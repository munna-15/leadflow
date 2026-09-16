"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Layers3,
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

const productCapabilities = [
  {
    icon: Users,
    label: "Lead management",
    title: "Every lead in one visible workspace.",
    description:
      "Capture, organize, assign, and manage leads without losing important context between conversations.",
    points: [
      "Centralized lead records",
      "Source and ownership tracking",
      "Status and temperature visibility",
    ],
  },
  {
    icon: BrainCircuit,
    label: "AI qualification",
    title: "Turn conversations into structured intelligence.",
    description:
      "LeadFlow can extract intent, requirements, timeline, and other useful signals from incoming lead information.",
    points: [
      "Requirement extraction",
      "Intent identification",
      "Lead scoring and temperature",
    ],
  },
  {
    icon: Workflow,
    label: "Sales pipeline",
    title: "See where every opportunity stands.",
    description:
      "Move from scattered conversations to a clear sales journey with visible stages and next actions.",
    points: [
      "Stage-based opportunity flow",
      "Qualification visibility",
      "Attention signals for active opportunities",
    ],
  },
  {
    icon: Clock3,
    label: "Follow-up intelligence",
    title: "Make the next action impossible to miss.",
    description:
      "Keep overdue, upcoming, and completed follow-ups connected to the leads they belong to.",
    points: [
      "Overdue follow-up visibility",
      "Upcoming action tracking",
      "Clear next-step context",
    ],
  },
];

const workflowSteps = [
  {
    number: "01",
    icon: Zap,
    title: "Capture",
    text: "Bring lead inquiries into one system.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Understand",
    text: "Extract intent and useful requirements.",
  },
  {
    number: "03",
    icon: Target,
    title: "Prioritize",
    text: "Identify which opportunities need attention.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Follow up",
    text: "Keep the next action visible and organized.",
  },
  {
    number: "05",
    icon: TrendingUp,
    title: "Convert",
    text: "Move opportunities forward with better context.",
  },
];

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* NAVIGATION                                                          */}
      {/* ------------------------------------------------------------------ */}

      <SiteNavbar/>

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[46rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:px-12 lg:pb-32 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              The LeadFlow system
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              One system for the leads your business{" "}
              <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                cannot afford to lose.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-body sm:text-xl">
              LeadFlow brings lead capture, qualification, intelligence,
              pipeline management, and follow-up into one connected workflow.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                Explore the demo
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/get-started"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background"
              >
                Get LeadFlow
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PRODUCT OVERVIEW                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-primary">
              One connected workflow
            </p>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              From first inquiry to the next meaningful action.
            </h2>

            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              LeadFlow connects the parts of the sales process that are often
              handled separately, giving your team better context at every
              stage.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {productCapabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  className="group rounded-[1.5rem] border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-900/[0.05] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {item.label}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                    {item.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-border pt-5">
                    {item.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-body"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* INTELLIGENCE LAYER                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden">
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-primary/[0.035] blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24 lg:px-12 lg:py-32">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <BrainCircuit className="h-4 w-4" />
              Intelligence layer
            </div>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Give your team context, not just contact records.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
              A lead becomes more useful when your team can quickly understand
              intent, requirements, urgency, and the action that should happen
              next.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Structured lead requirements",
                "Intent and temperature signals",
                "AI-generated summaries",
                "Suggested next actions",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-body"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-[2.5rem] bg-primary/[0.035] blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-xl shadow-slate-900/[0.06]">
              <div className="border-b border-border px-6 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Lead intelligence
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Sample qualification result
                    </p>
                  </div>

                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                    Hot lead
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-7">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Lead
                  </p>

                  <p className="mt-1 text-lg font-semibold text-foreground">
                    Rahim Ahmed
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    Property purchase inquiry
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-background p-4">
                    <p className="text-xs text-muted">Score</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">
                      92
                    </p>
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <p className="text-xs text-muted">Intent</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      Purchase
                    </p>
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <p className="text-xs text-muted">Timeline</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      Next month
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    AI summary
                  </p>

                  <p className="mt-3 text-sm leading-7 text-body">
                    High-intent buyer with a clear location, budget, property
                    type, and near-term move timeline.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#111827] p-5 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Suggested next action
                  </div>

                  <p className="mt-2 text-base font-semibold">
                    Contact this lead today
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    High intent + near-term timeline requires prompt follow-up.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WORKFLOW                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-[#111827] text-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-primary">
              The workflow
            </p>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Every stage connected to the next.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
              LeadFlow is designed around the journey a lead takes—not around
              disconnected tools your team has to constantly switch between.
            </p>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-5">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {step.number}
                    </span>

                    <Icon className="h-4 w-4 text-primary" />
                  </div>

                  <h3 className="mt-8 text-lg font-semibold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {step.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Layers3 className="h-4.5 w-4.5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  One connected sales journey
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Less context switching. More visibility.
                </p>
              </div>
            </div>

            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-sky-300"
            >
              See the full workflow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OUTCOME                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-sm font-semibold tracking-wide text-primary">
                Built around visibility
              </p>

              <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
                Know what happened. Know what matters. Know what comes next.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-2xl font-semibold text-foreground">
                  Capture
                </p>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Keep inquiries from getting scattered.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-2xl font-semibold text-foreground">
                  Understand
                </p>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Turn lead information into useful context.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-2xl font-semibold text-foreground">Act</p>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Keep follow-ups and next actions visible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#111827] px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-primary">
                  Ready to make every lead visible?
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Give your team one system for the next opportunity.
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                  Explore the LeadFlow experience or talk to us about setting it
                  up for your business.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/demo"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Explore demo
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/get-started"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
      {/* FOOTER                                                              */}
      {/* ------------------------------------------------------------------ */}

      <SiteFooter/>
    </main>
  );
}
