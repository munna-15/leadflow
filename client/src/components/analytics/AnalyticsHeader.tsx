
"use client";

import {
  CalendarRange,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import type { AnalyticsRange } from "@/services/analytics.service";

interface AnalyticsHeaderProps {
  range: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
}

const rangeOptions: {
  value: AnalyticsRange;
  label: string;
}[] = [
  {
    value: "7d",
    label: "Last 7 days",
  },
  {
    value: "30d",
    label: "Last 30 days",
  },
  {
    value: "90d",
    label: "Last 90 days",
  },
];

export default function AnalyticsHeader({
  range,
  onRangeChange,
}: AnalyticsHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedRange =
    rangeOptions.find((option) => option.value === range) ??
    rangeOptions[1];

  const handleRangeChange = (nextRange: AnalyticsRange) => {
    if (nextRange === range) {
      setIsOpen(false);
      return;
    }

    onRangeChange(nextRange);
    setIsOpen(false);
  };

  return (
    <header className="relative overflow-visible border-b border-border/70 pb-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/8 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-10 h-40 w-72 bg-primary/5 blur-3xl"
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Performance intelligence
            </p>
          </div>

          <div className="relative mt-3 inline-block">
            <div
              aria-hidden="true"
              className="absolute -inset-x-8 -inset-y-5 -z-10 bg-gradient-to-r from-primary/10 via-sky-400/5 to-transparent blur-2xl"
            />

            <h1 className="bg-gradient-to-br from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-transparent sm:text-6xl lg:text-7xl">
              Analytics
              <span className="text-primary/80">.</span>
            </h1>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Understand how leads move through your sales process, where
            momentum is building, and where your next opportunity may be.
          </p>
        </div>

        <div className="relative self-start lg:self-auto">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            onClick={() => setIsOpen((current) => !current)}
            className="group inline-flex h-11 min-w-44 items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-background hover:shadow-md"
          >
            <span className="flex items-center gap-2.5">
              <CalendarRange className="h-4 w-4 text-muted transition-colors group-hover:text-primary" />

              <span>{selectedRange.label}</span>
            </span>

            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-xl"
            >
              {rangeOptions.map((option) => {
                const isSelected = option.value === range;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitem"
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() => handleRangeChange(option.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary-soft text-primary"
                        : "text-body hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <span>{option.label}</span>

                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

