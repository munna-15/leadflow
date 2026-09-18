"use client";

import {
  ArrowLeft,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteLead,
  type Lead,
  type LeadStatus,
  type LeadTemperature,
} from "@/services/lead.service";

type LeadProfileProps = {
  lead: Lead;
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  qualified: "Qualified",
  contacted: "Contacted",
  meeting: "Meeting",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

const temperatureStyles: Record<LeadTemperature, string> = {
  hot: "bg-orange-50 text-orange-700",
  warm: "bg-amber-50 text-amber-700",
  cold: "bg-slate-100 text-slate-600",
};

const temperatureLabels: Record<LeadTemperature, string> = {
  hot: "Hot lead",
  warm: "Warm lead",
  cold: "Cold lead",
};

const getInitials = (name: string) => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "?";
  }

  const parts = normalizedName.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatStatusDescription = (status: LeadStatus) => {
  switch (status) {
    case "new":
      return "Recently captured opportunity";
    case "qualified":
      return "Ready for sales follow-up";
    case "contacted":
      return "Initial conversation started";
    case "meeting":
      return "Sales meeting in progress";
    case "negotiation":
      return "Deal is being negotiated";
    case "won":
      return "Opportunity converted successfully";
    case "lost":
      return "Opportunity is no longer active";
    default:
      return "Current sales opportunity";
  }
};

const formatSource = (source: string) => {
  if (!source?.trim()) {
    return "Unknown source";
  }

  return source
    .trim()
    .replace(/[\_-]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getScoreInfo = (score: number) => {
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

export default function LeadProfile({ lead }: LeadProfileProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  const initials = getInitials(lead.name);

  const temperatureStyle = temperatureStyles[lead.temperature];

  const temperatureLabel = temperatureLabels[lead.temperature];

  const statusLabel = statusLabels[lead.status];

  const assignedName = lead.assignedTo?.name || "Unassigned";

  const assignedRole =
    lead.assignedTo?.role === "owner"
      ? "Owner"
      : lead.assignedTo?.role === "admin"
        ? "Admin"
        : lead.assignedTo?.role === "sales"
          ? "Sales"
          : null;

  const scoreInfo = getScoreInfo(lead.score);

  const hasEmail = Boolean(lead.email?.trim());
  const hasPhone = Boolean(lead.phone?.trim());

  const openDeleteModal = () => {
    setIsMenuOpen(false);
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeleteError("");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteLead(lead._id);

      router.replace("/dashboard/leads");
    } catch (error) {
      console.error("Failed to delete lead:", error);

      setDeleteError("Unable to delete this lead. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isDeleteModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDeleteModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeleteModalOpen, isDeleting]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleOutsideClick = () => {
      setIsMenuOpen(false);
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <>
      <section>
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-lg font-semibold text-primary">
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {lead.name}
                    </h1>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${temperatureStyle}`}
                    >
                      {temperatureLabel}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted">
                    {formatSource(lead.source)} · {statusLabel}
                  </p>

                  {(hasEmail || hasPhone) && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-body">
                      {hasEmail && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                        >
                          <Mail className="h-4 w-4 text-muted" />

                          <span className="break-all">{lead.email}</span>
                        </a>
                      )}

                      {hasPhone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                        >
                          <Phone className="h-4 w-4 text-muted" />
                          {lead.phone}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="relative shrink-0 self-start"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((current) => !current)}
                  aria-label="Lead actions"
                  aria-expanded={isMenuOpen}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-sm font-semibold text-body transition-colors hover:bg-background hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span>More</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={openDeleteModal}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger/5"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete lead
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-6 py-5 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Lead score
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  {lead.score}
                </span>

                <span
                  className={`mb-1 text-sm font-medium ${scoreInfo.className}`}
                >
                  {scoreInfo.label}
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(Math.max(lead.score, 0), 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="px-6 py-5 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Current status
              </p>

              <p className="mt-2 text-lg font-semibold text-foreground">
                {statusLabel}
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                {formatStatusDescription(lead.status)}
              </p>
            </div>

            <div className="px-6 py-5 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Assigned to
              </p>

              <div className="mt-2 flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background text-xs font-semibold text-foreground">
                  {lead.assignedTo?.avatar ? (
                    <img
                      src={lead.assignedTo.avatar}
                      alt={assignedName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(assignedName)
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {assignedName}
                  </p>

                  <p className="text-xs text-muted">
                    {assignedRole || "No owner assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-5 py-8 backdrop-blur-sm"
          role="presentation"
          onClick={closeDeleteModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-lead-title"
            className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <Trash2 className="h-5 w-5" />
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                aria-label="Close delete confirmation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <h2
                id="delete-lead-title"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Delete this lead?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                You are about to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  {lead.name}
                </span>
                . This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3">
                <p className="text-sm font-medium leading-6 text-danger">
                  {deleteError}
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-body transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete lead
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
