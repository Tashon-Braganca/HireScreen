"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Toast from "@radix-ui/react-toast";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Progress from "@radix-ui/react-progress";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, deleteAccount } from "@/app/actions/profile";
import { openCheckout } from "@/hooks/useSubscription";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ArrowRight, Check, CheckCircle2, LogOut, Sparkles } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_status: string | null;
  queries_used: number;
  last_query_reset_date: string | null;
}

interface SettingsClientProps {
  profile: Profile;
  jobsCount: number;
  docsCount: number;
}

interface ProfileFormValues {
  full_name: string;
}

const MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const INPUT_CLASSNAME =
  "w-full rounded-lg border border-[var(--border-sub)] bg-[var(--bg-raised)] px-[14px] py-[11px] text-[14px] text-[var(--text-ink)] placeholder:text-[var(--text-dim)] outline-none transition-[border-color,box-shadow] duration-200 ease-in focus:border-[var(--border-vis)] focus:shadow-[0_0_0_3px_var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50";

function getInitials(fullName: string | null): string {
  if (!fullName || !fullName.trim()) return "NS";
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "NS";
}

function usageColor(percent: number): string {
  if (percent >= 80) return "#E05A5A";
  if (percent >= 60) return "var(--accent-amber)";
  return "var(--accent-sage)";
}

type MeterProps = {
  label: string;
  valueText: string;
  note: string;
  percent: number;
};

function UsageMeter({ label, valueText, note, percent }: MeterProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-normal text-[var(--text-body)]">
          {label}
        </span>
        <span className="text-[13px] font-medium text-[var(--text-ink)]">
          {valueText}
        </span>
      </div>

      <Progress.Root className="relative h-[5px] w-full overflow-hidden rounded-full bg-[var(--bg-raised)]">
        <Progress.Indicator asChild>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="h-full"
            style={{ backgroundColor: usageColor(percent) }}
          />
        </Progress.Indicator>
      </Progress.Root>

      <p className="mt-1 text-[11px] font-normal text-[var(--text-dim)]">
        {note}
      </p>
    </div>
  );
}

