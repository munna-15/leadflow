const stats = [
  {
    label: "Total leads",
    value: "24",
    description: "All active opportunities",
  },
  {
    label: "Hot leads",
    value: "7",
    description: "High purchase intent",
  },
  {
    label: "Warm leads",
    value: "9",
    description: "Potential opportunities",
  },
  {
    label: "Follow-ups due",
    value: "4",
    description: "Need attention today",
  },
];

export default function LeadStats() {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-muted">{stat.label}</p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>

          <p className="mt-1 text-sm text-muted">{stat.description}</p>
        </div>
      ))}
    </section>
  );
}
