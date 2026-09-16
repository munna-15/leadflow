import { ArrowUpRight, Clock3, Flame, MessageCircle } from "lucide-react";

const attentionItems = [
  {
    name: "Rahim Ahmed",
    description: "High-intent property inquiry",
    meta: "Follow-up overdue",
    score: 92,
    icon: Flame,
  },
  {
    name: "Karim Hasan",
    description: "Apartment inquiry",
    meta: "No response for 2 days",
    score: 84,
    icon: MessageCircle,
  },
  {
    name: "Nadia Rahman",
    description: "Qualified buyer",
    meta: "Meeting tomorrow",
    score: 78,
    icon: Clock3,
  },
];

export default function AttentionPanel() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              Needs attention
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              Leads waiting on you
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 divide-y divide-border">
          {attentionItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.name}
                className="flex items-center gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{item.name}</p>

                  <p className="mt-1 text-sm text-body">{item.description}</p>

                  <p className="mt-1 text-xs font-medium text-muted">
                    {item.meta}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-xs font-medium text-muted">Lead score</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {item.score}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-foreground p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-sky-300">Today</p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Your sales pulse
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          12 leads are currently active. 3 have high intent and 4 follow-ups are
          due today.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-semibold">12</p>
            <p className="mt-1 text-xs text-slate-400">Active leads</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-semibold">3</p>
            <p className="mt-1 text-xs text-slate-400">High intent</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-semibold">4</p>
            <p className="mt-1 text-xs text-slate-400">Due today</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-semibold">68%</p>
            <p className="mt-1 text-xs text-slate-400">Response rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
