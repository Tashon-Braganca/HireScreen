"use client";

import React, { useEffect, useState } from "react";
import { BentoCard, BentoHeader } from "@/components/ui/BentoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Shield, CreditCard, Zap, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PRO_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID;

interface UserInfo {
  id: string;
  email: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email || '' });
      }
    };
    fetchUser();
  }, []);

  const handleUpgrade = () => {
    console.log('[UPGRADE] Button clicked');
    console.log('[UPGRADE] Price ID:', PRO_PRICE_ID);
    console.log('[UPGRADE] User:', user);
    
    if (!PRO_PRICE_ID) {
      alert('Billing is not configured. Please contact support.');
      return;
    }

    if (typeof window === 'undefined' || !window.Paddle) {
      alert('Payment system loading. Please wait a moment and try again.');
      console.error('[UPGRADE] Paddle not loaded');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('[UPGRADE] Opening Paddle checkout...');
      window.Paddle.Checkout.open({
        items: [{
          priceId: PRO_PRICE_ID,
          quantity: 1,
        }],
        customer: user?.email ? { email: user.email } : undefined,
        customData: user?.id ? { userId: user.id } : undefined,
        settings: {
          successUrl: 'https://candidrank.cc/dashboard?upgraded=true',
        },
      });
    } catch (err) {
      console.error('[UPGRADE] Error:', err);
      alert('Failed to open checkout. Please try again.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 pb-12 pt-6 overflow-y-auto h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and workspace settings.</p>
      </div>

      <BentoCard>
        <BentoHeader
          title="Profile Information"
          subtitle="Update your photo and personal details."
          action={<Button variant="outline">Save Changes</Button>}
        />

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
            <User size={32} />
          </div>
          <div>
            <Button variant="outline" size="sm" className="mb-2">Change Photo</Button>
            <p className="text-xs text-slate-400">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">First Name</label>
            <Input placeholder="Jane" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Last Name</label>
            <Input placeholder="Doe" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <Input placeholder="jane@example.com" type="email" value={user?.email || ''} readOnly />
          </div>
        </div>
      </BentoCard>

      <BentoCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
            <CreditCard size={20} />
          </div>
          <h3 className="font-bold text-slate-900">Subscription</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">Manage your plan and billing.</p>

        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-slate-900">Free Plan</div>
              <div className="text-xs text-slate-500">3 active jobs, 20 queries/mo</div>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-slate-200 text-slate-600 rounded-full">Current</span>
          </div>
        </div>

        <div className="border-2 border-violet-200 bg-violet-50/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-violet-600" />
            <span className="font-semibold text-slate-900">Pro Plan</span>
            <span className="text-lg font-bold text-violet-600 ml-auto">$49/mo</span>
          </div>
          <ul className="space-y-2 mb-4">
            {["Unlimited jobs", "Unlimited queries", "Unlimited uploads", "PDF export", "Priority support"].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <Check size={14} className="text-violet-600 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Opening...
              </>
            ) : (
              "Upgrade to Pro"
            )}
          </Button>
        </div>
      </BentoCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Bell size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Notifications</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Manage how you receive updates about candidates.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Email Alerts</span>
              <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Security</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Update your password and security settings.</p>
          <Button variant="outline" className="w-full">Change Password</Button>
        </BentoCard>
      </div>
    </div>
  );
}
