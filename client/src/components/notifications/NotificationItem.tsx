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

import { useNotifications } from "@/components/notifications/NotificationProvider";

type NotificationType =
  | "hot-lead"
  | "overdue"
  | "meeting"
  | "assigned"
  | "completed"
  | "system";

type NotificationItemProps = {
  notificationId?: string;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  unread?: boolean;
  actionLabel?: string;
  actionHref?: string;
};

type NotificationTypeStyle = {
  icon: typeof Bell;
  iconWrapper: string;
  badge: string;
  label: string;
};

const typeStyles: Record<NotificationType, NotificationTypeStyle> = {
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
  notificationId,
  title,
  description,
  time,
  type,
  unread = false,
  actionLabel,
  actionHref,
}: NotificationItemProps) {
  const { markAsRead } = useNotifications();

  const styles = typeStyles[type];

  const Icon = styles.icon;

  const handleActionClick = () => {
    if (!unread || !notificationId) {
      return;
    }

    void markAsRead(notificationId).catch((error) => {
      console.error("Failed to mark notification as read:", error);
    });
  };

  return (
    <article
      className={`group relative px-5 py-6 transition-colors duration-200 sm:px-6 ${
        unread
          ? "bg-primary-soft/15 hover:bg-primary-soft/25"
          : "bg-surface hover:bg-background"
      }`}
      aria-label={`${styles.label} notification: ${title}`}
    >
      {unread && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] bg-primary"
        />
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.iconWrapper} transition-transform duration-200 group-hover:scale-[1.03]`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm leading-5 ${
                    unread
                      ? "font-bold text-foreground"
                      : "font-semibold text-foreground"
                  }`}
                >
                  {title}
                </h3>

                {unread && (
                  <span
                    aria-label="Unread"
                    className="h-2 w-2 shrink-0 rounded-full bg-primary"
                  />
                )}
              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                {description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />

              <time>{time}</time>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badge}`}
              >
                {styles.label}
              </span>

              {unread && (
                <span className="text-[11px] font-medium text-primary">
                  Unread
                </span>
              )}
            </div>

            {actionLabel && actionHref && (
              <Link
                href={actionHref}
                onClick={handleActionClick}
                className="group/action inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-xl px-3 text-xs font-semibold text-muted transition-all duration-200 hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 sm:self-auto"
              >
                {actionLabel}

                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
