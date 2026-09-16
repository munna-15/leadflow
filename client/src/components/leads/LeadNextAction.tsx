
"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Phone,
  Sparkles,
} from "lucide-react";

export default function LeadNextAction() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-primary">Next best action</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Contact Rahim today
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            The lead has a strong purchase intent and the previous follow-up
            is overdue.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-background p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <Clock3 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Follow-up overdue
            </p>

            <p className="mt-1 text-sm leading-6 text-body">
              Reach out to confirm apartment availability and arrange a
              property viewing.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Phone className="h-4 w-4" />
          Call lead
        </button>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background"
        >
          <CalendarDays className="h-4 w-4" />
          Schedule follow-up
        </button>
      </div>

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
    </section>
  );
}

