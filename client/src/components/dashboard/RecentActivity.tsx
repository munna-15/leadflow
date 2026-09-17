"use client";

import Link from "next/link";

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Flame,
  MessageSquare,
  Plus,
  RefreshCw,
  UserRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { Activity, ActivityType } from "@/services/activity.service";

type RecentActivityProps = {
  activities?: Activity[];
  loading?: boolean;
};

const activityConfig: Record<
  ActivityType,
  {
    icon: LucideIcon;
    iconClass: string;
    accentClass: string;
  }
> = {
  lead_created: {
    icon: Plus,
    iconClass: "bg-primary-soft text-primary",
    accentClass: "bg-primary",
  },

  lead_assigned: {
    icon: UserRound,
    iconClass: "bg-slate-100 text-slate-600",
    accentClass: "bg-slate-300",
  },

  lead_updated: {
    icon: RefreshCw,
    iconClass: "bg-sky-50 text-sky-600",
    accentClass: "bg-sky-400",
  },

  status_changed: {
    icon: CircleDot,
    iconClass: "bg-amber-50 text-amber-600",
    accentClass: "bg-amber-400",
  },

  temperature_changed: {
    icon: Flame,
    iconClass: "bg-orange-50 text-orange-600",
    accentClass: "bg-orange-400",
  },

  follow_up_scheduled: {
    icon: CalendarClock,
    iconClass: "bg-primary-soft text-primary",
    accentClass: "bg-primary",
  },

  follow_up_rescheduled: {
    icon: RefreshCw,
    iconClass: "bg-sky-50 text-sky-600",
    accentClass: "bg-sky-400",
  },

  follow_up_completed: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
    accentClass: "bg-emerald-500",
  },

  follow_up_cancelled: {
    icon: MessageSquare,
    iconClass: "bg-red-50 text-red-600",
    accentClass: "bg-red-400",
  },
};

const fallbackActivity = {
  icon: CircleDot,
  iconClass: "bg-background text-muted",
  accentClass: "bg-border",
};

const formatActivityTime = (createdAt: string) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff = Date.now() - date.getTime();

  if (diff < 0) {
    return "Just now";
  }

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatActivityDate = (createdAt: string) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function RecentActivity({
  activities = [],
  loading = false,
}: RecentActivityProps) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Activity
            </p>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
            What&apos;s happening.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Follow the latest changes across your leads, assignments, and
            follow-ups.
          </p>
        </div>

        <Link
          href="/dashboard/activity"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          View activity
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        {loading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 px-6 py-5 sm:px-7"
              >
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-background" />

                <div className="min-w-0 flex-1 space-y-2.5">
                  <div className="h-4 w-52 max-w-[80%] animate-pulse rounded bg-background" />

                  <div className="h-3 w-80 max-w-[90%] animate-pulse rounded bg-background" />

                  <div className="h-3 w-24 animate-pulse rounded bg-background" />
                </div>

                <div className="hidden h-3 w-14 animate-pulse rounded bg-background sm:block" />
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="divide-y divide-border">
            {activities.slice(0, 6).map((activity) => {
              const config = activityConfig[activity.type] ?? fallbackActivity;

              const Icon = config.icon;
              const leadId = activity.lead?._id;

              const activityContent = (
                <>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 top-0 w-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${config.accentClass}`}
                  />

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.iconClass}`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-semibold tracking-[-0.01em] text-foreground">
                        {activity.title}
                      </p>

                      {activity.lead?.name && (
                        <>
                          <span className="text-border">•</span>

                          <span className="truncate text-sm font-medium text-muted">
                            {activity.lead.name}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-body">
                      {activity.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted">
                      {activity.actor?.name && (
                        <>
                          <span>
                            by{" "}
                            <span className="text-body">
                              {activity.actor.name}
                            </span>
                          </span>

                          <span className="text-border">•</span>
                        </>
                      )}

                      <span title={formatActivityDate(activity.createdAt)}>
                        {formatActivityTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center pt-1">
                    <ArrowRight className="h-4 w-4 text-border transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </>
              );

              if (!leadId) {
                return (
                  <div
                    key={activity._id}
                    className="relative flex items-start gap-4 px-6 py-5 sm:px-7 sm:py-6"
                  >
                    {activityContent}
                  </div>
                );
              }

              return (
                <Link
                  key={activity._id}
                  href={`/dashboard/leads/${leadId}`}
                  className="group relative flex items-start gap-4 px-6 py-5 transition-colors duration-200 hover:bg-background sm:px-7 sm:py-6"
                >
                  {activityContent}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <div className="absolute inset-0 rounded-2xl bg-primary/5" />

              <CircleDot className="relative h-5 w-5" strokeWidth={2} />
            </div>

            <h3 className="mt-5 text-base font-semibold tracking-[-0.01em] text-foreground">
              Your activity timeline is quiet.
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              Lead changes, assignments, and follow-up activity will appear here
              automatically as your team works.
            </p>

            <Link
              href="/dashboard/leads"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Go to leads
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        <div className="border-t border-border px-6 py-4 sm:hidden">
          <Link
            href="/dashboard/activity"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-primary"
          >
            View full activity
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
