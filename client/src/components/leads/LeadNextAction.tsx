"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Phone,
  Sparkles,
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

export default function LeadNextAction({ lead }: LeadNextActionProps) {
  const [currentLead, setCurrentLead] = useState(lead);

  const [scheduledFollowUp, setScheduledFollowUp] = useState<FollowUp | null>(
    null,
  );

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
  }, [lead]);

  const followUp = formatFollowUp(currentLead.nextFollowUpAt);

  const hasPhone = Boolean(currentLead.phone?.trim());

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
    } catch (error) {
      console.error("Failed to complete follow-up:", error);

      setActionError("Unable to complete the follow-up. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Next best action</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {actionTitle}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            {actionDescription}
          </p>
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
    </section>
  );
}
