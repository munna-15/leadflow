
"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  ShieldCheck,
  Trash2,
  LoaderCircle,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import api from "@/lib/api";

type PasswordField =
  | "currentPassword"
  | "newPassword"
  | "confirmPassword";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordVisibility = {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
};

type PasswordApiResponse = {
  success: boolean;
  message: string;
};

const initialPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialVisibility: PasswordVisibility = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

export default function SecuritySettings() {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(initialPasswordForm);

  const [visibility, setVisibility] =
    useState<PasswordVisibility>(initialVisibility);

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState<string | null>(null);

  const [passwordSuccess, setPasswordSuccess] =
    useState<string | null>(null);

  const handlePasswordFieldChange = (
    field: PasswordField,
    value: string,
  ) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (passwordError) {
      setPasswordError(null);
    }

    if (passwordSuccess) {
      setPasswordSuccess(null);
    }
  };

  const toggleVisibility = (
    field: PasswordField,
  ) => {
    setVisibility((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const validatePasswordForm = () => {
    const currentPassword =
      passwordForm.currentPassword.trim();

    const newPassword =
      passwordForm.newPassword;

    const confirmPassword =
      passwordForm.confirmPassword;

    if (!currentPassword) {
      return "Enter your current password.";
    }

    if (!newPassword) {
      return "Enter a new password.";
    }

    if (newPassword.length < 8) {
      return "Your new password must be at least 8 characters.";
    }

    if (newPassword === currentPassword) {
      return "Your new password must be different from your current password.";
    }

    if (!confirmPassword) {
      return "Confirm your new password.";
    }

    if (newPassword !== confirmPassword) {
      return "New password and confirmation do not match.";
    }

    return null;
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    const validationError =
      validatePasswordForm();

    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setSavingPassword(true);

    try {
      const response =
        await api.patch<PasswordApiResponse>(
          "/auth/password",
          {
            currentPassword:
              passwordForm.currentPassword,
            newPassword:
              passwordForm.newPassword,
          },
        );

      setPasswordForm(initialPasswordForm);
      setVisibility(initialVisibility);
      setIsPasswordOpen(false);

      setPasswordSuccess(
        response.data.message ||
          "Password updated successfully.",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to update your password. Please try again.";

      setPasswordError(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    if (savingPassword) {
      return;
    }

    setPasswordForm(initialPasswordForm);
    setVisibility(initialVisibility);
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsPasswordOpen(false);
  };

  const renderPasswordInput = (
    field: PasswordField,
    label: string,
    placeholder: string,
  ) => {
    const value = passwordForm[field];
    const isVisible = visibility[field];

    return (
      <div>
        <label
          htmlFor={`security-${field}`}
          className="text-sm font-semibold text-foreground"
        >
          {label}
        </label>

        <div className="relative mt-2">
          <input
            id={`security-${field}`}
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={(event) =>
              handlePasswordFieldChange(
                field,
                event.target.value,
              )
            }
            placeholder={placeholder}
            autoComplete={
              field === "currentPassword"
                ? "current-password"
                : field === "newPassword"
                  ? "new-password"
                  : "new-password"
            }
            disabled={savingPassword}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-70"
          />

          <button
            type="button"
            aria-label={
              isVisible
                ? `Hide ${label.toLowerCase()}`
                : `Show ${label.toLowerCase()}`
            }
            onClick={() =>
              toggleVisibility(field)
            }
            disabled={savingPassword}
            className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="border-b border-border/70 px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Security
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Account security
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Protect your account and manage active
              access to the LeadFlow workspace.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/70">
        <div className="px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
                <KeyRound className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  Password
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                  Update your password regularly to
                  keep your account secure.
                </p>

                <p className="mt-1.5 text-xs font-medium text-muted">
                  Password changes are protected by
                  your current password.
                </p>
              </div>
            </div>

            {!isPasswordOpen && (
              <button
                type="button"
                onClick={() => {
                  setPasswordError(null);
                  setPasswordSuccess(null);
                  setIsPasswordOpen(true);
                }}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-surface px-4 text-sm font-semibold text-foreground shadow-sm outline-none transition-colors duration-200 hover:bg-background focus:ring-4 focus:ring-primary/10"
              >
                Change password
              </button>
            )}
          </div>

          {isPasswordOpen && (
            <div className="mt-6 rounded-2xl border border-border/70 bg-background/60 p-4 sm:p-5">
              <div className="max-w-xl">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Change your password
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    Use a strong password with at least
                    8 characters.
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  {renderPasswordInput(
                    "currentPassword",
                    "Current password",
                    "Enter your current password",
                  )}

                  {renderPasswordInput(
                    "newPassword",
                    "New password",
                    "Enter a new password",
                  )}

                  {renderPasswordInput(
                    "confirmPassword",
                    "Confirm new password",
                    "Re-enter your new password",
                  )}
                </div>

                <div className="mt-5 min-h-[68px]">
                  {passwordError ? (
                    <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 px-3.5 py-3 text-sm text-danger">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />

                      <p className="leading-5">
                        {passwordError}
                      </p>
                    </div>
                  ) : passwordSuccess ? (
                    <div className="flex items-start gap-2 rounded-xl border border-success/20 bg-success/5 px-3.5 py-3 text-sm text-success">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                      <p className="leading-5">
                        {passwordSuccess}
                      </p>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      handleCancelPasswordChange
                    }
                    disabled={savingPassword}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border/80 bg-surface px-4 text-sm font-semibold text-foreground outline-none transition-colors hover:bg-background focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleChangePassword
                    }
                    disabled={savingPassword}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm outline-none transition-colors hover:bg-primary-dark focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingPassword && (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}

                    {savingPassword
                      ? "Updating..."
                      : "Update password"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                Account protection
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                Your account uses secure authentication
                and protected sessions.
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />

                <span className="text-xs font-semibold text-success">
                  Protection active
                </span>
              </div>
            </div>
          </div>

          <div className="inline-flex w-fit shrink-0 items-center rounded-full bg-background px-2.5 py-1.5 ring-1 ring-border/70">
            <span className="text-xs font-semibold text-muted">
              HTTP-only session
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
              <LogOut className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                Active sessions
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                Your current authentication is protected
                by a secure HTTP-only session cookie.
              </p>

              <p className="mt-1.5 text-xs font-medium text-muted">
                Session management will be available
                when multi-session controls are enabled.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit shrink-0 items-center rounded-full bg-background px-3 py-1.5 ring-1 ring-border/70">
            <span className="text-xs font-semibold text-muted">
              Protected
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-red-100 bg-red-50/40 px-6 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Trash2 className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-red-700">
                Delete account
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-red-600/80">
                Permanently remove your account and
                associated workspace data. Account deletion
                controls are not enabled yet.
              </p>
            </div>
          </div>

          <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white px-3.5 text-xs font-semibold text-red-400">
            Unavailable
          </span>
        </div>
      </div>
    </section>
  );
}

