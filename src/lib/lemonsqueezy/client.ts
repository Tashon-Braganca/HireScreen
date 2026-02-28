/**
 * LemonSqueezy REST API helper.
 *
 * Docs: https://docs.lemonsqueezy.com/api
 *
 * All functions are server-only (they read server-env vars). Never import
 * this file in client components.
 */

const LS_API_BASE = "https://api.lemonsqueezy.com/v1";

function lsHeaders(): HeadersInit {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("Missing LEMONSQUEEZY_API_KEY");
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${apiKey}`,
  };
}

export interface CreateCheckoutParams {
  /** LemonSqueezy store ID (numeric string) */
  storeId: string;
  /** Variant ID of the product/plan */
  variantId: string;
  /** Prefill the checkout email field */
  email?: string;
  /** Arbitrary key/value data attached to the order */
  customData?: Record<string, string>;
  /** Where to redirect after a successful purchase */
  redirectUrl?: string;
}

export interface LemonSqueezyCheckout {
  checkoutUrl: string;
}

/**
 * Creates a LemonSqueezy checkout session and returns the hosted checkout URL.
 */
export async function createCheckout(
  params: CreateCheckoutParams
): Promise<LemonSqueezyCheckout> {
  const { storeId, variantId, email, customData, redirectUrl } = params;

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email,
          custom: customData,
        },
        product_options: {
          redirect_url: redirectUrl,
        },
      },
      relationships: {
        store: {
          data: { type: "stores", id: storeId },
        },
        variant: {
          data: { type: "variants", id: variantId },
        },
      },
    },
  };

  const res = await fetch(`${LS_API_BASE}/checkouts`, {
    method: "POST",
    headers: lsHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LemonSqueezy API error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as {
    data: { attributes: { url: string } };
  };

  return { checkoutUrl: json.data.attributes.url };
}

/**
 * Verifies a LemonSqueezy webhook signature.
 *
 * LS signs the raw request body with HMAC-SHA256 and puts the hex digest in
 * the `X-Signature` header.
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing LEMONSQUEEZY_WEBHOOK_SECRET");

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === signature;
}
