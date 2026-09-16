
const stats = [
  {
    label: "Total leads",
    value: "24",
    description: "Active opportunities",
    type: "total",
  },
  {
    label: "Hot leads",
    value: "7",
    description: "High purchase intent",
    type: "hot",
  },
  {
    label: "Warm leads",
    value: "9",
    description: "Potential opportunities",
    type: "warm",
  },
  {
    label: "Follow-ups due",
    value: "4",
    description: "Need attention today",
    type: "due",
  },
];

const accentMap = {
  total: {
    dot: "bg-slate-400",
    value: "text-foreground",
  },
  hot: {
    dot: "bg-orange-500",
    value: "text-orange-600",
  },
  warm: {
    dot: "bg-amber-400",
    value: "text-amber-600",
  },
  due: {
    dot: "bg-primary",
    value: "text-primary",
  },
};

export default function LeadStats() {
  return (
    <section className="mt-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <div>
            <p className="text-sm font-semibold text-foreground">Lead pulse</p>
            <p className="mt-0.5 text-xs text-muted">
              A quick view of your current sales activity
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live overview
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const accent = accentMap[stat.type as keyof typeof accentMap];

            return (
              <div
                key={stat.label}
                className={`group relative px-5 py-6 transition-colors hover:bg-background sm:px-7 ${
                  index < stats.length - 1
                    ? "border-b border-border xl:border-b-0 xl:border-r"
                    : ""
                } ${
                  index === 1
                    ? "sm:border-r border-border xl:border-r"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${accent.dot}`}
                    />
                    <p className="text-sm font-medium text-muted">
                      {stat.label}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-muted/70">
                    0{index + 1}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p
                      className={`text-4xl font-semibold tracking-tight ${accent.value}`}
                    >
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      {stat.description}
                    </p>
                  </div>

                  <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted transition-transform group-hover:translate-x-0.5 sm:flex">
                    →
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

