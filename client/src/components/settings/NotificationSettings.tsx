"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Flame,
  LoaderCircle,
  Mail,
  MessageSquare,
  Sparkles,
  Smartphone,
  Users,
} from "lucide-react";

import {
  getSettings,
  updateSettings,
  type NotificationSettings as NotificationSettingsData,
} from "@/services/settings.service";

type NotificationKey = keyof NotificationSettingsData;

type NotificationChannel = {
  key: NotificationKey;
  label: string;
  description: string;
  icon: typeof BellRing;
};

type NotificationCategory = {
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

const channels: NotificationChannel[] = [
  {
    key: "inApp",
    label: "In-app notifications",
    description:
      "Show important activity inside the LeadFlow notification center.",
    icon: BellRing,
  },
  {
    key: "email",
    label: "Email notifications",
    description:
      "Receive important lead, follow-up, and meeting alerts by email.",
    icon: Mail,
  },
  {
    key: "browser",
    label: "Browser notifications",
    description: "Get real-time alerts while LeadFlow is open in your browser.",
    icon: Smartphone,
  },
  {
    key: "teamActivity",
    label: "Team activity updates",
    description:
      "Receive updates when team members change lead ownership or status.",
    icon: MessageSquare,
  },
];

const initialCategories: NotificationCategory[] = [
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
    description: "Overdue, upcoming, and completed follow-up notifications.",
    icon: BellRing,
    enabled: true,
  },
  {
    id: "meeting-reminders",
    label: "Meeting reminders",
    description: "Upcoming meetings and confirmation reminders.",
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

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsData | null>(
    null,
  );

  const [categories, setCategories] =
    useState<NotificationCategory[]>(initialCategories);

  const [loading, setLoading] = useState(true);

  const [savingKey, setSavingKey] = useState<NotificationKey | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSettings();

        if (!mounted) {
          return;
        }

        setSettings(data.notifications);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setError(getErrorMessage(error));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccess(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success]);

  const handleChannelToggle = async (key: NotificationKey) => {
    if (!settings || savingKey !== null) {
      return;
    }

    const previousValue = settings[key];
    const nextValue = !previousValue;

    setError(null);
    setSuccess(null);

    setSettings((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: nextValue,
      };
    });

    setSavingKey(key);

    try {
      const updatedSettings = await updateSettings({
        notifications: {
          [key]: nextValue,
        },
      });

      setSettings(updatedSettings.notifications);
      setSuccess("Notification preference updated.");
    } catch (error) {
      setSettings((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          [key]: previousValue,
        };
      });

      setError(getErrorMessage(error));
    } finally {
      setSavingKey(null);
    }
  };

  const handleCategoryToggle = (id: NotificationCategory["id"]) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === id
          ? {
              ...category,
              enabled: !category.enabled,
            }
          : category,
      ),
    );
  };

  return (
    <section
      className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
      aria-labelledby="notification-settings-title"
    >
      {/* Header */}
      <div className="border-b border-border/70 px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <BellRing className="h-4 w-4" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Notifications
            </p>

            <h2
              id="notification-settings-title"
              className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Notification preferences
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Choose which events deserve your attention and where LeadFlow
              should deliver them.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="min-h-[68px] border-b border-border/70 px-6 py-3 sm:px-7">
        <div className="flex min-h-[42px] items-center">
          {error ? (
            <div
              role="alert"
              className="w-full rounded-xl border border-danger/15 bg-danger/5 px-4 py-2.5 text-sm leading-5 text-danger"
            >
              {error}
            </div>
          ) : success ? (
            <div
              role="status"
              className="flex w-full items-center gap-2 rounded-xl border border-success/15 bg-success/5 px-4 py-2.5 text-sm font-medium leading-5 text-success"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Notification categories */}
      <div className="border-b border-border/70">
        <div className="px-6 py-6 sm:px-7">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-foreground">
              Notification categories
            </p>

            <p className="mt-1 text-sm leading-5 text-muted">
              Choose the types of activity you want to keep visible in your
              notification center.
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/70">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.id}
                className="flex flex-col gap-4 px-6 py-5 transition-colors duration-200 hover:bg-background/60 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      category.enabled
                        ? "bg-primary-soft text-primary"
                        : "bg-background text-muted"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {category.label}
                      </h3>

                      {category.enabled && (
                        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                      {category.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={category.enabled}
                  aria-label={`Toggle ${category.label}`}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 outline-none transition-colors duration-200 focus:ring-4 focus:ring-primary/10 ${
                    category.enabled ? "bg-primary" : "bg-slate-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${
                      category.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery channels */}
      <div>
        <div className="px-6 py-6 sm:px-7">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-foreground">
              Delivery channels
            </p>

            <p className="mt-1 text-sm leading-5 text-muted">
              Decide where enabled notification events should be delivered.
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/70">
          {loading ? (
            channels.map((channel) => (
              <div
                key={channel.key}
                className="flex min-h-[104px] flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-background" />

                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-40 animate-pulse rounded bg-background" />

                    <div className="mt-2 h-3 w-full max-w-xl animate-pulse rounded bg-background" />

                    <div className="mt-1.5 h-3 w-3/4 max-w-md animate-pulse rounded bg-background" />
                  </div>
                </div>

                <div className="h-7 w-12 shrink-0 animate-pulse rounded-full bg-background" />
              </div>
            ))
          ) : settings ? (
            channels.map((channel) => {
              const Icon = channel.icon;
              const enabled = settings[channel.key];
              const saving = savingKey === channel.key;

              return (
                <div
                  key={channel.key}
                  className="flex min-h-[104px] flex-col gap-5 px-6 py-5 transition-colors duration-200 hover:bg-background/60 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        enabled
                          ? "bg-primary-soft text-primary"
                          : "bg-background text-muted"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
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
                    aria-checked={enabled}
                    aria-label={`${
                      enabled ? "Disable" : "Enable"
                    } ${channel.label}`}
                    disabled={savingKey !== null}
                    onClick={() => handleChannelToggle(channel.key)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 outline-none transition-colors duration-200 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                      enabled ? "bg-primary" : "bg-slate-200"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${
                        enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />

                    {saving && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center sm:px-7">
              <BellRing className="mx-auto h-6 w-6 text-muted" />

              <p className="mt-3 text-sm font-semibold text-foreground">
                Notification settings unavailable
              </p>

              <p className="mt-1 text-sm text-muted">
                We could not load your notification preferences.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/70 bg-background/50 px-6 py-4 sm:px-7">
        <div className="flex items-start gap-2.5">
          <BellRing
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted"
            aria-hidden="true"
          />

          <p className="text-xs leading-5 text-muted">
            Delivery preferences are stored per account and can be changed at
            any time. Category preferences will be persisted when notification
            categories are connected to the backend.
          </p>
        </div>
      </div>
    </section>
  );
}
