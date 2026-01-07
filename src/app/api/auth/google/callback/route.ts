import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirect') || '/dashboard/settings';
  
  // Store the redirect URL in state for after OAuth
  const state = Buffer.from(JSON.stringify({ redirectTo })).toString('base64');
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Google Client ID not configured' }, { status: 500 });
  }

  // Determine the callback URL based on environment
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Build the Google OAuth URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    access_type: 'offline', // Get refresh token
    prompt: 'consent', // Always show consent screen to get refresh token
    state: state,
  });

  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  
  return NextResponse.redirect(authUrl);
}
