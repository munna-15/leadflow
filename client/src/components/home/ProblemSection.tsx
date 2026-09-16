
"use client";

import { ArrowDown, ArrowRight, MessageSquare, Target, Timer } from "lucide-react";
import { motion } from "motion/react";

const problems = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Inquiries arrive everywhere",
    description:
      "Website forms, social messages, calls, and referrals create a constant stream of new opportunities.",
  },
  {
    number: "02",
    icon: Target,
    title: "Intent gets buried",
    description:
      "A high-value prospect can look exactly like an ordinary inquiry when everything sits in the same queue.",
  },
  {
    number: "03",
    icon: Timer,
    title: "Follow-ups get missed",
    description:
      "Without a clear next action, promising conversations quietly lose momentum.",
  },
];

export default function ProblemSection() {
  return (
    <section
      id="solutions"
      className="relative overflow-hidden border-t border-border bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold tracking-wide text-primary">
              The lead gap
            </p>

            <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Most leads aren't lost at the first conversation.
              <span className="mt-1 block bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                They're lost between conversations.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
              When inquiries are scattered across channels and follow-ups depend
              on memory, valuable opportunities become harder to see,
              prioritize, and act on.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background">
                <ArrowDown className="h-4 w-4 text-primary" />
              </span>
              The cost of disconnected sales activity
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-5 top-8 hidden h-[calc(100%-64px)] w-px bg-border sm:block" />

            <div className="space-y-4">
              {problems.map((problem, index) => {
                const Icon = problem.icon;

                return (
                  <motion.div
                    key={problem.number}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.1,
                    }}
                    className="group relative flex gap-5 rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:border-primary/25 hover:bg-white hover:shadow-lg hover:shadow-slate-900/5 sm:p-6"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors duration-300 group-hover:border-primary/20 group-hover:text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-foreground sm:text-lg">
                          {problem.title}
                        </h3>

                        <span className="shrink-0 text-xs font-semibold tracking-wider text-muted/60">
                          {problem.number}
                        </span>
                      </div>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base">
                        {problem.description}
                      </p>
                    </div>

                    <ArrowRight className="absolute bottom-5 right-5 hidden h-4 w-4 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 sm:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-20 overflow-hidden rounded-3xl bg-[#111827] px-6 py-8 sm:px-8 lg:mt-24 lg:px-10 lg:py-9"
        >
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                From scattered activity
              </p>

              <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                To clear sales priorities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="rounded-full bg-white/10 px-3.5 py-2 text-slate-300">
                Inquiries
              </span>

              <ArrowRight className="h-4 w-4 text-primary" />

              <span className="rounded-full bg-primary/15 px-3.5 py-2 text-primary-200">
                LeadFlow
              </span>

              <ArrowRight className="h-4 w-4 text-primary" />

              <span className="rounded-full bg-white/10 px-3.5 py-2 text-slate-300">
                Next actions
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

