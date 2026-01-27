import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy/client";

interface WebhookEvent {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      status: string;
      customer_id: number;
      product_id: number;
      variant_id: number;
      ends_at: string | null;
      renews_at: string | null;
      cancelled: boolean;
      first_subscription_item?: {
        subscription_id: number;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Webhook secret not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // Verify signature
    const isValid = verifyWebhookSignature(rawBody, signature, secret);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: WebhookEvent = JSON.parse(rawBody);
    const eventName = event.meta.event_name;
    const userId = event.meta.custom_data?.user_id;

    console.log(`Webhook received: ${eventName}`, { userId });

    if (!userId) {
      console.error("No user_id in webhook custom_data");
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const supabase = createAdminClient();

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_resumed": {
        const status = event.data.attributes.status;
        const subscriptionId = event.data.id;

        // Map Lemon Squeezy status to our status
        let subscriptionStatus: "free" | "pro" | "cancelled" = "free";
        if (status === "active" || status === "on_trial") {
          subscriptionStatus = "pro";
        } else if (status === "cancelled" || status === "expired") {
          subscriptionStatus = "cancelled";
        }

        await supabase
          .from("profiles")
          .update({
            subscription_status: subscriptionStatus,
            subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`Updated user ${userId} subscription to ${subscriptionStatus}`);
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`Cancelled subscription for user ${userId}`);
        break;
      }

      case "subscription_payment_success": {
        // Reset monthly query count on successful payment
        await supabase
          .from("profiles")
          .update({
            queries_used: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`Reset query count for user ${userId}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventName}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
