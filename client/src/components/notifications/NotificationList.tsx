"use client";

import { ArrowRight, Bell, CheckCheck } from "lucide-react";

import NotificationItem from "./NotificationItem";

const todayNotifications = [
  {
    title: "Rahim Ahmed is a high-intent lead",
    description:
      "Rahim has a lead score of 92 with an active buying timeline. A follow-up is overdue and should be handled first.",
    time: "12 min ago",
    type: "hot-lead" as const,
    unread: true,
    actionLabel: "View lead",
    actionHref: "/dashboard/leads/1",
  },
  {
    title: "Follow-up is overdue for Karim Hasan",
    description:
      "Karim has not responded for 2 days. Reconnect now to keep the opportunity active.",
    time: "34 min ago",
    type: "overdue" as const,
    unread: true,
    actionLabel: "View follow-up",
    actionHref: "/dashboard/follow-ups",
  },
  {
    title: "Nadia Rahman has a meeting tomorrow",
    description:
      "The property viewing is scheduled for tomorrow. Confirmation is still pending.",
    time: "1 hr ago",
    type: "meeting" as const,
    unread: true,
    actionLabel: "View lead",
    actionHref: "/dashboard/leads/nadia-rahman",
  },
  {
    title: "New lead assigned to you",
    description:
      "Tanvir Hossain has been assigned to your sales queue and is waiting for initial qualification.",
    time: "2 hrs ago",
    type: "assigned" as const,
    unread: true,
    actionLabel: "View lead",
    actionHref: "/dashboard/leads/tanvir-hossain",
  },
  {
    title: "Follow-up completed",
    description:
      "The follow-up with Rahim Ahmed was marked as completed and the activity was added to the lead timeline.",
    time: "3 hrs ago",
    type: "completed" as const,
    unread: false,
    actionLabel: "View activity",
    actionHref: "/dashboard/follow-ups",
  },
];

const earlierNotifications = [
  {
    title: "Farhan Ahmed moved to Meeting",
    description:
      "Farhan's opportunity progressed from Contacted to Meeting after the latest sales interaction.",
    time: "Yesterday",
    type: "system" as const,
    unread: false,
    actionLabel: "View pipeline",
    actionHref: "/dashboard/pipeline",
  },
  {
    title: "AI qualification completed",
    description:
      "LeadFlow completed qualification for a newly captured lead and generated a lead score and intent summary.",
    time: "Yesterday",
    type: "system" as const,
    unread: false,
    actionLabel: "Review leads",
    actionHref: "/dashboard/leads",
  },
  {
    title: "Maya Islam follow-up scheduled",
    description:
      "A follow-up was scheduled for Sep 18 at 2:00 PM and added to the upcoming queue.",
    time: "Sep 13",
    type: "meeting" as const,
    unread: false,
    actionLabel: "View follow-ups",
    actionHref: "/dashboard/follow-ups",
  },
];

export default function NotificationList() {
  return (
    <section className="mt-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />

                <p className="text-sm font-semibold text-primary">
                  Notification stream
                </p>
              </div>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                Recent activity
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-muted">
                Important events across your leads and sales workflow.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-xl px-3 text-xs font-semibold text-muted transition-colors hover:bg-background hover:text-primary sm:self-auto"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Clear unread
            </button>
          </div>

          <div>
            <div className="border-b border-border bg-background/50 px-5 py-3 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Today
              </p>
            </div>

            <div className="divide-y divide-border">
              {todayNotifications.map((notification) => (
                <NotificationItem
                  key={`${notification.title}-${notification.time}`}
                  {...notification}
                />
              ))}
            </div>

            <div className="border-y border-border bg-background/50 px-5 py-3 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Earlier
              </p>
            </div>

            <div className="divide-y divide-border">
              {earlierNotifications.map((notification) => (
                <NotificationItem
                  key={`${notification.title}-${notification.time}`}
                  {...notification}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-border px-5 py-4 sm:px-6">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              View notification history
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-foreground p-6 text-white shadow-sm sm:p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
            <Bell className="h-5 w-5" />
          </div>

          <p className="mt-7 text-sm font-semibold text-sky-300">
            Attention first
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Your notifications should lead to action.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            LeadFlow surfaces important events with enough context to help you
            decide what to do next instead of sending disconnected alerts.
          </p>

          <div className="mt-7 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Unread
              </p>

              <p className="mt-1 text-2xl font-semibold">7</p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Notifications waiting for review
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Immediate
              </p>

              <p className="mt-1 text-2xl font-semibold text-orange-300">3</p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Events that may require action now
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
