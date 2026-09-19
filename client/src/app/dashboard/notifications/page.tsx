"use client";

import NotificationList from "@/components/notifications/NotificationList";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import NotificationSummary from "@/components/notifications/NotificationSummary";
import { useNotifications } from "@/components/notifications/NotificationProvider";

function NotificationsPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-border/70" />
            <div className="h-4 w-32 rounded-full bg-border/70" />
          </div>

          <div className="mt-4 h-12 w-64 max-w-full rounded-xl bg-border/70 sm:h-14 sm:w-80" />

          <div className="mt-4 h-5 w-full max-w-xl rounded-lg bg-border/70" />
          <div className="mt-2 h-5 w-4/5 max-w-lg rounded-lg bg-border/70" />
        </div>

        <div className="h-11 w-36 animate-pulse rounded-xl bg-border/70" />
      </section>

      <section className="mt-8">
        <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface">
          <div className="grid divide-y divide-border/70 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-y-0">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index} className="animate-pulse p-6 sm:p-7">
                <div className="h-11 w-11 rounded-xl bg-border/60" />

                <div className="mt-6 h-4 w-24 rounded bg-border/60" />

                <div className="mt-2 h-9 w-14 rounded-lg bg-border/60" />

                <div className="mt-3 h-3 w-32 rounded bg-border/60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface">
          <div className="border-b border-border/70 px-5 py-6 sm:px-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-border/60" />
                <div className="h-4 w-36 rounded bg-border/60" />
              </div>

              <div className="mt-4 h-6 w-44 rounded bg-border/60" />
              <div className="mt-2 h-4 w-full max-w-md rounded bg-border/60" />
            </div>
          </div>

          <div className="divide-y divide-border/70">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div key={index} className="animate-pulse px-5 py-6 sm:px-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-2xl bg-border/60" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-56 max-w-full rounded bg-border/60" />

                        <div className="mt-3 h-3 w-full max-w-2xl rounded bg-border/60" />

                        <div className="mt-2 h-3 w-3/4 max-w-xl rounded bg-border/60" />
                      </div>

                      <div className="h-3 w-16 shrink-0 rounded bg-border/60" />
                    </div>

                    <div className="mt-5 h-7 w-20 rounded-full bg-border/60" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function NotificationsPage() {
  const { loading } = useNotifications();

  if (loading) {
    return <NotificationsPageSkeleton />;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-8">
      <NotificationsHeader />
      <NotificationSummary />
      <NotificationList />
    </main>
  );
}
