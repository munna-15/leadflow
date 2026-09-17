
"use client";

import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Flame,
  Layers3,
  UsersRound,
} from "lucide-react";

type SalesOverviewProps = {
  activeLeads?: number;
  highIntentLeads?: number;
  followUpsDue?: number;
  pipelineLeads?: number;
};

export default function SalesOverview({
  activeLeads = 0,
  highIntentLeads = 0,
  followUpsDue = 0,
  pipelineLeads = 0,
}: SalesOverviewProps) {
  return (
    <section className="mt-8">
      <div className="mb-5 flex items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Sales overview
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
            Know where your opportunities stand.
          </h2>
        </div>

        <Link
          href="/dashboard/leads"
          className="group hidden items-center gap-1.5 text-sm font-semibold text-primary sm:inline-flex"
        >
          Explore leads
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr_1fr]">
        <div className="relative min-h-[230px] overflow-hidden rounded-3xl bg-foreground p-6 text-white shadow-sm sm:p-7">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-32 w-48 bg-gradient-to-tl from-primary/10 to-transparent"
          />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                <UsersRound className="h-5 w-5" />
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                Active pipeline
              </span>
            </div>

            <div className="mt-10">
              <p className="text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
                {activeLeads}
              </p>

              <p className="mt-2 text-sm font-medium text-slate-300">
                active opportunities
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                Leads currently moving through your sales process
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[230px] overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Flame className="h-5 w-5" />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              High intent
            </span>
          </div>

          <div className="mt-9">
            <p className="text-4xl font-semibold tracking-[-0.045em] text-foreground">
              {highIntentLeads}
            </p>

            <p className="mt-2 text-sm font-medium text-body">
              leads showing strong buying signals
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400/0 via-orange-400/60 to-orange-400/0" />
        </div>

        <div className="relative min-h-[230px] overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <CalendarClock className="h-5 w-5" />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Attention
            </span>
          </div>

          <div className="mt-9">
            <p className="text-4xl font-semibold tracking-[-0.045em] text-foreground">
              {followUpsDue}
            </p>

            <p className="mt-2 text-sm font-medium text-body">
              follow-ups currently needing action
            </p>
          </div>

          <Link
            href="/dashboard/follow-ups"
            className="group absolute bottom-6 right-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
          >
            Open queue
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-border bg-surface px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
            <Layers3 className="h-4.5 w-4.5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Pipeline coverage
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              {pipelineLeads} leads are currently represented across the sales
              pipeline.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/pipeline"
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          View pipeline
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

