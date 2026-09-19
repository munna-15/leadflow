"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  Gauge,
  Lightbulb,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import {
  getSettings,
  updateSettings,
  type AIPreferences as AIPreferencesData,
} from "@/services/settings.service";

type AIPreferenceKey =
  | "automaticQualification"
  | "leadSummary"
  | "suggestedNextAction";

type ScoringMode = AIPreferencesData["scoringMode"];

type AIFeature = {
  key: AIPreferenceKey;
  label: string;
  description: string;
  icon: typeof BrainCircuit;
};

type ScoringOption = {
  value: ScoringMode;
  label: string;
  description: string;
};

const aiFeatures: AIFeature[] = [
  {
    key: "automaticQualification",
    label: "Automatic lead qualification",
    description:
      "Analyze captured lead information and generate intent, requirements, and a qualification score.",
    icon: BrainCircuit,
  },
  {
    key: "leadSummary",
    label: "AI lead summary",
    description:
      "Create a concise summary of the lead's needs, context, and buying intent.",
    icon: Sparkles,
  },
  {
    key: "suggestedNextAction",
    label: "Suggested next action",
    description:
      "Recommend a practical next step based on lead activity, stage, and follow-up history.",
    icon: Lightbulb,
  },
];

const scoringOptions: ScoringOption[] = [
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

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export default function AIPreferences() {
  const [settings, setSettings] = useState<AIPreferencesData | null>(null);

  const [loading, setLoading] = useState(true);

  const [savingKey, setSavingKey] = useState<
    AIPreferenceKey | "scoringMode" | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSettings();

        if (!mounted) {
          return;
        }

        setSettings(data.ai);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setError(getErrorMessage(error));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccess(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success]);

  const handleFeatureToggle = async (key: AIPreferenceKey) => {
    if (!settings || savingKey !== null) {
      return;
    }

    const previousValue = settings[key];
    const nextValue = !previousValue;

    setError(null);
    setSuccess(null);

    setSettings((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: nextValue,
      };
    });

    setSavingKey(key);

    try {
      const updatedSettings = await updateSettings({
        ai: {
          [key]: nextValue,
        },
      });

      setSettings(updatedSettings.ai);
      setSuccess("AI preference updated.");
    } catch (error) {
      setSettings((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          [key]: previousValue,
        };
      });

      setError(getErrorMessage(error));
    } finally {
      setSavingKey(null);
    }
  };

  const handleScoringModeChange = async (value: ScoringMode) => {
    if (!settings || savingKey !== null) {
      return;
    }

    const previousValue = settings.scoringMode;

    if (previousValue === value) {
      return;
    }

    setError(null);
    setSuccess(null);

    setSettings((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        scoringMode: value,
      };
    });

    setSavingKey("scoringMode");

    try {
      const updatedSettings = await updateSettings({
        ai: {
          scoringMode: value,
        },
      });

      setSettings(updatedSettings.ai);
      setSuccess("Lead scoring preference updated.");
    } catch (error) {
      setSettings((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          scoringMode: previousValue,
        };
      });

      setError(getErrorMessage(error));
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <section
      className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
      aria-labelledby="ai-preferences-title"
    >
      {/* Header */}
      <div className="border-b border-border/70 px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <BrainCircuit className="h-4 w-4" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Intelligence
            </p>

            <h2
              id="ai-preferences-title"
              className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              AI preferences
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Control which AI-assisted capabilities LeadFlow uses when
              analyzing and prioritizing your leads.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="min-h-[68px] border-b border-border/70 px-6 py-3 sm:px-7">
        <div className="flex min-h-[42px] items-center">
          {error ? (
            <div
              role="alert"
              className="w-full rounded-xl border border-danger/15 bg-danger/5 px-4 py-2.5 text-sm leading-5 text-danger"
            >
              {error}
            </div>
          ) : success ? (
            <div
              role="status"
              className="flex w-full items-center gap-2 rounded-xl border border-success/15 bg-success/5 px-4 py-2.5 text-sm font-medium leading-5 text-success"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* AI Features */}
      <div className="divide-y divide-border/70">
        {loading ? (
          aiFeatures.map((feature) => (
            <div
              key={feature.key}
              className="flex min-h-[104px] flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-background" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-48 animate-pulse rounded bg-background" />

                  <div className="mt-2 h-3 w-full max-w-xl animate-pulse rounded bg-background" />

                  <div className="mt-1.5 h-3 w-3/4 max-w-md animate-pulse rounded bg-background" />
                </div>
              </div>

              <div className="h-7 w-12 shrink-0 animate-pulse rounded-full bg-background" />
            </div>
          ))
        ) : settings ? (
          aiFeatures.map((feature) => {
            const Icon = feature.icon;
            const enabled = settings[feature.key];
            const saving = savingKey === feature.key;

            return (
              <div
                key={feature.key}
                className="flex min-h-[104px] flex-col gap-5 px-6 py-5 transition-colors duration-200 hover:bg-background/60 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      enabled
                        ? "bg-primary-soft text-primary"
                        : "bg-background text-muted"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {feature.label}
                      </h3>

                      {enabled && (
                        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`${
                    enabled ? "Disable" : "Enable"
                  } ${feature.label}`}
                  disabled={savingKey !== null}
                  onClick={() => handleFeatureToggle(feature.key)}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 outline-none transition-colors duration-200 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                    enabled ? "bg-primary" : "bg-slate-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${
                      enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />

                  {saving && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
                    </span>
                  )}
                </button>
              </div>
            );
          })
        ) : (
          <div className="px-6 py-12 text-center sm:px-7">
            <BrainCircuit
              className="mx-auto h-6 w-6 text-muted"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-semibold text-foreground">
              AI preferences unavailable
            </p>

            <p className="mt-1 text-sm text-muted">
              We could not load your AI preferences.
            </p>
          </div>
        )}
      </div>

      {/* Scoring Mode */}
      <div className="border-t border-border/70 px-6 py-6 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Gauge className="h-4 w-4" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Lead scoring behavior
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
              Choose how LeadFlow should balance different signals when
              generating a lead score.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {loading ? (
            scoringOptions.map((option) => (
              <div
                key={option.value}
                className="min-h-[122px] animate-pulse rounded-2xl border border-border/70 bg-background p-4"
              >
                <div className="h-4 w-24 rounded bg-surface" />

                <div className="mt-3 h-3 w-full rounded bg-surface" />

                <div className="mt-1.5 h-3 w-4/5 rounded bg-surface" />
              </div>
            ))
          ) : settings ? (
            scoringOptions.map((option) => {
              const selected = option.value === settings.scoringMode;

              const saving = savingKey === "scoringMode";

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  disabled={savingKey !== null}
                  onClick={() => handleScoringModeChange(option.value)}
                  className={`group relative min-h-[122px] rounded-2xl border p-4 text-left outline-none transition-all duration-200 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70 ${
                    selected
                      ? "border-primary bg-primary-soft/40 shadow-sm"
                      : "border-border/70 bg-surface hover:border-primary/25 hover:bg-background/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {option.label}
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        selected
                          ? "border-primary bg-primary"
                          : "border-border bg-surface group-hover:border-primary/40"
                      }`}
                    >
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    {option.description}
                  </p>

                  {saving && selected && (
                    <span className="absolute bottom-3 right-3">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-border/70 bg-background px-4 py-8 text-center md:col-span-3">
              <p className="text-sm font-semibold text-foreground">
                Scoring preferences unavailable
              </p>

              <p className="mt-1 text-sm text-muted">
                Lead scoring options could not be loaded.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/70 bg-background/50 px-6 py-4 sm:px-7">
        <p className="text-xs leading-5 text-muted">
          AI recommendations are decision-support signals. Your team remains
          responsible for reviewing lead information before taking action.
        </p>
      </div>
    </section>
  );
}
