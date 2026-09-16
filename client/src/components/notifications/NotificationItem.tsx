"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flame,
  UserRound,
} from "lucide-react";

type NotificationItemProps = {
  title: string;
  description: string;
  time: string;
  type:
    | "hot-lead"
    | "overdue"
    | "meeting"
    | "assigned"
    | "completed"
    | "system";
  unread?: boolean;
  actionLabel?: string;
  actionHref?: string;
};

const typeStyles = {
  "hot-lead": {
    icon: Flame,
    iconWrapper: "bg-orange-50 text-orange-600",
    badge: "bg-orange-50 text-orange-700",
    label: "Hot lead",
  },
  overdue: {
    icon: AlertCircle,
    iconWrapper: "bg-red-50 text-red-600",
    badge: "bg-red-50 text-red-700",
    label: "Overdue",
  },
  meeting: {
    icon: CalendarClock,
    iconWrapper: "bg-primary-soft text-primary",
    badge: "bg-primary-soft text-primary",
    label: "Meeting",
  },
  assigned: {
    icon: UserRound,
    iconWrapper: "bg-background text-muted",
    badge: "bg-background text-body",
    label: "Assignment",
  },
  completed: {
    icon: CheckCircle2,
    iconWrapper: "bg-green-50 text-green-600",
    badge: "bg-green-50 text-green-700",
    label: "Completed",
  },
  system: {
    icon: Bell,
    iconWrapper: "bg-background text-muted",
    badge: "bg-background text-body",
    label: "System",
  },
};

export default function NotificationItem({
  title,
  description,
  time,
  type,
  unread = false,
  actionLabel,
  actionHref,
}: NotificationItemProps) {
  const styles = typeStyles[type];
  const Icon = styles.icon;

  return (
    <article
      className={`group relative overflow-hidden px-5 py-5 transition-colors sm:px-6 ${
        unread ? "bg-primary-soft/20" : "bg-surface hover:bg-background"
      }`}
    >
      {unread && <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.iconWrapper}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>

                {unread && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
                {description}
              </p>
            </div>

            <span className="shrink-0 text-xs font-medium text-muted">
              {time}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badge}`}
              >
                {styles.label}
              </span>

              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                <Clock3 className="h-3.5 w-3.5" />
                {time}
              </div>
            </div>

            {actionLabel && actionHref && (
              <Link
                href={actionHref}
                className="inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-xl px-3 text-xs font-semibold text-muted transition-colors hover:bg-background hover:text-primary sm:self-auto"
              >
                {actionLabel}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
