
import {
  Globe2,
  MessageCircle,
  Share2,
  Users,
  Waypoints,
} from "lucide-react";

import type { AnalyticsSource } from "@/services/analytics.service";

interface LeadSourcesProps {
  sources: AnalyticsSource[];
}

const sourceMeta: Record<
  string,
  {
    icon: typeof Globe2;
    description: string;
  }
> = {
  website: {
    icon: Globe2,
    description: "Website and landing-page inquiries",
  },
  facebook: {
    icon: Share2,
    description: "Facebook and Messenger inquiries",
  },
  whatsapp: {
    icon: MessageCircle,
    description: "Direct WhatsApp conversations",
  },
  referral: {
    icon: Users,
    description: "Existing customer referrals",
  },
  manual: {
    icon: Waypoints,
    description: "Leads added manually",
  },
  unknown: {
    icon: Waypoints,
    description: "Uncategorized lead source",
  },
};

const getSourceMeta = (source: string) => {
  return (
    sourceMeta[source] || {
      icon: Waypoints,
      description: "Other lead source",
    }
  );
};

export default function LeadSources({
  sources,
}: LeadSourcesProps) {
  const totalLeads = sources.reduce(
    (total, source) => total + source.leads,
    0,
  );

  return (
    <section className="mt-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-6 sm:px-7 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">
                Lead sources
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Where opportunities come from
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
                Compare incoming lead volume and qualification across the
                channels bringing opportunities into your business.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span>
                {totalLeads.toLocaleString()} total{" "}
                {totalLeads === 1 ? "lead" : "leads"}
              </span>
            </div>
          </div>
        </div>

        {sources.length === 0 ? (
          <div className="px-6 py-16 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-muted">
              <Waypoints className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No source data yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              Lead source performance will appear here once your business
              starts receiving leads.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sources.map((source) => {
              const meta = getSourceMeta(source.source);
              const Icon = meta.icon;

              return (
                <div
                  key={source.source}
                  className="group px-6 py-5 transition-colors duration-200 hover:bg-background sm:px-7 lg:px-8"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-muted transition-colors duration-200 group-hover:bg-primary-soft group-hover:text-primary">
                        <Icon className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">
                          {source.name}
                        </h3>

                        <p className="mt-1 truncate text-xs text-muted">
                          {meta.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:w-[420px] lg:shrink-0">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Leads
                        </p>

                        <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                          {source.leads.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Qualified
                        </p>

                        <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                          {source.qualified.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Qualification
                        </p>

                        <p className="mt-1 text-lg font-semibold tracking-tight text-primary">
                          {source.qualificationRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500 group-hover:bg-primary-dark"
                          style={{
                            width: `${Math.min(
                              Math.max(source.share, 0),
                              100,
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="w-12 text-right text-xs font-semibold text-muted">
                        {source.share}%
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-muted">
                        Share of incoming leads
                      </span>

                      <span className="text-[11px] font-medium text-muted">
                        {source.qualified.toLocaleString()} of{" "}
                        {source.leads.toLocaleString()} qualified
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

