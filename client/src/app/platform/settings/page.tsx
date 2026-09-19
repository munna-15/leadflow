"use client";

import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MonitorCog,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getPlatformSettings,
  type PlatformSettings,
} from "@/services/platformSettings.service";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type SettingItem = {
  label: string;
  value: string;
  status?: boolean;
};

type SettingsSection = {
  icon: LucideIcon;
  title: string;
  description: string;
  items: SettingItem[];
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

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

  return "Failed to load platform settings.";
};

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPlatformSettings();

        if (!mounted) {
          return;
        }

        setSettings(data);
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

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-[1480px] items-center justify-center px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
            <LoaderCircle className="h-4 w-4 animate-spin text-sky-600" />
            Loading platform settings...
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* ERROR                                                                    */
  /* ------------------------------------------------------------------------ */

  if (error || !settings) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto w-full max-w-[1480px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <section className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-7 text-sm font-medium text-red-700">
            {error || "Platform settings are unavailable."}
          </section>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* DYNAMIC SETTINGS SECTIONS                                                */
  /* ------------------------------------------------------------------------ */

  const settingsSections: SettingsSection[] = [
    {
      icon: UserRound,
      title: "Platform account",
      description:
        "Manage the identity and account information used to access the private platform.",
      items: [
        {
          label: "Account",
          value: settings.account.name || "Platform administrator",
        },
        {
          label: "Email",
          value: settings.account.email,
        },
        {
          label: "Account type",
          value: settings.account.accountType,
        },
        {
          label: "Access level",
          value: settings.account.accessLevel,
        },
      ],
    },

    {
      icon: Mail,
      title: "Email & invitations",
      description:
        "Review the current invitation delivery configuration used for client onboarding.",
      items: [
        {
          label: "Invitation delivery",
          value: settings.invitations.delivery,
          status: settings.invitations.delivery === "Configured",
        },
        {
          label: "Client invitation flow",
          value: settings.invitations.flow,
          status: settings.invitations.flow === "Enabled",
        },
        {
          label: "Pending invitations",
          value: String(settings.invitations.pending),
        },
        {
          label: "Accepted invitations",
          value: String(settings.invitations.accepted),
        },
      ],
    },

    {
      icon: LockKeyhole,
      title: "Security & access",
      description:
        "Platform access remains separated from every individual client workspace.",
      items: [
        {
          label: "Private platform",
          value: settings.security.privatePlatform
            ? "Protected"
            : "Unprotected",
          status: settings.security.privatePlatform,
        },
        {
          label: "Workspace isolation",
          value: settings.security.workspaceIsolation ? "Enabled" : "Disabled",
          status: settings.security.workspaceIsolation,
        },
        {
          label: "Authentication",
          value: settings.security.authentication,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.045)]">
          <div className="pointer-events-none absolute right-[-8%] top-[-55%] h-[520px] w-[520px] rounded-full bg-sky-100/70 blur-[110px]" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-sky-700">
              <MonitorCog className="h-3.5 w-3.5" />
              Platform configuration
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#0F172A] sm:text-5xl">
              Platform settings
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">
              Keep platform-level access, onboarding configuration and security
              information in one controlled surface.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#EEF2F7] pt-5">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#64748B]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Platform operational
              </div>

              <div className="text-xs text-[#94A3B8]">
                Environment:
                <span className="ml-1.5 font-semibold text-[#475569]">
                  {settings.preferences.environment}
                </span>
              </div>

              <div className="text-xs text-[#94A3B8]">
                {settings.account.email}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CONFIGURATION CARDS                                               */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-5 grid gap-5 xl:grid-cols-3">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.035)]"
              >
                <div className="border-b border-[#EEF2F7] px-6 py-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-base font-semibold tracking-[-0.025em] text-[#111827]">
                        {section.title}
                      </h2>

                      <p className="mt-1.5 text-xs leading-5 text-[#94A3B8]">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[#F1F5F9]">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <span className="text-xs font-medium text-[#64748B]">
                        {item.label}
                      </span>

                      <span className="inline-flex max-w-[62%] items-center gap-1.5 text-right text-xs font-semibold text-[#374151]">
                        {item.status && (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        )}

                        <span className="break-words">{item.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* PLATFORM PREFERENCES                                             */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.035)]">
          <div className="border-b border-[#EEF2F7] px-6 py-6 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Globe2 className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Preferences
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#111827]">
                  Platform preferences
                </h2>
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-[#F1F5F9] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <PreferenceRow
              icon={Globe2}
              label="Platform environment"
              value={settings.preferences.environment}
            />

            <PreferenceRow
              icon={Bell}
              label="Operational notifications"
              value={settings.preferences.operationalNotifications}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* SECURITY NOTICE                                                   */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-5 overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-emerald-50/55">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-[#374151]">
                Platform access is isolated
              </p>

              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                Client users access their own workspace separately and do not
                receive access to this platform console.
              </p>
            </div>

            <Link
              href="/platform/clients"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
            >
              Manage clients
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-5 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
          <span>LeadFlow / Platform Settings</span>

          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Platform configuration operational
          </span>
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PREFERENCE ROW                                                             */
/* -------------------------------------------------------------------------- */

function PreferenceRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 sm:px-7">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#64748B]">{label}</p>

        <p className="mt-1 text-sm font-semibold text-[#111827]">{value}</p>
      </div>
    </div>
  );
}
