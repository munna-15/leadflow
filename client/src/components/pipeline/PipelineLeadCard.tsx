
"use client";

import Link from "next/link";
import { ArrowUpRight, Flame } from "lucide-react";

type PipelineLeadCardProps = {
  id: string;
  name: string;
  detail: string;
  score: number;
  temperature: "Hot" | "Warm" | "Cold";
};

const temperatureStyles = {
  Hot: "bg-orange-50 text-orange-700",
  Warm: "bg-amber-50 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

export default function PipelineLeadCard({
  id,
  name,
  detail,
  score,
  temperature,
}: PipelineLeadCardProps) {
  return (
    <Link
      href={`/dashboard/leads/${id}`}
      className="group block rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-soft/20 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-foreground">
              {name}
            </h4>

            {temperature === "Hot" && (
              <Flame className="h-3.5 w-3.5 shrink-0 text-orange-500" />
            )}
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">
            {detail}
          </p>
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${temperatureStyles[temperature]}`}
        >
          {temperature}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted">Score</span>

          <span className="text-sm font-semibold text-foreground">
            {score}
          </span>
        </div>
      </div>
    </Link>
  );
}

