"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";

import type { Lead } from "@/services/lead.service";

import {
  completeFollowUp,
  createFollowUp,
  getFollowUps,
  updateFollowUp,
  type FollowUp,
  type FollowUpType,
} from "@/services/followUp.service";

import {
  suggestLeadNextAction,
  type AINextActionRecommendation,
} from "@/services/aiNextAction.service";

type LeadNextActionProps = {
  lead: Lead;
};

type FollowUpInfo = {
  label: string;
  description: string;
  overdue: boolean;
};

const followUpTypes: {
  value: FollowUpType;
  label: string;
}[] = [
  {
    value: "call",
    label: "Call",
  },
  {
    value: "message",
    label: "Message",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "meeting",
    label: "Meeting",
  },
  {
    value: "other",
    label: "Other",
  },
];

const formatDateForInput = (dateValue: Date) => {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTimeForInput = (dateValue: Date) => {
  const hours = String(dateValue.getHours()).padStart(2, "0");
  const minutes = String(dateValue.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const getDefaultFollowUpDateTime = () => {
  const date = new Date();

  date.setMinutes(date.getMinutes() + 60);

  return {
    date: formatDateForInput(date),
    time: formatTimeForInput(date),
  };
};

const getFollowUpInputValues = (followUp: FollowUp | null) => {
  if (!followUp) {
    return getDefaultFollowUpDateTime();
  }

  const date = new Date(followUp.scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return getDefaultFollowUpDateTime();
  }

  return {
    date: formatDateForInput(date),
    time: formatTimeForInput(date),
  };
};

const formatFollowUp = (nextFollowUpAt: string | null): FollowUpInfo | null => {
  if (!nextFollowUpAt) {
    return null;
  }

  const date = new Date(nextFollowUpAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();

  if (date <= now) {
    return {
      label: "Follow-up overdue",
      description: "This lead was scheduled for follow-up and needs attention.",
      overdue: true,
    };
  }

  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) {
    return {
      label: "Follow-up today",
      description: `Scheduled for ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}.`,
      overdue: false,
    };
  }

  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();

  if (isTomorrow) {
    return {
      label: "Follow-up tomorrow",
      description: `Scheduled for ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}.`,
      overdue: false,
    };
  }

  return {
    label: "Follow-up scheduled",
    description: `Scheduled for ${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}.`,
    overdue: false,
  };
};

const getActionTitle = (lead: Lead) => {
  if (lead.nextFollowUpAt) {
    const followUp = formatFollowUp(lead.nextFollowUpAt);

    if (followUp?.overdue) {
      return `Follow up with ${lead.name}`;
    }

    return `Prepare for ${lead.name}'s follow-up`;
  }

  if (lead.temperature === "hot") {
    return `Contact ${lead.name} soon`;
  }

  if (lead.status === "new") {
    return `Review ${lead.name}'s lead`;
  }

  if (lead.status === "qualified") {
    return `Follow up with ${lead.name}`;
  }

  return `Continue working with ${lead.name}`;
};

const getActionDescription = (lead: Lead) => {
  const followUp = formatFollowUp(lead.nextFollowUpAt);

  if (followUp?.overdue) {
    return "The scheduled follow-up has passed. This lead needs attention.";
  }

  if (followUp) {
    return followUp.description;
  }

  if (lead.temperature === "hot") {
    return "This lead has a high priority score and should receive timely attention.";
  }

  if (lead.status === "new") {
    return "Review the available lead information and decide on the next sales step.";
  }

  if (lead.status === "qualified") {
    return "This lead is qualified and ready for a sales follow-up.";
  }

  return "No follow-up is currently scheduled for this lead.";
};

const actionLabels: Record<AINextActionRecommendation["action"], string> = {
  call: "Call the lead",
  message: "Message the lead",
  email: "Email the lead",
  schedule_follow_up: "Schedule a follow-up",
  review_lead: "Review the lead",
  wait: "No immediate action",
};

const timingLabels: Record<AINextActionRecommendation["timing"], string> = {
  now: "Now",
  today: "Today",
  tomorrow: "Tomorrow",
  this_week: "This week",
  scheduled: "Already scheduled",
  no_action: "No immediate action",
};

const priorityStyles: Record<AINextActionRecommendation["priority"], string> = {
  high: "bg-orange-50 text-orange-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const getRecommendationIcon = (
  action: AINextActionRecommendation["action"],
) => {
  switch (action) {
    case "call":
      return Phone;

    case "message":
      return MessageSquareText;

    case "email":
      return Mail;

    case "schedule_follow_up":
      return CalendarDays;

    case "review_lead":
      return Target;

    case "wait":
    default:
      return Clock3;
  }
};

const formatGeneratedAt = (generatedAt: string) => {
  const date = new Date(generatedAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function LeadNextAction({ lead }: LeadNextActionProps) {
  const [currentLead, setCurrentLead] = useState(lead);

  const [scheduledFollowUp, setScheduledFollowUp] = useState<FollowUp | null>(
    null,
  );

  const [aiRecommendation, setAiRecommendation] =
    useState<AINextActionRecommendation | null>(null);

  const [isGettingAIRecommendation, setIsGettingAIRecommendation] =
    useState(false);

  const [aiRecommendationError, setAiRecommendationError] = useState("");

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [followUpDate, setFollowUpDate] = useState("");

  const [followUpTime, setFollowUpTime] = useState("");

  const [followUpType, setFollowUpType] = useState<FollowUpType>("call");

  const [followUpNotes, setFollowUpNotes] = useState("");

  const [isScheduling, setIsScheduling] = useState(false);

  const [isCompleting, setIsCompleting] = useState(false);

  const [actionError, setActionError] = useState("");

  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    setCurrentLead(lead);
    setAiRecommendation(null);
    setAiRecommendationError("");
  }, [lead]);

  const followUp = formatFollowUp(currentLead.nextFollowUpAt);

  const hasPhone = Boolean(currentLead.phone?.trim());

  const hasEmail = Boolean(currentLead.email?.trim());

  const actionTitle = getActionTitle(currentLead);

  const actionDescription = getActionDescription(currentLead);

  const canCall = hasPhone;

  const loadScheduledFollowUp = async () => {
    try {
      const followUps = await getFollowUps({
        lead: currentLead._id,
        status: "scheduled",
      });

      const activeFollowUps = followUps
        .filter((item) => item.status === "scheduled")
        .filter((item) => !Number.isNaN(new Date(item.scheduledAt).getTime()))
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime(),
        );

      const nextFollowUp = activeFollowUps[0] || null;

      setScheduledFollowUp(nextFollowUp);

      setCurrentLead((previousLead) => ({
        ...previousLead,
        nextFollowUpAt: nextFollowUp?.scheduledAt || null,
      }));

      return nextFollowUp;
    } catch (error) {
      console.error("Failed to load scheduled follow-up:", error);

      return null;
    }
  };

  const handleGetAIRecommendation = async () => {
    try {
      setIsGettingAIRecommendation(true);
      setAiRecommendationError("");

      const recommendation = await suggestLeadNextAction(currentLead._id);

      setAiRecommendation(recommendation);
    } catch (error) {
      console.error("Failed to generate AI next-action recommendation:", error);

      setAiRecommendationError(
        "AI recommendation could not be generated right now. Please try again later.",
      );
    } finally {
      setIsGettingAIRecommendation(false);
    }
  };

  const openSchedule = async () => {
    setActionError("");
    setActionSuccess("");

    const existingFollowUp = await loadScheduledFollowUp();

    const inputValues = getFollowUpInputValues(existingFollowUp);

    setFollowUpDate(inputValues.date);

    setFollowUpTime(inputValues.time);

    setFollowUpType(existingFollowUp?.type || "call");

    setFollowUpNotes(existingFollowUp?.notes || "");

    setIsScheduleOpen(true);
  };

  const closeSchedule = () => {
    if (isScheduling) {
      return;
    }

    setIsScheduleOpen(false);
    setActionError("");
  };

  const handleSchedule = async () => {
    if (!followUpDate || !followUpTime) {
      setActionError("Please select a follow-up date and time.");

      return;
    }

    const scheduledAt = new Date(`${followUpDate}T${followUpTime}`);

    if (Number.isNaN(scheduledAt.getTime())) {
      setActionError("Please enter a valid follow-up date and time.");

      return;
    }

    if (scheduledAt.getTime() <= Date.now()) {
      setActionError("Follow-up time must be in the future.");

      return;
    }

    try {
      setIsScheduling(true);
      setActionError("");
      setActionSuccess("");

      const payload = {
        type: followUpType,
        scheduledAt: scheduledAt.toISOString(),
        notes: followUpNotes.trim() || null,
      };

      if (scheduledFollowUp) {
        await updateFollowUp(scheduledFollowUp._id, payload);
      } else {
        await createFollowUp({
          lead: currentLead._id,
          ...payload,
        });
      }

      const refreshedFollowUp = await loadScheduledFollowUp();

      setScheduledFollowUp(refreshedFollowUp);

      setIsScheduleOpen(false);

      setActionSuccess(
        scheduledFollowUp
          ? "Follow-up rescheduled successfully."
          : "Follow-up scheduled successfully.",
      );

      setAiRecommendation(null);
      setAiRecommendationError("");
    } catch (error) {
      console.error("Failed to save follow-up:", error);

      setActionError(
        scheduledFollowUp
          ? "Unable to reschedule the follow-up. Please try again."
          : "Unable to schedule the follow-up. Please try again.",
      );
    } finally {
      setIsScheduling(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      setActionError("");
      setActionSuccess("");

      const followUps = await getFollowUps({
        lead: currentLead._id,
        status: "scheduled",
      });

      const overdueFollowUps = followUps
        .filter(
          (item) =>
            item.status === "scheduled" &&
            new Date(item.scheduledAt).getTime() <= Date.now(),
        )
        .sort(
          (a, b) =>
            new Date(b.scheduledAt).getTime() -
            new Date(a.scheduledAt).getTime(),
        );

      const targetFollowUp = overdueFollowUps[0];

      if (!targetFollowUp) {
        setActionError("No overdue follow-up was found.");

        return;
      }

      await completeFollowUp(targetFollowUp._id);

      await loadScheduledFollowUp();

      setScheduledFollowUp(null);

      setActionSuccess("Follow-up marked as complete.");

      setAiRecommendation(null);
      setAiRecommendationError("");
    } catch (error) {
      console.error("Failed to complete follow-up:", error);

      setActionError("Unable to complete the follow-up. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const RecommendationIcon = aiRecommendation
    ? getRecommendationIcon(aiRecommendation.action)
    : Sparkles;

  const generatedTime = aiRecommendation
    ? formatGeneratedAt(aiRecommendation.generatedAt)
    : null;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-primary">
              Next best action
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {actionTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              {actionDescription}
            </p>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-primary/15 bg-primary-soft/30">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-primary shadow-sm">
                    <Zap className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      AI Reply Center
                    </p>

                    <p className="text-xs text-muted">Sales decision support</p>
                  </div>
                </div>

                {aiRecommendation ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
                        <RecommendationIcon className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {actionLabels[aiRecommendation.action]}
                        </p>

                        <p className="mt-0.5 text-xs text-muted">
                          AI recommended action
                        </p>
                      </div>

                      <span
                        className={`ml-0 sm:ml-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[aiRecommendation.priority]
                        }`}
                      >
                        {aiRecommendation.priority.charAt(0).toUpperCase() +
                          aiRecommendation.priority.slice(1)}{" "}
                        priority
                      </span>
                    </div>

                    <div className="mt-4 rounded-2xl bg-surface p-4 shadow-sm">
                      <p className="text-sm leading-6 text-body">
                        {aiRecommendation.message}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-surface px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                          Timing
                        </p>

                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {timingLabels[aiRecommendation.timing]}
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                          Confidence
                        </p>

                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {aiRecommendation.confidence}%
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                          Generated
                        </p>

                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {generatedTime || "Just now"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-border/80 bg-surface px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />

                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                          Why this action
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-body">
                        {aiRecommendation.reason}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-muted">
                        Powered by{" "}
                        <span className="font-medium text-body">
                          {aiRecommendation.provider}
                        </span>{" "}
                        ·{" "}
                        <span className="font-medium text-body">
                          {aiRecommendation.model}
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={handleGetAIRecommendation}
                        disabled={isGettingAIRecommendation}
                        className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isGettingAIRecommendation ? (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}

                        {isGettingAIRecommendation
                          ? "Analyzing..."
                          : "Refresh recommendation"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <p className="max-w-2xl text-sm leading-6 text-body">
                      Let AI review this lead's qualification, requirements,
                      follow-up history, and recent activity to suggest the next
                      sales action.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-body shadow-sm">
                        Lead intelligence
                      </span>

                      <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-body shadow-sm">
                        Follow-up context
                      </span>

                      <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-body shadow-sm">
                        Activity history
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGetAIRecommendation}
                      disabled={isGettingAIRecommendation}
                      className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGettingAIRecommendation ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Analyzing lead...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Get AI recommendation
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {aiRecommendationError && (
              <div className="relative mt-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3">
                <p className="text-sm font-medium leading-6 text-danger">
                  {aiRecommendationError}
                </p>
              </div>
            )}
          </div>
        </div>

        {followUp ? (
          <div
            className={`mt-6 rounded-2xl p-5 ${
              followUp.overdue ? "bg-orange-50" : "bg-background"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  followUp.overdue
                    ? "bg-white text-orange-600"
                    : "bg-primary-soft text-primary"
                }`}
              >
                <Clock3 className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {followUp.label}
                </p>

                <p className="mt-1 text-sm leading-6 text-body">
                  {followUp.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-muted">
                <Clock3 className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  No follow-up scheduled
                </p>

                <p className="mt-1 text-sm leading-6 text-muted">
                  Set a follow-up time so this opportunity does not get lost.
                </p>
              </div>
            </div>
          </div>
        )}

        {actionError && (
          <div className="mt-4 rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3">
            <p className="text-sm font-medium text-danger">{actionError}</p>
          </div>
        )}

        {actionSuccess && (
          <div className="mt-4 rounded-2xl border border-success/20 bg-success/5 px-4 py-3">
            <p className="text-sm font-medium text-success">{actionSuccess}</p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={canCall ? `tel:${currentLead.phone}` : undefined}
            aria-disabled={!canCall}
            onClick={(event) => {
              if (!canCall) {
                event.preventDefault();
              }
            }}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors sm:min-w-[132px] ${
              canCall
                ? "bg-primary text-white hover:bg-primary-dark"
                : "cursor-not-allowed border border-border bg-background text-muted"
            }`}
          >
            <Phone className="h-4 w-4" />
            {canCall ? "Call lead" : "No phone number"}
          </a>

          {hasEmail && (
            <a
              href={`mailto:${currentLead.email}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background sm:min-w-[132px]"
            >
              <Mail className="h-4 w-4" />
              Email lead
            </a>
          )}

          <button
            type="button"
            onClick={openSchedule}
            disabled={isScheduling}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[180px]"
          >
            <CalendarDays className="h-4 w-4" />
            {followUp ? "Reschedule" : "Schedule follow-up"}
          </button>
        </div>

        {isScheduleOpen && (
          <div className="mt-4 rounded-2xl border border-primary/15 bg-primary-soft/30 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {scheduledFollowUp
                    ? "Reschedule follow-up"
                    : "Schedule follow-up"}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Choose the next follow-up time and communication method.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="follow-up-date"
                  className="text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Date
                </label>

                <input
                  id="follow-up-date"
                  type="date"
                  value={followUpDate}
                  min={formatDateForInput(new Date())}
                  onChange={(event) => setFollowUpDate(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="follow-up-time"
                  className="text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Time
                </label>

                <input
                  id="follow-up-time"
                  type="time"
                  value={followUpTime}
                  onChange={(event) => setFollowUpTime(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="follow-up-type"
                className="text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Follow-up type
              </label>

              <select
                id="follow-up-type"
                value={followUpType}
                onChange={(event) =>
                  setFollowUpType(event.target.value as FollowUpType)
                }
                className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {followUpTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label
                htmlFor="follow-up-notes"
                className="text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Notes
              </label>

              <textarea
                id="follow-up-notes"
                value={followUpNotes}
                onChange={(event) => setFollowUpNotes(event.target.value)}
                rows={3}
                placeholder="Add a short note for the follow-up..."
                className="mt-2 w-full resize-none rounded-xl border border-border bg-surface px-3 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeSchedule}
                disabled={isScheduling}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSchedule}
                disabled={isScheduling}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isScheduling ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CalendarDays className="h-4 w-4" />
                    {scheduledFollowUp ? "Save changes" : "Confirm follow-up"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {followUp?.overdue && (
          <div className="mt-5 border-t border-border pt-5">
            <button
              type="button"
              onClick={handleComplete}
              disabled={isCompleting}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCompleting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              {isCompleting ? "Completing..." : "Mark follow-up complete"}

              {!isCompleting && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
