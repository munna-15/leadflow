"use client";

import { Bell, CheckCheck, Settings } from "lucide-react";

export default function NotificationsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />

          <p className="text-sm font-semibold text-primary">Activity center</p>
        </div>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Notifications
        </h1>

        <p className="mt-2 text-base leading-7 text-muted">
          Stay informed about important lead activity, follow-ups, meetings, and
          sales workflow changes.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background"
        >
          <CheckCheck className="h-4 w-4 text-muted" />
          Mark all read
        </button>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
        >
          <Settings className="h-4 w-4" />
          Preferences
        </button>
      </div>
    </div>
  );
}
