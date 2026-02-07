"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingShape } from "@/components/ui/FloatingShape";
import { BentoCard } from "@/components/ui/BentoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("Check your email for the confirmation link!");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f0f4f8]">
      {/* Background Blobs */}
      <FloatingShape className="w-[500px] h-[500px] bg-purple-300 top-[-10%] left-[-10%]" delay={0} />
      <FloatingShape className="w-[400px] h-[400px] bg-blue-300 bottom-[-10%] right-[-5%]" delay={2} />

      <div className="relative z-10 w-full max-w-md px-4">
        <BentoCard className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Sign in to access your recruitment dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11" isLoading={loading}>
              Sign In
            </Button>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">Or</span>
                </div>
            </div>

            <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleSignUp}
                isLoading={loading}
            >
                Create Account
            </Button>
          </form>
        </BentoCard>
      </div>
    </div>
  );
}
