import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Target,
  Users,
} from "lucide-react";

const stages = [
  {
    label: "Captured",
    value: 124,
    percentage: "100%",
    description: "New leads entered",
    conversion: null,
    icon: Users,
    tone: "primary",
  },
  {
    label: "Qualified",
    value: 82,
    percentage: "66%",
    description: "Showing buying intent",
    conversion: "66% retained",
    icon: Target,
    tone: "primary",
  },
  {
    label: "Contacted",
    value: 54,
    percentage: "44%",
    description: "Active conversations",
    conversion: "66% retained",
    icon: CircleDot,
    tone: "primary",
  },
  {
    label: "Meetings",
    value: 31,
    percentage: "25%",
    description: "Sales conversations",
    conversion: "57% retained",
    icon: CheckCircle2,
    tone: "success",
  },
  {
    label: "Won",
    value: 12,
    percentage: "9.7%",
    description: "Converted customers",
    conversion: "39% retained",
    icon: CheckCircle2,
    tone: "success",
  },
];

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary",
    value: "text-primary",
    line: "bg-primary/20",
  },
  success: {
    icon: "bg-green-50 text-green-600",
    value: "text-green-600",
    line: "bg-green-200",
  },
};

export default function ConversionJourney() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Conversion journey
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              How leads move through your sales process
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Follow the journey from first inquiry to customer and identify
              where opportunities are being lost.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-background px-3.5 py-2 text-xs font-semibold text-body">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            9.7% overall conversion
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 lg:p-8">
        <div className="hidden lg:block">
          <div className="flex items-start">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const styles = toneStyles[stage.tone as keyof typeof toneStyles];

              const isLast = index === stages.length - 1;

              return (
                <div
                  key={stage.label}
                  className="flex min-w-0 flex-1 items-start"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {stage.label}
                        </p>

                        <p className="mt-0.5 text-xs text-muted">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-semibold tracking-tight ${styles.value}`}
                      >
                        {stage.value}
                      </span>

                      <span className="text-xs font-semibold text-muted">
                        {stage.percentage}
                      </span>
                    </div>

                    {stage.conversion && (
                      <p className="mt-1 text-xs font-medium text-muted">
                        {stage.conversion}
                      </p>
                    )}
                  </div>

                  {!isLast && (
                    <div className="flex w-16 shrink-0 items-center px-2 pt-5">
                      <div className="h-px flex-1 bg-border" />

                      <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="flex h-3 overflow-hidden rounded-full bg-background">
              <div className="h-full w-[66%] bg-primary" />
              <div className="h-full w-[19%] bg-primary/50" />
              <div className="h-full w-[9%] bg-primary/30" />
              <div className="h-full w-[6%] bg-green-500" />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-xs font-medium text-muted">
              <span>124 captured</span>
              <span>12 converted</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const styles = toneStyles[stage.tone as keyof typeof toneStyles];

            const isLast = index === stages.length - 1;

            return (
              <div key={stage.label}>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-foreground">
                          {stage.label}
                        </h3>

                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`text-xl font-semibold ${styles.value}`}
                          >
                            {stage.value}
                          </span>

                          <span className="text-[11px] font-medium text-muted">
                            {stage.percentage}
                          </span>
                        </div>
                      </div>

                      <p className="mt-1 text-xs text-muted">
                        {stage.description}
                      </p>

                      {stage.conversion && (
                        <p className="mt-2 text-[11px] font-semibold text-body">
                          {stage.conversion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex h-7 items-center justify-center">
                    <ArrowDownRight className="h-4 w-4 text-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-primary-soft/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Strongest transition
            </p>

            <p className="mt-1.5 text-sm font-semibold text-foreground">
              Captured → Qualified
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              66% of incoming leads are reaching qualification.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50/70 p-4">
            <div className="flex items-start gap-2">
              <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Largest drop
                </p>

                <p className="mt-1.5 text-sm font-semibold text-foreground">
                  Qualified → Contacted
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  28 qualified opportunities have not reached active
                  conversations yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
