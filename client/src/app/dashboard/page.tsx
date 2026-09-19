"use client";

import { useEffect, useState } from "react";

import AttentionPanel from "@/components/dashboard/AttentionPanel";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PipelineSnapshot from "@/components/dashboard/PipelineSnapshot";
import RecentActivity from "@/components/dashboard/RecentActivity";

import { getDashboard, type DashboardData } from "@/services/dashboard.service";

import { getSettings } from "@/services/settings.service";

type DashboardCache = {
  dashboard: DashboardData;
  userName: string;
  updatedAt: number;
};

const CACHE_KEY = "leadflow_dashboard_cache_v1";

const readDashboardCache = (): DashboardCache | null => {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as DashboardCache;

    if (!parsed?.dashboard) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeDashboardCache = (dashboard: DashboardData, userName: string) => {
  try {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        dashboard,
        userName,
        updatedAt: Date.now(),
      }),
    );
  } catch {
    return;
  }
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [userName, setUserName] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncDashboard = async () => {
      const cached = readDashboardCache();

      if (cached) {
        setDashboard(cached.dashboard);
        setUserName(cached.userName || "");
        setLoading(false);
        setRefreshing(true);
      }

      try {
        const [dashboardResult, settingsResult] = await Promise.allSettled([
          getDashboard(),
          getSettings(),
        ]);

        if (!mounted) {
          return;
        }

        let nextDashboard = cached?.dashboard ?? null;

        let nextUserName = cached?.userName ?? "";

        if (dashboardResult.status === "fulfilled") {
          nextDashboard = dashboardResult.value;

          setDashboard(dashboardResult.value);
        }

        if (settingsResult.status === "fulfilled") {
          nextUserName = settingsResult.value.account?.name?.trim() || "";

          setUserName(nextUserName);
        }

        if (dashboardResult.status === "rejected") {
          setError(
            nextDashboard
              ? "Latest dashboard sync failed. Showing the last available data."
              : "Unable to load your dashboard. Please try again.",
          );
        } else {
          setError("");
        }

        if (nextDashboard) {
          writeDashboardCache(nextDashboard, nextUserName);
        }
      } catch (syncError) {
        console.error("Dashboard sync failed:", syncError);

        if (!mounted) {
          return;
        }

        setError(
          cached?.dashboard
            ? "Latest dashboard sync failed. Showing the last available data."
            : "Unable to load your dashboard. Please try again.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void syncDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const retryDashboard = async () => {
    try {
      setRefreshing(true);
      setError("");

      const [dashboardResult, settingsResult] = await Promise.allSettled([
        getDashboard(),
        getSettings(),
      ]);

      let nextDashboard = dashboard;

      let nextUserName = userName;

      if (dashboardResult.status === "fulfilled") {
        nextDashboard = dashboardResult.value;

        setDashboard(dashboardResult.value);
      }

      if (settingsResult.status === "fulfilled") {
        nextUserName = settingsResult.value.account?.name?.trim() || "";

        setUserName(nextUserName);
      }

      if (dashboardResult.status === "rejected") {
        setError(
          "Latest dashboard sync failed. Showing the last available data.",
        );
      } else {
        setError("");
      }

      if (nextDashboard) {
        writeDashboardCache(nextDashboard, nextUserName);
      }
    } catch (retryError) {
      console.error("Dashboard retry failed:", retryError);

      setError(
        "Latest dashboard sync failed. Showing the last available data.",
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const hasDashboardData = dashboard !== null;

  const initialLoading = loading && !hasDashboardData;

  return (
    <div className="w-full overflow-x-hidden [overflow-anchor:none]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-8">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-[11px] sm:tracking-[0.22em]">
            {formattedDate || "\u00A0"}
          </p>

          <div className="relative mt-3 inline-block max-w-full">
            <div
              aria-hidden="true"
              className="absolute -inset-x-4 -inset-y-3 -z-10 bg-gradient-to-r from-primary/10 via-sky-400/5 to-transparent blur-2xl sm:-inset-x-6 sm:-inset-y-4"
            />

            <h1 className="max-w-full bg-gradient-to-br from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-transparent sm:text-5xl sm:leading-[1.05] lg:text-7xl">
              {userName ? <>Good morning, {userName}</> : "Good morning"}

              <span className="text-primary/80">.</span>
            </h1>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
            Here&apos;s what needs your attention today.
          </p>
        </div>

        {error && !hasDashboardData ? (
          <div className="min-h-[850px] rounded-2xl border border-danger/20 bg-red-50 px-4 py-5 sm:min-h-[900px] sm:rounded-3xl sm:px-6 sm:py-6 lg:min-h-[950px]">
            <p className="text-sm font-semibold leading-6 text-danger">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void retryDashboard();
              }}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-danger px-4 text-sm font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-danger/20 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="min-h-[1050px] sm:min-h-[1100px] lg:min-h-[950px]">
            {initialLoading ? (
              <DashboardSkeleton />
            ) : (
              <div>
                {error && hasDashboardData && (
                  <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/70 px-4 py-3">
                    <p className="text-xs font-medium leading-5 text-amber-700">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        void retryDashboard();
                      }}
                      className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                    >
                      Retry
                    </button>
                  </div>
                )}

                <div aria-busy={refreshing} className="space-y-6 sm:space-y-8">
                  <AttentionPanel
                    items={dashboard?.attentionItems ?? []}
                    activeLeads={dashboard?.summary.activeLeads ?? 0}
                    highIntentLeads={dashboard?.summary.highIntentLeads ?? 0}
                    followUpsDue={dashboard?.summary.followUpsDue ?? 0}
                  />

                  <PipelineSnapshot
                    stages={dashboard?.pipeline.stages ?? []}
                    won={dashboard?.pipeline.won ?? 0}
                    lost={dashboard?.pipeline.lost ?? 0}
                  />

                  <RecentActivity
                    activities={dashboard?.recentActivities ?? []}
                    loading={false}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
