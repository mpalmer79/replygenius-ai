import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Determine base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // Handle errors from Google
  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=google_auth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_code`);
  }

  // Parse state to get redirect URL
  let redirectTo = '/dashboard/settings';
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
      redirectTo = decoded.redirectTo || redirectTo;
    } catch (e) {
      console.error('Failed to parse state:', e);
    }
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${baseUrl}/api/auth/google/callback`;
    
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    // Get user info from Google
    const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info');
      return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=userinfo_failed`);
    }

    const userInfo = await userInfoResponse.json();

    // Get the user's business accounts
    const accountsResponse = await fetch(
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    let accounts = [];
    if (accountsResponse.ok) {
      const accountsData = await accountsResponse.json();
      accounts = accountsData.accounts || [];
    } else {
      console.log('No business accounts found or API access pending');
    }

    // Store the connection in Supabase
    // Note: In production, you'd associate this with the logged-in user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // For now, we'll store this as a platform connection
    // In a full implementation, you'd link this to the user's organization
    const connectionData = {
      platform: 'google',
      platform_account_id: userInfo.id,
      platform_account_name: userInfo.email,
      access_token: access_token,
      refresh_token: refresh_token || null,
      token_expires_at: expiresAt,
      is_active: true,
      metadata: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accounts: accounts,
      },
      // In production, these would come from the authenticated user's session
      organization_id: null, // Will be set when user auth is implemented
      location_id: null,
    };

    // Check if connection already exists
    const { data: existing } = await supabase
      .from('platform_connections')
      .select('id')
      .eq('platform', 'google')
      .eq('platform_account_id', userInfo.id)
      .single();

    if (existing) {
      // Update existing connection
      await supabase
        .from('platform_connections')
        .update(connectionData)
        .eq('id', existing.id);
    } else {
      // Insert new connection
      await supabase
        .from('platform_connections')
        .insert(connectionData);
    }

    // Redirect back with success
    return NextResponse.redirect(`${baseUrl}${redirectTo}?google=connected&accounts=${accounts.length}`);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=callback_failed`);
  }
}
