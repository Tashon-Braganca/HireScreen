"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UseSubscriptionResult {
  isPro: boolean;
  subscriptionStatus: string | null;
  isLoading: boolean;
  refresh: () => void;
}

/**
 * Reads the current user's subscription status from the `profiles` table.
 *
 * Returns `isPro = true` when `subscription_status === "pro"`.
 */
export function useSubscription(): UseSubscriptionResult {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSubscriptionStatus(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

      setSubscriptionStatus(profile?.subscription_status ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  return {
    isPro: subscriptionStatus === "pro",
    subscriptionStatus,
    isLoading,
    refresh: fetchStatus,
  };
}

/**
 * Opens the LemonSqueezy checkout in a new tab.
 * Returns the checkout URL on success or throws on failure.
 */
export async function openCheckout(): Promise<void> {
  const res = await fetch("/api/billing/checkout", { method: "POST" });
  const data = (await res.json()) as { checkoutUrl?: string; error?: string };

  if (!res.ok || !data.checkoutUrl) {
    throw new Error(data.error ?? "Failed to create checkout");
  }

  window.open(data.checkoutUrl, "_blank");
}
