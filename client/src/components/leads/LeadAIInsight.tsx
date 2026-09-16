
import {
  BrainCircuit,
  CheckCircle2,
  MapPin,
  Sparkles,
  Target,
} from "lucide-react";

const signals = [
  {
    label: "Intent",
    value: "Property purchase",
    icon: Target,
  },
  {
    label: "Location",
    value: "Bashundhara",
    icon: MapPin,
  },
];

export default function LeadAIInsight() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                AI insight
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                Qualified
              </span>
            </div>

            <p className="mt-1 text-sm text-muted">
              AI-generated understanding of this lead.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-success">
          <CheckCircle2 className="h-4 w-4" />
          High confidence
        </div>
      </div>

      <div className="mt-7 rounded-2xl bg-background p-5 sm:p-6">
        <p className="text-sm font-semibold text-foreground">
          High-intent buyer
        </p>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-body sm:text-base">
          Rahim is actively looking for a 3-bedroom apartment in Bashundhara
          with a budget of around ৳1 crore. His stated timeline is next month,
          indicating a strong purchase intent and a relatively short decision
          window.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {signals.map((signal) => {
          const Icon = signal.icon;

          return (
            <div
              key={signal.label}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-2 text-muted">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {signal.label}
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold text-foreground">
                {signal.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary-soft/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Why this lead matters
          </p>

          <p className="mt-1 text-sm leading-6 text-body">
            Clear requirements, defined budget, and a near-term timeline make
            this lead worth immediate follow-up.
          </p>
        </div>

        <div className="shrink-0 rounded-xl bg-surface px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-medium text-muted">AI score</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">
            92
          </p>
        </div>
      </div>
    </section>
  );
}

