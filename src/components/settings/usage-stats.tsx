import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UsageStatsProps {
  isPro: boolean;
  queriesUsed: number;
  jobsCount: number;
  documentsCount: number;
}

const LIMITS = {
  free: { queries: 20, jobs: 2 },
  pro: { queries: 1000, jobs: 999999 },
};

export function UsageStats({ isPro, queriesUsed, jobsCount, documentsCount }: UsageStatsProps) {
  const limits = isPro ? LIMITS.pro : LIMITS.free;
  const queryPercentage = Math.min((queriesUsed / limits.queries) * 100, 100);
  const jobPercentage = isPro ? 0 : Math.min((jobsCount / limits.jobs) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>
          Your current usage this billing period
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Queries */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Queries</span>
            <span className="text-muted-foreground">
              {queriesUsed} / {isPro ? "1,000" : limits.queries}
            </span>
          </div>
          <Progress value={queryPercentage} className="h-2" />
          {queryPercentage >= 80 && !isPro && (
            <p className="text-xs text-amber-600">
              You&apos;re running low on queries. Consider upgrading to Pro.
            </p>
          )}
        </div>

        {/* Jobs (only show for free users) */}
        {!isPro && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Active Jobs</span>
              <span className="text-muted-foreground">
                {jobsCount} / {limits.jobs}
              </span>
            </div>
            <Progress value={jobPercentage} className="h-2" />
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{jobsCount}</p>
            <p className="text-xs text-muted-foreground">Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{documentsCount}</p>
            <p className="text-xs text-muted-foreground">Resumes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{queriesUsed}</p>
            <p className="text-xs text-muted-foreground">Queries</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
