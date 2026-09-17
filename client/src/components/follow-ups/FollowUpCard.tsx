
"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Trash2,
  UsersRound,
} from "lucide-react";

import {
  deleteFollowUp,
  updateFollowUp,
  type FollowUpType,
} from "@/services/followUp.service";

import { useState } from "react";

type FollowUpCardProps = {
  followUpId: string;
  leadId: string;
  name: string;
  initials: string;
  status: string;
  temperature: "Hot" | "Warm" | "Cold";
  score: number;
  reason: string;
  description: string;
  scheduledAt: string;
  timingLabel: string;
  timingType:
    | "overdue"
    | "today"
    | "upcoming";
  phone: string | null;
  email: string | null;
  type: FollowUpType;
  onCompleted?: (
    followUpId: string,
  ) => void;
  onEdit?: (
    followUpId: string,
  ) => void;
  onDeleted?: (
    followUpId: string,
  ) => void;
};

const temperatureStyles = {
  Hot: "bg-orange-50 text-orange-700",
  Warm: "bg-amber-50 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

const timingStyles = {
  overdue:
    "bg-red-50 text-red-600",
  today:
    "bg-primary-soft text-primary",
  upcoming:
    "bg-background text-muted",
};

const getChannelLabel = (
  type: FollowUpType,
) => {
  switch (type) {
    case "call":
      return "Call";

    case "message":
      return "Message";

    case "email":
      return "Email";

    case "meeting":
      return "Meeting";

    default:
      return "Follow-up";
  }
};

const getChannelIcon = (
  type: FollowUpType,
) => {
  switch (type) {
    case "call":
      return Phone;

    case "message":
      return MessageSquare;

    case "email":
      return Mail;

    case "meeting":
      return UsersRound;

    default:
      return CalendarDays;
  }
};

export default function FollowUpCard({
  followUpId,
  leadId,
  name,
  initials,
  status,
  temperature,
  score,
  reason,
  description,
  scheduledAt,
  timingLabel,
  timingType,
  phone,
  email,
  type,
  onCompleted,
  onEdit,
  onDeleted,
}: FollowUpCardProps) {
  const [
    completing,
    setCompleting,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    deleteConfirm,
    setDeleteConfirm,
  ] = useState(false);

  const [
    actionError,
    setActionError,
  ] = useState("");

  const ChannelIcon =
    getChannelIcon(type);

  const channelLabel =
    getChannelLabel(type);

  const handleComplete =
    async () => {
      try {
        setActionError("");
        setCompleting(true);

        await updateFollowUp(
          followUpId,
          {
            status: "completed",
          },
        );

        onCompleted?.(
          followUpId,
        );
      } catch (error) {
        console.error(
          "Failed to complete follow-up:",
          error,
        );

        setActionError(
          "Unable to complete this follow-up.",
        );
      } finally {
        setCompleting(false);
      }
    };

  const handleDelete =
    async () => {
      try {
        setActionError("");
        setDeleting(true);

        await deleteFollowUp(
          followUpId,
        );

        onDeleted?.(
          followUpId,
        );
      } catch (error) {
        console.error(
          "Failed to delete follow-up:",
          error,
        );

        setActionError(
          "Unable to delete this follow-up.",
        );

        setDeleting(false);
      }
    };

  const handleChannelAction =
    () => {
      if (type === "call") {
        if (!phone) {
          return;
        }

        window.location.href =
          `tel:${phone}`;

        return;
      }

      if (type === "email") {
        if (!email) {
          return;
        }

        window.location.href =
          `mailto:${email}`;

        return;
      }

      if (type === "message") {
        if (!phone) {
          return;
        }

        window.location.href =
          `sms:${phone}`;

        return;
      }
    };

  const channelDisabled =
    (type === "call" ||
      type === "message") &&
    !phone;

  const emailDisabled =
    type === "email" &&
    !email;

  const actionDisabled =
    channelDisabled ||
    emailDisabled ||
    type === "meeting" ||
    type === "other";

  return (
    <article className="group rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-semibold text-primary">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/leads/${leadId}`}
                className="text-base font-semibold text-foreground transition-colors hover:text-primary"
              >
                {name}
              </Link>

              {temperature ===
                "Hot" && (
                <Flame className="h-3.5 w-3.5 text-orange-500" />
              )}

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${temperatureStyles[temperature]}`}
              >
                {temperature}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted">
              {status} · Lead score{" "}
              {score}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${timingStyles[timingType]}`}
          >
            {timingLabel}
          </span>
        </div>

        {/* Follow-up insight */}
        <div className="rounded-2xl bg-background p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
              <ChannelIcon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {reason}
                </p>

                <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm">
                  {channelLabel}
                </span>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-body">
                {description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  {scheduledAt}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <ChannelIcon className="h-3.5 w-3.5 shrink-0" />
                  {channelLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {actionError && (
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="font-medium">
              {actionError}
            </p>
          </div>
        )}

        {/* Delete confirmation */}
        {deleteConfirm && (
          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                  <Trash2 className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Delete this follow-up?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600/80">
                    This scheduled conversation
                    will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteConfirm(
                      false,
                    )
                  }
                  disabled={deleting}
                  className="h-9 rounded-xl bg-white px-3.5 text-xs font-semibold text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={deleting}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Deleting
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href={`/dashboard/leads/${leadId}`}
            className="group/link inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted transition-colors hover:bg-background hover:text-primary lg:justify-start"
          >
            View lead

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </Link>

          <div className="flex flex-wrap gap-2">
            {/* Channel */}
            <button
              type="button"
              onClick={
                handleChannelAction
              }
              disabled={
                actionDisabled
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChannelIcon className="h-4 w-4 shrink-0" />

              {channelLabel}
            </button>

            {/* Update */}
            <button
              type="button"
              onClick={() =>
                onEdit?.(
                  followUpId,
                )
              }
              disabled={
                completing ||
                deleting
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil className="h-4 w-4 shrink-0" />

              Update
            </button>

            {/* Complete */}
            <button
              type="button"
              onClick={
                handleComplete
              }
              disabled={
                completing ||
                deleting
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {completing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Completing
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Complete
                </>
              )}
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() =>
                setDeleteConfirm(
                  (current) =>
                    !current,
                )
              }
              disabled={
                completing ||
                deleting
              }
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                deleteConfirm
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-red-100 bg-white text-red-600 hover:border-red-200 hover:bg-red-50"
              }`}
            >
              <Trash2 className="h-4 w-4 shrink-0" />

              Delete
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted">
          <Clock3 className="h-3.5 w-3.5 shrink-0" />

          <span>
            {type ===
            "meeting"
              ? "Prepare for the meeting and complete the follow-up after the conversation."
              : "Complete the follow-up after the conversation is handled."}
          </span>
        </div>
      </div>
    </article>
  );
}

