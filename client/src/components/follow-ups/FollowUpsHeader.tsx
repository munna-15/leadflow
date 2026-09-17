"use client";

import { CalendarDays, Plus, Sparkles } from "lucide-react";

type FollowUpsHeaderProps = {
  onSchedule?: () => void;
};

export default function FollowUpsHeader({ onSchedule }: FollowUpsHeaderProps) {
  return (
    <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-primary to-primary" />

          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Sales follow-up
            </p>
          </div>

          <span className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
        </div>

        <div className="relative mt-3 inline-block">
          <div
            aria-hidden="true"
            className="absolute -inset-x-5 -inset-y-3 -z-10 bg-gradient-to-r from-primary/10 via-sky-400/5 to-transparent blur-2xl"
          />

          <h1 className="bg-gradient-to-br from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-5xl font-semibold leading-[1.05] tracking-[-0.055em] text-transparent sm:text-6xl">
            Follow-ups
            <span className="ml-1 text-primary/80">.</span>
          </h1>
        </div>

        <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Stay ahead of every conversation and make sure promising leads never
          go quiet.
        </p>
      </div>

      <button
        type="button"
        onClick={onSchedule}
        className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-[#172033]"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
          <Plus
            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
            strokeWidth={2.5}
          />
        </span>

        <span className="relative">Schedule follow-up</span>

        <Sparkles className="relative h-3.5 w-3.5 text-primary opacity-70 transition-all duration-300 group-hover:rotate-12 group-hover:opacity-100" />
      </button>
    </div>
  );
}
