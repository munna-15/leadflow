"use client";

import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  MessageCircle,
  Target,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const stages = [
  {
    label: "New",
    count: "12",
    description: "Fresh opportunities",
    icon: Users,
  },
  {
    label: "Qualified",
    count: "8",
    description: "Intent confirmed",
    icon: Target,
  },
  {
    label: "Contacted",
    count: "6",
    description: "Conversation started",
    icon: MessageCircle,
  },
  {
    label: "Meeting",
    count: "4",
    description: "Active conversations",
    icon: CalendarDays,
  },
  {
    label: "Negotiation",
    count: "2",
    description: "Close to outcome",
    icon: CheckCircle2,
  },
];

export default function SalesWorkflowSection() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />

            <p className="text-sm font-semibold tracking-wide text-primary">
              Sales workflow
            </p>
          </div>

          <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            See every opportunity.
            <span className="mt-1 block bg-gradient-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
              Know what moves next.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            LeadFlow gives your team a clear view of where opportunities are,
            which ones are progressing, and where attention is needed next.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="mt-12 overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-xl shadow-slate-900/[0.05] sm:mt-14 sm:rounded-[2rem] lg:mt-16"
        >
          <div className="border-b border-border px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Opportunity flow
                </p>

                <p className="mt-1 text-xs text-muted">
                  Current sales journey across active leads
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />

                <span className="text-xs font-medium text-muted">
                  32 active opportunities
                </span>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="px-5 py-6 sm:hidden">
            <div className="relative ml-5 border-l border-border pl-7">
              <div className="space-y-6">
                {stages.map((stage, index) => {
                  const Icon = stage.icon;

                  return (
                    <motion.div
                      key={stage.label}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.06,
                      }}
                      className="relative"
                    >
                      <div className="absolute -left-[3.05rem] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-sm">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>

                      <div
                        className={`rounded-2xl p-4 ${
                          index === 1
                            ? "bg-[#111827] shadow-lg shadow-slate-900/10"
                            : "border border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                index === 1 ? "text-white" : "text-foreground"
                              }`}
                            >
                              {stage.label}
                            </p>

                            <p
                              className={`mt-1 text-xs ${
                                index === 1 ? "text-slate-400" : "text-muted"
                              }`}
                            >
                              {stage.description}
                            </p>
                          </div>

                          <span
                            className={`text-2xl font-semibold tracking-tight ${
                              index === 1 ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {stage.count}
                          </span>
                        </div>

                        <div
                          className={`mt-4 h-1.5 overflow-hidden rounded-full ${
                            index === 1 ? "bg-white/10" : "bg-background"
                          }`}
                        >
                          <div
                            className={`h-full rounded-full bg-primary ${
                              index === 0
                                ? "w-[88%]"
                                : index === 1
                                  ? "w-[72%]"
                                  : index === 2
                                    ? "w-[58%]"
                                    : index === 3
                                      ? "w-[42%]"
                                      : "w-[28%]"
                            }`}
                          />
                        </div>
                      </div>

                      {index < stages.length - 1 && (
                        <ArrowDown className="absolute -bottom-5 left-1/2 h-4 w-4 -translate-x-1/2 text-primary/50" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="hidden px-6 py-7 sm:block lg:hidden">
            <div className="grid gap-4 sm:grid-cols-2">
              {stages.map((stage, index) => {
                const Icon = stage.icon;

                return (
                  <motion.div
                    key={stage.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.06,
                    }}
                    className={`rounded-2xl p-5 ${
                      index === 1
                        ? "bg-[#111827] shadow-lg shadow-slate-900/10"
                        : "border border-border bg-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            index === 1 ? "bg-white/10" : "bg-primary-soft"
                          }`}
                        >
                          <Icon className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              index === 1 ? "text-white" : "text-foreground"
                            }`}
                          >
                            {stage.label}
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              index === 1 ? "text-slate-400" : "text-muted"
                            }`}
                          >
                            {stage.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-2xl font-semibold ${
                          index === 1 ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {stage.count}
                      </span>
                    </div>

                    <div
                      className={`mt-5 h-1.5 overflow-hidden rounded-full ${
                        index === 1 ? "bg-white/10" : "bg-background"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full bg-primary ${
                          index === 0
                            ? "w-[88%]"
                            : index === 1
                              ? "w-[72%]"
                              : index === 2
                                ? "w-[58%]"
                                : index === 3
                                  ? "w-[42%]"
                                  : "w-[28%]"
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden px-7 py-8 lg:block">
            <div className="relative">
              <div className="absolute left-8 right-8 top-6 h-px bg-border" />

              <div className="relative grid grid-cols-5 gap-4">
                {stages.map((stage, index) => {
                  const Icon = stage.icon;

                  return (
                    <motion.div
                      key={stage.label}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.07,
                      }}
                      className="relative"
                    >
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-sm">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>

                      <div
                        className={`mt-6 rounded-2xl p-5 ${
                          index === 1
                            ? "bg-[#111827] shadow-lg shadow-slate-900/10"
                            : "border border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={`text-sm font-semibold ${
                              index === 1 ? "text-white" : "text-foreground"
                            }`}
                          >
                            {stage.label}
                          </p>

                          <span
                            className={`text-xs font-semibold ${
                              index === 1 ? "text-primary" : "text-muted"
                            }`}
                          >
                            {stage.count}
                          </span>
                        </div>

                        <p
                          className={`mt-3 text-sm leading-6 ${
                            index === 1 ? "text-slate-400" : "text-muted"
                          }`}
                        >
                          {stage.description}
                        </p>

                        <div
                          className={`mt-5 h-1.5 overflow-hidden rounded-full ${
                            index === 1 ? "bg-white/10" : "bg-background"
                          }`}
                        >
                          <div
                            className={`h-full rounded-full bg-primary ${
                              index === 0
                                ? "w-[88%]"
                                : index === 1
                                  ? "w-[72%]"
                                  : index === 2
                                    ? "w-[58%]"
                                    : index === 3
                                      ? "w-[42%]"
                                      : "w-[28%]"
                            }`}
                          />
                        </div>
                      </div>

                      {index < stages.length - 1 && (
                        <ArrowRight className="absolute -right-3 top-4 z-20 h-4 w-4 text-primary/60" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid border-t border-border lg:grid-cols-[1fr_0.85fr]">
            <div className="p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                What needs attention
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                    <Target className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      3 high-intent leads
                    </p>

                    <p className="mt-0.5 text-xs text-muted">
                      Waiting for a follow-up
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      2 meetings tomorrow
                    </p>

                    <p className="mt-0.5 text-xs text-muted">
                      Confirmation still pending
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                </div>
              </div>
            </div>

            <div className="bg-[#111827] p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Workflow visibility
              </p>

              <p className="mt-3 max-w-md text-xl font-semibold leading-7 text-white">
                From scattered conversations to one visible sales journey.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                Track movement
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
