import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckout } from "@/lib/lemonsqueezy/client";

export async function POST(_request: NextRequest) {
  try {
    console.log("[CHECKOUT] Starting checkout process...");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("[CHECKOUT] Unauthorized - no user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
      console.error("[CHECKOUT] Missing LEMONSQUEEZY_STORE_ID or LEMONSQUEEZY_VARIANT_ID");
      return NextResponse.json({ error: "Pro plan not configured" }, { status: 500 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    const email = profile?.email ?? user.email;
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/dashboard/settings?upgraded=true`;

    console.log("[CHECKOUT] Creating LemonSqueezy checkout for user:", user.id);

    const { checkoutUrl } = await createCheckout({
      storeId,
      variantId,
      email,
      customData: { user_id: user.id },
      redirectUrl: successUrl,
    });

    console.log("[CHECKOUT] Got checkout URL:", checkoutUrl);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("[CHECKOUT] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
