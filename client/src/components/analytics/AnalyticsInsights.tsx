
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Flame,
  Lightbulb,
  TriangleAlert,
} from "lucide-react";

import type { AnalyticsInsight } from "@/services/analytics.service";

interface AnalyticsInsightsProps {
  insights: AnalyticsInsight[];
}

const getInsightStyles = (type: AnalyticsInsight["type"]) => {
  if (type === "priority") {
    return {
      icon: Flame,
      iconClass: "bg-red-50 text-red-600",
      badgeClass: "bg-red-50 text-red-700",
      accentClass: "bg-red-500",
    };
  }

  if (type === "attention") {
    return {
      icon: TriangleAlert,
      iconClass: "bg-orange-50 text-orange-600",
      badgeClass: "bg-orange-50 text-orange-700",
      accentClass: "bg-orange-500",
    };
  }

  return {
    icon: Lightbulb,
    iconClass: "bg-primary-soft text-primary",
    badgeClass: "bg-primary-soft text-primary",
    accentClass: "bg-primary",
  };
};

const formatInsightType = (type: AnalyticsInsight["type"]) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function AnalyticsInsights({
  insights,
}: AnalyticsInsightsProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-primary" />

              <p className="text-sm font-semibold text-primary">
                Intelligence layer
              </p>
            </div>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              What the numbers are telling you
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Turn current pipeline activity into clear signals so your team
              can see what deserves attention next.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-primary/15 bg-primary-soft/50 px-3.5 py-2 text-xs font-semibold text-primary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <Lightbulb className="h-3 w-3" />
            </span>

            {insights.length}{" "}
            {insights.length === 1 ? "actionable signal" : "actionable signals"}
          </div>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="px-6 py-16 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No immediate signals
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            There are no current analytics signals requiring attention for the
            selected period.
          </p>
        </div>
      ) : (
        <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {insights.map((insight) => {
            const styles = getInsightStyles(insight.type);
            const Icon = styles.icon;

            return (
              <article
                key={`${insight.type}-${insight.title}`}
                className="group relative p-6 transition-colors hover:bg-background sm:p-7"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 ${styles.accentClass} opacity-70`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badgeClass}`}
                  >
                    {formatInsightType(insight.type)}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-base font-semibold leading-6 text-foreground">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {insight.description}
                  </p>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                      {insight.metric}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-muted">
                      {insight.metricLabel}
                    </p>
                  </div>

                  {insight.leadIds && insight.leadIds.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                      <span>
                        {insight.leadIds.length}{" "}
                        {insight.leadIds.length === 1
                          ? "lead"
                          : "leads"}
                      </span>

                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="border-t border-border bg-foreground px-6 py-6 text-white sm:px-7 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
              {insights.length > 0 ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-sky-300">
                Current signal
              </p>

              <h3 className="mt-1 text-lg font-semibold tracking-tight">
                {insights.length > 0
                  ? insights[0].title
                  : "Your current analytics look clear."}
              </h3>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-300">
                {insights.length > 0
                  ? insights[0].description
                  : "No immediate attention signal was detected for the selected analytics period."}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            Based on current analytics data
          </div>
        </div>
      </div>
    </section>
  );
}

