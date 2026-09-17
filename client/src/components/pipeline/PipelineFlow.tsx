"use client";

import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Trophy,
  XCircle,
} from "lucide-react";

import type {
  PipelineOutcome,
  PipelineStage,
} from "@/services/pipeline.service";

import PipelineLeadCard from "./PipelineLeadCard";

type PipelineFlowProps = {
  stages: PipelineStage[];
  outcomes: PipelineOutcome[];
};

export default function PipelineFlow({ stages, outcomes }: PipelineFlowProps) {
  const totalActiveOpportunities = stages.reduce(
    (total, stage) => total + stage.count,
    0,
  );

  const wonCount =
    outcomes.find((outcome) => outcome.key === "won")?.count ?? 0;

  const lostCount =
    outcomes.find((outcome) => outcome.key === "lost")?.count ?? 0;

  return (
    <section className="mt-10">
      {/* ------------------------------------------------------------------ */}
      {/* SECTION HEADER                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />

            <p className="text-sm font-semibold text-primary">Sales journey</p>
          </div>

          <h2 className="mt-2 bg-gradient-to-br from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-2xl font-semibold tracking-[-0.035em] text-transparent sm:text-3xl">
            From first inquiry to decision
            <span className="text-primary">.</span>
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Track where opportunities are today and keep every conversation
            moving toward the next stage.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-body shadow-sm sm:self-auto">
          <span className="flex h-2 w-2 rounded-full bg-primary" />
          {totalActiveOpportunities} active{" "}
          {totalActiveOpportunities === 1 ? "opportunity" : "opportunities"}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PIPELINE STAGES                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative mt-7">
        <div className="grid gap-4 lg:grid-cols-5 lg:gap-3">
          {stages.map((stage, stageIndex) => {
            const isLast = stageIndex === stages.length - 1;

            return (
              <div
                key={stage.key}
                className="relative flex flex-col lg:min-w-0"
              >
                <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
                  {/* Stage top accent */}

                  <div className="relative border-b border-border px-5 pb-5 pt-5">
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary/80" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-xs font-bold text-primary">
                            {String(stageIndex + 1).padStart(2, "0")}
                          </span>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-foreground">
                              {stage.label}
                            </h3>

                            <p className="mt-0.5 truncate text-xs text-muted">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-background px-2 text-xs font-semibold text-foreground">
                        {stage.count}
                      </span>
                    </div>
                  </div>

                  {/* Stage leads */}

                  <div className="flex flex-1 flex-col bg-background/40 p-3">
                    {stage.leads.length > 0 ? (
                      <div className="space-y-3">
                        {stage.leads.map((lead) => (
                          <PipelineLeadCard key={lead.id} {...lead} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-28 flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-4 text-center">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            No active leads
                          </p>

                          <p className="mt-1 text-xs leading-5 text-muted">
                            Opportunities entering this stage will appear here.
                          </p>
                        </div>
                      </div>
                    )}

                    {stage.count > stage.leads.length && (
                      <button
                        type="button"
                        className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:bg-primary-soft/30 hover:text-primary"
                      >
                        View {stage.count - stage.leads.length} more
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {stage.count === stage.leads.length && stage.count > 0 && (
                      <div className="mt-3 flex min-h-10 items-center justify-center rounded-xl bg-surface text-xs font-medium text-muted">
                        All opportunities visible
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage connector */}

                {!isLast && (
                  <>
                    <div className="absolute -bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center lg:hidden">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    <div className="absolute right-[-10px] top-1/2 z-10 hidden -translate-y-1/2 lg:flex">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* OUTCOMES                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-success/15 bg-success/5 px-4 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-success shadow-sm">
            <Trophy className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              {wonCount}{" "}
              {wonCount === 1 ? "opportunity won" : "opportunities won"}
            </p>

            <p className="mt-0.5 text-xs leading-5 text-muted">
              Successfully closed opportunities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-danger/15 bg-danger/5 px-4 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-danger shadow-sm">
            <XCircle className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              {lostCount}{" "}
              {lostCount === 1 ? "opportunity lost" : "opportunities lost"}
            </p>

            <p className="mt-0.5 text-xs leading-5 text-muted">
              Opportunities that are no longer active.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* GUIDANCE                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary-soft/40 px-4 py-4 sm:flex-row sm:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
          <CheckCircle2 className="h-4.5 w-4.5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            Keep opportunities moving
          </p>

          <p className="mt-0.5 text-sm leading-6 text-body">
            Every stage represents the next meaningful step in the conversation
            — from initial inquiry to negotiation.
          </p>
        </div>
      </div>
    </section>
  );
}
