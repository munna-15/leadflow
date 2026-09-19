"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Database,
  Layers3,
  Lightbulb,
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
      "LeadFlow can capture incoming leads, understand their intent and requirements, score the opportunity, and surface what your team should act on first.",
    intent: "Lead qualification",
    score: 94,
    temperature: "Hot",
    signals: [
      "Clear business need",
      "Immediate sales priority",
      "Strong buying intent",
    ],
    nextAction:
      "Prioritize the lead for sales review and start a focused follow-up.",
    stage: "Qualified",
  },
  {
    customer:
      "Our team gets lots of inquiries. We need to know which leads are actually ready to buy.",
    response:
      "LeadFlow can analyze urgency, requirements, engagement and buying signals, then turn them into a practical qualification score for your sales team.",
    intent: "Buying intent",
    score: 91,
    temperature: "Hot",
    signals: [
      "Explicit buying signal",
      "High urgency",
      "Requirements identified",
    ],
    nextAction:
      "Move the lead forward in the pipeline and assign an immediate follow-up.",
    stage: "Qualified",
  },
  {
    customer:
      "Can it tell my team what to do next instead of just giving us another dashboard?",
    response:
      "Yes. LeadFlow combines lead context, recent activity and pipeline stage to suggest a clear next action so your team can move from information to action.",
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
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
        style={{
          animationDelay: "120ms",
        }}
      />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
        style={{
          animationDelay: "240ms",
        }}
      />
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
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-b-0">
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
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-primary/[0.05] blur-3xl"
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
        className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-[0_28px_80px_-34px_rgba(15,23,42,0.28)]"
      >
        {/* HEADER */}
        <div className="border-b border-border/80 bg-white/95 px-4 py-3.5 backdrop-blur sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <BrainCircuit className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    LeadFlow AI
                  </p>

                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-primary">
                    Preview
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] text-muted">
                  Understand → qualify → act
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* COMPACT CHAT VIEWPORT */}
        <div className="h-[34rem] overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/90 px-3.5 py-3.5 sm:h-[35rem] sm:px-4 sm:py-4">
          <div className="mx-auto flex h-full max-w-[500px] flex-col">
            <div className="mb-3 flex items-center justify-center">
              <span className="rounded-full border border-border/70 bg-surface px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                Example workflow
              </span>
            </div>

            {/* CUSTOMER */}
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
              className="ml-auto w-full max-w-[90%] sm:max-w-[84%]"
            >
              <div className="flex items-start justify-end gap-2.5">
                <div className="min-w-0 rounded-[1.2rem] rounded-tr-md bg-[#111827] px-3.5 py-3 text-[12px] leading-5 !text-white shadow-sm sm:px-4 sm:py-3.5 sm:text-[13px] sm:leading-5">
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

            {/* THINKING */}
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

                <div className="rounded-[1.2rem] rounded-tl-md border border-border bg-surface px-3.5 py-2.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ChatTypingIndicator />

                    <span className="text-[10px] font-medium text-muted">
                      Understanding context…
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI REPLY */}
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
                    <div className="rounded-[1.2rem] rounded-tl-md border border-primary/15 bg-primary-soft/45 px-3.5 py-3.5 shadow-sm sm:px-4">
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

                    {/* DETAILS */}
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
                        className="mt-3 overflow-hidden rounded-[1.15rem] border border-border bg-white shadow-sm"
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
                          <div className="rounded-lg border border-border/70 bg-background/60 p-2.5">
                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                              Intent
                            </p>

                            <p className="mt-1 text-[11px] font-semibold leading-4 text-foreground">
                              {conversation.intent}
                            </p>
                          </div>

                          <div className="rounded-lg border border-border/70 bg-background/60 p-2.5">
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

                        <div className="mx-3.5 my-3 rounded-lg border border-primary/10 bg-primary-soft/30 p-2.5 sm:mx-4">
                          <div className="flex items-start gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
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
                                <CheckCircle2 className="h-2.5 w-2.5 text-success" />
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

            {/* BOTTOM STATUS */}
            <div className="mt-auto pt-4">
              <div className="flex items-center justify-center gap-2 border-t border-border/70 pt-3">
                <ShieldCheck className="h-3 w-3 text-primary" />

                <p className="text-center text-[8px] leading-4 text-muted">
                  AI surfaces signals and recommendations. Your team stays in
                  control of the final decision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-border/80 bg-surface px-4 py-3 sm:px-5">
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

