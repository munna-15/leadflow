"use client";

import Link from "next/link";

import { ArrowRight, Bell, CheckCheck, RefreshCw } from "lucide-react";

import { useNotifications } from "@/components/notifications/NotificationProvider";
import type { Notification } from "@/services/notification.service";

import NotificationItem from "./NotificationItem";

const getRelativeTime = (createdAt: string) => {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return "Recently";
  }

  const diffInSeconds = Math.max(
    0,
    Math.floor((Date.now() - createdTime) / 1000),
  );

  if (diffInSeconds < 10) {
    return "Just now";
  }

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const date = new Date(createdAt);
  const now = new Date();

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  }).format(date);
};

const isToday = (createdAt: string) => {
  const date = new Date(createdAt);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

function NotificationGroup({
  label,
  notifications,
}: {
  label: string;
  notifications: Notification[];
}) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="border-b border-border/70 bg-background/60 px-5 py-3 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {label}
        </p>
      </div>

      <div className="divide-y divide-border/70">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notificationId={notification._id}
            title={notification.title}
            description={notification.description}
            time={getRelativeTime(notification.createdAt)}
            type={notification.type}
            unread={!notification.isRead}
            actionLabel={notification.action?.label ?? undefined}
            actionHref={notification.action?.href ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}

function NotificationListSkeleton() {
  return (
    <div className="divide-y divide-border/70">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <div key={index} className="animate-pulse px-5 py-6 sm:px-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-background" />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-56 max-w-full rounded bg-background" />

                  <div className="mt-3 h-3 w-full max-w-2xl rounded bg-background" />

                  <div className="mt-2 h-3 w-3/4 max-w-xl rounded bg-background" />
                </div>

                <div className="h-3 w-16 shrink-0 rounded bg-background" />
              </div>

              <div className="mt-5 h-7 w-20 rounded-full bg-background" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NotificationList() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAllAsRead,
  } = useNotifications();

  const todayNotifications = notifications.filter((notification) =>
    isToday(notification.createdAt),
  );

  const earlierNotifications = notifications.filter(
    (notification) => !isToday(notification.createdAt),
  );

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <section className="mt-8">
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 border-b border-border/70 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft">
                <Bell className="h-4 w-4 text-primary" />
              </div>

              <p className="text-sm font-semibold text-primary">
                Notification stream
              </p>
            </div>

            <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground">
              Recent activity
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-muted">
              Important events across your leads and sales workflow.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleMarkAllRead()}
            disabled={unreadCount === 0 || loading}
            className="group inline-flex h-9 items-center justify-center gap-2 self-start rounded-xl px-3 text-xs font-semibold text-muted transition-all duration-200 hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
          >
            <CheckCheck className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />

            {unreadCount > 0 ? "Mark all read" : "All caught up"}
          </button>
        </div>

        {loading ? (
          <NotificationListSkeleton />
        ) : error ? (
          <div className="px-6 py-14 text-center sm:px-7">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <Bell className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              Notifications unavailable
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void refreshNotifications()}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-white transition-colors hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-16 text-center sm:px-7">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-muted">
              <Bell className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No notifications yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              Important lead activity, follow-ups, meetings, and workflow alerts
              will appear here.
            </p>
          </div>
        ) : (
          <div>
            <NotificationGroup
              label="Today"
              notifications={todayNotifications}
            />

            <NotificationGroup
              label="Earlier"
              notifications={earlierNotifications}
            />
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="border-t border-border/70 px-5 py-4 sm:px-6">
            <Link
              href="/dashboard/notifications"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark focus:outline-none"
            >
              View notification history
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
