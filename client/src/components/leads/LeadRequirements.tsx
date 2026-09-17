"use client";

import {
  BedDouble,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Home,
  MapPin,
  Tag,
} from "lucide-react";

import type { Lead } from "@/services/lead.service";

type LeadRequirementsProps = {
  lead: Lead;
};

type RequirementItem = {
  key: string;
  label: string;
  value: string;
  icon: typeof MapPin;
};

const requirementConfig: Record<
  string,
  {
    label: string;
    icon: typeof MapPin;
  }
> = {
  location: {
    label: "Location",
    icon: MapPin,
  },
  propertyType: {
    label: "Property type",
    icon: Home,
  },
  bedrooms: {
    label: "Bedrooms",
    icon: BedDouble,
  },
  budget: {
    label: "Budget",
    icon: CircleDollarSign,
  },
  timeline: {
    label: "Timeline",
    icon: CalendarDays,
  },
  intent: {
    label: "Intent",
    icon: Tag,
  },
};

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (character) => character.toUpperCase());
};

const formatValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  const stringValue = String(value).trim();

  if (key === "propertyType") {
    return stringValue
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  if (key === "bedrooms") {
    return `${stringValue} bedrooms`;
  }

  if (key === "budget") {
    const numericValue = Number(stringValue);

    if (Number.isFinite(numericValue) && numericValue >= 100000) {
      return `৳${numericValue.toLocaleString("en-BD")}`;
    }
  }

  if (key === "intent") {
    return stringValue
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  if (key === "timeline") {
    return stringValue
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  return stringValue;
};

export default function LeadRequirements({ lead }: LeadRequirementsProps) {
  const requirements = lead.requirements || {};

  const requirementItems: RequirementItem[] = Object.entries(requirements)
    .map(([key, value]) => {
      const formattedValue = formatValue(key, value);

      if (!formattedValue) {
        return null;
      }

      const config = requirementConfig[key];

      return {
        key,
        label: config?.label || formatLabel(key),
        value: formattedValue,
        icon: config?.icon || FileText,
      };
    })
    .filter((item): item is RequirementItem => item !== null);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div>
        <p className="text-sm font-semibold text-primary">Lead requirements</p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          What this lead is looking for
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Key requirements captured from the lead and qualification workflow.
        </p>
      </div>

      {requirementItems.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {requirementItems.map((requirement) => {
            const Icon = requirement.icon;

            return (
              <div
                key={requirement.key}
                className="group rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/30 hover:bg-primary-soft/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-muted transition-colors group-hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">
                      {requirement.label}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-foreground">
                      {requirement.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-muted">
            <FileText className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No requirements captured yet
          </h3>

          <p className="mt-1 max-w-lg text-sm leading-6 text-muted">
            Requirements will appear here when they are added manually or
            extracted through the qualification workflow.
          </p>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-border bg-background p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Original inquiry
        </p>

        <div className="mt-3 flex items-start gap-3">
          <FileText className="mt-1 h-4 w-4 shrink-0 text-muted" />

          <p className="text-sm leading-7 text-muted">
            The original inquiry is not stored separately for this lead yet.
          </p>
        </div>
      </div>
    </section>
  );
}
