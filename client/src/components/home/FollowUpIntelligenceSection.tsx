"use client";

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Phone,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const followUps = [
  {
    name: "Rahim Ahmed",
    context: "High-intent buyer",
    action: "Call today",
    time: "Overdue",
    urgent: true,
  },
  {
    name: "Nadia Rahman",
    context: "Meeting scheduled",
    action: "Confirm meeting",
    time: "Today · 4:30 PM",
    urgent: false,
  },
  {
    name: "Karim Hasan",
    context: "Proposal viewed",
    action: "Send follow-up",
    time: "Tomorrow",
    urgent: false,
  },
];

export default function FollowUpIntelligenceSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />

              <p className="text-sm font-semibold tracking-wide text-primary">
                Follow-up intelligence
              </p>
            </div>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Never let the{" "}
              <span className="bg-gradient-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                next action disappear.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
              LeadFlow keeps follow-ups visible, organized, and connected to the
              leads that need them—so your team knows what to do next.
            </p>

            <div className="mt-9 space-y-4">
              {[
                {
                  icon: Clock3,
                  title: "Overdue follow-ups",
                  text: "See what needs immediate attention.",
                },
                {
                  icon: CalendarClock,
                  title: "Upcoming actions",
                  text: "Keep future conversations on schedule.",
                },
                {
                  icon: CheckCircle2,
                  title: "Completed activity",
                  text: "Maintain a clear record of progress.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-muted">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/[0.035] blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-xl shadow-slate-900/[0.06]">
              <div className="border-b border-border px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Follow-up queue
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      What your team should act on next
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Intelligent
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {followUps.map((followUp, index) => (
                    <motion.div
                      key={followUp.name}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.08,
                      }}
                      className={`rounded-2xl border p-4 sm:p-5 ${
                        followUp.urgent
                          ? "border-orange-200 bg-orange-50/70"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            followUp.urgent
                              ? "bg-orange-100"
                              : "bg-primary-soft"
                          }`}
                        >
                          <Phone
                            className={`h-4 w-4 ${
                              followUp.urgent
                                ? "text-orange-600"
                                : "text-primary"
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {followUp.name}
                              </p>

                              <p className="mt-0.5 text-xs text-muted">
                                {followUp.context}
                              </p>
                            </div>

                            <span
                              className={`text-xs font-semibold ${
                                followUp.urgent
                                  ? "text-orange-600"
                                  : "text-muted"
                              }`}
                            >
                              {followUp.time}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-foreground">
                              {followUp.action}
                            </span>

                            <ArrowRight className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border bg-[#111827] px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      Today's follow-up discipline
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      8 of 10 scheduled actions completed
                    </p>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 sm:w-32">
                    <div className="h-full w-[80%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
