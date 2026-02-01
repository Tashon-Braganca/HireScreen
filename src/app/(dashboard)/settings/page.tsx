import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionCard } from "@/components/settings/subscription-card";
import { DangerZone } from "@/components/settings/danger-zone";
import { User, CreditCard, Shield, Crown, Mail, Calendar } from "lucide-react";

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string; success?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const isPro = profile.subscription_status === "pro";
  const defaultTab = params.tab || "profile";
  const showSuccess = params.success === "true";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100">Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
            <p className="font-medium text-emerald-400">Welcome to Pro!</p>
            <p className="text-sm text-emerald-400/80">Your subscription is now active.</p>
          </div>
        )}

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-400">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-400">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="danger" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-400">
              <Shield className="h-4 w-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-lg font-medium text-zinc-100 mb-6">Account Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">Email</span>
                  </div>
                  <span className="text-sm text-zinc-100">{profile.email}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">Name</span>
                  </div>
                  <span className="text-sm text-zinc-100">{profile.full_name || "Not set"}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Crown className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">Plan</span>
                  </div>
                  {isPro ? (
                    <span className="text-sm font-medium text-amber-500">Pro</span>
                  ) : (
                    <span className="text-sm text-zinc-100">Free</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">Member since</span>
                  </div>
                  <span className="text-sm text-zinc-100">
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <SubscriptionCard 
              isPro={isPro} 
              subscriptionId={profile.subscription_id}
              showSuccess={false}
            />
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="danger" className="space-y-6">
            <DangerZone />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
