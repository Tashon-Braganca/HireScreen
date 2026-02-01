// Lemon Squeezy API Client
// https://docs.lemonsqueezy.com/api

import crypto from "crypto";

const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";

interface LemonSqueezyCheckoutOptions {
  email: string;
  userId: string;
  variantId: string;
  redirectUrl?: string;
}

interface LemonSqueezyCheckoutResponse {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
}

interface LemonSqueezySubscription {
  id: string;
  status: "active" | "cancelled" | "expired" | "past_due" | "paused" | "on_trial" | "unpaid";
  customer_id: number;
  product_id: number;
  variant_id: number;
  ends_at: string | null;
  renews_at: string | null;
  cancelled: boolean;
}

export async function createCheckout(
  options: LemonSqueezyCheckoutOptions
): Promise<string> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    throw new Error("Lemon Squeezy API key or Store ID not configured");
  }

  const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/vnd.api+json",
      "Accept": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: options.email,
            custom: {
              user_id: options.userId,
            },
          },
          checkout_options: {
            redirect_url: options.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
          },
          product_options: {
            redirect_url: options.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: options.variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Lemon Squeezy checkout error:", {
      status: response.status,
      statusText: response.statusText,
      body: error,
      storeId,
      variantId: options.variantId,
    });
    throw new Error(`Failed to create checkout session: ${response.status} ${response.statusText}`);
  }

  const data: LemonSqueezyCheckoutResponse = await response.json();
  return data.data.attributes.url;
}

export async function getSubscription(subscriptionId: string): Promise<LemonSqueezySubscription | null> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error("Lemon Squeezy API key not configured");
  }

  const response = await fetch(`${LEMONSQUEEZY_API_URL}/subscriptions/${subscriptionId}`, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/vnd.api+json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch subscription");
  }

  const data = await response.json();
  return {
    id: data.data.id,
    status: data.data.attributes.status,
    customer_id: data.data.attributes.customer_id,
    product_id: data.data.attributes.product_id,
    variant_id: data.data.attributes.variant_id,
    ends_at: data.data.attributes.ends_at,
    renews_at: data.data.attributes.renews_at,
    cancelled: data.data.attributes.cancelled,
  };
}

export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error("Lemon Squeezy API key not configured");
  }

  const response = await fetch(`${LEMONSQUEEZY_API_URL}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/vnd.api+json",
      "Accept": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id: subscriptionId,
        attributes: {
          cancelled: true,
        },
      },
    }),
  });

  return response.ok;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return signature === digest;
}
