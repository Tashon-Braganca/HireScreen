"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as Label from "@radix-ui/react-label";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setError("Check your email for the confirmation link!");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (googleError) {
      setError(googleError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] flex">
      {/* Left Column (Brand Side) */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[var(--bg-panel)] border-r border-[var(--border-sub)]">

        <div className="flex-1 flex flex-col justify-center px-12">
          {/* Brand mark */}
          <div className="flex items-center gap-3">
            <div className="w-[32px] h-[32px] rounded-lg bg-[var(--accent-sage)] text-[var(--bg-canvas)] font-bold flex items-center justify-center text-[16px]">
              C
            </div>
            <span className="font-[family-name:var(--font-ui)] font-semibold text-[18px] text-[var(--text-ink)] mt-0.5">
              CandidRank
            </span>
          </div>

          {/* Tagline */}
          <div className="mt-8 font-[family-name:var(--font-display)] font-bold italic text-[48px] leading-[1.05]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="text-[var(--text-ink)]"
            >
              Stop reading
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[var(--text-ink)]"
            >
              resumes.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-[var(--accent-sage)]"
            >
              Start asking.
            </motion.div>
          </div>

          <p className="mt-6 font-[family-name:var(--font-ui)] font-normal text-[16px] text-[var(--text-body)] max-w-xs leading-relaxed">
            Upload resumes. Ask questions in plain English. Get ranked candidates with cited proof — in seconds.
          </p>

          <div className="mt-10 bg-[var(--bg-raised)] border border-[var(--border-vis)] rounded-xl p-5 w-fit">
            <p className="font-[family-name:var(--font-display)] font-normal italic text-[17px] text-[var(--text-ink)] pr-4">
              &quot;We screened 200 candidates in 4 minutes.&quot;
            </p>
            <p className="font-[family-name:var(--font-ui)] font-normal text-[12px] text-[var(--text-dim)] mt-3">
              — Senior HR Director, Series B
            </p>
            <div className="flex gap-3 mt-4">
              {['8h saved', '94% accuracy', '10s results'].map((stat, i) => (
                <motion.div
                  key={stat}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-[var(--bg-canvas)] border border-[var(--border-sub)] rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] font-medium text-[11px] text-[var(--accent-sage)]"
                >
                  {stat}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-6 border-t border-[var(--border-sub)] w-full">
          <p className="font-[family-name:var(--font-ui)] font-normal text-[12px] text-[var(--text-dim)] text-center">
            SOC 2 Ready · 99.9% Uptime · Free plan available
          </p>
        </div>
      </div>

      {/* Right Column (Auth Panel) */}
      <div className="flex-1 flex items-center justify-center relative bg-[var(--bg-canvas)] px-8 py-12">
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(232, 228, 220, 0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        <div className="w-full max-w-md relative z-10">

          {/* Mode Switcher */}
          <div className="flex bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-lg p-1">
            <button
              onClick={() => { setMode("signin"); setError(null); }}
              className={`flex-1 py-2.5 font-[family-name:var(--font-ui)] font-medium text-[13px] rounded-[6px] text-center transition-all duration-200 ${mode === "signin"
                  ? "bg-[var(--bg-raised)] text-[var(--text-ink)] shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
                  : "text-[var(--text-dim)] hover:text-[var(--text-body)]"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 py-2.5 font-[family-name:var(--font-ui)] font-medium text-[13px] rounded-[6px] text-center transition-all duration-200 ${mode === "signup"
                  ? "bg-[var(--bg-raised)] text-[var(--text-ink)] shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
                  : "text-[var(--text-dim)] hover:text-[var(--text-body)]"
                }`}
            >
              Create Account
            </button>
          </div>

          <div className="mt-8">
            <h1 className="font-[family-name:var(--font-display)] font-bold italic text-[32px] text-[var(--text-ink)]">
              {mode === "signin" ? "Welcome back." : "Start screening."}
            </h1>
            <p className="font-[family-name:var(--font-ui)] font-normal text-[15px] text-[var(--text-body)] mt-2">
              {mode === "signin" ? "Sign in to your CandidRank workspace." : "Create your free account. No credit card needed."}
            </p>
          </div>

          {/* Google OAuth Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-[var(--bg-panel)] border border-[var(--border-vis)] rounded-lg py-3 font-[family-name:var(--font-ui)] font-medium text-[14px] text-[var(--text-ink)] hover:bg-[var(--bg-raised)] hover:border-[var(--border-vis)] transition-colors disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-[1px] bg-[var(--border-vis)]" />
            <span className="font-[family-name:var(--font-ui)] font-normal text-[12px] text-[var(--text-dim)]">or</span>
            <div className="flex-1 h-[1px] bg-[var(--border-vis)]" />
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={mode === "signin" ? handleLogin : handleSignUp}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div className="space-y-1.5 flex flex-col">
                  <Label.Root className="font-[family-name:var(--font-ui)] font-medium text-[11px] text-[var(--text-body)] uppercase tracking-[0.08em]">
                    FULL NAME
                  </Label.Root>
                  <motion.input
                    whileFocus={{ scale: 1.005 }}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={mode === "signup"}
                    placeholder="Jane Doe"
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] font-normal text-[14px] text-[var(--text-ink)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-vis)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-dim)] transition-colors duration-200"
                  />
                </div>
              )}

              <div className="space-y-1.5 flex flex-col">
                <Label.Root className="font-[family-name:var(--font-ui)] font-medium text-[11px] text-[var(--text-body)] uppercase tracking-[0.08em]">
                  EMAIL
                </Label.Root>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.005 }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    className={`w-full bg-[var(--bg-panel)] border rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] font-normal text-[14px] text-[var(--text-ink)] placeholder:text-[var(--text-dim)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-dim)] transition-colors duration-200 ${error && error.toLowerCase().includes('email') ? 'border-[#E05A5A]' : 'border-[var(--border-sub)] focus:border-[var(--border-vis)]'
                      }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col relative">
                <div className="flex items-center justify-between">
                  <Label.Root className="font-[family-name:var(--font-ui)] font-medium text-[11px] text-[var(--text-body)] uppercase tracking-[0.08em]">
                    PASSWORD
                  </Label.Root>
                  {mode === "signin" && (
                    <a href="#" className="font-[family-name:var(--font-ui)] font-normal text-[12px] text-[var(--text-dim)] hover:text-[var(--text-body)] transition-colors duration-150">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.005 }}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`w-full bg-[var(--bg-panel)] border rounded-lg pl-4 pr-10 py-3 font-[family-name:var(--font-ui)] font-normal text-[14px] text-[var(--text-ink)] placeholder:text-[var(--text-dim)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-dim)] transition-colors duration-200 ${error && (!error.toLowerCase().includes('email') && !error.toLowerCase().includes('link')) ? 'border-[#E05A5A]' : 'border-[var(--border-sub)] focus:border-[var(--border-vis)]'
                      }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-body)] focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="font-[family-name:var(--font-ui)] font-normal text-[12px] mt-1 text-center" style={{ color: error.includes('confirmation link') ? 'var(--accent-sage)' : '#E05A5A' }}>
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(126,184,154,0.2)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 bg-[var(--accent-sage)] text-[var(--bg-canvas)] font-[family-name:var(--font-ui)] font-semibold text-[15px] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  mode === "signin" ? "Sign In" : "Create Account"
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Mode Switch Link */}
          <div className="mt-6 text-center font-[family-name:var(--font-ui)] font-normal text-[13px] text-[var(--text-dim)]">
            {mode === "signin" ? (
              <span>
                Don&apos;t have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(null); }} className="font-medium text-[var(--accent-sage)] cursor-pointer focus:outline-none hover:underline underline-offset-2">
                  Create one free →
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button onClick={() => { setMode("signin"); setError(null); }} className="font-medium text-[var(--accent-sage)] cursor-pointer focus:outline-none hover:underline underline-offset-2">
                  Sign in →
                </button>
              </span>
            )}
          </div>

          {mode === "signup" && (
            <p className="mt-4 font-[family-name:var(--font-ui)] font-normal text-[11px] text-[var(--text-dim)] text-center">
              By creating an account you agree to our{" "}
              <Link href="/legal/terms" className="text-[var(--accent-sage)] hover:underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/legal/privacy" className="text-[var(--accent-sage)] hover:underline">
                Privacy Policy
              </Link>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
