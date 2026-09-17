"use client";

import Link from "next/link";

import {
ArrowRight,
ArrowUpRight,
CheckCircle2,
CircleDot,
Handshake,
Layers3,
MessageCircle,
Target,
UsersRound,
} from "lucide-react";

export type PipelineStage = {
id: string;
label: string;
count: number;
};

type PipelineSnapshotProps = {
stages?: PipelineStage[];
won?: number;
lost?: number;
};

const stageIcons = {
new: UsersRound,
qualified: Target,
contacted: MessageCircle,
meeting: CircleDot,
negotiation: Handshake,
};

const stageStyles = {
new: {
icon: "bg-slate-100 text-slate-600",
accent: "bg-slate-300",
text: "text-slate-600",
},
qualified: {
icon: "bg-primary-soft text-primary",
accent: "bg-primary",
text: "text-primary",
},
contacted: {
icon: "bg-sky-50 text-sky-600",
accent: "bg-sky-400",
text: "text-sky-600",
},
meeting: {
icon: "bg-amber-50 text-amber-600",
accent: "bg-amber-400",
text: "text-amber-600",
},
negotiation: {
icon: "bg-emerald-50 text-emerald-600",
accent: "bg-emerald-400",
text: "text-emerald-600",
},
};

export default function PipelineSnapshot({
stages = [],
won = 0,
lost = 0,
}: PipelineSnapshotProps) {
const activeStages = stages.filter(
(stage) =>
stage.id !== "won" &&
stage.id !== "lost",
);

const totalActiveLeads = activeStages.reduce(
(total, stage) => total + stage.count,
0,
);

const strongestStage = activeStages.reduce<PipelineStage | null>(
(current, stage) => {
if (!current || stage.count > current.count) {
return stage;
}


  return current;
},
null,


);

return ( <section className="mt-10"> <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"> <div> <div className="flex items-center gap-2"> <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary-soft text-primary"> <Layers3 className="h-3 w-3" /> </span>

```
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Pipeline
        </p>
      </div>

      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
        See opportunities move forward.
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Understand where active opportunities are sitting and where your
        sales process needs momentum.
      </p>
    </div>

    <Link
      href="/dashboard/pipeline"
      className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
    >
      Open pipeline
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  </div>

  <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
    <div className="relative overflow-hidden border-b border-border px-6 py-6 sm:px-7">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-28 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Sales journey
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            Current distribution across your active sales flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-primary">
            <Layers3 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {totalActiveLeads}
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Active flow
            </p>
          </div>
        </div>
      </div>
    </div>

    {activeStages.length > 0 ? (
      <div className="px-6 py-7 sm:px-7 sm:py-8">
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[820px]">
            <div className="flex items-start">
              {activeStages.map((stage, index) => {
                const Icon =
                  stageIcons[
                    stage.id as keyof typeof stageIcons
                  ] ?? CircleDot;

                const style =
                  stageStyles[
                    stage.id as keyof typeof stageStyles
                  ] ?? stageStyles.new;

                const isLast =
                  index === activeStages.length - 1;

                const stageShare =
                  totalActiveLeads > 0
                    ? Math.round(
                        (stage.count / totalActiveLeads) * 100,
                      )
                    : 0;

                return (
                  <div
                    key={stage.id}
                    className="flex min-w-0 flex-1 items-start"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
                        >
                          <Icon
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        </div>

                        <div className="min-w-0 pt-0.5">
                          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                            {stage.label}
                          </p>

                          <div className="mt-1 flex items-baseline gap-2">
                            <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                              {stage.count}
                            </p>

                            <span
                              className={`text-[10px] font-semibold ${style.text}`}
                            >
                              {stageShare}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="h-1.5 overflow-hidden rounded-full bg-background">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${style.accent}`}
                            style={{
                              width:
                                stage.count > 0
                                  ? `${Math.max(
                                      stageShare,
                                      8,
                                    )}%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {!isLast && (
                      <div className="flex w-14 shrink-0 items-center justify-center pt-5">
                        <div className="flex items-center gap-1 text-border">
                          <span className="h-px w-4 bg-border" />
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />

                <p className="text-xs font-medium text-muted">
                  Active sales flow
                </p>

                {strongestStage && strongestStage.count > 0 && (
                  <>
                    <span className="text-border">•</span>

                    <p className="text-xs font-medium text-muted">
                      Most active:
                      <span className="ml-1 font-semibold text-foreground">
                        {strongestStage.label}
                      </span>
                    </p>
                  </>
                )}
              </div>

              <Link
                href="/dashboard/pipeline"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                See full journey
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex min-h-[230px] flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Layers3 className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-foreground">
          Your pipeline is ready for its first opportunity.
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
          Once leads enter your sales process, their journey will appear
          here automatically.
        </p>

        <Link
          href="/dashboard/leads"
          className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          Explore leads
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    )}

    <div className="grid grid-cols-2 border-t border-border">
      <div className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-background sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>

          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {won}
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Won
            </p>
          </div>
        </div>

        <ArrowRight className="hidden h-4 w-4 text-border transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-500 sm:block" />
      </div>

      <div className="group flex items-center justify-between gap-4 border-l border-border px-6 py-5 transition-colors hover:bg-background sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted">
            <CircleDot className="h-4.5 w-4.5" />
          </div>

          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {lost}
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Lost
            </p>
          </div>
        </div>

        <ArrowRight className="hidden h-4 w-4 text-border transition-all duration-200 group-hover:translate-x-1 group-hover:text-muted sm:block" />
      </div>
    </div>
  </div>
</section>


);
}
