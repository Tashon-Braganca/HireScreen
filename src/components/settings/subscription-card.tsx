"use client";

import { useState } from "react";
import { Check, Crown, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionCardProps {
  isPro: boolean;
  subscriptionId: string | null;
  showSuccess?: boolean;
}

const PRO_FEATURES = [
  "Unlimited positions",
  "100 resumes per position",
  "1,000 queries per month",
  "CSV export",
  "Priority support",
];

const FREE_FEATURES = [
  "2 positions",
  "10 resumes per position",
  "20 queries per month",
];

export function SubscriptionCard({ isPro }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        console.error("Checkout failed:", data);
        toast.error(data.error?.message || "Failed to start checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = () => {
    window.open("https://app.lemonsqueezy.com/my-orders", "_blank");
  };

  if (isPro) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Crown className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-zinc-100">Pro Plan</h2>
            <p className="text-sm text-zinc-500">You have full access</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {PRO_FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-zinc-300">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleManage}
          className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Manage Subscription
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Free Plan */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-medium text-zinc-100 mb-1">Free</h3>
        <p className="text-2xl font-bold text-zinc-100 mb-4">
          $0<span className="text-sm font-normal text-zinc-500">/month</span>
        </p>
        
        <div className="space-y-3 mb-6">
          {FREE_FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-400">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center text-sm text-zinc-500 py-2">
          Current plan
        </div>
      </div>

      {/* Pro Plan */}
      <div className="rounded-xl border-2 border-amber-500/50 bg-zinc-900/50 p-6 relative">
        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-amber-500 text-zinc-900 text-xs font-bold rounded">
          RECOMMENDED
        </div>
        
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-medium text-zinc-100">Pro</h3>
          <Crown className="h-4 w-4 text-amber-500" />
        </div>
        <p className="text-2xl font-bold text-zinc-100 mb-4">
          $29<span className="text-sm font-normal text-zinc-500">/month</span>
        </p>
        
        <div className="space-y-3 mb-6">
          {PRO_FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-zinc-300">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleUpgrade}
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
