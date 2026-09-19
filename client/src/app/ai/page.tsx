"use client";

import Link from "next/link";

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Database,
  Lightbulb,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { motion } from "motion/react";

import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteFooter from "@/components/home/SiteFooter";

const typingSpeed = 24;

const ease = [0.22, 1, 0.36, 1] as const;

type ChatPhase = "customer" | "thinking" | "response" | "details" | "complete";

type Conversation = {
  customer: string;
  response: string;
  intent: string;
  score: number;
  temperature: "Hot" | "Warm";
  signals: string[];
  nextAction: string;
  stage: string;
};

const conversations: Conversation[] = [
  {
    customer:
      "I need a system that can capture website leads and tell my sales team which ones need attention first.",
    response:
      "LeadFlow can capture the inquiry, understand its intent, score the opportunity and surface what your team should review first.",
    intent: "Lead qualification",
    score: 94,
    temperature: "Hot",
    signals: [
      "Clear business need",
      "Immediate priority",
      "Strong buying intent",
    ],
    nextAction: "Prioritize for sales review and start a focused follow-up.",
    stage: "Qualified",
  },
  {
    customer:
      "Our team gets lots of inquiries. We need to know which leads are actually ready to buy.",
    response:
      "LeadFlow can interpret urgency, requirements, engagement and buying signals, then turn them into a practical qualification picture.",
    intent: "Buying intent",
    score: 91,
    temperature: "Hot",
    signals: [
      "Explicit buying signal",
      "High urgency",
      "Requirements identified",
    ],
    nextAction: "Move the lead forward and assign an immediate follow-up.",
    stage: "Qualified",
  },
  {
    customer:
      "Can it tell my team what to do next instead of giving us another dashboard?",
    response:
      "Yes. LeadFlow combines lead context, recent activity and pipeline stage to suggest a clear next action.",
    intent: "Next-action guidance",
    score: 88,
    temperature: "Warm",
    signals: ["Active opportunity", "Recent activity", "Actionable context"],
    nextAction:
      "Review the latest activity and contact the lead with a focused follow-up.",
    stage: "Contacted",
  },
];

function TypingText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [visibleText, setVisibleText] = useState("");

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let index = 0;
    let completed = false;

    setVisibleText("");

    if (!text) {
      onCompleteRef.current?.();
      return;
    }

    const interval = window.setInterval(() => {
      index += 1;

      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);

        if (!completed) {
          completed = true;
          onCompleteRef.current?.();
        }
      }
    }, typingSpeed);

    return () => {
      window.clearInterval(interval);
    };
  }, [text]);

  return <>{visibleText}</>;
}

