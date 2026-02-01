import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckout } from "@/lib/lemonsqueezy/client";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    if (!variantId) {
      return NextResponse.json(
        { success: false, error: { code: "CONFIG_ERROR", message: "Payment not configured" } },
        { status: 500 }
      );
    }

    // Create checkout session
    const checkoutUrl = await createCheckout({
      email: user.email || "",
      userId: user.id,
      variantId,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    });

    return NextResponse.json({
      success: true,
      data: { checkoutUrl },
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: errorMessage } },
      { status: 500 }
    );
  }
}
