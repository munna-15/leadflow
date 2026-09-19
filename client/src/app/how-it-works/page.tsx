"use client";

import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import { motion } from "motion/react";

import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteFooter from "@/components/home/SiteFooter";

const workflowSteps = [
  {
    number: "01",
    icon: Zap,
    label: "Capture",
    title: "Bring every opportunity into one place.",
    description:
      "LeadFlow gives your business a central place for inquiries instead of leaving important conversations scattered across different channels.",
    details: [
      "Website inquiries",
      "Manual lead entry",
      "Campaign and referral leads",
      "Source tracking",
    ],
  },
  {
    number: "02",
    icon: BrainCircuit,
    label: "Qualify",
    title: "Turn raw inquiries into useful context.",
    description:
      "Lead information can be structured into requirements, intent, timeline, and other signals your team can use to understand the opportunity.",
    details: [
      "Requirement extraction",
      "Intent identification",
      "Lead temperature",
      "AI-generated summary",
    ],
  },
  {
    number: "03",
    icon: Target,
    label: "Prioritize",
    title: "Know which opportunities deserve attention.",
    description:
      "LeadFlow helps your team distinguish between routine inquiries and opportunities that need a faster or more focused response.",
    details: [
      "Lead scoring",
      "Hot, warm, and cold signals",
      "Priority visibility",
      "Assigned ownership",
    ],
  },
  {
    number: "04",
    icon: CalendarClock,
    label: "Follow up",
    title: "Keep the next action visible.",
    description:
      "Instead of relying on memory, connect follow-up actions directly to the lead and keep overdue and upcoming work visible.",
    details: [
      "Follow-up scheduling",
      "Overdue visibility",
      "Upcoming actions",
      "Completed activity",
    ],
  },
  {
    number: "05",
    icon: TrendingUp,
    label: "Convert",
    title: "Move opportunities forward with context.",
    description:
      "When your team can see the history, intent, stage, and next action together, conversations can progress through a clearer sales journey.",
    details: [
      "Pipeline progression",
      "Meeting tracking",
      "Negotiation visibility",
      "Won and lost outcomes",
    ],
  },
];

const attentionSignals = [
  {
    icon: Target,
    title: "High-intent lead",
    text: "A lead has clear requirements and a strong buying signal.",
  },
  {
    icon: CalendarClock,
    title: "Follow-up due",
    text: "A scheduled action needs attention today or is already overdue.",
  },
  {
    icon: Users,
    title: "Ownership",
    text: "A team member is responsible for moving the opportunity forward.",
  },
];

