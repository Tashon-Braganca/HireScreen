import crypto from "crypto";

const PADDLE_API_URL = "https://api.paddle.com";

interface PaddleCheckoutResponse {
  data: {
    id: string;
    checkout: {
      url: string;
    };
  };
}

interface PaddleSubscription {
  id: string;
  status: "active" | "canceled" | "paused" | "past_due";
  customer_id: string;
  next_billed_at: string | null;
  scheduled_change: {
    action: "cancel" | "pause" | "resume" | null;
  } | null;
}

export function getPaddleInstance() {
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!clientToken) {
    throw new Error("Paddle client token not configured");
  }
  if (typeof window === "undefined") {
    throw new Error("getPaddleInstance should only be called on the client side");
  }
  return {
    clientToken,
    initialize: () => {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      document.head.appendChild(script);
      return new Promise<void>((resolve) => {
        script.onload = () => {
          if ((window as unknown as { Paddle?: { Setup: (opts: { token: string }) => void } }).Paddle) {
            (window as unknown as { Paddle: { Setup: (opts: { token: string }) => void } }).Paddle.Setup({ token: clientToken });
          }
          resolve();
        };
      });
    },
  };
}

export function getPaddleServerClient() {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("Paddle API key not configured");
  }
  return {
    apiKey,
    createCheckout: async (options: { priceId: string; email?: string; userId: string; customData?: Record<string, string> }) => {
      const response = await fetch(`${PADDLE_API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              price_id: options.priceId,
              quantity: 1,
            },
          ],
          custom_data: {
            user_id: options.userId,
            ...options.customData,
          },
          checkout: {
            ...(options.email && { customer_email: options.email }),
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Paddle checkout error:", {
          status: response.status,
          statusText: response.statusText,
          body: error,
          priceId: options.priceId,
        });
        throw new Error(`Failed to create checkout session: ${response.status} ${response.statusText}`);
      }

      const data: PaddleCheckoutResponse = await response.json();
      return data.data.checkout.url;
    },
    getSubscription: async (subscriptionId: string): Promise<PaddleSubscription | null> => {
      const response = await fetch(`${PADDLE_API_URL}/subscriptions/${subscriptionId}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
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
        status: data.data.status,
        customer_id: data.data.customer_id,
        next_billed_at: data.data.next_billed_at,
        scheduled_change: data.data.scheduled_change,
      };
    },
    cancelSubscription: async (subscriptionId: string): Promise<boolean> => {
      const response = await fetch(`${PADDLE_API_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    },
  };
}

export function verifyPaddleWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const digestBuffer = Buffer.from(digest, "hex");
    if (sigBuffer.length !== digestBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(sigBuffer, digestBuffer);
  } catch {
    return signature === digest;
  }
}

export async function createCheckout({ 
  priceId, 
  email, 
  userId 
}: { 
  priceId: string; 
  email: string | undefined; 
  userId: string; 
}): Promise<string> {
  
  console.log('[PADDLE] Creating pay link for priceId:', priceId);
  
  const response = await fetch('https://api.paddle.com/transactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ 
        price_id: priceId, 
        quantity: 1 
      }],
      customer: email ? { email } : undefined,
      custom_data: { user_id: userId },
      checkout: { 
        url: 'https://candidrank.cc/dashboard?upgraded=true' 
      },
      status: 'ready',
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('[PADDLE] API error:', JSON.stringify(data));
    throw new Error(`Paddle error: ${data?.error?.detail || response.statusText}`);
  }

  console.log('[PADDLE] Transaction status:', data?.data?.status);
  
  const checkoutUrl = data?.data?.checkout?.url;
  if (!checkoutUrl) {
    throw new Error('No checkout URL returned from Paddle');
  }
  
  console.log('[PADDLE] Checkout URL:', checkoutUrl);
  return checkoutUrl;
}

export async function getSubscription(subscriptionId: string): Promise<PaddleSubscription | null> {
  const client = getPaddleServerClient();
  return client.getSubscription(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const client = getPaddleServerClient();
  return client.cancelSubscription(subscriptionId);
}
