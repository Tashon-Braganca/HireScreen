import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckout } from "@/lib/paddle/client";

export async function POST(request: NextRequest) {
  try {
    console.log('[CHECKOUT] Starting checkout process...');
    
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[CHECKOUT] Unauthorized - no user');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let { priceId } = body;
    
    console.log('[CHECKOUT] Received priceId:', priceId);

    if (!priceId) {
      console.log('[CHECKOUT] No priceId provided');
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    // If priceId is "pro", resolve to actual price ID from env
    if (priceId === "pro") {
      priceId = process.env.PADDLE_PRO_PRICE_ID;
      console.log('[CHECKOUT] Resolved "pro" to:', priceId);
      if (!priceId) {
        console.error('[CHECKOUT] PADDLE_PRO_PRICE_ID not set in environment');
        return NextResponse.json({ error: "Pro plan not configured" }, { status: 500 });
      }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    const email = profile?.email || user.email;
    console.log('[CHECKOUT] User email:', email);
    console.log('[CHECKOUT] Creating Paddle checkout...');

    const checkoutUrl = await createCheckout({
      priceId,
      email,
      userId: user.id,
    });

    console.log('[CHECKOUT] Got checkout URL:', checkoutUrl);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("[CHECKOUT] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
