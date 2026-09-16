import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Flame,
  Target,
  Users,
} from "lucide-react";

const metrics = [
  {
    label: "Total leads",
    value: "124",
    change: "+18%",
    comparison: "vs previous period",
    description: "New opportunities captured",
    icon: Users,
    tone: "primary",
    trend: "up",
  },
  {
    label: "Qualified",
    value: "82",
    change: "+12%",
    comparison: "vs previous period",
    description: "Leads showing real intent",
    icon: Target,
    tone: "primary",
    trend: "up",
  },
  {
    label: "Meetings",
    value: "31",
    change: "+9%",
    comparison: "vs previous period",
    description: "Sales conversations reached",
    icon: CheckCircle2,
    tone: "success",
    trend: "up",
  },
  {
    label: "Won",
    value: "12",
    change: "+20%",
    comparison: "vs previous period",
    description: "Opportunities converted",
    icon: CircleDollarSign,
    tone: "success",
    trend: "up",
  },
  {
    label: "Conversion",
    value: "9.7%",
    change: "-1.2%",
    comparison: "vs previous period",
    description: "Lead-to-customer conversion",
    icon: Flame,
    tone: "warning",
    trend: "down",
  },
];

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
};

export default function AnalyticsOverview() {
  return (
    <section className="mt-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 lg:divide-y-0">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const styles = toneStyles[metric.tone as keyof typeof toneStyles];

            const isLast = index === metrics.length - 1;

            return (
              <div
                key={metric.label}
                className={`group relative p-5 transition-colors hover:bg-background sm:p-6 ${
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
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}

                    {metric.change}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-muted">
                    {metric.label}
                  </p>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-foreground">
                      {metric.value}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] font-medium text-muted">
                    {metric.comparison}
                  </p>

                  <p className="mt-3 text-sm leading-5 text-body">
                    {metric.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-background/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Target className="h-3.5 w-3.5" />
            </div>

            <p className="text-sm font-medium text-body">
              66% of captured leads are currently qualified.
            </p>
          </div>

          <p className="text-xs font-semibold text-primary">82 of 124 leads</p>
        </div>
      </div>
    </section>
  );
}
