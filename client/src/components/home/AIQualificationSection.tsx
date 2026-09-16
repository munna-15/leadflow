
"use client";

import {
  ArrowRight,
  BrainCircuit,
  Check,
  MapPin,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { motion } from "motion/react";

const intelligence = [
  {
    label: "Intent",
    value: "Property purchase",
    icon: Target,
  },
  {
    label: "Location",
    value: "Bashundhara",
    icon: MapPin,
  },
  {
    label: "Timeline",
    value: "Next month",
    icon: Timer,
  },
];

export default function AIQualificationSection() {
  return (
    <section id="ai" className="relative overflow-hidden bg-surface">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold tracking-wide text-primary">
                AI qualification
              </p>
            </div>

            <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Don't just collect leads.
              <span className="mt-1 block bg-gradient-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                Understand them.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
              LeadFlow turns unstructured inquiries into useful sales
              intelligence, helping your team understand intent before making
              the next move.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Extract important requirements automatically",
                "Identify buying intent and lead temperature",
                "Give your team a clearer next action",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Check className="h-3 w-3 text-primary" />
                  </span>

                  <p className="text-sm leading-6 text-body sm:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/[0.035] blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background shadow-xl shadow-slate-900/[0.06]">
              <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                    <BrainCircuit className="h-4.5 w-4.5 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      AI qualification
                    </p>
                    <p className="text-xs text-muted">
                      Lead intelligence generated
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Complete
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
                <div className="border-b border-border p-5 lg:border-b-0 lg:border-r sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Original inquiry
                  </p>

                  <blockquote className="mt-5 text-base leading-7 text-foreground sm:text-lg">
                    “I need a 3 bedroom apartment in Bashundhara. My budget is
                    around 1 crore and I want to move next month.”
                  </blockquote>

                  <div className="mt-6 flex items-center gap-2 text-xs text-muted">
                    <span className="rounded-full border border-border bg-surface px-2.5 py-1">
                      Website
                    </span>

                    <span>•</span>

                    <span>New inquiry</span>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Extracted intelligence
                    </p>

                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {intelligence.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-muted">{item.label}</p>
                            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#111827] p-4">
                      <p className="text-xs text-slate-400">Lead score</p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                        92
                      </p>
                      <p className="mt-1 text-xs font-medium text-primary">
                        High intent
                      </p>
                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                      <p className="text-xs text-orange-700/70">Temperature</p>
                      <p className="mt-1 text-lg font-semibold text-orange-700">
                        Hot
                      </p>
                      <p className="mt-1 text-xs font-medium text-orange-600">
                        Needs attention
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                  <p className="text-xs text-muted">Suggested next action</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Contact this lead today
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  Ready for follow-up
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

