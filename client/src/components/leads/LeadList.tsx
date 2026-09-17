"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Flame,
  MessageCircle,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Lead } from "@/services/lead.service";

type LeadListProps = {
  leads: Lead[];
  loading: boolean;
  error: string;
};

type TemperatureFilter = "all" | "hot" | "warm" | "cold";

const temperatureStyles = {
  hot: "bg-orange-50 text-orange-700",
  warm: "bg-amber-50 text-amber-700",
  cold: "bg-slate-100 text-slate-600",
};

const statusLabels = {
  new: "New",
  qualified: "Qualified",
  contacted: "Contacted",
  meeting: "Meeting",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

const formatFollowUp = (nextFollowUpAt: string | null) => {
  if (!nextFollowUpAt) {
    return "No follow-up";
  }

  const date = new Date(nextFollowUpAt);

  if (Number.isNaN(date.getTime())) {
    return "No follow-up";
  }

  const now = new Date();

  if (date <= now) {
    return "Overdue";
  }

  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) {
    return `Today · ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();

  if (isTomorrow) {
    return `Tomorrow · ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const getLeadIcon = (lead: Lead) => {
  if (lead.temperature === "hot") {
    return Flame;
  }

  if (lead.nextFollowUpAt) {
    return Clock3;
  }

  return MessageCircle;
};

const getLeadDescription = (lead: Lead) => {
  if (lead.aiSummary) {
    return lead.aiSummary;
  }

  const requirementEntries = Object.entries(lead.requirements || {}).filter(
    ([, value]) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );

  if (requirementEntries.length > 0) {
    return requirementEntries
      .slice(0, 2)
      .map(([, value]) => String(value))
      .join(" · ");
  }

  return "No additional lead information available";
};

export default function LeadList({ leads, loading, error }: LeadListProps) {
  const [search, setSearch] = useState("");
  const [temperatureFilter, setTemperatureFilter] =
    useState<TemperatureFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        lead.name.toLowerCase().includes(normalizedSearch) ||
        lead.email?.toLowerCase().includes(normalizedSearch) ||
        lead.phone?.toLowerCase().includes(normalizedSearch) ||
        lead.source.toLowerCase().includes(normalizedSearch);

      const matchesTemperature =
        temperatureFilter === "all" || lead.temperature === temperatureFilter;

      return matchesSearch && matchesTemperature;
    });
  }, [leads, search, temperatureFilter]);

  const hasActiveFilters =
    search.trim().length > 0 || temperatureFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTemperatureFilter("all");
  };

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            All leads
          </h2>

          <p className="mt-1 text-sm text-muted">
            Your current sales opportunities.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search leads..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-9 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-soft hover:text-primary"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
              showFilters || temperatureFilter !== "all"
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-surface text-muted hover:bg-background hover:text-foreground"
            }`}
            aria-label="Filter leads"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-col gap-3 border-b border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Temperature
            </span>

            {(
              [
                ["all", "All"],
                ["hot", "Hot"],
                ["warm", "Warm"],
                ["cold", "Cold"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTemperatureFilter(value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  temperatureFilter === value
                    ? "bg-primary text-white"
                    : "bg-surface text-muted hover:bg-primary-soft hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-left text-xs font-semibold text-primary hover:text-primary-dark sm:ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="divide-y divide-border">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-background" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-36 rounded bg-background" />

                  <div className="mt-2 h-3 w-64 max-w-full rounded bg-background" />

                  <div className="mt-2 h-3 w-48 rounded bg-background" />
                </div>

                <div className="hidden h-10 w-12 rounded bg-background sm:block" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <X className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            Unable to load leads
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted">
            {error}
          </p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            {hasActiveFilters ? (
              <Search className="h-5 w-5" />
            ) : (
              <UserRound className="h-5 w-5" />
            )}
          </div>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            {hasActiveFilters ? "No leads match your filters" : "No leads yet"}
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted">
            {hasActiveFilters
              ? "Try a different search term or clear your filters."
              : "Your captured leads will appear here once they are added to LeadFlow."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredLeads.map((lead) => {
            const Icon = getLeadIcon(lead);

            const temperatureStyle = temperatureStyles[lead.temperature];

            const followUp = formatFollowUp(lead.nextFollowUpAt);

            return (
              <Link
                key={lead._id}
                href={`/dashboard/leads/${lead._id}`}
                className="group block p-5 transition-colors hover:bg-background sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {lead.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${temperatureStyle}`}
                        >
                          {lead.temperature.charAt(0).toUpperCase() +
                            lead.temperature.slice(1)}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-1 text-sm text-body">
                        {getLeadDescription(lead)}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
                        <span>{lead.source}</span>

                        <span>•</span>

                        <span>{statusLabels[lead.status]}</span>

                        <span>•</span>

                        <span
                          className={
                            followUp === "Overdue"
                              ? "font-semibold text-danger"
                              : ""
                          }
                        >
                          {followUp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 lg:justify-end">
                    <div>
                      <p className="text-xs font-medium text-muted">Score</p>

                      <p className="mt-1 text-xl font-semibold text-foreground">
                        {lead.score}
                      </p>
                    </div>

                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-all group-hover:border-primary group-hover:text-primary"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && !error && leads.length > 0 && (
        <div className="border-t border-border px-5 py-4 sm:px-6">
          <p className="text-xs font-medium text-muted">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredLeads.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {leads.length}
            </span>{" "}
            leads
          </p>
        </div>
      )}
    </section>
  );
}
