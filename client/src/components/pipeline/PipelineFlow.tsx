
"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Flame,
} from "lucide-react";
import Link from "next/link";

const stages = [
  {
    id: "new",
    label: "New",
    description: "Fresh opportunities",
    count: 12,
    leads: [
      {
        name: "Tanvir Hossain",
        detail: "2 bedroom apartment · Mirpur",
        score: 71,
        temperature: "Warm",
      },
      {
        name: "Sadia Karim",
        detail: "Office space · Banani",
        score: 64,
        temperature: "Warm",
      },
    ],
  },
  {
    id: "qualified",
    label: "Qualified",
    description: "Ready for contact",
    count: 8,
    leads: [
      {
        name: "Rahim Ahmed",
        detail: "3 bedroom apartment · Bashundhara",
        score: 92,
        temperature: "Hot",
      },
      {
        name: "Nadia Rahman",
        detail: "Family apartment · Uttara",
        score: 78,
        temperature: "Warm",
      },
    ],
  },
  {
    id: "contacted",
    label: "Contacted",
    description: "In active conversation",
    count: 6,
    leads: [
      {
        name: "Karim Hasan",
        detail: "Apartment inquiry · Gulshan",
        score: 84,
        temperature: "Hot",
      },
      {
        name: "Imran Chowdhury",
        detail: "Commercial property · Motijheel",
        score: 69,
        temperature: "Warm",
      },
    ],
  },
  {
    id: "meeting",
    label: "Meeting",
    description: "Appointments in progress",
    count: 4,
    leads: [
      {
        name: "Farhan Ahmed",
        detail: "Apartment viewing · Dhanmondi",
        score: 88,
        temperature: "Hot",
      },
      {
        name: "Maya Islam",
        detail: "Family home · Uttara",
        score: 76,
        temperature: "Warm",
      },
    ],
  },
  {
    id: "negotiation",
    label: "Negotiation",
    description: "Decision stage",
    count: 2,
    leads: [
      {
        name: "Arif Rahman",
        detail: "Premium apartment · Gulshan",
        score: 95,
        temperature: "Hot",
      },
      {
        name: "Nusrat Jahan",
        detail: "Commercial unit · Banani",
        score: 82,
        temperature: "Hot",
      },
    ],
  },
];

const temperatureStyles = {
  Hot: "bg-orange-50 text-orange-700",
  Warm: "bg-amber-50 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

export default function PipelineFlow() {
  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Sales flow</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Move opportunities forward
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Review active leads by stage and identify where conversations need
            momentum.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted">
          <CircleDot className="h-3.5 w-3.5 text-primary" />
          {stages.reduce((total, stage) => total + stage.count, 0)} pipeline
          opportunities
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-4">
        <div className="flex min-w-280 items-stretch gap-3">
          {stages.map((stage, stageIndex) => {
            const isLast = stageIndex === stages.length - 1;

            return (
              <div key={stage.id} className="flex min-w-0 flex-1">
                <div className="flex min-w-0 flex-1 flex-col rounded-3xl border border-border bg-surface shadow-sm">
                  <div className="border-b border-border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
                            {stageIndex + 1}
                          </span>

                          <h3 className="text-sm font-semibold text-foreground">
                            {stage.label}
                          </h3>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-muted">
                          {stage.description}
                        </p>
                      </div>

                      <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-foreground">
                        {stage.count}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-3">
                    {stage.leads.map((lead) => (
                      <Link
                        key={lead.name}
                        href={`/dashboard/leads/${lead.name
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                        className="group rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-soft/20 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="truncate text-sm font-semibold text-foreground">
                                {lead.name}
                              </h4>

                              {lead.temperature === "Hot" && (
                                <Flame className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                              )}
                            </div>

                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">
                              {lead.detail}
                            </p>
                          </div>

                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${temperatureStyles[lead.temperature as keyof typeof temperatureStyles]}`}
                          >
                            {lead.temperature}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-muted">
                              Score
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                              {lead.score}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}

                    <button
                      type="button"
                      className="mt-auto flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-dashed border-border px-4 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:bg-primary-soft/20 hover:text-primary"
                    >
                      View {stage.count - stage.leads.length} more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex w-8 shrink-0 items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary-soft/40 px-4 py-3 text-sm text-body">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
        Leads move through the pipeline as conversations, meetings, and
        decisions progress.
      </div>
    </section>
  );
}