function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      {[0, 120, 240].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
          style={{
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

function ChatSignal({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />

        <span className="truncate text-[11px] font-medium text-muted">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-[11px] font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function AIChatPreview() {
  const [conversationIndex, setConversationIndex] = useState(0);

  const [phase, setPhase] = useState<ChatPhase>("customer");

  const conversation = conversations[conversationIndex];

  const handleCustomerComplete = useCallback(() => {
    setPhase("thinking");
  }, []);

  const handleResponseComplete = useCallback(() => {
    setPhase("details");
  }, []);

  useEffect(() => {
    if (phase !== "thinking") {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase("response");
    }, 750);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "details") {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase("complete");
    }, 2800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "complete") {
      return;
    }

    const timer = window.setTimeout(() => {
      setConversationIndex((current) =>
        current === conversations.length - 1 ? 0 : current + 1,
      );

      setPhase("customer");
    }, 650);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  const replyVisible =
    phase === "response" || phase === "details" || phase === "complete";

  const detailsVisible = phase === "details" || phase === "complete";

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-[3rem] bg-primary/[0.055] blur-3xl"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease,
        }}
        className="overflow-hidden rounded-[1.9rem] border border-border bg-white shadow-[0_30px_90px_-42px_rgba(15,23,42,0.3)]"
      >
        {/* Header */}
        <div className="border-b border-border/80 bg-white px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <BrainCircuit className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    LeadFlow AI
                  </p>

                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-primary">
                    Live preview
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] text-muted">
                  Understand · qualify · act
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_10px_rgba(16,185,129,0.45)]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div className="min-h-[34rem] bg-gradient-to-b from-white via-white to-slate-50/90 px-3.5 py-4 sm:px-5 sm:py-5">
          <div className="flex min-h-[30rem] flex-col">
            <div className="mb-4 flex items-center justify-center">
              <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-muted shadow-sm">
                Example workflow
              </span>
            </div>

            {/* Customer message */}
            <motion.div
              key={`customer-${conversationIndex}`}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease,
              }}
              className="ml-auto w-full max-w-[94%] sm:max-w-[86%]"
            >
              <div className="flex items-start justify-end gap-2.5">
                <div className="min-w-0 rounded-[1.25rem] rounded-tr-md bg-[#111827] px-3.5 py-3 text-[12px] leading-5 text-white shadow-[0_12px_30px_-18px_rgba(15,23,42,0.55)] sm:px-4 sm:py-3.5 sm:text-[13px] sm:leading-5">
                  <TypingText
                    text={conversation.customer}
                    onComplete={handleCustomerComplete}
                  />
                </div>

                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-muted">
                  <Users className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-1.5 text-right text-[9px] font-medium text-muted">
                Customer
              </div>
            </motion.div>

            {/* Thinking */}
            {phase === "thinking" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="mt-5 flex items-start gap-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <div className="rounded-[1.2rem] rounded-tl-md border border-border bg-white px-3.5 py-2.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ChatTypingIndicator />

                    <span className="text-[10px] font-medium text-muted">
                      Understanding context…
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI reply */}
            {replyVisible && (
              <motion.div
                key={`assistant-${conversationIndex}`}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease,
                }}
                className="mt-5"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                    <BrainCircuit className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="min-h-[7rem] rounded-[1.2rem] rounded-tl-md border border-primary/15 bg-primary-soft/45 px-3.5 py-3.5 shadow-sm sm:px-4">
                      <p className="text-[12px] leading-5 text-foreground sm:text-[13px] sm:leading-5">
                        <TypingText
                          text={conversation.response}
                          onComplete={handleResponseComplete}
                        />

                        {phase === "response" && (
                          <span className="ml-0.5 inline-block h-3.5 w-px translate-y-[2px] animate-pulse bg-primary" />
                        )}
                      </p>
                    </div>

                    <div className="mt-1.5 text-[9px] font-medium text-muted">
                      LeadFlow AI
                    </div>

                    {/* Intelligence */}
                    {detailsVisible && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.45,
                          ease,
                        }}
                        className="mt-3 rounded-[1.2rem] border border-border bg-white shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-slate-50/80 px-3.5 py-2.5 sm:px-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />

                            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-foreground">
                              Lead intelligence
                            </p>
                          </div>

                          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-primary">
                            AI enriched
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 p-3.5 sm:p-4">
                          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                              Intent
                            </p>

                            <p className="mt-1 text-[11px] font-semibold leading-4 text-foreground">
                              {conversation.intent}
                            </p>
                          </div>

                          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                              Score
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                              <p className="text-base font-semibold text-foreground">
                                {conversation.score}
                              </p>

                              <span
                                className={`text-[8px] font-bold uppercase tracking-[0.08em] ${
                                  conversation.temperature === "Hot"
                                    ? "text-danger"
                                    : "text-warning"
                                }`}
                              >
                                {conversation.temperature}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="px-3.5 sm:px-4">
                          <ChatSignal
                            icon={Layers3}
                            label="Pipeline stage"
                            value={conversation.stage}
                          />

                          <ChatSignal
                            icon={Zap}
                            label="Next action"
                            value="Suggested"
                          />
                        </div>

                        <div className="mx-3.5 my-3 rounded-xl border border-primary/10 bg-primary-soft/30 p-3 sm:mx-4">
                          <div className="flex items-start gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
                              <Lightbulb className="h-3.5 w-3.5" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-primary">
                                Recommended next move
                              </p>

                              <p className="mt-1 text-[10px] leading-4 text-foreground">
                                {conversation.nextAction}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border/70 px-3.5 py-3 sm:px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {conversation.signals.map((signal) => (
                              <span
                                key={signal}
                                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/60 px-2 py-1 text-[8px] font-medium text-muted"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-success" />

                                {signal}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom status */}
            <div className="mt-auto pt-5">
              <div className="flex items-center justify-center gap-2 border-t border-border/70 pt-4">
                <ShieldCheck className="h-3 w-3 shrink-0 text-primary" />

                <p className="text-center text-[8px] leading-4 text-muted">
                  AI surfaces signals and recommendations. Your team stays in
                  control of the final decision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/80 bg-slate-50/70 px-4 py-3.5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <CircleDot className="h-3 w-3 shrink-0 text-primary" />

              <p className="truncate text-[8px] font-semibold uppercase tracking-[0.12em] text-muted sm:text-[9px]">
                Capture · Understand · Prioritize · Act
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 text-[8px] font-medium text-muted sm:text-[9px]">
              <Clock3 className="h-3 w-3" />
              Real-time workflow
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const workflowSteps = [
  {
    number: "01",
    icon: MessageSquareText,
    label: "Capture",
    title: "A lead arrives",
    description:
      "A prospect submits a question, requirement, budget, timeline or business need.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    label: "Understand",
    title: "AI reads the context",
    description:
      "LeadFlow turns raw information into structured intent and useful requirements.",
  },
  {
    number: "03",
    icon: Target,
    label: "Qualify",
    title: "Signals become priority",
    description:
      "Intent, engagement and requirements contribute to a practical qualification picture.",
  },
  {
    number: "04",
    icon: Workflow,
    label: "Move",
    title: "The opportunity gets context",
    description:
      "The lead stays connected to ownership, pipeline stage and recent activity.",
  },
  {
    number: "05",
    icon: Lightbulb,
    label: "Act",
    title: "The next step is clearer",
    description:
      "Your team gets a practical action instead of another disconnected data point.",
  },
];

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-primary/[0.055] blur-3xl" />

        <div className="absolute right-[-10rem] top-[8rem] h-[24rem] w-[24rem] rounded-full bg-sky-200/[0.18] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-18 pt-14 sm:px-8 sm:pb-22 sm:pt-18 lg:px-12 lg:pb-26 lg:pt-22">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(430px,560px)] lg:gap-14 xl:gap-18">
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
              duration: 0.7,
              ease,
            }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                AI for sales operations
              </span>
            </div>

            <h1 className="mt-5 text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-[4rem]">
              Turn lead
              <span className="block">conversations into</span>
              <span className="mt-1 block bg-gradient-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                useful action.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              LeadFlow captures incoming leads, understands intent, highlights
              useful buying signals and helps your team see what deserves
              attention next.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Lead capture",
                "AI qualification",
                "Lead scoring",
                "Pipeline context",
                "Next actions",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {[
                "Understand what a lead actually wants",
                "Surface opportunities that need attention",
                "Turn context into clearer sales action",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <span className="text-sm leading-6 text-muted">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/how-it-works"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f2937] hover:!text-white"
              >
                See how LeadFlow works
                <ArrowRight className="h-4 w-4 !text-white" />
              </Link>

              <Link
                href="/product"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-primary-soft/30"
              >
                Explore the product
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                  Human control
                </p>

                <p className="mt-0.5 text-[11px] font-semibold text-foreground">
                  AI supports decisions. Your team stays responsible.
                </p>
              </div>
            </div>
          </motion.div>

          <AIChatPreview />
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.22,
          }}
          transition={{
            duration: 0.6,
            ease,
          }}
          className="grid gap-7 lg:grid-cols-[1fr_auto]"
        >
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary" />

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                From lead to action
              </p>
            </div>

            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              One connected intelligence loop.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted sm:text-base">
            LeadFlow keeps the important context connected as a lead moves
            through the sales workflow.
          </p>
        </motion.div>

        <div className="relative mt-14 lg:mt-16">
          <div
            aria-hidden="true"
            className="absolute left-4 right-4 top-4 hidden h-px bg-gradient-to-r from-primary/15 via-primary/45 to-primary/15 lg:block"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-4 left-4 top-4 w-px bg-gradient-to-b from-primary/20 via-border to-primary/20 lg:hidden"
          />

          <div className="grid lg:grid-cols-5">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                    ease,
                  }}
                  className="group relative px-0 py-6 lg:px-4 lg:py-0 first:lg:pl-0 last:lg:pr-0"
                >
                  <div className="flex items-start gap-5 lg:block">
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:shadow-[0_0_0_6px_rgba(14,165,233,0.08)]">
                      <span className="text-[10px] font-bold tracking-[0.08em] text-muted transition-colors duration-300 group-hover:text-white">
                        {step.number}
                      </span>
                    </div>

                    <div className="min-w-0 pt-0.5 lg:mt-7 lg:pt-0">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                          {step.label}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                        {step.title}
                      </h3>

                      <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-16 lg:bottom-[-2.5rem]"
                  />
                </motion.article>
              );
            })}
          </div>
        </div>

        <div className="mt-14 flex items-center gap-3 border-t border-border pt-6 lg:mt-16">
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_5px_rgba(14,165,233,0.08)]" />

          <p className="text-xs font-medium tracking-wide text-muted">
            Capture → Understand → Qualify → Move → Act
          </p>
        </div>
      </div>
    </section>
  );
}

function IntelligenceSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
          <motion.div
            initial={{
              opacity: 0,
              x: -18,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.22,
            }}
            transition={{
              duration: 0.6,
              ease,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary" />

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Intelligence layer
              </p>
            </div>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              Give every lead more useful context.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              A lead becomes more actionable when your team can see intent,
              qualification, momentum and the next useful step without
              reconstructing the story manually.
            </p>

            <div className="mt-8 space-y-5">
              {[
                {
                  icon: Target,
                  title: "Intent",
                  text: "Understand the business reason behind the inquiry.",
                },
                {
                  icon: TrendingUp,
                  title: "Priority",
                  text: "Translate useful signals into a practical qualification picture.",
                },
                {
                  icon: Workflow,
                  title: "Momentum",
                  text: "Keep activity and pipeline context connected.",
                },
                {
                  icon: Lightbulb,
                  title: "Next action",
                  text: "Make the point of attention easier for the team to see.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>

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
              duration: 0.7,
              ease,
            }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[3rem] bg-primary/[0.045] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_24px_80px_-30px_rgba(15,23,42,0.2)]">
              <div className="border-b border-border bg-slate-50/80 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Example lead intelligence
                    </p>

                    <p className="mt-1 text-[11px] text-muted">
                      Structured context for sales review
                    </p>
                  </div>

                  <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                    AI enriched
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                      Opportunity
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      Property purchase
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      High-intent buyer · Bashundhara
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      Score
                    </p>

                    <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                      92
                    </p>

                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-danger">
                      Hot
                    </span>
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      icon: Target,
                      label: "Intent",
                      value: "Apartment purchase",
                    },
                    {
                      icon: Database,
                      label: "Budget",
                      value: "৳1 Crore",
                    },
                    {
                      icon: Layers3,
                      label: "Requirement",
                      value: "3-bedroom apartment",
                    },
                    {
                      icon: Clock3,
                      label: "Timeline",
                      value: "Next month",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-border bg-surface p-4"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />

                          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                            {item.label}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-primary/10 bg-primary-soft/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
                      <Lightbulb className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                        Suggested next action
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-foreground">
                        Confirm inventory fit, schedule a focused follow-up and
                        move the opportunity toward a meeting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-muted" />

                      <span className="text-xs font-semibold text-foreground">
                        Pipeline
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-primary">
                      Qualified
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-1.5">
                    {["New", "Qualified", "Contacted", "Meeting", "Won"].map(
                      (stage, index) => (
                        <div key={stage} className="min-w-0 flex-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              index <= 1 ? "bg-primary" : "bg-border"
                            }`}
                          />

                          <span className="mt-2 block truncate text-[9px] font-medium text-muted">
                            {stage}
                          </span>
                        </div>
                      ),
                    )}
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

function ResponsibleAISection() {
  const principles = [
    {
      icon: ShieldCheck,
      title: "Human review stays in control",
      description:
        "AI can surface signals and recommendations while the team remains responsible for business decisions.",
    },
    {
      icon: Database,
      title: "Context matters",
      description:
        "Useful recommendations should be grounded in lead information, activity and workflow context.",
    },
    {
      icon: Target,
      title: "Useful beats impressive",
      description:
        "The goal is not more AI output. The goal is clearer prioritization and more actionable sales work.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
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
              duration: 0.6,
              ease,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary" />

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Responsible AI
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              AI should reduce ambiguity, not remove human judgment.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              LeadFlow is designed as decision support inside a sales workflow.
              The team still reviews context, decides what matters and takes
              responsibility for the outcome.
            </p>
          </motion.div>

          <div className="space-y-5">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <motion.div
                  key={principle.title}
                  initial={{
                    opacity: 0,
                    x: 16,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.18,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease,
                  }}
                  className="group flex gap-4 border-b border-border pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {principle.title}
                    </h3>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
                      {principle.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(14,165,233,0.08),transparent_34%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease,
          }}
          className="mx-auto max-w-3xl"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            See LeadFlow in action
          </p>

          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
            Make every lead easier to understand.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Explore the product or start a conversation about how LeadFlow could
            fit your sales workflow.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/get-started"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f2937] hover:!text-white"
            >
              Get started with LeadFlow
              <ArrowRight className="h-4 w-4 !text-white" />
            </Link>

            <Link
              href="/demo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-primary-soft/30"
            >
              Explore the demo
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AIPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />

      <main>
        <Hero />
        <WorkflowSection />
        <IntelligenceSection />
        <ResponsibleAISection />
        <CTASection />
      </main>

      <SiteFooter />
    </div>
  );
}