export function SettingsClient({ profile, jobsCount, docsCount }: SettingsClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const isPro = (profile.subscription_status ?? "").toLowerCase() === "pro";

  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await openCheckout();
    } catch (err) {
      console.error("[UPGRADE]", err);
      setToastTitle("Checkout failed");
      setToastDescription(err instanceof Error ? err.message : "Please try again.");
      setToastOpen(true);
    } finally {
      setIsUpgrading(false);
    }
  };

  const { register, handleSubmit, formState } = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: profile.full_name ?? "",
    },
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState("Reset link sent");
  const [toastDescription, setToastDescription] = useState("Check your inbox.");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const queriesUsed = profile.queries_used ?? 0;
  const queryLimit = isPro ? Infinity : 20;
  const jobsLimit = isPro ? Infinity : 3;
  const docsLimit = isPro ? Infinity : 50;

  const queriesPercent = isPro ? Math.min(100, (queriesUsed / Math.max(queriesUsed, 1)) * 100) : (queriesUsed / 20) * 100;
  const jobsPercent = isPro ? Math.min(100, (jobsCount / Math.max(jobsCount, 1)) * 100) : (jobsCount / 3) * 100;
  const docsPercent = isPro ? Math.min(100, (docsCount / Math.max(docsCount, 1)) * 100) : (docsCount / 50) * 100;

  const nextReset = useMemo(() => {
    const baseDate = profile.last_query_reset_date ? new Date(profile.last_query_reset_date) : new Date();
    baseDate.setDate(baseDate.getDate() + 30);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(baseDate);
  }, [profile.last_query_reset_date]);

  const onSubmitProfile = async (values: ProfileFormValues) => {
    const result = await updateProfile({ full_name: values.full_name.trim() });
    if (!result.success) {
      setToastTitle("Could not save changes");
      setToastDescription(result.error ?? "Please try again.");
      setToastOpen(true);
      return;
    }

    setSaveSuccess(true);
    router.refresh();
    window.setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    if (error) {
      setToastTitle("Could not send reset link");
      setToastDescription(error.message);
      setToastOpen(true);
      return;
    }

    setToastTitle("Reset link sent");
    setToastDescription("Check your inbox.");
    setToastOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (confirmInput !== "delete" || isDeleting) return;
    setIsDeleting(true);

    const result = await deleteAccount();
    if (result.success) {
      router.push("/");
      return;
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setConfirmInput("");
    setToastTitle("Delete failed");
    setToastDescription(result.error ?? "Unable to delete account.");
    setToastOpen(true);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div>
        <section className="mb-5 overflow-hidden rounded-2xl border border-[var(--border-sub)] bg-[var(--bg-panel)] hover-glow">
          <header className="border-b border-[var(--border-sub)] px-6 py-5">
            <h2 className="text-[14px] font-semibold text-[var(--text-ink)]">
              Profile
            </h2>
            <p className="mt-0.5 text-[13px] font-normal text-[var(--text-body)]">
              Your name and account details.
            </p>
          </header>

          <div className="px-6 py-6">
            <div className="mb-6 flex items-center gap-5">
              <Avatar className="h-14 w-14 rounded-full">
                <AvatarImage src={profile.avatar_url ?? undefined} alt="Profile photo" />
                <AvatarFallback
                  className="border border-[var(--border-vis)] bg-[var(--bg-raised)] text-[18px] font-medium text-[var(--text-body)]"
                 
                >
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <p className="text-[15px] font-medium text-[var(--text-ink)]">
                  {profile.full_name || "No name set"}
                </p>
                <p className="text-[13px] font-normal text-[var(--text-dim)]">
                  {profile.email}
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="mt-2 w-fit rounded-lg border border-[var(--border-vis)] bg-transparent px-3 py-1.5 text-[12px] font-normal text-[var(--text-body)] transition-[color,border-color,box-shadow] duration-200 hover:text-[var(--text-ink)] hover:shadow-sm"
                 
                >
                  Change photo
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitProfile)}>
              <div>
                <Label
                  htmlFor="settings-full-name"
                  className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-body)]"
                 
                >
                  FULL NAME
                </Label>
                <input
                  id="settings-full-name"
                  {...register("full_name")}
                  className={`${INPUT_CLASSNAME} mt-1.5`}
                />
              </div>

              <div className="mt-4">
                <Label
                  htmlFor="settings-email"
                  className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-body)]"
                 
                >
                  EMAIL ADDRESS
                </Label>
                <input id="settings-email" defaultValue={profile.email} disabled className={`${INPUT_CLASSNAME} mt-1.5`} />
                <p className="mt-1.5 text-[11px] font-normal text-[var(--text-dim)]">
                  Email changes require contacting support.
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <motion.button
                  type="submit"
                  disabled={formState.isSubmitting}
                  whileHover={!formState.isSubmitting ? { scale: 1.02 } : undefined}
                  whileTap={!formState.isSubmitting ? { scale: 0.97 } : undefined}
                  transition={{ duration: 0.25, ease: MOTION_EASE }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-[13px] font-semibold ${
                    saveSuccess
                      ? "border border-[var(--border-vis)] bg-transparent text-[var(--accent-sage)]"
                      : "bg-[var(--accent-sage)] text-[var(--bg-canvas)]"
                  } ${formState.isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                 
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {saveSuccess ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: MOTION_EASE }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Check size={14} />
                        Saved
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: MOTION_EASE }}
                      >
                        {formState.isSubmitting ? "Saving..." : "Save Changes"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          </div>
        </section>

        <section className="mb-5 overflow-hidden rounded-2xl border border-[var(--border-sub)] bg-[var(--bg-panel)] hover-glow">
          <header className="border-b border-[var(--border-sub)] px-6 py-5">
            <h2 className="text-[14px] font-semibold text-[var(--text-ink)]">
              Plan & Usage
            </h2>
            <p className="mt-0.5 text-[13px] font-normal text-[var(--text-body)]">
              Your subscription and monthly limits.
            </p>
          </header>

          <div className="px-6 py-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-normal uppercase tracking-[0.08em] text-[var(--text-dim)]">
                  CURRENT PLAN
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span
                    className={`text-[28px] font-semibold leading-none ${
                      isPro ? "text-[var(--accent-sage)]" : "text-[var(--accent-amber)]"
                    }`}
                   
                  >
                    {isPro ? "Pro" : "Free"}
                  </span>
                  <span className="text-[13px] font-normal text-[var(--text-dim)]">
                    {isPro ? "Â· Unlimited" : "Â· 20 queries / month"}
                  </span>
                </div>
              </div>

              {isPro ? (
                <button
                  type="button"
                  className="rounded-lg border border-[var(--border-vis)] bg-transparent px-4 py-2 text-[13px] font-normal text-[var(--text-body)] transition-colors duration-150 hover:text-[var(--text-ink)]"
                 
                >
                  Manage Billing
                </button>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25, ease: MOTION_EASE }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent-sage)] px-5 py-2.5 text-[13px] font-semibold text-[var(--bg-canvas)] disabled:opacity-60"
                  style={{ boxShadow: "0 0 20px rgba(126,184,154,0.15)" }}
                >
                  {isUpgrading ? "Opening…" : "Upgrade to Pro"}
                  {!isUpgrading && <ArrowRight size={14} />}
                </motion.button>
              )}
            </div>

            <Separator className="my-5 bg-[var(--border-sub)]" />

            <div className="space-y-5">
              <UsageMeter
                label="Queries this month"
                valueText={`${queriesUsed} / ${queryLimit === Infinity ? "âˆž" : "20"}`}
                note={`Resets ${nextReset}`}
                percent={queriesPercent}
              />

              <UsageMeter
                label="Active jobs"
                valueText={`${jobsCount} / ${jobsLimit === Infinity ? "âˆž" : "3"}`}
                note={isPro ? "Unlimited active jobs on Pro" : "3 job limit on Free plan"}
                percent={jobsPercent}
              />

              <UsageMeter
                label="Resume uploads"
                valueText={`${docsCount} / ${docsLimit === Infinity ? "âˆž" : "50"}`}
                note={isPro ? "Unlimited uploads on Pro" : "50 upload limit on Free plan"}
                percent={docsPercent}
              />
            </div>

            {!isPro && (
              <div className="mt-6 flex items-start gap-4 rounded-xl border border-[var(--border-vis)] bg-[var(--bg-raised)] p-5">
                <Sparkles size={18} className="mt-0.5 flex-shrink-0 text-[var(--accent-sage)]" />

                <div>
                  <p className="text-[14px] font-semibold text-[var(--text-ink)]">
                    Go unlimited with Pro
                  </p>
                  <p
                    className="mt-1 text-[13px] font-normal leading-relaxed text-[var(--text-body)]"
                   
                  >
                    Unlimited jobs, queries, and uploads for $49/month.
                  </p>

                  <div className="mt-3 space-y-2">
                    {[
                      "Unlimited AI queries every month",
                      "Unlimited resume uploads and jobs",
                      "PDF export for candidate reports",
                      "Priority support",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check size={13} className="text-[var(--accent-sage)]" />
                        <span className="text-[13px] font-normal text-[var(--text-body)]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.25, ease: MOTION_EASE }}
                    className="mt-4 inline-flex items-center gap-1 rounded-lg bg-[var(--accent-sage)] px-5 py-2.5 text-[13px] font-semibold text-[var(--bg-canvas)] disabled:opacity-60"
                    style={{ boxShadow: "0 0 20px rgba(126,184,154,0.15)" }}
                  >
                    {isUpgrading ? "Opening…" : "Upgrade to Pro"}
                    {!isUpgrading && <ArrowRight size={14} />}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-5 overflow-hidden rounded-2xl border border-[var(--border-sub)] bg-[var(--bg-panel)] hover-glow">
          <header className="border-b border-[var(--border-sub)] px-6 py-5">
            <h2 className="text-[14px] font-semibold text-[var(--text-ink)]">
              Security
            </h2>
            <p className="mt-0.5 text-[13px] font-normal text-[var(--text-body)]">
              Password and session management.
            </p>
          </header>

          <div className="space-y-0 px-6 py-6">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-[14px] font-medium text-[var(--text-ink)]">
                  Password
                </p>
                <p className="mt-0.5 text-[12px] font-normal text-[var(--text-dim)]">
                  Send a reset link to your email
                </p>
              </div>

              <motion.button
                type="button"
                onClick={handleResetPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="rounded-lg border border-[var(--border-vis)] bg-transparent px-4 py-2 text-[13px] font-normal text-[var(--text-body)] transition-[color,border-color,box-shadow] duration-200 hover:text-[var(--text-ink)] hover:shadow-sm"
               
              >
                Send Reset Link
              </motion.button>
            </div>

            <Separator className="bg-[var(--border-sub)]" />

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-[14px] font-medium text-[var(--text-ink)]">
                  Sign Out
                </p>
                <p className="mt-0.5 text-[12px] font-normal text-[var(--text-dim)]">
                  End your current session
                </p>
              </div>

              <motion.button
                type="button"
                onClick={handleSignOut}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-normal text-[#E05A5A] transition-[color,background-color,box-shadow] duration-200 hover:bg-[rgba(224,90,90,0.07)] hover:shadow-sm"
                style={{ borderColor: "rgba(224,90,90,0.3)" }}
              >
                <LogOut size={13} />
                Sign Out
              </motion.button>
            </div>
          </div>
        </section>

        <section className="mb-5 overflow-hidden rounded-2xl border bg-[var(--bg-panel)]" style={{ borderColor: "rgba(224,90,90,0.18)" }}>
          <header className="border-b px-6 py-5" style={{ borderBottomColor: "rgba(224,90,90,0.12)" }}>
            <h2 className="text-[14px] font-semibold text-[var(--text-ink)]">
              Danger Zone
            </h2>
            <p className="mt-0.5 text-[13px] font-normal text-[var(--text-body)]">
              Permanent and irreversible actions.
            </p>
          </header>

          <div className="px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-medium text-[var(--text-ink)]">
                  Delete Account
                </p>
                <p className="mt-0.5 text-[12px] font-normal text-[var(--text-dim)]">
                  Permanently deletes all jobs, resumes, and query history.
                </p>
              </div>

              <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialog.Trigger asChild>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="rounded-lg border px-4 py-2 text-[13px] font-normal text-[#E05A5A] transition-[color,background-color,box-shadow] duration-200 hover:bg-[rgba(224,90,90,0.07)] hover:shadow-sm"
                    style={{ borderColor: "rgba(224,90,90,0.3)" }}
                  >
                    Delete Account
                  </motion.button>
                </AlertDialog.Trigger>

                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm" />
                  <AlertDialog.Content asChild>
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: MOTION_EASE }}
                      className="fixed left-1/2 top-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border-vis)] bg-[var(--bg-panel)] p-6"
                      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
                    >
                      <AlertDialog.Title
                        className="text-[22px] font-bold text-[var(--text-ink)]"
                      >
                        Delete your account?
                      </AlertDialog.Title>

                      <AlertDialog.Description
                        className="mt-3 text-[14px] font-normal leading-relaxed text-[var(--text-body)]"
                       
                      >
                        This permanently deletes all your jobs, uploaded resumes, query history, and account data. There is no undo.
                      </AlertDialog.Description>

                      <div
                        className="mt-4 flex items-start gap-3 rounded-lg border p-4"
                        style={{ borderColor: "rgba(224,90,90,0.2)", backgroundColor: "rgba(224,90,90,0.07)" }}
                      >
                        <AlertTriangle size={16} className="flex-shrink-0 text-[#E05A5A]" />
                        <p className="text-[13px] font-normal text-[#E05A5A]">
                          All your jobs and resumes will be removed.
                        </p>
                      </div>

                      <div className="mt-5">
                        <Label
                          htmlFor="delete-confirm"
                          className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-body)]"
                         
                        >
                          Type &ldquo;delete&rdquo; to confirm
                        </Label>
                        <input
                          id="delete-confirm"
                          value={confirmInput}
                          onChange={(event) => setConfirmInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") event.preventDefault();
                          }}
                          placeholder="delete"
                          className={`${INPUT_CLASSNAME} mt-1.5`}
                        />
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <AlertDialog.Cancel asChild>
                          <button
                            type="button"
                            onClick={() => setConfirmInput("")}
                            className="rounded-lg border border-[var(--border-vis)] bg-transparent px-4 py-2.5 text-[13px] font-normal text-[var(--text-body)] transition-colors duration-150 hover:text-[var(--text-ink)]"
                           
                          >
                            Cancel
                          </button>
                        </AlertDialog.Cancel>

                        <AlertDialog.Action asChild>
                          <motion.button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={confirmInput !== "delete" || isDeleting}
                            whileTap={confirmInput === "delete" && !isDeleting ? { scale: 0.97 } : undefined}
                            transition={{ duration: 0.2, ease: MOTION_EASE }}
                            className="rounded-lg bg-[#E05A5A] px-5 py-2.5 text-[13px] font-semibold text-[var(--text-ink)] transition-opacity duration-150 enabled:hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[0.35]"
                           
                          >
                            {isDeleting ? "Deleting..." : "Yes, delete everything"}
                          </motion.button>
                        </AlertDialog.Action>
                      </div>
                    </motion.div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {toastOpen && (
          <Toast.Root open={toastOpen} onOpenChange={setToastOpen} duration={4000} asChild forceMount>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: MOTION_EASE }}
              className="min-w-[300px] rounded-xl border border-[var(--border-vis)] bg-[var(--bg-raised)] p-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[var(--accent-sage)]" />
                <div>
                  <Toast.Title
                    className="text-[13px] font-semibold text-[var(--text-ink)]"
                   
                  >
                    {toastTitle}
                  </Toast.Title>
                  <Toast.Description
                    className="mt-1 text-[12px] font-normal text-[var(--text-body)]"
                   
                  >
                    {toastDescription}
                  </Toast.Description>
                </div>
              </div>
            </motion.div>
          </Toast.Root>
        )}
      </AnimatePresence>

      <Toast.Viewport className="fixed bottom-4 right-4 z-[100] outline-none" />
    </Toast.Provider>
  );
}
