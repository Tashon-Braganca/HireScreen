"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UsageCardProps {
  title: string;
  current: number | string;
  limit?: number | string;
  showUpgrade?: boolean;
  isPro: boolean;
}

export function UsageCard({ title, current, limit, showUpgrade }: UsageCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        toast.error(data.error?.message || "Failed to start checkout");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {current}
          {limit && typeof limit !== "string" && (
            <span className="text-lg font-normal text-muted-foreground">
              {" "}/ {limit}
            </span>
          )}
          {limit === "Unlimited" && (
            <span className="text-lg font-normal text-muted-foreground">
              {" "}(Unlimited)
            </span>
          )}
        </div>
        {showUpgrade && (
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm text-primary"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Upgrade to Pro
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
