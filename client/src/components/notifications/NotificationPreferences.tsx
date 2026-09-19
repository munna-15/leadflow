
"use client";

import {
  BellRing,
  CalendarClock,
  Flame,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";

type NotificationPreference = {
  id:
    | "lead-activity"
    | "follow-up-reminders"
    | "meeting-reminders"
    | "high-intent-leads"
    | "ai-activity";
  label: string;
  description: string;
  icon: typeof Users;
  enabled: boolean;
};

const initialPreferences: NotificationPreference[] = [
  {
    id: "lead-activity",
    label: "Lead activity",
    description:
      "New leads, assignments, status changes, and important updates.",
    icon: Users,
    enabled: true,
  },
  {
    id: "follow-up-reminders",
    label: "Follow-up reminders",
    description:
      "Overdue, upcoming, and completed follow-up notifications.",
    icon: BellRing,
    enabled: true,
  },
  {
    id: "meeting-reminders",
    label: "Meeting reminders",
    description:
      "Upcoming meetings and confirmation reminders.",
    icon: CalendarClock,
    enabled: true,
  },
  {
    id: "high-intent-leads",
    label: "High-intent leads",
    description:
      "Alerts when a lead reaches a high-intent or hot-lead threshold.",
    icon: Flame,
    enabled: true,
  },
  {
    id: "ai-activity",
    label: "AI activity",
    description:
      "Qualification results, summaries, scores, and AI-generated signals.",
    icon: Sparkles,
    enabled: false,
  },
];

export default function NotificationPreferences() {
  const [preferences, setPreferences] =
    useState<NotificationPreference[]>(initialPreferences);

  const handleToggle = (
    id: NotificationPreference["id"],
  ) => {
    setPreferences((current) =>
      current.map((preference) =>
        preference.id === id
          ? {
              ...preference,
              enabled: !preference.enabled,
            }
          : preference,
      ),
    );
  };

  return (
    <section
      className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
      aria-labelledby="notification-preferences-title"
    >
      <div className="border-b border-border/70 px-6 py-6 sm:px-7 lg:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft">
              <BellRing
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm font-semibold text-primary">
              Notification preferences
            </p>
          </div>

          <h2
            id="notification-preferences-title"
            className="mt-3 bg-gradient-to-r from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl"
          >
            Choose what deserves your attention
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Control which notification categories appear in your
            notification center. You can adjust delivery channels
            separately below.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border/70">
        {preferences.map((preference) => {
          const Icon = preference.icon;

          return (
            <div
              key={preference.id}
              className="group flex flex-col gap-4 px-6 py-5 transition-colors duration-200 hover:bg-background/70 sm:flex-row sm:items-center sm:justify-between sm:px-7"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    preference.enabled
                      ? "bg-primary-soft text-primary"
                      : "bg-background text-muted"
                  }`}
                >
                  <Icon
                    className="h-[18px] w-[18px]"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {preference.label}
                    </h3>

                    {preference.enabled && (
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                    {preference.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={preference.enabled}
                aria-label={`Toggle ${preference.label}`}
                onClick={() => handleToggle(preference.id)}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 ${
                  preference.enabled
                    ? "bg-primary"
                    : "bg-slate-200"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    preference.enabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border/70 bg-background/60 px-6 py-4 sm:px-7">
        <p className="text-xs leading-5 text-muted">
          These settings control notification categories. Critical
          workflow events may remain visible when required for timely
          action.
        </p>
      </div>
    </section>
  );
}