const journeySteps = [
  {
    icon: MessageSquareText,
    title: "Inquiry received",
    text: "A potential customer submits a request.",
  },
  {
    icon: BrainCircuit,
    title: "Requirements understood",
    text: "Relevant intent and requirements are structured.",
  },
  {
    icon: Target,
    title: "Opportunity prioritized",
    text: "The lead receives useful attention signals.",
  },
  {
    icon: CalendarClock,
    title: "Follow-up scheduled",
    text: "The next action is connected to the lead.",
  },
  {
    icon: TrendingUp,
    title: "Opportunity progresses",
    text: "The lead moves through the sales workflow.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <SiteNavbar />

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 -z-10 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl sm:h-[34rem] sm:w-[48rem]"
        />

        <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:px-12 lg:pb-32 lg:pt-36">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm">
              <Workflow className="h-4 w-4 text-primary" />
              The LeadFlow workflow
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              From the first inquiry to the{" "}
              <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                next meaningful action.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-body sm:text-xl">
              LeadFlow connects lead capture, qualification, prioritization,
              follow-up, and pipeline progression into one continuous workflow.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              >
                See it in action
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/get-started"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              >
                Get LeadFlow
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PREMIUM WORKFLOW STRIP                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden border-y border-border bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.08),transparent_38%)]"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mb-14 flex flex-col gap-4 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-primary" />

                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                  One connected workflow
                </p>
              </div>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-4xl">
                Every step moves the opportunity
                <span className="text-primary"> forward.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted sm:text-base">
              LeadFlow connects every stage so useful context follows the lead
              instead of getting lost between teams and tools.
            </p>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-4 top-4 hidden h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 lg:right-4 lg:block"
            />

            <div
              aria-hidden="true"
              className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-primary/20 via-border to-primary/20 lg:hidden"
            />

            <div className="grid gap-0 lg:grid-cols-5">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === workflowSteps.length - 1;

                return (
                  <motion.div
                    key={step.number}
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.25,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="group relative lg:px-4 first:lg:pl-0 last:lg:pr-0"
                  >
                    <div className="flex items-start gap-5 py-6 lg:block lg:py-0">
                      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:shadow-[0_0_0_6px_rgba(14,165,233,0.08)]">
                        <span className="text-[10px] font-bold tracking-[0.08em] text-muted transition-colors duration-300 group-hover:text-white">
                          {step.number}
                        </span>
                      </div>

                      <div className="min-w-0 pt-0.5 lg:mt-7 lg:pt-0">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />

                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                            {step.label}
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                          {step.title.replace(".", "")}
                        </h3>

                        <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                          {step.description.split(".")[0]}.
                        </p>
                      </div>
                    </div>

                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="absolute left-[2rem] top-[3.75rem] h-[calc(100%-3.75rem)] w-12 lg:left-auto lg:right-0 lg:top-[4.5rem] lg:h-px lg:w-10"
                      />
                    )}

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-16 lg:bottom-[-2.5rem]"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-14 flex items-center gap-3 border-t border-border pt-6 lg:mt-16">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_5px_rgba(14,165,233,0.08)]" />

            <p className="text-xs font-medium tracking-wide text-muted">
              Capture → Understand → Prioritize → Act → Progress
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DETAILED WORKFLOW                                                 */}
      {/* ------------------------------------------------------------------ */}

      <section>
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-primary">
              How LeadFlow works
            </p>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Each step gives the next one more useful context.
            </h2>

            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              The workflow is designed so information does not disappear as a
              lead moves from one stage to another.
            </p>
          </div>

          <div className="mt-16 space-y-5">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const isFeatured = index === 1;

              return (
                <motion.article
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.55,
                  }}
                  className={`overflow-hidden rounded-[1.75rem] border ${
                    isFeatured
                      ? "border-primary/20 bg-primary/[0.025]"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="grid lg:grid-cols-[180px_1fr]">
                    <div
                      className={`flex items-start justify-between border-b p-6 sm:p-7 lg:border-b-0 lg:border-r ${
                        isFeatured ? "border-primary/10" : "border-border"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold tracking-wide text-muted">
                          STEP {step.number}
                        </span>

                        <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      {isFeatured && (
                        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                          Intelligence
                        </span>
                      )}
                    </div>

                    <div className="p-6 sm:p-7 lg:p-8">
                      <p className="text-sm font-semibold text-primary">
                        {step.label}
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {step.title}
                      </h3>

                      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                        {step.description}
                      </p>

                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {step.details.map((detail) => (
                          <div
                            key={detail}
                            className="flex items-center gap-2.5 rounded-xl bg-background px-4 py-3 text-sm font-medium text-body"
                          >
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ATTENTION LAYER                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-[#111827] text-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Attention layer
              </div>

              <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                LeadFlow is designed around one question:
                <span className="text-primary"> what needs attention now?</span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
                The goal is not to give your team more information to scan. It
                is to surface the information that helps them decide what action
                should happen next.
              </p>
            </div>

            <div className="space-y-3">
              {attentionSignals.map((signal, index) => {
                const Icon = signal.icon;

                return (
                  <motion.div
                    key={signal.title}
                    initial={{
                      opacity: 0,
                      x: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.07,
                    }}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-4.5 w-4.5 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold">
                        {signal.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {signal.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SAMPLE JOURNEY                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-24">
            <div>
              <p className="text-sm font-semibold tracking-wide text-primary">
                A lead journey
              </p>

              <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
                The same lead can carry context through every stage.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
                Instead of restarting the conversation at every stage, your team
                can see what the lead asked for, what has happened, and what
                should happen next.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-px bg-border" />

              <div className="space-y-5">
                {journeySteps.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{
                        opacity: 0,
                        x: 14,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.06,
                      }}
                      className="relative flex gap-4"
                    >
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>

                      <div className="min-w-0 rounded-2xl border border-border bg-background p-4 sm:p-5">
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted">
                          {item.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#111827] px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-primary">
                  One connected workflow
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Give every lead a clear next step.
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                  Explore the LeadFlow experience or talk to us about setting it
                  up for your business.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/demo"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-[#111827]"
                >
                  Explore demo
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/get-started"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Get LeadFlow
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <SiteFooter />
    </main>
  );
}
