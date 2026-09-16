
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

export default function LeadProfile() {
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
                RA
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Rahim Ahmed
                  </h1>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                    Hot lead
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted">
                  Qualified through website inquiry
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-body">
                  <a
                    href="mailto:rahim@example.com"
                    className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4 text-muted" />
                    rahim@example.com
                  </a>

                  <a
                    href="tel:+8801700000000"
                    className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 text-muted" />
                    +880 1700-000000
                  </a>
                </div>
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
                92
              </span>
              <span className="mb-1 text-sm font-medium text-success">
                High intent
              </span>
            </div>
          </div>

          <div className="px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Current status
            </p>

            <p className="mt-2 text-lg font-semibold text-foreground">
              Qualified
            </p>

            <p className="mt-1 text-sm text-muted">
              Ready for sales follow-up
            </p>
          </div>

          <div className="px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Assigned to
            </p>

            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-xs font-semibold text-foreground">
                M
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">Munna</p>
                <p className="text-xs text-muted">Owner</p>
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

