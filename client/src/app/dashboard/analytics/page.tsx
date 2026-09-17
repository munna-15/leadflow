
"use client";

import { useCallback, useEffect, useState } from "react";

import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsInsights from "@/components/analytics/AnalyticsInsights";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";
import ConversionJourney from "@/components/analytics/ConversionJourney";
import LeadPerformance from "@/components/analytics/LeadPerformance";
import LeadSources from "@/components/analytics/LeadSources";
import {
  getAnalytics,
  type AnalyticsData,
  type AnalyticsRange,
} from "@/services/analytics.service";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAnalytics(range);

      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);

      setError(
        "We couldn't load your analytics right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <AnalyticsPageSkeleton />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-6 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <span className="text-lg font-semibold">!</span>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
            Analytics unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            {error ||
              "We couldn't load the analytics data. Please try again."}
          </p>

          <button
            type="button"
            onClick={loadAnalytics}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1F2937]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <AnalyticsHeader
        range={range}
        onRangeChange={setRange}
      />

      <AnalyticsOverview data={analytics.overview} />

      <ConversionJourney data={analytics.pipeline} />

      <LeadSources sources={analytics.sources} />

      <LeadPerformance team={analytics.team} />

      <AnalyticsInsights insights={analytics.insights} />
    </div>
  );
}

function AnalyticsPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-border/70 pb-10">
        <div className="h-4 w-40 rounded-full bg-border" />

        <div className="mt-4 h-16 w-64 rounded-2xl bg-border sm:h-20 sm:w-80" />

        <div className="mt-5 h-5 w-full max-w-2xl rounded-full bg-border" />

        <div className="mt-2 h-5 w-3/4 max-w-xl rounded-full bg-border" />

        <div className="mt-7 flex gap-3">
          <div className="h-11 w-36 rounded-xl bg-border" />
          <div className="h-11 w-32 rounded-xl bg-border" />
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-surface p-6"
            >
              <div className="h-10 w-10 rounded-xl bg-border" />

              <div className="mt-5 h-4 w-20 rounded-full bg-border" />

              <div className="mt-2 h-9 w-16 rounded-lg bg-border" />

              <div className="mt-2 h-3 w-24 rounded-full bg-border" />

              <div className="mt-4 h-4 w-32 rounded-full bg-border" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 h-80 rounded-3xl border border-border bg-surface" />

      <div className="mt-8 h-96 rounded-3xl border border-border bg-surface" />

      <div className="mt-8 h-96 rounded-3xl border border-border bg-surface" />

      <div className="mt-8 h-80 rounded-3xl border border-border bg-surface" />
    </div>
  );
}

