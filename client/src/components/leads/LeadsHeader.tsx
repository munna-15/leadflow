"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";

export default function LeadsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Lead management</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Leads
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-7 text-muted">
          Capture, qualify, and follow up with every opportunity from one place.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
      >
        <Plus className="h-4.5 w-4.5" />
        Add lead
      </button>
    </div>
  );
}
