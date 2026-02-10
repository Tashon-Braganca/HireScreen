"use client";

import React from "react";
import { BentoCard, BentoHeader } from "@/components/ui/BentoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
            <Input placeholder="jane@example.com" type="email" />
          </div>
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
