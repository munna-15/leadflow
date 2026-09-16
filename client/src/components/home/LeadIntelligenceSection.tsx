
"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  MapPin,
  Phone,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "motion/react";

const requirements = [
  {
    label: "Location",
    value: "Bashundhara",
    icon: MapPin,
  },
  {
    label: "Property",
    value: "3 bedroom apartment",
    icon: Target,
  },
  {
    label: "Budget",
    value: "৳1 Crore",
    icon: CircleAlert,
  },
  {
    label: "Timeline",
    value: "Next month",
    icon: Clock3,
  },
];

const activities = [
  {
    label: "Inquiry received",
    time: "Today, 9:42 AM",
    complete: true,
  },
  {
    label: "AI qualification completed",
    time: "Today, 9:43 AM",
    complete: true,
  },
  {
    label: "Follow-up",
    time: "Due today",
    complete: false,
  },
];

export default function LeadIntelligenceSection() {
  return (
    <section id="product" className="relative overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold tracking-wide text-primary">
                Lead intelligence
              </p>
            </div>

            <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Know what matters before you make the{" "}
              <span className="bg-gradient-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                next move.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
              Every lead should give your team more than a name and a phone
              number. LeadFlow brings intent, requirements, activity, and the
              next action together.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                "Clear lead scoring",
                "Structured requirements",
                "AI-generated summaries",
                "Actionable follow-ups",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-body">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-[2.5rem] bg-slate-900/[0.025] blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-xl shadow-slate-900/[0.06]">
              <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Lead intelligence
                  </p>
                  <p className="mt-0.5 text-xs text-muted">Rahim Ahmed</p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Hot lead
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="border-b border-border p-5 lg:border-b-0 lg:border-r sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Lead score
                  </p>

                  <div className="mt-5 flex items-end gap-3">
                    <span className="text-6xl font-semibold tracking-[-0.04em] text-foreground">
                      92
                    </span>
                    <span className="mb-2 text-sm font-semibold text-primary">
                      / 100
                    </span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
                    <div className="h-full w-[92%] rounded-full bg-primary" />
                  </div>

                  <div className="mt-6 rounded-2xl bg-background p-4">
                    <p className="text-xs text-muted">AI summary</p>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      High-intent buyer with a clear location, budget, and
                      near-term move timeline.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Requirements
                    </p>

                    <span className="text-xs font-medium text-muted">
                      4 signals
                    </span>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {requirements.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 rounded-xl border border-border p-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>

                          <div>
                            <p className="text-xs text-muted">{item.label}</p>
                            <p className="mt-0.5 text-sm font-semibold text-foreground">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-background px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Activity
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      Keep the conversation moving
                    </p>
                  </div>

                  <Phone className="h-4 w-4 text-primary" />
                </div>

                <div className="mt-5 space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.label}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          activity.complete
                            ? "bg-primary-soft"
                            : "border border-primary/20 bg-surface"
                        }`}
                      >
                        {activity.complete ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.label}
                        </p>
                        <p className="text-xs text-muted">{activity.time}</p>
                      </div>

                      {!activity.complete && (
                        <span className="text-xs font-semibold text-primary">
                          Action needed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-7">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Suggested next action
                  </span>
                </div>

                <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                  Contact today
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

