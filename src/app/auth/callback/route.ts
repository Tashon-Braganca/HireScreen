import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend/welcome";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const next = searchParams.get("next") ?? "/dashboard";

    const supabase = await createClient();

    // Handle OAuth code exchange
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            return NextResponse.redirect(`${origin}/login?error=auth_failed`);
        }
    }

    // Handle email magic link / OTP verification
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ 
            token_hash, 
            type: type as 'signup' | 'magiclink' | 'recovery' | 'email_change' 
        });
        if (error) {
            return NextResponse.redirect(`${origin}/login?error=auth_failed`);
        }
    }

    // At this point session is established — get user and send welcome email
    const { data: { user } } = await supabase.auth.getUser();
    console.log('[AUTH] User:', user?.email, 'created_at:', user?.created_at);

    if (user?.email) {
        const createdAt = new Date(user.created_at).getTime();
        const ageMs = Date.now() - createdAt;
        const isNewUser = ageMs < 120000;
        console.log('[AUTH] Age ms:', ageMs, 'isNewUser:', isNewUser);

        if (isNewUser) {
            const name = user.user_metadata?.full_name 
                      || user.user_metadata?.name 
                      || '';
            console.log('[AUTH] Sending welcome email to:', user.email);
            await sendWelcomeEmail(user.email, name);
        }
    }

    return NextResponse.redirect(`${origin}${next}`);
}
