"use client";

import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Flame,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";

import type { DashboardAttentionItem } from "@/services/dashboard.service";

type AttentionPanelProps = {
  items?: DashboardAttentionItem[];
  activeLeads?: number;
  highIntentLeads?: number;
  followUpsDue?: number;
};

const typeConfig = {
  overdue_follow_up: {
    label: "Overdue",
    icon: CalendarClock,
    iconClass: "bg-danger/10 text-danger",
    badgeClass: "bg-danger/10 text-danger",
  },

  high_intent: {
    label: "High intent",
    icon: Flame,
    iconClass: "bg-orange-50 text-orange-600",
    badgeClass: "bg-orange-50 text-orange-600",
  },

  upcoming_follow_up: {
    label: "Upcoming",
    icon: MessageCircle,
    iconClass: "bg-primary-soft text-primary",
    badgeClass: "bg-primary-soft text-primary",
  },
} as const;

const getScoreClass = (score: number) => {
  if (score >= 80) {
    return "text-orange-600";
  }

  if (score >= 60) {
    return "text-primary";
  }

  return "text-muted";
};

export default function AttentionPanel({
  items = [],
  activeLeads = 0,
  highIntentLeads = 0,
  followUpsDue = 0,
}: AttentionPanelProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="flex items-start justify-between gap-5 border-b border-border px-6 py-6 sm:px-7">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-danger">
                Needs attention
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-[28px]">
              Leads waiting on you
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Prioritize the conversations most likely to need action right now.
            </p>
          </div>

          <Link
            href="/dashboard/leads"
            className="group hidden shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft sm:inline-flex"
          >
            View leads
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="divide-y divide-border">
          {items.length > 0 ? (
            items.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;

              return (
                <Link
                  key={item.id}
                  href={`/dashboard/leads/${item.leadId}`}
                  className="group flex items-center gap-4 px-6 py-5 transition-colors duration-200 hover:bg-background sm:px-7"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconClass}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-foreground">
                        {item.leadName}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${config.badgeClass}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm text-body">
                      {item.description}
                    </p>

                    <p className="mt-1 text-xs font-medium text-muted">
                      {item.scheduledAt
                        ? new Date(item.scheduledAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "No follow-up scheduled"}
                    </p>
                  </div>

                  <div className="hidden shrink-0 items-center gap-4 sm:flex">
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                        Score
                      </p>

                      <p
                        className={`mt-1 text-xl font-semibold tracking-tight ${getScoreClass(
                          item.score,
                        )}`}
                      >
                        {item.score}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-border transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center sm:px-7">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <UserRound className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">
                Nothing needs attention
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                Your current lead activity is clear. New priorities will appear
                here when they need action.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border px-6 py-4 sm:hidden">
          <Link
            href="/dashboard/leads"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-primary"
          >
            View all leads
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-foreground p-6 text-white shadow-sm sm:p-7">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              Today
            </p>
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">
            Your sales pulse
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            A focused snapshot of the opportunities and follow-ups that matter
            most today.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/dashboard/leads"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition-colors duration-200 hover:bg-white/[0.08]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-sky-300">
                  <UserRound className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Active opportunities
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Leads currently in motion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold tracking-tight">
                  {activeLeads}
                </span>

                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-sky-300" />
              </div>
            </Link>

            <Link
              href="/dashboard/leads"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition-colors duration-200 hover:bg-white/[0.08]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                  <Flame className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    High-intent leads
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Strong buying signals detected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold tracking-tight">
                  {highIntentLeads}
                </span>

                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-300" />
              </div>
            </Link>

            <Link
              href="/dashboard/follow-ups"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition-colors duration-200 hover:bg-white/[0.08]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sky-300">
                  <CalendarClock className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Follow-ups due
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Conversations needing action
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold tracking-tight">
                  {followUpsDue}
                </span>

                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-sky-300" />
              </div>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Phone className="h-3.5 w-3.5 text-sky-300" />
              Keep conversations moving
            </div>

            <Link
              href="/dashboard/follow-ups"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-sky-300"
            >
              Open queue
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
