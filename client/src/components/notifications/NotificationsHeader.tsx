"use client";

import { useState } from "react";

import { Bell, CheckCheck, LoaderCircle } from "lucide-react";

import { useNotifications } from "@/components/notifications/NotificationProvider";

export default function NotificationsHeader() {
  const { unreadCount, markAllAsRead } = useNotifications();

  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || isMarkingAllRead) {
      return;
    }

    try {
      setActionError(null);
      setIsMarkingAllRead(true);

      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);

      setActionError("Unable to mark notifications as read. Please try again.");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft">
            <Bell className="h-4 w-4 text-primary" />
          </div>

          <p className="text-sm font-semibold tracking-wide text-primary">
            Activity center
          </p>
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
          <span className="bg-gradient-to-r from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
            Notifications
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-base leading-7 text-muted">
          Stay informed about important lead activity, follow-ups, meetings, and
          sales workflow changes.
        </p>

        {actionError && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {actionError}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleMarkAllRead}
        disabled={unreadCount === 0 || isMarkingAllRead}
        className="group inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
      >
        {isMarkingAllRead ? (
          <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <CheckCheck className="h-4 w-4 text-muted transition-colors group-hover:text-primary" />
        )}

        {isMarkingAllRead
          ? "Marking..."
          : unreadCount > 0
            ? `Mark all read (${unreadCount})`
            : "All caught up"}
      </button>
    </header>
  );
}
