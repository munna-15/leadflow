import {
  ArrowUpRight,
  Globe2,
  MessageCircle,
  Share2,
  Users,
} from "lucide-react";

const sources = [
  {
    name: "Website",
    leads: 52,
    qualified: 38,
    conversion: "11.5%",
    share: 42,
    icon: Globe2,
    trend: "+18%",
    description: "Organic and landing-page inquiries",
  },
  {
    name: "Facebook",
    leads: 35,
    qualified: 21,
    conversion: "8.6%",
    share: 28,
    icon: Share2,
    trend: "+9%",
    description: "Campaign and social inquiries",
  },
  {
    name: "WhatsApp",
    leads: 22,
    qualified: 14,
    conversion: "9.1%",
    share: 18,
    icon: MessageCircle,
    trend: "+14%",
    description: "Direct messaging conversations",
  },
  {
    name: "Referral",
    leads: 15,
    qualified: 9,
    conversion: "6.7%",
    share: 12,
    icon: Users,
    trend: "+4%",
    description: "Existing customer referrals",
  },
];

export default function LeadSources() {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-6 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Lead sources</p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Where opportunities come from
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Compare incoming volume with qualification and conversion
                quality across each channel.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              124 total leads
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {sources.map((source) => {
            const Icon = source.icon;

            return (
              <div
                key={source.name}
                className="group px-6 py-5 transition-colors hover:bg-background sm:px-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-muted transition-colors group-hover:bg-primary-soft group-hover:text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {source.name}
                        </h3>

                        <span className="text-xs font-semibold text-green-600">
                          {source.trend}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs text-muted">
                        {source.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 sm:w-[330px] sm:shrink-0">
                    <div>
                      <p className="text-[11px] font-medium text-muted">
                        Leads
                      </p>

                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {source.leads}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-muted">
                        Qualified
                      </p>

                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {source.qualified}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-muted">
                        Conversion
                      </p>

                      <p className="mt-1 text-sm font-semibold text-primary">
                        {source.conversion}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500 group-hover:bg-primary-dark"
                      style={{ width: `${source.share}%` }}
                    />
                  </div>

                  <span className="w-9 text-right text-xs font-semibold text-muted">
                    {source.share}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-foreground p-6 text-white shadow-sm sm:p-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
          <ArrowUpRight className="h-5 w-5" />
        </div>

        <p className="mt-7 text-sm font-semibold text-sky-300">
          Source intelligence
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Website leads are driving the strongest conversion signal.
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Website inquiries currently combine the highest lead volume with the
          strongest qualification and conversion rate in this reporting period.
        </p>

        <div className="mt-7 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-300">Lead volume</span>

              <span className="text-sm font-semibold text-white">42%</span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[42%] rounded-full bg-sky-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-300">Qualified rate</span>

              <span className="text-sm font-semibold text-white">73%</span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[73%] rounded-full bg-sky-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-300">Conversion</span>

              <span className="text-sm font-semibold text-white">11.5%</span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[58%] rounded-full bg-sky-400" />
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-400">
          Source performance should be evaluated alongside lead quality,
          follow-up speed, and final conversion.
        </p>
      </div>
    </section>
  );
}
