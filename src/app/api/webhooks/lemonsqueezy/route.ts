import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy/client";

/**
 * POST /api/webhooks/lemonsqueezy
 *
 * Handles events from LemonSqueezy. Supported events:
 *   - order_created            → upgrades the matching user to Pro
 *   - subscription_created     → upgrades the matching user to Pro
 *   - subscription_updated     → keeps Pro if active, downgrades if cancelled/expired
 *   - subscription_cancelled   → downgrades the matching user to Free
 *   - subscription_expired     → downgrades the matching user to Free
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature") ?? "";

  // Verify signature
  let valid = false;
  try {
    valid = await verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    console.error("[LS_WEBHOOK] Signature verification threw:", err);
    return NextResponse.json({ error: "Config error" }, { status: 500 });
  }

  if (!valid) {
    console.warn("[LS_WEBHOOK] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const meta = event.meta as Record<string, unknown> | undefined;
  const eventName = meta?.event_name as string | undefined;
  const customData = (meta?.custom_data ?? {}) as Record<string, string>;
  const userId = customData.user_id;

  const data = event.data as Record<string, unknown> | undefined;
  const subscriptionId = data?.id as string | undefined;
  const attributes = (data?.attributes ?? {}) as Record<string, unknown>;
  const status = attributes.status as string | undefined;

  console.log(`[LS_WEBHOOK] Received event: ${eventName} | userId: ${userId} | status: ${status}`);

  const supabase = await createClient();

  try {
    // ──── UPGRADE EVENTS ──────────────────────────────────────────────────────
    if (eventName === "order_created" || eventName === "subscription_created") {
      if (!userId) {
        console.error("[LS_WEBHOOK] order/subscription created but no user_id in custom_data");
        return NextResponse.json({ received: true });
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "pro",
          subscription_id: subscriptionId ?? null,
        })
        .eq("id", userId);

      if (error) {
        console.error("[LS_WEBHOOK] Failed to upgrade user:", error);
      } else {
        console.log(`[LS_WEBHOOK] User ${userId} upgraded to Pro`);
      }
    }

    // ──── SUBSCRIPTION UPDATED ────────────────────────────────────────────────
    if (eventName === "subscription_updated") {
      if (!subscriptionId) return NextResponse.json({ received: true });

      const isPro = status === "active" || status === "on_trial";

      const { error } = await supabase
        .from("profiles")
        .update({ subscription_status: isPro ? "pro" : "free" })
        .eq("subscription_id", subscriptionId);

      if (error) {
        console.error("[LS_WEBHOOK] Failed to update subscription status:", error);
      } else {
        console.log(`[LS_WEBHOOK] Subscription ${subscriptionId} status → ${isPro ? "pro" : "free"}`);
      }
    }

    // ──── DOWNGRADE EVENTS ────────────────────────────────────────────────────
    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      if (!subscriptionId) return NextResponse.json({ received: true });

      const { error } = await supabase
        .from("profiles")
        .update({ subscription_status: "free" })
        .eq("subscription_id", subscriptionId);

      if (error) {
        console.error("[LS_WEBHOOK] Failed to downgrade user:", error);
      } else {
        console.log(`[LS_WEBHOOK] Subscription ${subscriptionId} downgraded to free`);
      }
    }
  } catch (err) {
    console.error("[LS_WEBHOOK] Unexpected error:", err);
  }

  return NextResponse.json({ received: true });
}
