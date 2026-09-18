"use client";

import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { qualifyLeadWithAI, type Lead } from "@/services/lead.service";

type LeadAIInsightProps = {
  lead: Lead;
  onLeadUpdated?: (lead: Lead) => void;
};

type InsightSignal = {
  label: string;
  value: string;
  icon: typeof Target;
};

const temperatureStyles = {
  hot: {
    badge: "bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
  warm: {
    badge: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  cold: {
    badge: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
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

const formatRequirementLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

const formatQualifiedAt = (dateValue: string | null) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function LeadAIInsight({
  lead,
  onLeadUpdated,
}: LeadAIInsightProps) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [isQualifying, setIsQualifying] = useState(false);
  const [qualificationError, setQualificationError] = useState("");

  const requirements = currentLead.requirements || {};

  const requirementEntries = Object.entries(requirements)
    .map(([key, value]) => ({
      key,
      value: formatRequirementValue(value),
    }))
    .filter(
      (
        entry,
      ): entry is {
        key: string;
        value: string;
      } => Boolean(entry.value),
    );

  const scoreInfo = getScoreLabel(currentLead.score);

  const temperatureStyle = temperatureStyles[currentLead.temperature];

  const hasAIInsight = Boolean(
    currentLead.aiSummary?.trim() ||
    currentLead.aiIntent?.trim() ||
    currentLead.aiQualifiedAt,
  );

  const formattedQualifiedAt = formatQualifiedAt(currentLead.aiQualifiedAt);

  const signals: InsightSignal[] = [
    ...(currentLead.aiIntent
      ? [
          {
            label: "Intent",
            value: currentLead.aiIntent,
            icon: Target,
          },
        ]
      : []),
    ...(() => {
      const locationEntry = requirementEntries.find(({ key }) =>
        ["location", "area", "city"].includes(key.toLowerCase()),
      );

      return locationEntry
        ? [
            {
              label: "Location",
              value: locationEntry.value,
              icon: MapPin,
            },
          ]
        : [];
    })(),
    ...(() => {
      const propertyEntry = requirementEntries.find(({ key }) =>
        ["propertytype", "type", "producttype"].includes(key.toLowerCase()),
      );

      return propertyEntry
        ? [
            {
              label: "Type",
              value: propertyEntry.value,
              icon: Target,
            },
          ]
        : [];
    })(),
    ...(() => {
      const timelineEntry = requirementEntries.find(({ key }) =>
        ["timeline", "timeframe"].includes(key.toLowerCase()),
      );

      return timelineEntry
        ? [
            {
              label: "Timeline",
              value: timelineEntry.value,
              icon: Clock3,
            },
          ]
        : [];
    })(),
  ].slice(0, 4);

  const handleQualify = async () => {
    try {
      setIsQualifying(true);
      setQualificationError("");

      const updatedLead = await qualifyLeadWithAI(currentLead._id);

      setCurrentLead(updatedLead);
      onLeadUpdated?.(updatedLead);
    } catch (error) {
      console.error("Failed to qualify lead with AI:", error);

      setQualificationError("AI qualification failed. Please try again.");
    } finally {
      setIsQualifying(false);
    }
  };

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

        <button
          type="button"
          onClick={handleQualify}
          disabled={isQualifying}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isQualifying ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : hasAIInsight ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Re-qualify with AI
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Qualify with AI
            </>
          )}
        </button>
      </div>

      {qualificationError && (
        <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3">
          <p className="text-sm font-medium text-danger">
            {qualificationError}
          </p>
        </div>
      )}

      {isQualifying ? (
        <div className="mt-7 rounded-2xl border border-primary/15 bg-primary-soft/30 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
              <BrainCircuit className="h-5 w-5 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">
                AI is analyzing this lead
              </h3>

              <p className="mt-1 text-sm leading-6 text-body">
                LeadFlow is evaluating the available lead information and
                generating qualification insights.
              </p>
            </div>
          </div>
        </div>
      ) : hasAIInsight ? (
        <>
          <div className="mt-7 rounded-2xl bg-background p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    AI qualification
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${temperatureStyle.badge}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${temperatureStyle.dot}`}
                    />
                    {currentLead.temperature.charAt(0).toUpperCase() +
                      currentLead.temperature.slice(1)}
                  </span>
                </div>

                {currentLead.aiSummary && (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-body sm:text-base">
                    {currentLead.aiSummary}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="rounded-xl bg-surface px-5 py-3 text-center shadow-sm">
                  <p className="text-xs font-medium text-muted">AI score</p>

                  <p className="mt-1 text-3xl font-semibold tracking-tight text-primary">
                    {currentLead.score}
                  </p>

                  <p
                    className={`mt-0.5 text-xs font-semibold ${scoreInfo.className}`}
                  >
                    {scoreInfo.label}
                  </p>
                </div>
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

          {requirementEntries.length > 0 && (
            <div className="mt-5 rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />

                <h3 className="text-sm font-semibold text-foreground">
                  Requirements
                </h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {requirementEntries.map(({ key, value }) => (
                  <div key={key}>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      {formatRequirementLabel(key)}
                    </p>

                    <p className="mt-1.5 break-words text-sm font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-primary/15 bg-primary-soft/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />

                <p className="text-sm font-semibold text-foreground">
                  AI qualification status
                </p>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                {currentLead.aiProvider && (
                  <span>
                    Provider:{" "}
                    <span className="font-semibold text-body">
                      {currentLead.aiProvider}
                    </span>
                  </span>
                )}

                {currentLead.aiModel && (
                  <span>
                    • Model:{" "}
                    <span className="font-semibold text-body">
                      {currentLead.aiModel}
                    </span>
                  </span>
                )}

                {formattedQualifiedAt && (
                  <span>
                    •{" "}
                    <span className="font-semibold text-body">
                      {formattedQualifiedAt}
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" />
              AI available
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
                qualification available yet. Run AI qualification to analyze the
                lead&apos;s intent, requirements, summary, and score.
              </p>
            </div>
          </div>

          {requirementEntries.length > 0 && (
            <div className="mt-5 rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />

                <h3 className="text-sm font-semibold text-foreground">
                  Available lead requirements
                </h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {requirementEntries.map(({ key, value }) => (
                  <div key={key}>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      {formatRequirementLabel(key)}
                    </p>

                    <p className="mt-1.5 break-words text-sm font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
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
                {currentLead.score}
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
