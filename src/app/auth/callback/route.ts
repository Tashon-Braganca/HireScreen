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
            
            if (user) {
                const createdAt = new Date(user.created_at);
                const now = new Date();
                const secondsSinceCreation = (now.getTime() - createdAt.getTime()) / 1000;
                
                if (secondsSinceCreation < 30) {
                    const fullName = user.user_metadata?.full_name || 
                                     user.user_metadata?.name || 
                                     user.email?.split("@")[0] || 
                                     "there";
                    
                    sendWelcomeEmail(user.email!, fullName).catch((err) => {
                        console.error("[AUTH] Failed to send welcome email:", err);
                    });
                }
            }
            
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
