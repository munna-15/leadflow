"use client";

import {
  ArrowUpRight,
  Clock3,
  Flame,
  MessageCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const leads = [
  {
    name: "Rahim Ahmed",
    description: "3 bedroom apartment · Bashundhara",
    source: "Website",
    status: "Qualified",
    temperature: "Hot",
    score: 92,
    followUp: "Overdue",
    icon: Flame,
  },
  {
    name: "Karim Hasan",
    description: "Apartment inquiry · Gulshan",
    source: "Facebook",
    status: "Contacted",
    temperature: "Hot",
    score: 84,
    followUp: "Tomorrow",
    icon: MessageCircle,
  },
  {
    name: "Nadia Rahman",
    description: "Family apartment · Uttara",
    source: "Website",
    status: "Meeting",
    temperature: "Warm",
    score: 78,
    followUp: "Sep 17",
    icon: Clock3,
  },
  {
    name: "Tanvir Hossain",
    description: "2 bedroom apartment · Mirpur",
    source: "Referral",
    status: "New",
    temperature: "Warm",
    score: 71,
    followUp: "Sep 18",
    icon: MessageCircle,
  },
];

const temperatureStyles = {
  Hot: "bg-orange-50 text-orange-700",
  Warm: "bg-amber-50 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

export default function LeadList() {
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

        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

            <input
              type="search"
              placeholder="Search leads..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-background hover:text-foreground"
            aria-label="Filter leads"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {leads.map((lead) => {
          const Icon = lead.icon;

          return (
            <div
              key={lead.name}
              className="group p-5 transition-colors hover:bg-background sm:p-6"
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
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${temperatureStyles[lead.temperature as keyof typeof temperatureStyles]}`}
                      >
                        {lead.temperature}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-body">{lead.description}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
                      <span>{lead.source}</span>
                      <span>•</span>
                      <span>{lead.status}</span>
                      <span>•</span>
                      <span>{lead.followUp}</span>
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

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-all group-hover:border-primary group-hover:text-primary"
                    aria-label={`Open ${lead.name}`}
                  >
                    <ArrowUpRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
