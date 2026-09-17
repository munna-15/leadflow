
import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Handshake,
  Target,
  Users,
} from "lucide-react";

import type {
  AnalyticsPipeline,
  AnalyticsPipelineStageId,
} from "@/services/analytics.service";

interface ConversionJourneyProps {
  data: AnalyticsPipeline;
}

const stageMeta: Record<
  AnalyticsPipelineStageId,
  {
    description: string;
    icon: typeof Users;
    tone: "primary" | "success";
  }
> = {
  new: {
    description: "New opportunities",
    icon: Users,
    tone: "primary",
  },
  qualified: {
    description: "Qualified leads",
    icon: Target,
    tone: "primary",
  },
  contacted: {
    description: "Active conversations",
    icon: CircleDot,
    tone: "primary",
  },
  meeting: {
    description: "Sales meetings",
    icon: CheckCircle2,
    tone: "primary",
  },
  negotiation: {
    description: "In negotiation",
    icon: Handshake,
    tone: "primary",
  },
};

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary",
    value: "text-primary",
  },
  success: {
    icon: "bg-green-50 text-green-600",
    value: "text-green-600",
  },
} as const;

export default function ConversionJourney({
  data,
}: ConversionJourneyProps) {
  const activeStageTotal = data.stages.reduce(
    (total, stage) => total + stage.count,
    0,
  );

  const totalLeads =
    activeStageTotal + data.won + data.lost;

  const getShare = (count: number) => {
    if (totalLeads === 0) {
      return 0;
    }

    return Number(((count / totalLeads) * 100).toFixed(1));
  };

  const stages = data.stages.map((stage) => {
    const meta = stageMeta[stage.id];

    return {
      ...stage,
      description: meta.description,
      icon: meta.icon,
      tone: meta.tone,
      percentage: getShare(stage.count),
    };
  });

  const outcomeStages = [
    {
      id: "won",
      label: "Won",
      count: data.won,
      percentage: getShare(data.won),
      description: "Converted customers",
      icon: CheckCircle2,
      tone: "success" as const,
    },
    {
      id: "lost",
      label: "Lost",
      count: data.lost,
      percentage: getShare(data.lost),
      description: "Closed opportunities",
      icon: ArrowDownRight,
      tone: "primary" as const,
    },
  ];

  const allStages = [
    ...stages,
    ...outcomeStages,
  ];

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Current sales journey
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Where leads are in your sales process
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              See the current distribution of leads across each stage of
              your sales pipeline.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-background px-3.5 py-2 text-xs font-semibold text-body">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {totalLeads.toLocaleString()} total leads
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 lg:p-8">
        <div className="hidden lg:block">
          <div className="flex items-start">
            {allStages.map((stage, index) => {
              const Icon = stage.icon;
              const styles = toneStyles[stage.tone];
              const isLast = index === allStages.length - 1;

              return (
                <div
                  key={stage.id}
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
                        {stage.count}
                      </span>

                      <span className="text-xs font-semibold text-muted">
                        {stage.percentage}%
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-medium text-muted">
                      {stage.count === 1
                        ? "1 lead"
                        : `${stage.count.toLocaleString()} leads`}
                    </p>
                  </div>

                  {!isLast && (
                    <div className="flex w-12 shrink-0 items-center px-2 pt-5">
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
              {allStages.map((stage) => {
                if (stage.percentage <= 0) {
                  return null;
                }

                const barClass =
                  stage.id === "won"
                    ? "bg-green-500"
                    : stage.id === "lost"
                      ? "bg-slate-400"
                      : "bg-primary";

                return (
                  <div
                    key={stage.id}
                    className={`h-full ${barClass} transition-all duration-500`}
                    style={{
                      width: `${stage.percentage}%`,
                    }}
                    title={`${stage.label}: ${stage.count}`}
                  />
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-muted">
              <span>
                {activeStageTotal.toLocaleString()} active pipeline
              </span>

              <div className="flex items-center gap-4">
                <span>
                  {data.won.toLocaleString()} won
                </span>

                <span>
                  {data.lost.toLocaleString()} lost
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          {allStages.map((stage, index) => {
            const Icon = stage.icon;
            const styles = toneStyles[stage.tone];
            const isLast = index === allStages.length - 1;

            return (
              <div key={stage.id}>
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
                            {stage.count}
                          </span>

                          <span className="text-[11px] font-medium text-muted">
                            {stage.percentage}%
                          </span>
                        </div>
                      </div>

                      <p className="mt-1 text-xs text-muted">
                        {stage.description}
                      </p>

                      <p className="mt-2 text-[11px] font-semibold text-body">
                        {stage.count === 1
                          ? "1 lead currently here"
                          : `${stage.count.toLocaleString()} leads currently here`}
                      </p>
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
              Active pipeline
            </p>

            <p className="mt-1.5 text-sm font-semibold text-foreground">
              {activeStageTotal.toLocaleString()} active{" "}
              {activeStageTotal === 1 ? "lead" : "leads"}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Leads currently sitting in an active sales stage.
            </p>
          </div>

          <div className="rounded-2xl bg-green-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
              Closed outcomes
            </p>

            <p className="mt-1.5 text-sm font-semibold text-foreground">
              {data.won.toLocaleString()} won ·{" "}
              {data.lost.toLocaleString()} lost
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Current closed outcomes recorded in the pipeline.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

