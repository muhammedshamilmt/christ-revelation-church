import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  if (error || errorDescription) {
    console.error("Auth Callback OAuth Provider Error:", {
      error,
      error_code: searchParams.get('error_code'),
      error_description: errorDescription,
    });
    return NextResponse.redirect(
      `${origin}/?error=oauth_error&message=${encodeURIComponent(errorDescription || error || 'Authentication provider error')}`
    );
  }

  if (code) {
    let supabaseResponse = NextResponse.redirect(`${origin}/admin`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.redirect(`${origin}/admin`);
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      return supabaseResponse;
    }
    
    // Fallback: Check if session is already active
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return supabaseResponse;
    }
    
    console.error("Auth Callback Error: Server-side exchange failed, delegating to client:", exchangeError?.message);
    return NextResponse.redirect(`${origin}/admin?code=${code}`);
  }

  console.error("Auth Callback Error: No code provided in URL");
  return NextResponse.redirect(`${origin}/?error=unauthorized`);
}
