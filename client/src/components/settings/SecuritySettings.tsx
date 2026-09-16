"use client";

import { KeyRound, LogOut, ShieldCheck, Trash2 } from "lucide-react";

export default function SecuritySettings() {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7">
        <div>
          <p className="text-sm font-semibold text-primary">Security</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Account security
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Protect your account and manage active access to the LeadFlow
            workspace.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
              <KeyRound className="h-4.5 w-4.5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Password
              </h3>

              <p className="mt-1 text-sm leading-5 text-muted">
                Update your password regularly to keep your account secure.
              </p>

              <p className="mt-1.5 text-xs font-medium text-muted">
                Last changed 30 days ago
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background"
          >
            Change password
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Account protection
              </h3>

              <p className="mt-1 text-sm leading-5 text-muted">
                Your account uses secure authentication and protected sessions.
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Protection active
              </div>
            </div>
          </div>

          <span className="text-xs font-semibold text-muted">
            HTTP-only session
          </span>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
              <LogOut className="h-4.5 w-4.5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Active sessions
              </h3>

              <p className="mt-1 text-sm leading-5 text-muted">
                Sign out from other devices if you notice unfamiliar activity.
              </p>

              <p className="mt-1.5 text-xs font-medium text-muted">
                1 active session
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background"
          >
            Manage sessions
          </button>
        </div>
      </div>

      <div className="border-t border-red-100 bg-red-50/40 px-6 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Trash2 className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-red-700">
                Delete account
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-red-600/80">
                Permanently remove your account and associated workspace data.
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-white px-3.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Delete account
          </button>
        </div>
      </div>
    </section>
  );
}
