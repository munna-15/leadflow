"use client";

import { BellRing, Mail, MessageSquare, Smartphone } from "lucide-react";

const channels = [
  {
    label: "In-app notifications",
    description:
      "Show important activity inside the LeadFlow notification center.",
    icon: BellRing,
    enabled: true,
  },
  {
    label: "Email notifications",
    description:
      "Receive important lead, follow-up, and meeting alerts by email.",
    icon: Mail,
    enabled: true,
  },
  {
    label: "Browser notifications",
    description: "Get real-time alerts while LeadFlow is open in your browser.",
    icon: Smartphone,
    enabled: false,
  },
  {
    label: "Team activity updates",
    description:
      "Receive updates when team members change lead ownership or status.",
    icon: MessageSquare,
    enabled: true,
  },
];

export default function NotificationSettings() {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7">
        <div>
          <p className="text-sm font-semibold text-primary">Delivery</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Notification delivery
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Decide where LeadFlow should deliver important workspace and sales
            activity notifications.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {channels.map((channel) => {
          const Icon = channel.icon;

          return (
            <div
              key={channel.label}
              className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between sm:px-7"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {channel.label}
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                    {channel.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={channel.enabled}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
                  channel.enabled ? "bg-primary" : "bg-slate-200"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    channel.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border bg-background/60 px-6 py-4 sm:px-7">
        <p className="text-xs leading-5 text-muted">
          Delivery preferences are stored per account and can be changed at any
          time.
        </p>
      </div>
    </section>
  );
}
