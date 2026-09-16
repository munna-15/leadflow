
"use client";

import { Plus, SlidersHorizontal } from "lucide-react";

export default function PipelineHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Sales workflow</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Pipeline
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-7 text-muted">
          Move opportunities forward and see where every active lead stands.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Add lead
        </button>
      </div>
    </div>
  );
}

