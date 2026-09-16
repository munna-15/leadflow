"use client";

import { CalendarRange, Download, Sparkles } from "lucide-react";

export default function AnalyticsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />

          <p className="text-sm font-semibold text-primary">
            Performance intelligence
          </p>
        </div>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analytics
        </h1>

        <p className="mt-2 text-base leading-7 text-muted">
          Understand how leads move through your sales process and where your
          team can create the next opportunity.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background"
        >
          <CalendarRange className="h-4 w-4 text-muted" />
          Last 30 days
        </button>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
        >
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>
    </div>
  );
}
