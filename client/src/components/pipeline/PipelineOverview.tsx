"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";

import type {
  PipelineSignals,
  PipelineSummary,
} from "@/services/pipeline.service";

type PipelineOverviewProps = {
  summary: PipelineSummary;
  signals: PipelineSignals;
};

const ACTIVE_STAGES = [
  {
    key: "new",
    label: "New",
  },
  {
    key: "qualified",
    label: "Qualified",
  },
  {
    key: "contacted",
    label: "Contacted",
  },
  {
    key: "meeting",
    label: "Meeting",
  },
  {
    key: "negotiation",
    label: "Negotiation",
  },
] as const;

export default function PipelineOverview({
  summary,
  signals,
}: PipelineOverviewProps) {
  const qualificationRate =
    summary.active > 0
      ? Math.round((summary.qualified / summary.active) * 100)
      : 0;

  const highIntentCount = signals.hotLeads.count;

  const highScoreCount = signals.highScoreLeads.count;

  const attentionCount = signals.attentionNeeded.count;

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        {/* ---------------------------------------------------------------- */}
        {/* PIPELINE PROGRESS                                                */}
        {/* ---------------------------------------------------------------- */}

        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">
                Pipeline overview
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                Active opportunities
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                See how your current leads are moving through the sales journey.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-8 flex items-center">
            {ACTIVE_STAGES.map((stage, index) => {
              const isLast = index === ACTIVE_STAGES.length - 1;

              const value = summary[stage.key];

              return (
                <div
                  key={stage.key}
                  className="flex min-w-0 flex-1 items-center"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">
                      {stage.label}
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                      {value}
                    </p>
                  </div>

                  {!isLast && (
                    <div className="mx-3 hidden h-px flex-1 bg-border sm:block" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${qualificationRate}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-muted">
              {summary.qualified} of {summary.active} active leads qualified
            </p>

            <p className="text-xs font-semibold text-primary">
              {qualificationRate}%
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* PIPELINE SIGNALS                                                 */}
        {/* ---------------------------------------------------------------- */}

        <div className="bg-foreground p-6 text-white lg:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-sky-300">
                Pipeline signal
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Where to focus next
              </h2>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {/* High-intent leads */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />

                <div>
                  <p className="text-sm font-semibold">
                    {highIntentCount} high-intent{" "}
                    {highIntentCount === 1 ? "lead" : "leads"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {highIntentCount > 0
                      ? "These leads are currently marked as hot and may deserve faster attention."
                      : "No hot leads are currently active in the pipeline."}
                  </p>
                </div>
              </div>
            </div>

            {/* High-score opportunities */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />

                <div>
                  <p className="text-sm font-semibold">
                    {highScoreCount} high-score{" "}
                    {highScoreCount === 1 ? "opportunity" : "opportunities"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {highScoreCount > 0
                      ? "These active leads currently have a score of 80 or above."
                      : "No active leads currently have a score of 80 or above."}
                  </p>
                </div>
              </div>
            </div>

            {/* Attention needed */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

                <div>
                  <p className="text-sm font-semibold">
                    {attentionCount}{" "}
                    {attentionCount === 1 ? "lead needs" : "leads need"}{" "}
                    attention
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {attentionCount > 0
                      ? "Follow-ups are overdue and may slow pipeline movement."
                      : "No overdue follow-ups require attention right now."}
                  </p>
                </div>
              </div>
            </div>

            {/* Current pipeline state */}

            <div className="flex items-center gap-2 pt-1 text-sm font-medium text-slate-300">
              <ArrowUpRight className="h-4 w-4 text-sky-300" />
              {summary.active} active{" "}
              {summary.active === 1 ? "opportunity" : "opportunities"} currently
              moving through the pipeline.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
