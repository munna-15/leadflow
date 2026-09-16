"use client";

import { CalendarDays, Plus } from "lucide-react";

export default function FollowUpsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />

          <p className="text-sm font-semibold text-primary">Sales follow-up</p>
        </div>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Follow-ups
        </h1>

        <p className="mt-2 text-base leading-7 text-muted">
          Stay ahead of every conversation and make sure promising leads never
          go quiet.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark lg:self-auto"
      >
        <Plus className="h-4 w-4" />
        Schedule follow-up
      </button>
    </div>
  );
}
