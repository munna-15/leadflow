"use client";

import { Camera, Mail, ShieldCheck, UserRound } from "lucide-react";

export default function AccountSettings() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7">
        <div>
          <p className="text-sm font-semibold text-primary">Account</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Profile & account
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Manage the personal information and account identity used across
            your LeadFlow workspace.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
          <div className="flex shrink-0 flex-col items-center sm:flex-row sm:items-center lg:w-56 lg:flex-col lg:items-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-soft text-2xl font-semibold text-primary">
                M
              </div>

              <button
                type="button"
                aria-label="Change profile photo"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted shadow-sm transition-colors hover:bg-background hover:text-primary"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 text-center sm:ml-4 sm:text-left lg:ml-0 lg:text-center">
              <p className="text-sm font-semibold text-foreground">Munna</p>

              <p className="mt-1 text-xs text-muted">Workspace Owner</p>
            </div>
          </div>

          <div className="grid flex-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="full-name"
                className="text-sm font-semibold text-foreground"
              >
                Full name
              </label>

              <div className="relative mt-2">
                <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="full-name"
                  type="text"
                  defaultValue="Munna"
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email address
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="email"
                  type="email"
                  defaultValue="munna@example.com"
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="text-sm font-semibold text-foreground"
              >
                Role
              </label>

              <div className="relative mt-2">
                <ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  id="role"
                  type="text"
                  value="Owner"
                  readOnly
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-medium text-muted outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs text-muted">
                Your role is controlled by workspace permissions.
              </p>
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="text-sm font-semibold text-foreground"
              >
                Timezone
              </label>

              <select
                id="timezone"
                defaultValue="Asia/Dhaka"
                className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="Asia/Dhaka">Bangladesh Standard Time</option>
                <option value="Asia/Kolkata">India Standard Time</option>
                <option value="Asia/Dubai">Gulf Standard Time</option>
                <option value="Europe/London">United Kingdom</option>
                <option value="America/New_York">Eastern Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
