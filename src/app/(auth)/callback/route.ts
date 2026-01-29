import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors from provider
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    const errorMessage = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(`${origin}/login?error=${errorMessage}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      // Successfully authenticated - redirect to dashboard
      const redirectUrl = `${origin}${next}`;
      return NextResponse.redirect(redirectUrl);
    }
    
    console.error("Code exchange error:", exchangeError);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }

  // No code provided
  return NextResponse.redirect(`${origin}/login?error=no_code_provided`);
}
