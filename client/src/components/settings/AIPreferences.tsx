"use client";

import { BrainCircuit, Gauge, Lightbulb, Sparkles, Target } from "lucide-react";

const aiFeatures = [
  {
    label: "Automatic lead qualification",
    description:
      "Analyze captured lead information and generate intent, requirements, and a qualification score.",
    icon: BrainCircuit,
    enabled: true,
  },
  {
    label: "AI lead summary",
    description:
      "Create a concise summary of the lead's needs, context, and buying intent.",
    icon: Sparkles,
    enabled: true,
  },
  {
    label: "Suggested next action",
    description:
      "Recommend a practical next step based on lead activity, stage, and follow-up history.",
    icon: Lightbulb,
    enabled: true,
  },
];

const scoringOptions = [
  {
    value: "balanced",
    label: "Balanced",
    description: "Consider intent, timeline, budget, and engagement together.",
  },
  {
    value: "intent",
    label: "Intent focused",
    description: "Give stronger weight to explicit buying signals and urgency.",
  },
  {
    value: "engagement",
    label: "Engagement focused",
    description: "Give stronger weight to recent conversations and activity.",
  },
];

export default function AIPreferences() {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <BrainCircuit className="h-4.5 w-4.5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-primary">Intelligence</p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              AI preferences
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Control which AI-assisted capabilities LeadFlow uses when
              analyzing and prioritizing your leads.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {aiFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.label}
              className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between sm:px-7"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {feature.label}
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={feature.enabled}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
                  feature.enabled ? "bg-primary" : "bg-slate-200"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    feature.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border px-6 py-6 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Gauge className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Lead scoring behavior
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted">
              Choose how LeadFlow should balance different signals when
              generating a lead score.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {scoringOptions.map((option) => {
            const selected = option.value === "balanced";

            return (
              <button
                key={option.value}
                type="button"
                className={`rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? "border-primary bg-primary-soft/40 shadow-sm"
                    : "border-border bg-surface hover:border-primary/30 hover:bg-background"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {option.label}
                  </span>

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      selected ? "bg-primary" : "bg-border"
                    }`}
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-muted">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border bg-background/60 px-6 py-4 sm:px-7">
        <p className="text-xs leading-5 text-muted">
          AI recommendations are decision-support signals. Your team remains
          responsible for reviewing lead information before taking action.
        </p>
      </div>
    </section>
  );
}
