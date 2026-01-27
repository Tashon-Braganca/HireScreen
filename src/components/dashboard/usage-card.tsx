import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface UsageCardProps {
  title: string;
  current: number | string;
  limit?: number | string;
  showUpgrade?: boolean;
  isPro: boolean;
}

export function UsageCard({ title, current, limit, showUpgrade }: UsageCardProps) {
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
          <Link href="/settings?tab=billing">
            <Button variant="link" className="p-0 h-auto text-sm">
              Upgrade to Pro
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
