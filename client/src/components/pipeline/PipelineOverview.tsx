
import {
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";

const stages = [
  { label: "New", value: 12 },
  { label: "Qualified", value: 8 },
  { label: "Contacted", value: 6 },
  { label: "Meeting", value: 4 },
  { label: "Negotiation", value: 2 },
];

export default function PipelineOverview() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">
                Pipeline overview
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                Active opportunities
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                See how your current leads are moving through the sales journey.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-8 flex items-center">
            {stages.map((stage, index) => {
              const isLast = index === stages.length - 1;

              return (
                <div
                  key={stage.label}
                  className="flex min-w-0 flex-1 items-center"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">
                      {stage.label}
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                      {stage.value}
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
            <div className="h-full w-[67%] rounded-full bg-primary" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-muted">
              8 of 12 active leads qualified
            </p>

            <p className="text-xs font-semibold text-primary">67%</p>
          </div>
        </div>

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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />

                <div>
                  <p className="text-sm font-semibold">
                    3 high-intent leads
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    These opportunities are currently in Qualified or
                    Contacted stages.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

                <div>
                  <p className="text-sm font-semibold">
                    2 leads need attention
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Follow-ups are overdue and may slow pipeline movement.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-sm font-medium text-slate-300">
              <ArrowUpRight className="h-4 w-4 text-sky-300" />
              Pipeline activity is up 14% this week.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

