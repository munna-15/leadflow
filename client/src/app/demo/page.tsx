"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Sparkles,
  Target,
  Thermometer,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";

import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteFooter from "@/components/home/SiteFooter";

const demoLead = {
  name: "Rahim Ahmed",
  message:
    "I need a 3 bedroom apartment in Bashundhara. My budget is around 1 crore and I want to move next month.",
  intent: "Property purchase",
  location: "Bashundhara",
  property: "3 bedroom apartment",
  budget: "৳1 Crore",
  timeline: "Next month",
  score: 92,
  temperature: "Hot",
  summary:
    "High-intent buyer with a defined location, budget and near-term moving timeline.",
  action: "Contact today and confirm suitable property availability.",
};

const workflowSteps = [
  {
    number: "01",
    title: "Capture",
    description: "Bring the customer's inquiry into one place.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Understand",
    description: "Turn unstructured messages into useful context.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Prioritize",
    description: "Surface intent, score and attention signals.",
    icon: Target,
  },
  {
    number: "04",
    title: "Act",
    description: "Give the team a clearer next action.",
    icon: Sparkles,
  },
];

function DemoWorkspace() {
  const [stage, setStage] = useState<"idle" | "analyzing" | "complete">("idle");

  const [progress, setProgress] = useState(0);

  const startAnalysis = () => {
    setStage("analyzing");
    setProgress(0);
  };

  useEffect(() => {
    if (stage !== "analyzing") return;

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        return current + 5;
      });
    }, 45);

    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (progress < 100 || stage !== "analyzing") return;

    const timer = window.setTimeout(() => {
      setStage("complete");
    }, 350);

    return () => window.clearTimeout(timer);
  }, [progress, stage]);

  return (
    <div className="relative">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-primary/[0.055] blur-3xl" />

      <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_35px_100px_-40px_rgba(15,23,42,0.28)]">
        {/* WORKSPACE HEADER */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <BrainCircuit className="h-5 w-5 text-primary" />

              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                LeadFlow Intelligence
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-xs text-muted">Interactive demo workspace</p>
              </div>
            </div>
          </div>

          <span className="hidden rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-muted sm:block">
            Sample lead
          </span>
        </div>

        {/* WORKSPACE */}
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          {/* INCOMING LEAD */}
          <div className="border-b border-border p-5 sm:p-7 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Incoming inquiry
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  Customer message
                </h3>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                <UserRound className="h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl rounded-tr-md bg-slate-950 p-5 text-sm leading-6 text-white shadow-sm">
              “{demoLead.message}”
            </div>

            <div className="mt-5 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                Just received
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span>Website inquiry</span>
            </div>

            <div className="mt-7 rounded-2xl border border-border bg-background p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                What LeadFlow does
              </p>

              <p className="mt-2 text-sm leading-6 text-body">
                Instead of leaving the sales team to interpret the message
                manually, LeadFlow turns the conversation into structured
                intelligence.
              </p>
            </div>

            <button
              type="button"
              onClick={startAnalysis}
              disabled={stage === "analyzing"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {stage === "analyzing" ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex"
                  >
                    <BrainCircuit className="h-4 w-4" />
                  </motion.span>
                  Analyzing inquiry...
                </>
              ) : (
                <>
                  {stage === "complete"
                    ? "Run analysis again"
                    : "Analyze this lead"}

                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* AI INTELLIGENCE */}
          <div className="bg-slate-50/70 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  AI qualification
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  Lead intelligence
                </h3>
              </div>

              {stage === "complete" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Analyzed
                </motion.div>
              )}
            </div>

            {stage === "idle" && (
              <div className="mt-6 flex min-h-[28rem] items-center justify-center rounded-2xl border border-dashed border-border bg-white p-6">
                <div className="max-w-xs text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>

                  <h4 className="mt-5 text-lg font-semibold text-foreground">
                    Ready to analyze
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    Run the demo to see how LeadFlow turns the inquiry into
                    structured sales intelligence.
                  </p>
                </div>
              </div>
            )}

            {stage === "analyzing" && (
              <div className="mt-6 min-h-[28rem] rounded-2xl border border-border bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft"
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      LeadFlow AI is analyzing
                    </p>

                    <p className="mt-0.5 text-xs text-muted">
                      Extracting context and intent signals
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {[
                    "Reading conversation context",
                    "Extracting requirements",
                    "Identifying intent signals",
                    "Calculating priority",
                  ].map((item, index) => {
                    const threshold = (index + 1) * 25;
                    const active = progress >= threshold;

                    return (
                      <div key={item}>
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={
                              active
                                ? "font-medium text-foreground"
                                : "text-muted"
                            }
                          >
                            {item}
                          </span>

                          {active && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                100,
                                Math.max(0, progress - index * 25) * 4,
                              )}%`,
                            }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-xl bg-slate-950 p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />

                    <span className="text-xs font-medium text-slate-300">
                      Processing intelligence...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {stage === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 min-h-[28rem] rounded-2xl border border-border bg-white p-4 sm:p-5"
              >
                {/* SIGNAL HEADER */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Signals identified
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-600">
                    Structured
                  </span>
                </div>

                {/* SCORE */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-950 p-3.5">
                    <p className="text-[10px] font-medium text-slate-400">
                      Lead score
                    </p>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight text-white">
                        {demoLead.score}
                      </span>

                      <span className="text-[10px] text-slate-500">/ 100</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-3.5">
                    <p className="text-[10px] font-medium text-orange-700/70">
                      Temperature
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-600" />

                      <span className="text-sm font-semibold text-orange-700">
                        {demoLead.temperature}
                      </span>
                    </div>
                  </div>
                </div>

                {/* EXTRACTED DATA */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    ["Intent", demoLead.intent],
                    ["Location", demoLead.location],
                    ["Property", demoLead.property],
                    ["Budget", demoLead.budget],
                    ["Timeline", demoLead.timeline],
                    ["Lead", demoLead.name],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="min-w-0 rounded-xl bg-slate-50 px-3 py-2.5"
                    >
                      <p className="text-[9px] font-medium uppercase tracking-wide text-muted">
                        {label}
                      </p>

                      <p className="mt-1 truncate text-[11px] font-semibold text-foreground">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI SUMMARY */}
                <div className="mt-2 rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-3.5 w-3.5 text-primary" />

                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                      AI summary
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-body">
                    {demoLead.summary}
                  </p>
                </div>

                {/* NEXT ACTION */}
                <div className="mt-2 rounded-xl bg-primary-soft/70 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary-dark">
                        Recommended next action
                      </p>

                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-800">
                        {demoLead.action}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoWorkflow() {
  return (
    <section className="border-t border-border bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Beyond the demo
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
            From a message to a meaningful sales action.
          </h2>

          <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
            The intelligence shown above fits into a broader workflow designed
            to help teams capture, understand, prioritize and act on incoming
            opportunities.
          </p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                className="relative rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-muted">
                    {step.number}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <h3 className="mt-7 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {step.description}
                </p>

                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-slate-300 lg:block" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.10),transparent_58%)]" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-22 lg:px-8 lg:pb-24 lg:pt-26">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Interactive product demo
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mx-auto mt-7 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              See LeadFlow turn a conversation{" "}
              <span className="bg-gradient-to-r from-slate-950 via-slate-700 to-primary bg-clip-text text-transparent">
                into action.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
            >
              Explore how LeadFlow transforms an unstructured customer inquiry
              into requirements, intent signals, lead priority and a clearer
              next action for your sales team.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-14 sm:mt-16"
          >
            <DemoWorkspace />
          </motion.div>

          <p className="mt-5 text-center text-[11px] text-muted">
            Demo uses fictional sample data. No real customer information is
            processed.
          </p>
        </div>
      </section>

      {/* WHAT THE DEMO SHOWS */}
      <section className="border-b border-border bg-background py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                What you just saw
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                Intelligence that gives the conversation structure.
              </h2>

              <p className="mt-5 text-base leading-7 text-muted">
                LeadFlow is designed to reduce the gap between receiving a lead
                and knowing what your team should actually do with it.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: MessageSquareText,
                  title: "Understand",
                  description:
                    "Start from the customer's actual words and context.",
                },
                {
                  icon: BrainCircuit,
                  title: "Extract",
                  description:
                    "Turn useful requirements into structured information.",
                },
                {
                  icon: TrendingUp,
                  title: "Prioritize",
                  description: "Surface score, temperature and intent signals.",
                },
                {
                  icon: Sparkles,
                  title: "Recommend",
                  description:
                    "Connect intelligence to a practical next action.",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                    }}
                    className="rounded-2xl border border-border bg-white p-5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <DemoWorkflow />

      {/* CTA */}
      <section className="bg-slate-950 py-24 text-white sm:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
            Ready to make the next lead count?
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
            Give your sales team a clearer way to act.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            LeadFlow brings lead capture, qualification, intelligence and
            follow-up into one focused workflow.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(14,165,233,0.55)] transition hover:bg-primary-dark"
            >
              Get LeadFlow
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore pricing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
