import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Flame,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

const insights = [
  {
    type: "Opportunity",
    title: "Website leads are showing the strongest intent.",
    description:
      "Website inquiries have the highest qualification rate and are converting into meetings more consistently than other sources.",
    metric: "73%",
    metricLabel: "qualification rate",
    icon: TrendingUp,
    tone: "primary",
  },
  {
    type: "Attention",
    title: "Qualified leads are waiting too long for contact.",
    description:
      "28 qualified opportunities have not reached the contacted stage. Faster first responses could reduce pipeline drop-off.",
    metric: "28",
    metricLabel: "waiting leads",
    icon: Clock3,
    tone: "warning",
  },
  {
    type: "Priority",
    title: "3 hot leads should be contacted first.",
    description:
      "These leads have high intent scores and active buying timelines. Delaying the next touchpoint may reduce momentum.",
    metric: "92+",
    metricLabel: "lead score",
    icon: Flame,
    tone: "danger",
  },
];

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary",
    badge: "bg-primary-soft text-primary",
    accent: "bg-primary",
  },
  warning: {
    icon: "bg-orange-50 text-orange-600",
    badge: "bg-orange-50 text-orange-700",
    accent: "bg-orange-500",
  },
  danger: {
    icon: "bg-red-50 text-red-600",
    badge: "bg-red-50 text-red-700",
    accent: "bg-red-500",
  },
};

export default function AnalyticsInsights() {
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
              Turn pipeline activity into clear signals so your team can decide
              what deserves attention next.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-primary/15 bg-primary-soft/50 px-3.5 py-2 text-xs font-semibold text-primary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <Lightbulb className="h-3 w-3" />
            </span>
            3 actionable signals
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const styles = toneStyles[insight.tone as keyof typeof toneStyles];

          return (
            <article
              key={insight.title}
              className="group relative p-6 transition-colors hover:bg-background sm:p-7"
            >
              <div
                className={`absolute inset-x-0 top-0 h-0.5 ${styles.accent} opacity-70`}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badge}`}
                >
                  {insight.type}
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

                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-muted transition-colors hover:bg-background hover:text-primary"
                >
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="border-t border-border bg-foreground px-6 py-6 text-white sm:px-7 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-sky-300">
                Recommended focus
              </p>

              <h3 className="mt-1 text-lg font-semibold tracking-tight">
                Reduce the gap between qualification and first contact.
              </h3>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-300">
                The current pipeline shows the clearest opportunity around
                qualified leads that have not yet entered an active
                conversation.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-foreground transition-colors hover:bg-slate-100"
          >
            Review qualified leads
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
