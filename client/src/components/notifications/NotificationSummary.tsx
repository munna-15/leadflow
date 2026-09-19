"use client";

import {
  AlertCircle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Flame,
} from "lucide-react";

import { useNotifications } from "@/components/notifications/NotificationProvider";

type NotificationSummaryTone = "primary" | "danger" | "warning" | "neutral";

type NotificationSummaryItem = {
  label: string;
  value: number;
  description: string;
  icon: typeof Bell;
  tone: NotificationSummaryTone;
};

const toneStyles: Record<
  NotificationSummaryTone,
  {
    icon: string;
    value: string;
    accent: string;
  }
> = {
  primary: {
    icon: "bg-primary-soft text-primary",
    value: "text-primary",
    accent: "bg-primary",
  },
  danger: {
    icon: "bg-red-50 text-red-600",
    value: "text-red-600",
    accent: "bg-red-500",
  },
  warning: {
    icon: "bg-orange-50 text-orange-600",
    value: "text-orange-600",
    accent: "bg-orange-500",
  },
  neutral: {
    icon: "bg-background text-muted",
    value: "text-foreground",
    accent: "bg-foreground",
  },
};

export default function NotificationSummary() {
  const { notifications, unreadCount, loading } = useNotifications();

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  );

  const needsAttention = unreadNotifications.filter(
    (notification) =>
      notification.type === "overdue" || notification.type === "hot-lead",
  ).length;

  const hotLeadAlerts = unreadNotifications.filter(
    (notification) => notification.type === "hot-lead",
  ).length;

  const upcoming = unreadNotifications.filter(
    (notification) => notification.type === "meeting",
  ).length;

  const summaryItems: NotificationSummaryItem[] = [
    {
      label: "Unread",
      value: unreadCount,
      description:
        unreadCount === 1 ? "Notification waiting" : "Notifications waiting",
      icon: Bell,
      tone: "primary",
    },
    {
      label: "Needs attention",
      value: needsAttention,
      description:
        needsAttention === 1 ? "Action required" : "Actions required",
      icon: AlertCircle,
      tone: "danger",
    },
    {
      label: "Hot lead alerts",
      value: hotLeadAlerts,
      description:
        hotLeadAlerts === 1
          ? "High-intent opportunity"
          : "High-intent opportunities",
      icon: Flame,
      tone: "warning",
    },
    {
      label: "Upcoming",
      value: upcoming,
      description: upcoming === 1 ? "Meeting alert" : "Meeting alerts",
      icon: CalendarClock,
      tone: "neutral",
    },
  ];

  return (
    <section className="mt-8" aria-label="Notification summary">
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="grid divide-y divide-border/70 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-y-0">
          {summaryItems.map((item, index) => {
            const Icon = item.icon;
            const styles = toneStyles[item.tone];
            const isLast = index === summaryItems.length - 1;

            return (
              <div
                key={item.label}
                className={`group relative p-6 transition-colors duration-200 hover:bg-background/70 sm:p-7 ${
                  !isLast ? "lg:border-r lg:border-border/70" : ""
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] ${styles.accent} opacity-60`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.icon} transition-transform duration-200 group-hover:scale-105`}
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-pulse rounded bg-current opacity-20" />
                    ) : (
                      <Icon className="h-[18px] w-[18px]" />
                    )}
                  </div>

                  {item.tone === "danger" && item.value > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Action needed
                    </span>
                  )}

                  {item.tone === "warning" && item.value > 0 && (
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                      Priority
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium text-muted">{item.label}</p>

                  <div className="mt-1">
                    {loading ? (
                      <div className="h-9 w-14 animate-pulse rounded-lg bg-background" />
                    ) : (
                      <span
                        className={`text-[34px] font-bold leading-none tracking-[-0.03em] ${styles.value}`}
                      >
                        {item.value}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {!loading && item.tone === "primary" && (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}

                    <p className="text-xs font-medium leading-5 text-muted">
                      {loading
                        ? "Loading notification data..."
                        : item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