const capabilities = [
  {
    number: "01",
    icon: Database,
    title: "Capture",
    description:
      "Bring incoming leads into one structured workspace instead of scattering them across forms, spreadsheets and inboxes.",
    points: [
      "Central lead records",
      "Source and contact context",
      "Consistent lead data",
    ],
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Understand",
    description:
      "Use AI to interpret what a lead actually wants instead of relying only on raw form fields.",
    points: ["Intent detection", "Requirement extraction", "AI summaries"],
  },
  {
    number: "03",
    icon: Target,
    title: "Qualify",
    description:
      "Turn useful buying signals into qualification scores so the team can focus where commercial attention matters.",
    points: ["Lead scoring", "Temperature", "Buying signals"],
  },
  {
    number: "04",
    icon: Workflow,
    title: "Move",
    description:
      "Keep qualified opportunities connected to pipeline stages, ownership and the next step.",
    points: ["Pipeline movement", "Lead assignment", "Activity context"],
  },
  {
    number: "05",
    icon: Lightbulb,
    title: "Act",
    description:
      "Convert context into practical next actions so your team knows what deserves attention now.",
    points: [
      "Follow-up guidance",
      "Next-action suggestions",
      "Prioritized work",
    ],
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
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(430px,560px)] lg:gap-14 xl:gap-18">
          {/* LEFT */}
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
              LeadFlow helps businesses capture leads, understand intent,
              qualify opportunities, prioritize sales attention, and decide what
              should happen next.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Lead capture",
                "AI qualification",
                "Lead scoring",
                "Pipeline",
                "Follow-ups",
                "Next actions",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-7 grid max-w-xl gap-2.5 sm:grid-cols-2">
              {[
                "Understand what a lead wants",
                "Identify opportunities that need attention",
                "Keep sales activity connected",
                "Guide the team toward the next step",
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
                <ArrowRight className="h-4 w-4 text-white" />
              </Link>

              <Link
                href="/product"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-primary-soft/30"
              >
                Explore the product
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <BrainCircuit className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                    AI layer
                  </p>

                  <p className="text-[11px] font-semibold text-foreground">
                    Context + intent + action
                  </p>
                </div>
              </div>

              <div className="hidden h-7 w-px bg-border sm:block" />

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-muted">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                    Human control
                  </p>

                  <p className="text-[11px] font-semibold text-foreground">
                    Review before action
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <AIChatPreview />
        </div>
      </div>
    </section>
  );
}

function CapabilitySection() {
  return (
    <section className="relative overflow-hidden bg-surface">
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
            amount: 0.25,
          }}
          transition={{
            duration: 0.6,
            ease,
          }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-primary" />

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              What LeadFlow actually does
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
            AI is not the feature.
            <span className="block text-primary">
              Better sales decisions are.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            LeadFlow combines operational workflow with AI intelligence so teams
            can understand leads faster, focus attention better and keep the
            path from inquiry to follow-up connected.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-border bg-border lg:grid-cols-5">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;

            return (
              <motion.article
                key={capability.number}
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
                  amount: 0.18,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease,
                }}
                className="group relative bg-surface p-6 transition-colors duration-300 hover:bg-slate-50 sm:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    {capability.number}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">
                  {capability.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {capability.description}
                </p>

                <div className="mt-7 space-y-2.5">
                  {capability.points.map((point) => (
                    <div key={point} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                      <span className="text-xs font-medium text-muted">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-16"
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const actionSteps = [
  {
    number: "01",
    icon: MessageSquareText,
    label: "Message",
    title: "A lead arrives",
    description:
      "A prospect shares a question, requirement, budget, timeline or business need.",
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
      "Intent, engagement and requirements contribute to a qualification picture.",
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

function MessageToActionSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.08),transparent_36%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              ease,
            }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary" />

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                From message to action
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              One connected intelligence loop.
            </h2>
          </motion.div>

          <p className="max-w-md text-sm leading-6 text-muted sm:text-base">
            Instead of turning every interaction into a task for a human to
            interpret manually, LeadFlow structures useful context along the
            way.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-4 top-4 hidden h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 lg:right-4 lg:block"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-4 left-4 top-4 w-px bg-gradient-to-b from-primary/20 via-border to-primary/20 lg:hidden"
          />

          <div className="grid lg:grid-cols-5">
            {actionSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
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
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:shadow-[0_0_0_6px_rgba(14,165,233,0.08)]">
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
                </motion.div>
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
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
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

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              Go beyond a lead record.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              A lead is more useful when your team can see what the person
              wants, how strong the opportunity looks, what changed recently,
              and what should happen next.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Target,
                  title: "Intent",
                  text: "Understand the business reason behind the inquiry.",
                },
                {
                  icon: BarChart3,
                  title: "Score",
                  text: "Translate useful signals into a practical qualification picture.",
                },
                {
                  icon: TrendingUp,
                  title: "Momentum",
                  text: "See whether the opportunity is becoming more or less actionable.",
                },
                {
                  icon: Lightbulb,
                  title: "Next action",
                  text: "Give the team a clear point to review and act on.",
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

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background shadow-[0_24px_80px_-30px_rgba(15,23,42,0.2)]">
              <div className="border-b border-border bg-surface px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Lead intelligence
                    </p>

                    <p className="mt-1 text-[11px] text-muted">
                      Example of how context can be structured
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

                  <div className="text-right">
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
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                        Intent
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Apartment purchase
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                        Budget
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-foreground">
                      ৳1 Crore
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Layers3 className="h-4 w-4 text-primary" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                        Requirement
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-foreground">
                      3-bedroom apartment
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-primary" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
                        Timeline
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Next month
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-primary/10 bg-primary-soft/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                      <Lightbulb className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                        Suggested next action
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-foreground">
                        Contact the lead with matching inventory, confirm
                        availability and move the opportunity toward a meeting.
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

                  <div className="mt-3 flex items-center gap-1.5">
                    {["New", "Qualified", "Contacted", "Meeting", "Won"].map(
                      (stage, index) => (
                        <div
                          key={stage}
                          className="flex min-w-0 flex-1 flex-col gap-2"
                        >
                          <div
                            className={`h-1.5 rounded-full ${
                              index <= 1 ? "bg-primary" : "bg-border"
                            }`}
                          />

                          <span className="truncate text-[9px] font-medium text-muted">
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

function AISummarySection() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220] text-white">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-primary/[0.09] blur-3xl" />

        <div className="absolute bottom-[-14rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-sky-500/[0.06] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              ease,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary" />

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                AI summary
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Turn scattered signals into one useful read.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/58 sm:text-lg">
              Instead of forcing your team to reconstruct a lead's situation
              from notes, fields and activity logs, LeadFlow can present the
              important context together.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                "Intent",
                "Requirements",
                "Engagement",
                "Qualification",
                "Next action",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs font-semibold text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

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
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease,
            }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_30px_90px_-35px_rgba(0,0,0,0.55)]">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      AI relationship read
                    </p>

                    <p className="mt-1 text-[11px] text-white/35">
                      Example output for a qualified opportunity
                    </p>
                  </div>

                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  Summary
                </p>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/82">
                  High-intent buyer looking for a three-bedroom apartment in
                  Bashundhara with a budget around ৳1 Crore and a target
                  timeline of next month.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Intent",
                      value: "Property purchase",
                    },
                    {
                      label: "Priority",
                      value: "Hot lead",
                    },
                    {
                      label: "Stage",
                      value: "Qualified",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">
                        {item.label}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white/75">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/[0.055] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-primary">
                      <Lightbulb className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                        Suggested next action
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-white/68">
                        Confirm inventory fit, schedule a focused follow-up and
                        keep the opportunity moving toward a meeting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />

                    <span className="text-xs font-medium text-white/48">
                      Structured for sales review
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                    Human review
                  </span>
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
        "AI can surface signals and recommendations, while the team remains responsible for business decisions.",
    },
    {
      icon: Database,
      title: "Context matters",
      description:
        "Recommendations should be grounded in lead information, activity and workflow context instead of isolated guesses.",
    },
    {
      icon: Target,
      title: "Useful beats impressive",
      description:
        "The goal is not more AI output. The goal is clearer prioritization and more actionable sales work.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background">
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
              LeadFlow is designed as a decision-support layer inside a sales
              workflow. The team still reviews context, decides what matters and
              takes responsibility for the outcome.
            </p>
          </motion.div>

          <div className="space-y-4">
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-105">
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
    <section className="relative overflow-hidden border-t border-border bg-surface">
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
            Build a clearer sales workflow
          </p>

          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
            Make every lead easier to understand.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Explore how LeadFlow can combine lead management, AI qualification,
            pipeline intelligence and follow-up guidance into one connected
            workflow.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/get-started"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f2937] hover:!text-white"
            >
              Get started with LeadFlow
              <ArrowRight className="h-4 w-4 text-white" />
            </Link>

            <Link
              href="/demo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-primary-soft/30"
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

        <CapabilitySection />

        <MessageToActionSection />

        <IntelligenceSection />

        <AISummarySection />

        <ResponsibleAISection />

        <CTASection />
      </main>

      <SiteFooter />
    </div>
  );
}
