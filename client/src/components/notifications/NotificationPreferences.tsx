"use client";

import { BellRing, CalendarClock, Flame, Sparkles, Users } from "lucide-react";

const preferences = [
  {
    label: "Lead activity",
    description:
      "New leads, assignments, status changes, and important updates.",
    icon: Users,
    enabled: true,
  },
  {
    label: "Follow-up reminders",
    description: "Overdue, upcoming, and completed follow-up notifications.",
    icon: BellRing,
    enabled: true,
  },
  {
    label: "Meeting reminders",
    description: "Upcoming meetings and confirmation reminders.",
    icon: CalendarClock,
    enabled: true,
  },
  {
    label: "High-intent leads",
    description:
      "Alerts when a lead reaches a high-intent or hot-lead threshold.",
    icon: Flame,
    enabled: true,
  },
  {
    label: "AI activity",
    description:
      "Qualification results, summaries, scores, and AI-generated signals.",
    icon: Sparkles,
    enabled: false,
  },
];

export default function NotificationPreferences() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            Notification preferences
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Choose what deserves your attention
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Control which events appear in your notification center. Critical
            workflow events can remain visible even when optional alerts are
            turned off.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {preferences.map((preference) => {
          const Icon = preference.icon;

          return (
            <div
              key={preference.label}
              className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between sm:px-7"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {preference.label}
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                    {preference.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={preference.enabled}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
                  preference.enabled ? "bg-primary" : "bg-slate-200"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    preference.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border bg-background/60 px-6 py-4 sm:px-7">
        <p className="text-xs leading-5 text-muted">
          Notification preferences will be persisted to your account when the
          backend settings endpoint is connected.
        </p>
      </div>
    </section>
  );
}
