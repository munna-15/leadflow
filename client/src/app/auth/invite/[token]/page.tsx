"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  acceptInvitation,
  getInvitationDetails,
  type InvitationDetails,
} from "@/services/clientOnboarding.service";

type PageState = "loading" | "ready" | "invalid" | "activated";

export default function InvitationActivationPage() {
  const router = useRouter();
  const params = useParams<{
    token: string;
  }>();

  const token = params?.token || "";

  const [pageState, setPageState] = useState<PageState>("loading");

  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadInvitation = async () => {
      if (!token) {
        setPageState("invalid");
        setErrorMessage("This invitation link is invalid.");
        return;
      }

      try {
        setPageState("loading");
        setErrorMessage("");

        const result = await getInvitationDetails(token);

        if (cancelled) {
          return;
        }

        setInvitation(result);
        setPageState("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "This invitation is invalid or expired.";

        setErrorMessage(message);
        setPageState("invalid");
      }
    };

    void loadInvitation();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      matching: password.length > 0 && password === confirmPassword,
    }),
    [password, confirmPassword],
  );

  const isPasswordValid = passwordChecks.length && passwordChecks.matching;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordChecks.length) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (!passwordChecks.matching) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await acceptInvitation(token, password);

      setPageState("activated");
      toast.success("Your LeadFlow account has been activated.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to activate your account.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToLogin = () => {
    router.push("/auth/login?activated=1");
  };

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                  */
  /* ------------------------------------------------------------------------ */

  if (pageState === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#0EA5E9] shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>

          <p className="mt-5 text-sm font-medium text-[#374151]">
            Verifying your invitation
          </p>

          <p className="mt-1 text-xs text-[#9CA3AF]">
            Please wait while we securely check your access.
          </p>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* INVALID                                                                  */
  /* ------------------------------------------------------------------------ */

  if (pageState === "invalid") {
    return (
      <main className="min-h-screen bg-[#F7F8FA] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
          <section className="w-full max-w-xl rounded-3xl border border-[#E5E7EB] bg-white p-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
              LeadFlow invitation
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111827] sm:text-3xl">
              This invitation is no longer available
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B7280]">
              {errorMessage ||
                "The invitation may have expired, been revoked, or already been used."}
            </p>

            <div className="mt-7 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] px-5 py-4 text-left">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0EA5E9]" />

                <p className="text-xs leading-5 text-[#6B7280]">
                  Ask your LeadFlow administrator to send a new invitation link.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={goToLogin}
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
            >
              Go to Sign in
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* ACTIVATED                                                                */
  /* ------------------------------------------------------------------------ */

  if (pageState === "activated") {
    return (
      <main className="min-h-screen bg-[#F7F8FA] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
          <section className="w-full max-w-xl rounded-3xl border border-[#E5E7EB] bg-white p-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Account activated
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111827] sm:text-3xl">
              Welcome to LeadFlow
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B7280]">
              Your workspace access is now active. Sign in with the email
              address you received the invitation on.
            </p>

            {invitation?.business?.name && (
              <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-5 py-4">
                <p className="text-xs font-medium text-[#9CA3AF]">Workspace</p>

                <p className="mt-1 text-sm font-semibold text-[#111827]">
                  {invitation.business.name}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={goToLogin}
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,165,233,0.2)] transition hover:bg-[#0284C7]"
            >
              Continue to Sign in
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* READY                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)] lg:grid-cols-[0.92fr_1.08fr]">
          {/* ---------------------------------------------------------------- */}
          {/* LEFT PANEL                                                       */}
          {/* ---------------------------------------------------------------- */}

          <section className="relative overflow-hidden bg-[#111827] px-7 py-9 text-white sm:px-10 sm:py-11 lg:px-12 lg:py-12">
            <div className="absolute -right-28 -top-28 h-64 w-64 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#0EA5E9]/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-[0.08em] text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                LEADFLOW
              </div>

              <div className="mt-16 max-w-md lg:mt-24">
                <p className="text-sm font-medium text-sky-300">
                  Your workspace is ready
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
                  Activate your account and get started.
                </h1>

                <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                  Set a secure password for your LeadFlow account. Once
                  activated, you can sign in and access your business workspace.
                </p>
              </div>

              <div className="mt-12 space-y-4 lg:mt-20">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Secure invitation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      This invitation is one-time use and expires automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-300">
                    <LockKeyhole className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Your password
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Choose your own password. No temporary password is shared.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* FORM PANEL                                                       */}
          {/* ---------------------------------------------------------------- */}

          <section className="px-7 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-md">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0EA5E9]">
                  Account activation
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#111827] sm:text-3xl">
                  Create your password
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                  You are activating access for{" "}
                  <span className="font-medium text-[#374151]">
                    {invitation?.business.name}
                  </span>
                  .
                </p>
              </div>

              {errorMessage && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="leading-5">{errorMessage}</p>
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                  Invited email
                </p>

                <p className="mt-1.5 break-all text-sm font-medium text-[#374151]">
                  {invitation?.invitation.email}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);

                        if (errorMessage) {
                          setErrorMessage("");
                        }
                      }}
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-11 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#7DD3FC] focus:ring-4 focus:ring-[#E0F2FE] disabled:bg-[#F8FAFC]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition hover:text-[#374151]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />

                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);

                        if (errorMessage) {
                          setErrorMessage("");
                        }
                      }}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-11 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#7DD3FC] focus:ring-4 focus:ring-[#E0F2FE] disabled:bg-[#F8FAFC]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition hover:text-[#374151]"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#F1F5F9] bg-[#FAFCFE] p-4">
                  <p className="text-xs font-semibold text-[#374151]">
                    Password requirements
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          passwordChecks.length
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-[#E5E7EB] text-[#9CA3AF]"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </span>

                      <span className="text-xs text-[#6B7280]">
                        At least 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          passwordChecks.matching
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-[#E5E7EB] text-[#9CA3AF]"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </span>

                      <span className="text-xs text-[#6B7280]">
                        Passwords match
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isPasswordValid}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,165,233,0.18)] transition hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Activating account...
                    </>
                  ) : (
                    <>
                      Activate account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-[#9CA3AF]">
                By activating this account, you will gain access to the LeadFlow
                workspace associated with this invitation.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
