"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Crown, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionCardProps {
  isPro: boolean;
  subscriptionId: string | null;
}

const PRO_FEATURES = [
  "Unlimited jobs",
  "100 resumes per job",
  "1,000 queries per month",
  "CSV export",
  "Priority support",
];

const FREE_FEATURES = [
  "2 jobs",
  "10 resumes per job",
  "20 queries per month",
];

export function SubscriptionCard({ isPro }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

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
        console.error("Failed to create checkout:", data.error);
        alert("Failed to start checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = () => {
    // Lemon Squeezy customer portal
    window.open("https://app.lemonsqueezy.com/my-orders", "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Subscription
              {isPro && <Crown className="h-5 w-5 text-yellow-500" />}
            </CardTitle>
            <CardDescription>
              {isPro ? "You're on the Pro plan" : "Upgrade to unlock all features"}
            </CardDescription>
          </div>
          <Badge variant={isPro ? "default" : "outline"} className="text-lg px-4 py-1">
            {isPro ? "Pro" : "Free"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {success === "true" && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-800 dark:text-green-200">
            <p className="font-medium">Welcome to Pro!</p>
            <p className="text-sm">Your subscription is now active. Enjoy unlimited access!</p>
          </div>
        )}

        {isPro ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Your Pro benefits:</h4>
              <ul className="space-y-2">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" onClick={handleManage}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Free Plan */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-3">Free Plan</h4>
              <ul className="space-y-2">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-primary rounded-lg p-4 relative">
              <Badge className="absolute -top-2 right-4">Recommended</Badge>
              <h4 className="font-medium mb-1">Pro Plan</h4>
              <p className="text-2xl font-bold mb-3">
                $29<span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <ul className="space-y-2 mb-4">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={handleUpgrade}
                disabled={isLoading}
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
        )}
      </CardContent>
    </Card>
  );
}
