"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Flame,
  ListChecks,
} from "lucide-react";

import type { FollowUp } from "@/services/followUp.service";

type FollowUpsOverviewProps = {
  followUps: FollowUp[];
};

type OverviewItem = {
  label: string;
  value: number;
  meta: string;
  description: string;
  icon: typeof ListChecks;
  tone: "primary" | "danger" | "warning" | "neutral";
  progress: number;
};

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary",
    accent: "bg-primary",
    value: "text-primary",
    ring: "border-primary/20",
  },

  danger: {
    icon: "bg-red-50 text-red-600",
    accent: "bg-red-500",
    value: "text-red-600",
    ring: "border-red-200/70",
  },

  warning: {
    icon: "bg-orange-50 text-orange-600",
    accent: "bg-orange-500",
    value: "text-orange-600",
    ring: "border-orange-200/70",
  },

  neutral: {
    icon: "bg-background text-muted",
    accent: "bg-foreground",
    value: "text-foreground",
    ring: "border-border",
  },
};

const isSameDay = (firstDate: Date, secondDate: Date) => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const isWithinNextDays = (date: Date, days: number) => {
  const now = new Date();

  const endDate = new Date(now);

  endDate.setDate(endDate.getDate() + days);

  endDate.setHours(23, 59, 59, 999);

  return date.getTime() >= now.getTime() && date.getTime() <= endDate.getTime();
};

export default function FollowUpsOverview({
  followUps,
}: FollowUpsOverviewProps) {
  const now = new Date();

  const scheduledFollowUps = followUps.filter(
    (followUp) => followUp.status === "scheduled",
  );

  const completedFollowUps = followUps.filter(
    (followUp) => followUp.status === "completed",
  );

  const dueToday = scheduledFollowUps.filter((followUp) =>
    isSameDay(new Date(followUp.scheduledAt), now),
  );

  const overdue = scheduledFollowUps.filter(
    (followUp) => new Date(followUp.scheduledAt).getTime() < now.getTime(),
  );

  const highPriority = scheduledFollowUps.filter(
    (followUp) => followUp.lead.temperature === "hot",
  );

  const upcoming = scheduledFollowUps.filter((followUp) =>
    isWithinNextDays(new Date(followUp.scheduledAt), 3),
  );

  const todayCompleted = completedFollowUps.filter(
    (followUp) =>
      followUp.completedAt && isSameDay(new Date(followUp.completedAt), now),
  );

  const todayTotal = dueToday.length + todayCompleted.length;

  const todayProgress =
    todayTotal > 0 ? Math.round((todayCompleted.length / todayTotal) * 100) : 0;

  const overdueProgress = overdue.length > 0 ? 100 : 0;

  const highPriorityProgress =
    scheduledFollowUps.length > 0
      ? Math.min(
          100,
          Math.round((highPriority.length / scheduledFollowUps.length) * 100),
        )
      : 0;

  const upcomingProgress =
    scheduledFollowUps.length > 0
      ? Math.min(
          100,
          Math.round((upcoming.length / scheduledFollowUps.length) * 100),
        )
      : 0;

  const overviewItems: OverviewItem[] = [
    {
      label: "Due today",
      value: dueToday.length,
      meta:
        todayCompleted.length === 1
          ? "1 completed"
          : `${todayCompleted.length} completed`,
      description:
        dueToday.length > 0
          ? "Actions waiting today"
          : "No actions waiting today",
      icon: ListChecks,
      tone: "primary",
      progress: todayProgress,
    },

    {
      label: "Overdue",
      value: overdue.length,
      meta: overdue.length > 0 ? "Needs attention" : "All caught up",
      description:
        overdue.length > 0
          ? "Conversations waiting too long"
          : "No overdue conversations",
      icon: AlertCircle,
      tone: "danger",
      progress: overdueProgress,
    },

    {
      label: "High priority",
      value: highPriority.length,
      meta: highPriority.length === 1 ? "Hot lead" : "Hot leads",
      description:
        highPriority.length > 0
          ? "Worth contacting first"
          : "No hot follow-ups scheduled",
      icon: Flame,
      tone: "warning",
      progress: highPriorityProgress,
    },

    {
      label: "Upcoming",
      value: upcoming.length,
      meta: "Next 3 days",
      description:
        upcoming.length > 0
          ? "Scheduled conversations"
          : "No upcoming conversations",
      icon: CalendarClock,
      tone: "neutral",
      progress: upcomingProgress,
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewItems.map((item) => {
          const Icon = item.icon;

          const styles = toneStyles[item.tone];

          return (
            <div
              key={item.label}
              className={`group relative overflow-hidden rounded-3xl border bg-surface p-5 shadow-sm transition-shadow duration-300 hover:shadow-md ${styles.ring}`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${styles.accent} opacity-80`}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted transition-colors duration-300 group-hover:bg-primary-soft group-hover:text-primary">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-semibold tracking-tight ${styles.value}`}
                      >
                        {item.value}
                      </span>

                      <span className="text-xs font-medium text-muted">
                        {item.meta}
                      </span>
                    </div>
                  </div>

                  {item.tone === "primary" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <p className="mt-2 text-sm leading-5 text-muted">
                  {item.description}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[11px] font-medium text-muted">
                  <span>
                    {item.tone === "danger"
                      ? "Attention required"
                      : item.tone === "primary"
                        ? "Today's progress"
                        : item.tone === "warning"
                          ? "Priority queue"
                          : "Schedule coverage"}
                  </span>

                  <span>{item.progress}%</span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className={`h-full rounded-full ${styles.accent} transition-all duration-500`}
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
