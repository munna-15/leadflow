"use client";

import { Save, Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />

          <p className="text-sm font-semibold text-primary">
            Workspace control
          </p>
        </div>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 text-base leading-7 text-muted">
          Manage your account, business workspace, team access, notifications,
          and LeadFlow preferences.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md lg:self-auto"
      >
        <Save className="h-4 w-4" />
        Save changes
      </button>
    </div>
  );
}
