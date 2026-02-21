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
            
            if (user?.email) {
                const createdAt = new Date(user.created_at).getTime();
                const isNewUser = Date.now() - createdAt < 120000;
                if (isNewUser) {
                    const name = user.user_metadata?.full_name 
                              || user.user_metadata?.name 
                              || '';
                    await sendWelcomeEmail(user.email, name);
                }
            }
            
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
