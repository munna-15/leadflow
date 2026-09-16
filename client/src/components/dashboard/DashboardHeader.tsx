"use client";

import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/85 backdrop-blur-xl">
      <div className="flex h-18 items-center justify-between px-6 sm:px-8 lg:px-10">
        <div className="relative hidden w-full max-w-md md:block">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />

          <input
            type="search"
            placeholder="Search leads, contacts..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-background hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          <div className="flex items-center gap-3 border-l border-border pl-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
              M
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">Munna</p>
              <p className="text-xs text-muted">Owner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
