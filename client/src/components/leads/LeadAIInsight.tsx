"use client";

import {
  BrainCircuit,
  CheckCircle2,
  MapPin,
  Sparkles,
  Target,
} from "lucide-react";

import type { Lead } from "@/services/lead.service";

type LeadAIInsightProps = {
  lead: Lead;
};

type InsightSignal = {
  label: string;
  value: string;
  icon: typeof Target;
};

const formatRequirementValue = (value: unknown) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const getRequirement = (requirements: Lead["requirements"], keys: string[]) => {
  for (const key of keys) {
    const value = requirements?.[key];

    const formatted = formatRequirementValue(value);

    if (formatted) {
      return formatted;
    }
  }

  return null;
};

const getScoreLabel = (score: number) => {
  if (score >= 80) {
    return {
      label: "High intent",
      className: "text-success",
    };
  }

  if (score >= 50) {
    return {
      label: "Moderate intent",
      className: "text-warning",
    };
  }

  return {
    label: "Low intent",
    className: "text-muted",
  };
};

export default function LeadAIInsight({ lead }: LeadAIInsightProps) {
  const requirements = lead.requirements || {};

  const intent = getRequirement(requirements, [
    "intent",
    "leadIntent",
    "purpose",
  ]);

  const location = getRequirement(requirements, ["location", "area", "city"]);

  const propertyType = getRequirement(requirements, ["propertyType", "type"]);

  const timeline = getRequirement(requirements, ["timeline", "timeframe"]);

  const scoreInfo = getScoreLabel(lead.score);

  const signals: InsightSignal[] = [
    ...(intent
      ? [
          {
            label: "Intent",
            value: intent,
            icon: Target,
          },
        ]
      : []),

    ...(location
      ? [
          {
            label: "Location",
            value: location,
            icon: MapPin,
          },
        ]
      : []),

    ...(propertyType
      ? [
          {
            label: "Type",
            value: propertyType,
            icon: Target,
          },
        ]
      : []),

    ...(timeline
      ? [
          {
            label: "Timeline",
            value: timeline,
            icon: Sparkles,
          },
        ]
      : []),
  ].slice(0, 4);

  const hasAIInsight = Boolean(lead.aiSummary?.trim());

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

              {hasAIInsight && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3 w-3" />
                  Qualified
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-muted">
              AI-generated understanding of this lead.
            </p>
          </div>
        </div>

        {hasAIInsight && (
          <div className="flex items-center gap-2 text-sm font-medium text-success">
            <CheckCircle2 className="h-4 w-4" />
            AI available
          </div>
        )}
      </div>

      {hasAIInsight ? (
        <>
          <div className="mt-7 rounded-2xl bg-background p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Lead summary
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-body sm:text-base">
                  {lead.aiSummary}
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-surface px-4 py-3 text-center shadow-sm">
                <p className="text-xs font-medium text-muted">AI score</p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">
                  {lead.score}
                </p>

                <p
                  className={`mt-0.5 text-xs font-semibold ${scoreInfo.className}`}
                >
                  {scoreInfo.label}
                </p>
              </div>
            </div>
          </div>

          {signals.length > 0 && (
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

                    <p className="mt-2 break-words text-sm font-semibold text-foreground">
                      {signal.value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary-soft/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Lead priority
              </p>

              <p className="mt-1 text-sm leading-6 text-body">
                This score is currently stored on the lead and can be updated by
                the qualification workflow.
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-surface px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-medium text-muted">Score</p>

              <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">
                {lead.score}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-7 rounded-2xl border border-dashed border-primary/25 bg-primary-soft/30 p-6 sm:p-7">
            <div className="max-w-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">
                AI qualification has not run yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-body">
                LeadFlow has the lead information, but there is no AI-generated
                summary available yet. Once the AI qualification workflow runs,
                the lead&apos;s intent, requirements, summary, and score can
                appear here.
              </p>
            </div>
          </div>

          {signals.length > 0 && (
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

                    <p className="mt-2 break-words text-sm font-semibold text-foreground">
                      {signal.value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-background p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Current lead score
              </p>

              <p className="mt-1 text-xs text-muted">Stored lead score</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-semibold tracking-tight text-primary">
                {lead.score}
              </p>

              <p className={`text-xs font-semibold ${scoreInfo.className}`}>
                {scoreInfo.label}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
