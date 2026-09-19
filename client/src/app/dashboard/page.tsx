"use client";

import { useCallback, useEffect, useState } from "react";

import AttentionPanel from "@/components/dashboard/AttentionPanel";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PipelineSnapshot from "@/components/dashboard/PipelineSnapshot";
import RecentActivity from "@/components/dashboard/RecentActivity";

import { getDashboard, type DashboardData } from "@/services/dashboard.service";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [formattedDate, setFormattedDate] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboard();

      setDashboard(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      setError("Unable to load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date();

    setFormattedDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="w-full overflow-x-hidden">
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
              Good morning, Munna
              <span className="text-primary/80">.</span>
            </h1>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
            Here&apos;s what needs your attention today.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-danger/20 bg-red-50 px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6">
            <p className="text-sm font-semibold leading-6 text-danger">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-danger px-4 text-sm font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-danger/20 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6 sm:space-y-8">
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
        )}
      </div>
    </div>
  );
}
