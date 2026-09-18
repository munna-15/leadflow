"use client";

import { Save, Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-primary to-primary" />

          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Workspace control
          </p>

          <span className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
        </div>

        <div className="relative mt-3 inline-block">
          <div
            aria-hidden="true"
            className="absolute -inset-x-5 -inset-y-3 -z-10 bg-gradient-to-r from-primary/10 via-sky-400/5 to-transparent blur-2xl"
          />

          <h1 className="bg-gradient-to-br from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-5xl font-semibold leading-[1.05] tracking-[-0.055em] text-transparent sm:text-6xl">
            Settings
            <span className="ml-1 text-primary/80">.</span>
          </h1>
        </div>

        <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Manage your account, business workspace, team access, notifications,
          security, and LeadFlow preferences from one place.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#172033] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
          <Save className="h-4 w-4" strokeWidth={2.3} />
        </span>

        <span>Save changes</span>
      </button>
    </div>
  );
}
