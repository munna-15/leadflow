
"use client";

import {
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  MessageSquarePlus,
  Target,
  UserRoundCheck,
} from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    icon: MessageSquarePlus,
    label: "Capture",
    title: "Bring every inquiry into one place.",
    description:
      "Collect leads from your website and keep every new opportunity inside a single workflow.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    label: "Qualify",
    title: "Turn conversations into useful context.",
    description:
      "AI extracts intent, requirements, timeline, and other signals from each inquiry.",
    featured: true,
  },
  {
    number: "03",
    icon: Target,
    label: "Prioritize",
    title: "Know who needs attention first.",
    description:
      "Lead scores and intent signals help your team focus on the opportunities that matter most.",
  },
  {
    number: "04",
    icon: UserRoundCheck,
    label: "Follow up",
    title: "Keep the next action visible.",
    description:
      "Track overdue, upcoming, and completed follow-ups so promising conversations keep moving.",
  },
  {
    number: "05",
    icon: CheckCircle2,
    label: "Convert",
    title: "Move opportunities toward outcomes.",
    description:
      "Turn qualified conversations into meetings, negotiations, wins, and measurable growth.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold tracking-wide text-primary">
            How LeadFlow works
          </p>

          <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            From first inquiry to{" "}
            <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
              meaningful action.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            LeadFlow turns scattered inquiries into a clear workflow your
            team can understand, prioritize, and act on.
          </p>
        </motion.div>

        <div className="mt-16 lg:mt-20">
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute left-[10%] right-[10%] top-6 h-px bg-border" />

              <div className="grid grid-cols-5 gap-5">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.08,
                      }}
                      className="relative"
                    >
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-sm">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>

                      <div
                        className={`mt-7 rounded-2xl p-5 ${
                          step.featured
                            ? "bg-[#111827] shadow-xl shadow-slate-900/10"
                            : "border border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                              step.featured
                                ? "text-primary"
                                : "text-muted"
                            }`}
                          >
                            {step.label}
                          </p>

                          <span
                            className={`text-xs font-semibold ${
                              step.featured
                                ? "text-slate-500"
                                : "text-muted/50"
                            }`}
                          >
                            {step.number}
                          </span>
                        </div>

                        <h3
                          className={`mt-4 text-lg font-semibold leading-6 ${
                            step.featured
                              ? "text-white"
                              : "text-foreground"
                          }`}
                        >
                          {step.title}
                        </h3>

                        <p
                          className={`mt-3 text-sm leading-6 ${
                            step.featured
                              ? "text-slate-400"
                              : "text-muted"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>

                      {index < steps.length - 1 && (
                        <ArrowRight className="absolute -right-3 top-4 z-20 h-4 w-4 text-primary/60" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="relative ml-5 border-l border-border pl-8">
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.08,
                      }}
                      className="relative"
                    >
                      <div className="absolute left-[-3.15rem] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-sm">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>

                      <div
                        className={`rounded-2xl p-5 ${
                          step.featured
                            ? "bg-[#111827] shadow-xl shadow-slate-900/10"
                            : "border border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                              step.featured
                                ? "text-primary"
                                : "text-muted"
                            }`}
                          >
                            {step.label}
                          </p>

                          <span
                            className={`text-xs font-semibold ${
                              step.featured
                                ? "text-slate-500"
                                : "text-muted/50"
                            }`}
                          >
                            {step.number}
                          </span>
                        </div>

                        <h3
                          className={`mt-3 text-lg font-semibold leading-6 ${
                            step.featured
                              ? "text-white"
                              : "text-foreground"
                          }`}
                        >
                          {step.title}
                        </h3>

                        <p
                          className={`mt-3 text-sm leading-6 ${
                            step.featured
                              ? "text-slate-400"
                              : "text-muted"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>

                      {index < steps.length - 1 && (
                        <ArrowDown className="absolute -bottom-5 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 text-primary/50" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-xl text-sm leading-6 text-muted">
            One workflow connects the moments that usually get lost between
            the first message and the next follow-up.
          </p>

          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Capture → Qualify → Prioritize → Follow up → Convert
          </div>
        </motion.div>
      </div>
    </section>
  );
}

