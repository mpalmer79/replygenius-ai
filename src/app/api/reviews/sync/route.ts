import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccounts, getLocations, syncReviewsToDatabase, refreshAccessToken } from '@/lib/google/business-profile';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all active Google connections
    const { data: connections, error: connError } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('platform', 'google')
      .eq('is_active', true);

    if (connError) {
      return NextResponse.json({ error: 'Failed to get connections' }, { status: 500 });
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({ error: 'No Google connections found' }, { status: 404 });
    }

    const results = [];

    for (const connection of connections) {
      let accessToken = connection.access_token;

      // Check if token is expired
      if (connection.token_expires_at && new Date(connection.token_expires_at) < new Date()) {
        // Refresh the token
        if (connection.refresh_token) {
          const newTokens = await refreshAccessToken(connection.refresh_token);
          if (newTokens) {
            accessToken = newTokens.access_token;
            
            // Update the token in database
            await supabase
              .from('platform_connections')
              .update({
                access_token: newTokens.access_token,
                token_expires_at: newTokens.token_expires_at,
              })
              .eq('id', connection.id);
          } else {
            results.push({
              connectionId: connection.id,
              error: 'Failed to refresh token',
            });
            continue;
          }
        } else {
          results.push({
            connectionId: connection.id,
            error: 'Token expired and no refresh token available',
          });
          continue;
        }
      }

      // Get accounts
      const accounts = await getAccounts(accessToken);

      for (const account of accounts) {
        // Get locations for this account
        const locations = await getLocations(accessToken, account.name);

        for (const location of locations) {
          // For now, we'll create a location in our DB if it doesn't exist
          // In production, you'd match this to existing user-created locations
          const { data: dbLocation, error: locError } = await supabase
            .from('locations')
            .upsert({
              name: location.title,
              address: location.storefrontAddress?.addressLines?.join(', ') || '',
              city: location.storefrontAddress?.locality || '',
              state: location.storefrontAddress?.administrativeArea || '',
              zip_code: location.storefrontAddress?.postalCode || '',
              google_place_id: location.name, // Using resource name as identifier
              organization_id: connection.organization_id,
            }, {
              onConflict: 'google_place_id',
            })
            .select()
            .single();

          if (locError || !dbLocation) {
            console.error('Error upserting location:', locError);
            continue;
          }

          // Sync reviews for this location
          const syncResult = await syncReviewsToDatabase(
            accessToken,
            account.name,
            location.name,
            supabase,
            dbLocation.id
          );

          results.push({
            account: account.accountName,
            location: location.title,
            synced: syncResult.synced,
            errors: syncResult.errors,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

// Also allow GET for manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}
