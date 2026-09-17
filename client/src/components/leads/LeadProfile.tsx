"use client";

import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MoreHorizontal,
  Phone,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

import type {
  Lead,
  LeadStatus,
  LeadTemperature,
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
  const parts = name.trim().split(/\s+/);

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
  if (!source) {
    return "Unknown source";
  }

  return source.charAt(0).toUpperCase() + source.slice(1);
};

export default function LeadProfile({ lead }: LeadProfileProps) {
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

  const hasEmail = Boolean(lead.email);
  const hasPhone = Boolean(lead.phone);

  return (
    <section>
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-6 sm:px-8">
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
                        {lead.email}
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background"
              >
                <CalendarDays className="h-4 w-4" />
                Schedule
              </button>

              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-3 text-muted transition-colors hover:bg-background hover:text-foreground"
                aria-label="More lead actions"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Lead score
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {lead.score}
              </span>

              <span
                className={`mb-1 text-sm font-medium ${
                  lead.score >= 80
                    ? "text-success"
                    : lead.score >= 50
                      ? "text-warning"
                      : "text-muted"
                }`}
              >
                {lead.score >= 80
                  ? "High intent"
                  : lead.score >= 50
                    ? "Moderate intent"
                    : "Low intent"}
              </span>
            </div>
          </div>

          <div className="px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Current status
            </p>

            <p className="mt-2 text-lg font-semibold text-foreground">
              {statusLabel}
            </p>

            <p className="mt-1 text-sm text-muted">
              {formatStatusDescription(lead.status)}
            </p>
          </div>

          <div className="px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Assigned to
            </p>

            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-background text-xs font-semibold text-foreground">
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

              <div>
                <p className="text-sm font-semibold text-foreground">
                  {assignedName}
                </p>

                <p className="text-xs text-muted">
                  {assignedRole || "No owner assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 text-sm text-body">
            <Sparkles className="h-4 w-4 text-primary" />
            AI qualification is available for this lead.
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Run AI qualification
          </button>
        </div>
      </div>
    </section>
  );
}
