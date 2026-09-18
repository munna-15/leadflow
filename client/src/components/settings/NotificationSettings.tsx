"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MessageSquare,
  Smartphone,
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

  const handleToggle = async (key: NotificationKey) => {
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

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-border/70 px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <BellRing className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Notifications
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Notification delivery
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Decide where LeadFlow should deliver important workspace and sales
              activity notifications.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STABLE FEEDBACK AREA                                               */}
      {/* ------------------------------------------------------------------ */}

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

      {/* ------------------------------------------------------------------ */}
      {/* CHANNELS                                                           */}
      {/* ------------------------------------------------------------------ */}

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
                {/* -------------------------------------------------------- */}
                {/* CHANNEL INFO                                              */}
                {/* -------------------------------------------------------- */}

                <div className="flex min-w-0 items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      enabled
                        ? "bg-primary-soft text-primary"
                        : "bg-background text-muted"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
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

                {/* -------------------------------------------------------- */}
                {/* TOGGLE                                                     */}
                {/* -------------------------------------------------------- */}

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`${enabled ? "Disable" : "Enable"} ${
                    channel.label
                  }`}
                  disabled={savingKey !== null}
                  onClick={() => handleToggle(channel.key)}
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

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-t border-border/70 bg-background/50 px-6 py-4 sm:px-7">
        <div className="flex items-start gap-2.5">
          <BellRing className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />

          <p className="text-xs leading-5 text-muted">
            Delivery preferences are stored per account and can be changed at
            any time.
          </p>
        </div>
      </div>
    </section>
  );
}
