
"use client";

import { Plus } from "lucide-react";

export default function LeadsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-primary">
          Lead management
        </p>

        <h1 className="mt-2 bg-gradient-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
          Leads
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Capture, qualify, and follow up with every opportunity from one
          place.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
      >
        <Plus className="h-4.5 w-4.5" />
        Add lead
      </button>
    </div>
  );
}

