import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend/welcome";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('[AUTH] User after OAuth:', user?.email, 'created_at:', user?.created_at);
            
            if (user?.email) {
                const createdAt = new Date(user.created_at).getTime();
                const now = Date.now();
                const ageMs = now - createdAt;
                const isNewUser = ageMs < 120000;
                console.log('[AUTH] Account age (ms):', ageMs, 'isNewUser:', isNewUser);
                
                if (isNewUser) {
                    const name = user.user_metadata?.full_name 
                              || user.user_metadata?.name 
                              || '';
                    console.log('[AUTH] Calling sendWelcomeEmail for:', user.email, 'name:', name);
                    await sendWelcomeEmail(user.email, name);
                }
            }
            
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
