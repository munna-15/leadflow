"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Phone,
  Sparkles,
} from "lucide-react";

import type { Lead } from "@/services/lead.service";

type LeadNextActionProps = {
  lead: Lead;
};

const formatFollowUp = (nextFollowUpAt: string | null) => {
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
  const followUp = formatFollowUp(lead.nextFollowUpAt);

  const hasPhone = Boolean(lead.phone);

  const actionTitle = getActionTitle(lead);

  const actionDescription = getActionDescription(lead);

  const canCall = hasPhone;

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
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
        <div className="mt-6 rounded-2xl bg-background p-5">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                followUp.overdue
                  ? "bg-orange-50 text-orange-600"
                  : "bg-primary-soft text-primary"
              }`}
            >
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={canCall ? `tel:${lead.phone}` : undefined}
          aria-disabled={!canCall}
          onClick={(event) => {
            if (!canCall) {
              event.preventDefault();
            }
          }}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${
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
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background"
        >
          <CalendarDays className="h-4 w-4" />
          Schedule follow-up
        </button>
      </div>

      {followUp?.overdue && (
        <div className="mt-5 border-t border-border pt-5">
          <button
            type="button"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark follow-up complete
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </section>
  );
}
