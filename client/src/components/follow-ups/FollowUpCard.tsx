"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Mail,
  Phone,
} from "lucide-react";

type FollowUpCardProps = {
  id: string;
  name: string;
  initials: string;
  status: string;
  temperature: "Hot" | "Warm" | "Cold";
  score: number;
  reason: string;
  description: string;
  scheduledAt: string;
  timingLabel: string;
  timingType: "overdue" | "today" | "upcoming";
};

const temperatureStyles = {
  Hot: "bg-orange-50 text-orange-700",
  Warm: "bg-amber-50 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

const timingStyles = {
  overdue: "bg-red-50 text-red-600",
  today: "bg-primary-soft text-primary",
  upcoming: "bg-background text-muted",
};

export default function FollowUpCard({
  id,
  name,
  initials,
  status,
  temperature,
  score,
  reason,
  description,
  scheduledAt,
  timingLabel,
  timingType,
}: FollowUpCardProps) {
  return (
    <article className="group rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-semibold text-primary">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/leads/${id}`}
                className="text-base font-semibold text-foreground transition-colors hover:text-primary"
              >
                {name}
              </Link>

              {temperature === "Hot" && (
                <Flame className="h-3.5 w-3.5 text-orange-500" />
              )}

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${temperatureStyles[temperature]}`}
              >
                {temperature}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted">
              {status} · Lead score {score}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${timingStyles[timingType]}`}
          >
            {timingLabel}
          </span>
        </div>

        <div className="rounded-2xl bg-background p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
              <Clock3 className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{reason}</p>

              <p className="mt-1.5 text-sm leading-6 text-body">
                {description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {scheduledAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/dashboard/leads/${id}`}
            className="group/link inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted transition-colors hover:bg-background hover:text-primary sm:justify-start"
          >
            View lead
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </Link>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              <Phone className="h-4 w-4" />
              Call
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-4 text-xs font-medium text-muted">
          <Mail className="h-3.5 w-3.5" />
          Follow-up can be completed manually or through a connected channel.
        </div>
      </div>
    </article>
  );
}
