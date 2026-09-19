"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";

import {
  getClientWorkspaces,
  type ClientWorkspace,
} from "@/services/clientOnboarding.service";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatRelativeDate = (value: string | null | undefined) => {
  if (!value) {
    return "No recent activity";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No recent activity";
  }

  const diff = Date.now() - date.getTime();

  if (diff < 60_000) {
    return "Just now";
  }

  if (diff < 3_600_000) {
    const minutes = Math.floor(diff / 60_000);

    return `${minutes}m ago`;
  }

  if (diff < 86_400_000) {
    const hours = Math.floor(diff / 3_600_000);

    return `${hours}h ago`;
  }

  if (diff < 604_800_000) {
    const days = Math.floor(diff / 86_400_000);

    return `${days}d ago`;
  }

  return formatDate(value);
};

/* -------------------------------------------------------------------------- */
/* ACTIVITY                                                                   */
/* -------------------------------------------------------------------------- */

type ActivityItem = {
  id: string;
  type: "created" | "invited" | "activated";
  title: string;
  description: string;
  date: string | null;
};

const getActivityItems = (clients: ClientWorkspace[]): ActivityItem[] => {
  return clients
    .flatMap((client) => {
      const activities: ActivityItem[] = [];

      if (client.invitation?.createdAt) {
        activities.push({
          id: `${client.id}-created`,
          type: "created",
          title: client.name,
          description: "Client workspace created",
          date: client.invitation.createdAt,
        });
      }

      if (client.invitation?.status === "accepted" && client.owner?.isActive) {
        activities.push({
          id: `${client.id}-activated`,
          type: "activated",
          title: client.name,
          description: "Client workspace activated",
          date: client.invitation.acceptedAt || client.invitation.createdAt,
        });
      } else if (client.invitation?.status === "pending") {
        activities.push({
          id: `${client.id}-invited`,
          type: "invited",
          title: client.name,
          description: "Invitation awaiting activation",
          date: client.invitation.createdAt,
        });
      }

      return activities;
    })
    .sort(
      (a, b) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
    )
    .slice(0, 6);
};

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function PlatformOverviewPage() {
  const [clients, setClients] = useState<ClientWorkspace[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await getClientWorkspaces();

      setClients(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load platform overview.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  /* ------------------------------------------------------------------------ */
  /* CURRENT PLATFORM STATE                                                   */
  /* ------------------------------------------------------------------------ */

  const lifecycle = useMemo(() => {
    const totalWorkspaces = clients.length;

    const activeWorkspaces = clients.filter(
      (client) => client.owner?.isActive,
    ).length;

    const pendingInvitations = clients.filter(
      (client) =>
        !client.owner?.isActive &&
        client.invitation?.status === "pending" &&
        new Date(client.invitation.expiresAt).getTime() > Date.now(),
    ).length;

    const reviewRequired = clients.filter(
      (client) =>
        !client.owner?.isActive &&
        client.invitation?.status === "pending" &&
        new Date(client.invitation.expiresAt).getTime() <= Date.now(),
    ).length;

    const activationRate =
      totalWorkspaces > 0
        ? Math.round((activeWorkspaces / totalWorkspaces) * 100)
        : 0;

    return {
      totalWorkspaces,
      activeWorkspaces,
      pendingInvitations,
      reviewRequired,
      activationRate,
    };
  }, [clients]);

  /* ------------------------------------------------------------------------ */
  /* ACTIVITY                                                                  */
  /* ------------------------------------------------------------------------ */

  const recentActivity = useMemo(() => getActivityItems(clients), [clients]);

  const latestActivity = recentActivity[0] ?? null;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        {/* ---------------------------------------------------------------- */}
        {/* OVERVIEW BODY                                                     */}
        {/* ---------------------------------------------------------------- */}

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          {/* -------------------------------------------------------------- */}
          {/* WORKSPACE LIFECYCLE                                            */}
          {/* -------------------------------------------------------------- */}

          <motion.section
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden rounded-[1.9rem] border border-[#E5E7EB] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.035)]"
          >
            <div className="border-b border-[#EEF2F7] px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gradient-to-r from-sky-500 to-transparent" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                      Lifecycle intelligence
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#111827] sm:text-2xl">
                    Workspace lifecycle
                  </h2>

                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#64748B]">
                    A current-state view of every client workspace from
                    onboarding through activation.
                  </p>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 sm:flex">
                  <UsersRound className="h-4 w-4" strokeWidth={1.8} />
                </div>
              </div>
            </div>

            {isLoading ? (
              <LifecycleSkeleton />
            ) : (
              <>
                <div className="px-6 py-7 sm:px-8 sm:py-8">
                  <div className="flex flex-col gap-8 md:flex-row md:items-center">
                    {/* Activation ring */}
                    <div className="flex shrink-0 justify-center md:justify-start">
                      <div
                        className="relative flex h-40 w-40 items-center justify-center rounded-full"
                        style={{
                          background: `conic-gradient(#0EA5E9 ${lifecycle.activationRate}%, #E7ECF2 ${lifecycle.activationRate}% 100%)`,
                        }}
                      >
                        <div className="flex h-[134px] w-[134px] flex-col items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
                          <span className="text-[38px] font-semibold leading-none tracking-[-0.065em] text-[#0F172A]">
                            {lifecycle.activationRate}%
                          </span>

                          <span className="mt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                            activation
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total workspace signal */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-semibold leading-none tracking-[-0.065em] text-[#0F172A]">
                          {lifecycle.totalWorkspaces}
                        </span>

                        <span className="pb-1 text-xs font-medium text-[#94A3B8]">
                          total workspaces
                        </span>
                      </div>

                      <p className="mt-3 max-w-md text-sm leading-6 text-[#64748B]">
                        {lifecycle.totalWorkspaces === 0
                          ? "Your first client workspace will appear here once onboarding begins."
                          : `${lifecycle.activeWorkspaces} workspace${lifecycle.activeWorkspaces === 1 ? "" : "s"} currently have active client access.`}
                      </p>

                      <div className="mt-6 h-px bg-[#EEF2F7]" />

                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <LifecycleSignal
                          icon={CheckCircle2}
                          label="Active"
                          value={lifecycle.activeWorkspaces}
                          iconClass="text-emerald-600"
                          isLoading={false}
                        />

                        <LifecycleSignal
                          icon={Clock3}
                          label="Pending"
                          value={lifecycle.pendingInvitations}
                          iconClass="text-sky-600"
                          isLoading={false}
                        />

                        <LifecycleSignal
                          icon={Mail}
                          label="Review"
                          value={lifecycle.reviewRequired}
                          iconClass="text-amber-600"
                          isLoading={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lifecycle distribution */}
                  <div className="mt-9 space-y-5 border-t border-[#EEF2F7] pt-7">
                    <LifecycleBar
                      label="Active access"
                      value={lifecycle.activeWorkspaces}
                      total={lifecycle.totalWorkspaces}
                      colorClass="bg-emerald-500"
                    />

                    <LifecycleBar
                      label="Awaiting activation"
                      value={lifecycle.pendingInvitations}
                      total={lifecycle.totalWorkspaces}
                      colorClass="bg-sky-500"
                    />

                    <LifecycleBar
                      label="Needs review"
                      value={lifecycle.reviewRequired}
                      total={lifecycle.totalWorkspaces}
                      colorClass="bg-amber-500"
                    />
                  </div>
                </div>

                <div className="border-t border-[#EEF2F7] bg-[#FBFCFE] px-6 py-4 sm:px-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                      <span className="text-xs font-medium text-[#64748B]">
                        Workspace state is synced with the platform backend.
                      </span>
                    </div>

                    <Link
                      href="/platform/clients"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] transition-colors hover:text-sky-700"
                    >
                      Open client operations
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.section>

          {/* -------------------------------------------------------------- */}
          {/* RECENT ACTIVITY                                                */}
          {/* -------------------------------------------------------------- */}

          <motion.section
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 0.05,
            }}
            className="overflow-hidden rounded-[1.9rem] border border-[#E5E7EB] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.035)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#EEF2F7] px-6 py-6 sm:px-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gradient-to-r from-slate-400 to-transparent" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Activity stream
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#111827] sm:text-2xl">
                  Recent activity
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-[#64748B]">
                  The latest onboarding and activation events across your client
                  portfolio.
                </p>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 sm:flex">
                <Activity className="h-4 w-4" strokeWidth={1.8} />
              </div>
            </div>

            {isLoading ? (
              <ActivitySkeleton />
            ) : recentActivity.length === 0 ? (
              <EmptyActivity />
            ) : (
              <div className="relative px-6 py-5 sm:px-8 sm:py-6">
                <div className="absolute bottom-10 left-[1.9rem] top-10 w-px bg-[#E8EDF2] sm:left-[2.35rem]" />

                <div className="relative space-y-1">
                  {recentActivity.map((activity, index) => (
                    <ActivityTimelineRow
                      key={activity.id}
                      activity={activity}
                      isLast={index === recentActivity.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && (
              <div className="border-t border-[#EEF2F7] px-6 py-4 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#94A3B8]">
                    {latestActivity
                      ? `Last activity ${formatRelativeDate(
                          latestActivity.date,
                        )}`
                      : "Waiting for first activity"}
                  </span>

                  <Link
                    href="/platform/clients"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] transition-colors hover:text-sky-700"
                  >
                    Client directory
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.section>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-6 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
          <span>LeadFlow / Private Platform</span>

          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live operational state
          </span>
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LIFECYCLE SIGNAL                                                           */
/* -------------------------------------------------------------------------- */

function LifecycleSignal({
  icon: Icon,
  label,
  value,
  iconClass,
  isLoading,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  iconClass: string;
  isLoading: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${iconClass}`} strokeWidth={1.8} />

        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">
          {label}
        </span>
      </div>

      {isLoading ? (
        <div className="mt-2 h-6 w-8 animate-pulse rounded bg-[#F1F5F9]" />
      ) : (
        <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#111827]">
          {value}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LIFECYCLE BAR                                                              */
/* -------------------------------------------------------------------------- */

function LifecycleBar({
  label,
  value,
  total,
  colorClass,
}: {
  label: string;
  value: number;
  total: number;
  colorClass: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-[#64748B]">{label}</span>

        <span className="text-xs font-semibold text-[#475569]">{value}</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF2F5]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-1.5 text-right text-[10px] text-[#A1AAB8]">
        {percentage}%
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ACTIVITY TIMELINE ROW                                                      */
/* -------------------------------------------------------------------------- */

function ActivityTimelineRow({
  activity,
  isLast,
}: {
  activity: ActivityItem;
  isLast: boolean;
}) {
  const config = {
    created: {
      icon: Building2,
      iconClass: "bg-sky-50 text-sky-700",
      accentClass: "border-sky-200",
      badge: "Created",
      badgeClass: "bg-sky-50 text-sky-700",
    },

    invited: {
      icon: Mail,
      iconClass: "bg-amber-50 text-amber-700",
      accentClass: "border-amber-200",
      badge: "Pending",
      badgeClass: "bg-amber-50 text-amber-700",
    },

    activated: {
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-700",
      accentClass: "border-emerald-200",
      badge: "Activated",
      badgeClass: "bg-emerald-50 text-emerald-700",
    },
  }[activity.type];

  const Icon = config.icon;

  return (
    <div
      className={["relative flex gap-4 py-4", isLast ? "pb-2" : ""].join(" ")}
    >
      <div
        className={[
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
          config.accentClass,
          config.iconClass,
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-[#374151]">
            {activity.title}
          </p>

          <span
            className={[
              "rounded-full px-2 py-1 text-[10px] font-semibold",
              config.badgeClass,
            ].join(" ")}
          >
            {config.badge}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
          {activity.description}
        </p>
      </div>

      <span className="shrink-0 pt-1 text-xs text-[#A1A1AA]">
        {formatRelativeDate(activity.date)}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LIFECYCLE SKELETON                                                         */
/* -------------------------------------------------------------------------- */

function LifecycleSkeleton() {
  return (
    <div className="animate-pulse px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <div className="flex shrink-0 justify-center md:justify-start">
          <div className="h-40 w-40 rounded-full border-[14px] border-[#F1F5F9] bg-white" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="h-12 w-28 rounded-lg bg-[#F1F5F9]" />

          <div className="mt-4 h-4 w-full max-w-md rounded bg-[#F8FAFC]" />

          <div className="mt-2 h-4 w-4/5 max-w-sm rounded bg-[#F8FAFC]" />

          <div className="mt-6 h-px bg-[#EEF2F7]" />

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <div className="h-3 w-14 rounded bg-[#F1F5F9]" />
              <div className="mt-2 h-6 w-8 rounded bg-[#F1F5F9]" />
            </div>

            <div>
              <div className="h-3 w-14 rounded bg-[#F1F5F9]" />
              <div className="mt-2 h-6 w-8 rounded bg-[#F1F5F9]" />
            </div>

            <div>
              <div className="h-3 w-14 rounded bg-[#F1F5F9]" />
              <div className="mt-2 h-6 w-8 rounded bg-[#F1F5F9]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-9 space-y-5 border-t border-[#EEF2F7] pt-7">
        <div>
          <div className="flex justify-between">
            <div className="h-3 w-24 rounded bg-[#F1F5F9]" />
            <div className="h-3 w-6 rounded bg-[#F1F5F9]" />
          </div>

          <div className="mt-2 h-1.5 rounded-full bg-[#F1F5F9]" />
        </div>

        <div>
          <div className="flex justify-between">
            <div className="h-3 w-32 rounded bg-[#F1F5F9]" />
            <div className="h-3 w-6 rounded bg-[#F1F5F9]" />
          </div>

          <div className="mt-2 h-1.5 rounded-full bg-[#F1F5F9]" />
        </div>

        <div>
          <div className="flex justify-between">
            <div className="h-3 w-24 rounded bg-[#F1F5F9]" />
            <div className="h-3 w-6 rounded bg-[#F1F5F9]" />
          </div>

          <div className="mt-2 h-1.5 rounded-full bg-[#F1F5F9]" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ACTIVITY SKELETON                                                          */
/* -------------------------------------------------------------------------- */

function ActivitySkeleton() {
  return (
    <div className="animate-pulse px-6 py-6 sm:px-8">
      <div className="space-y-6">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F1F5F9]" />

            <div className="min-w-0 flex-1">
              <div className="h-4 w-40 rounded-full bg-[#F1F5F9]" />

              <div className="mt-2 h-3 w-56 rounded-full bg-[#F8FAFC]" />
            </div>

            <div className="h-3 w-12 rounded-full bg-[#F1F5F9]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* EMPTY ACTIVITY                                                             */
/* -------------------------------------------------------------------------- */

function EmptyActivity() {
  return (
    <div className="px-6 py-16 text-center sm:px-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Building2 className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#374151]">
        No client activity yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#94A3B8]">
        Client workspace and activation events will appear here once onboarding
        begins.
      </p>

      <Link
        href="/platform/clients"
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 transition-colors hover:text-sky-800"
      >
        Open client operations
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
