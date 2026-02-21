import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyPaddleWebhookSignature } from "@/lib/paddle/client";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("paddle-signature") || "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[PADDLE_WEBHOOK] Missing PADDLE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const isValid = verifyPaddleWebhookSignature(payload, signature, secret);
  if (!isValid) {
    console.error("[PADDLE_WEBHOOK] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { 
    event_type: string; 
    data: { 
      id: string; 
      custom_data?: { user_id?: string }; 
      subscription_id?: string;
      status?: string;
    } 
  };
  try {
    event = JSON.parse(payload);
  } catch {
    console.error("[PADDLE_WEBHOOK] Failed to parse payload");
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = await createClient();
  const eventType = event.event_type;

  console.log(`[PADDLE_WEBHOOK] Processing event: ${eventType}`);

  try {
    if (eventType === "subscription.activated" || eventType === "transaction.completed") {
      const userId = event.data.custom_data?.user_id;
      const subscriptionId = event.data.id;

      if (userId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "pro",
            subscription_id: subscriptionId,
            queries_used: 0,
          })
          .eq("id", userId);

        if (error) {
          console.error("[PADDLE_WEBHOOK] Failed to update profile to pro:", error);
        } else {
          console.log(`[PADDLE_WEBHOOK] User ${userId} upgraded to pro (queries reset)`);
        }
      }
    }

    if (eventType === "subscription.updated") {
      const subscriptionId = event.data.id;
      const status = event.data.status;

      if (status === "active") {
        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("subscription_id", subscriptionId)
          .single();

        if (!fetchError && profile) {
          const { error } = await supabase
            .from("profiles")
            .update({ subscription_status: "pro" })
            .eq("id", profile.id);

          if (error) {
            console.error("[PADDLE_WEBHOOK] Failed to update profile to pro:", error);
          } else {
            console.log(`[PADDLE_WEBHOOK] User ${profile.id} subscription updated to pro`);
          }
        }
      } else if (status === "canceled" || status === "paused") {
        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("subscription_id", subscriptionId)
          .single();

        if (!fetchError && profile) {
          const { error } = await supabase
            .from("profiles")
            .update({ subscription_status: "free" })
            .eq("id", profile.id);

          if (error) {
            console.error("[PADDLE_WEBHOOK] Failed to update profile to free:", error);
          } else {
            console.log(`[PADDLE_WEBHOOK] User ${profile.id} subscription downgraded to free`);
          }
        }
      }
    }

    if (eventType === "subscription.canceled" || eventType === "subscription.expired") {
      const subscriptionId = event.data.id;

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("subscription_id", subscriptionId)
        .single();

      if (fetchError || !profile) {
        console.error("[PADDLE_WEBHOOK] Profile not found for subscription:", subscriptionId);
        return NextResponse.json({ received: true });
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "free",
        })
        .eq("id", profile.id);

      if (error) {
        console.error("[PADDLE_WEBHOOK] Failed to update profile to free:", error);
      } else {
        console.log(`[PADDLE_WEBHOOK] User ${profile.id} downgraded to free`);
      }
    }
  } catch (error) {
    console.error("[PADDLE_WEBHOOK] Error processing webhook:", error);
  }

  return NextResponse.json({ received: true });
}
