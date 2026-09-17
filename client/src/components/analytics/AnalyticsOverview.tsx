
import {
  CheckCircle2,
  CircleDollarSign,
  Flame,
  Target,
  Users,
} from "lucide-react";

import type { AnalyticsOverview as AnalyticsOverviewData } from "@/services/analytics.service";

interface AnalyticsOverviewProps {
  data: AnalyticsOverviewData;
}

const metrics = [
  {
    key: "totalLeads",
    label: "Total leads",
    description: "New opportunities captured",
    icon: Users,
    tone: "primary",
  },
  {
    key: "qualified",
    label: "Qualified",
    description: "Leads currently qualified",
    icon: Target,
    tone: "primary",
  },
  {
    key: "meetings",
    label: "Meetings",
    description: "Leads currently in meetings",
    icon: CheckCircle2,
    tone: "success",
  },
  {
    key: "won",
    label: "Won",
    description: "Opportunities converted",
    icon: CircleDollarSign,
    tone: "success",
  },
  {
    key: "conversionRate",
    label: "Conversion",
    description: "Lead-to-customer conversion",
    icon: Flame,
    tone: "warning",
  },
] as const;

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary",
    accent: "bg-primary",
  },
  success: {
    icon: "bg-green-50 text-green-600",
    accent: "bg-green-500",
  },
  warning: {
    icon: "bg-orange-50 text-orange-600",
    accent: "bg-orange-500",
  },
} as const;

const getMetricValue = (
  data: AnalyticsOverviewData,
  key: (typeof metrics)[number]["key"],
) => {
  if (key === "conversionRate") {
    return `${data.conversionRate}%`;
  }

  return data[key].toLocaleString();
};

export default function AnalyticsOverview({
  data,
}: AnalyticsOverviewProps) {
  return (
    <section className="mt-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 lg:divide-y-0">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const styles = toneStyles[metric.tone];
            const isLast = index === metrics.length - 1;

            return (
              <div
                key={metric.key}
                className={`group relative p-5 transition-colors duration-200 hover:bg-background sm:p-6 ${
                  !isLast ? "lg:border-r lg:border-border" : ""
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 ${styles.accent} opacity-70`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-muted">
                    {metric.label}
                  </p>

                  <div className="mt-1">
                    <span className="text-3xl font-semibold tracking-[-0.025em] text-foreground">
                      {getMetricValue(data, metric.key)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-5 text-body">
                    {metric.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

