
import {
  BedDouble,
  CalendarDays,
  CircleDollarSign,
  Home,
  MapPin,
  Tag,
} from "lucide-react";

const requirements = [
  {
    label: "Location",
    value: "Bashundhara",
    icon: MapPin,
  },
  {
    label: "Property type",
    value: "Apartment",
    icon: Home,
  },
  {
    label: "Bedrooms",
    value: "3 bedrooms",
    icon: BedDouble,
  },
  {
    label: "Budget",
    value: "৳1 Crore",
    icon: CircleDollarSign,
  },
  {
    label: "Timeline",
    value: "Next month",
    icon: CalendarDays,
  },
  {
    label: "Intent",
    value: "Purchase",
    icon: Tag,
  },
];

export default function LeadRequirements() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div>
        <p className="text-sm font-semibold text-primary">Lead requirements</p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          What this lead is looking for
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Key requirements extracted from the lead conversation and inquiry.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {requirements.map((requirement) => {
          const Icon = requirement.icon;

          return (
            <div
              key={requirement.label}
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

                  <p className="mt-1 truncate text-sm font-semibold text-foreground">
                    {requirement.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Original inquiry
        </p>

        <blockquote className="mt-3 border-l-2 border-primary pl-4 text-sm leading-7 text-body">
          “I need a 3 bedroom apartment in Bashundhara. My budget is around
          1 crore and I want to move next month.”
        </blockquote>
      </div>
    </section>
  );
}

