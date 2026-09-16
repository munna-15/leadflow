"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
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

const intelligenceSteps = [
  {
    number: "01",
    label: "Understand",
    title: "Read the conversation as context.",
    description:
      "LeadFlow starts with the customer's actual message instead of forcing your team to manually translate every inquiry into structured information.",
    icon: MessageSquareText,
    signal: "Conversation context",
  },
  {
    number: "02",
    label: "Extract",
    title: "Turn important details into structure.",
    description:
      "Relevant requirements such as location, budget, timeline, service type, or other business-specific details can be surfaced from the conversation.",
    icon: BrainCircuit,
    signal: "Structured data",
  },
  {
    number: "03",
    label: "Interpret",
    title: "Identify intent and buying signals.",
    description:
      "The system can interpret the context of an inquiry and identify signals that help your team understand how serious or relevant the opportunity may be.",
    icon: Target,
    signal: "Intent signals",
  },
  {
    number: "04",
    label: "Score",
    title: "Create a clearer priority signal.",
    description:
      "A lead score and temperature can help teams focus their attention where the available information suggests there is stronger intent.",
    icon: TrendingUp,
    signal: "Priority signal",
  },
  {
    number: "05",
    label: "Recommend",
    title: "Suggest what should happen next.",
    description:
      "Instead of stopping at analysis, LeadFlow turns the available context into a practical next-action suggestion for the sales team.",
    icon: Sparkles,
    signal: "Next action",
  },
];

const intelligenceDetails = [
  {
    number: "01",
    label: "Understand",
    title: "Read the conversation as context.",
    description:
      "LeadFlow starts from the customer's actual words, helping the system understand the inquiry before extracting individual data points.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    label: "Extract",
    title: "Turn important details into structure.",
    description:
      "Requirements such as location, budget, property type, timeline and other business-specific information can be surfaced from the conversation.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    label: "Interpret",
    title: "Identify intent and buying signals.",
    description:
      "The system interprets the available context and surfaces signals that can help the sales team understand the opportunity.",
    icon: Target,
  },
  {
    number: "04",
    label: "Score",
    title: "Create a clearer priority signal.",
    description:
      "Lead score and temperature provide an additional layer of context so teams can decide where attention may be most useful.",
    icon: TrendingUp,
  },
  {
    number: "05",
    label: "Recommend",
    title: "Suggest what should happen next.",
    description:
      "LeadFlow connects the available intelligence to a practical next action instead of ending the process with analysis alone.",
    icon: Sparkles,
  },
];

const conversations = [
  {
    customer:
      "I need a 3 bedroom apartment in Bashundhara. My budget is around 1 crore and I want to move next month.",
    ai: "Got it. I'm identifying the requirements, intent and timing behind this inquiry.",
    details: [
      ["Property", "3 bedroom apartment"],
      ["Location", "Bashundhara"],
      ["Budget", "৳1 Crore"],
      ["Timeline", "Next month"],
    ],
    score: "92",
    temperature: "Hot",
    action: "Contact today and confirm property availability.",
  },
  {
    customer:
      "I'm looking for a family apartment near Bashundhara. We need 3 bedrooms and would like to move soon.",
    ai: "I found a clear property requirement with a near-term timeline. Building the lead signal now.",
    details: [
      ["Property", "Family apartment"],
      ["Location", "Bashundhara"],
      ["Bedrooms", "3 bedroom"],
      ["Timeline", "Near-term"],
    ],
    score: "88",
    temperature: "Hot",
    action: "Follow up today and confirm suitable listings.",
  },
  {
    customer:
      "Can you help me find an apartment around Bashundhara? My budget is close to 1 crore.",
    ai: "The inquiry has a clear location and budget. I'm checking the available intent signals.",
    details: [
      ["Intent", "Property search"],
      ["Location", "Bashundhara"],
      ["Budget", "৳1 Crore"],
      ["Signal", "Qualified"],
    ],
    score: "84",
    temperature: "Warm",
    action: "Ask about preferred bedrooms and move timeline.",
  },
];

const typingSpeed = 28;

function TypingText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;

    setVisibleText("");

    const interval = window.setInterval(() => {
      index += 1;

      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
        onComplete?.();
      }
    }, typingSpeed);

    return () => window.clearInterval(interval);
  }, [text, onComplete]);

  return <>{visibleText}</>;
}

function AIChatPreview() {
  const [conversationIndex, setConversationIndex] = useState(0);

  const [phase, setPhase] = useState<
    "customer" | "thinking" | "response" | "details" | "complete"
  >("customer");

  const conversation = conversations[conversationIndex];

  const handleCustomerComplete = () => {
    window.setTimeout(() => {
      setPhase("thinking");
    }, 500);
  };

  useEffect(() => {
    if (phase !== "thinking") return;

    const timer = window.setTimeout(() => {
      setPhase("response");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const handleResponseComplete = () => {
    window.setTimeout(() => {
      setPhase("details");
    }, 550);
  };

  useEffect(() => {
    if (phase !== "details") return;

    const timer = window.setTimeout(() => {
      setPhase("complete");
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "complete") return;

    const timer = window.setTimeout(() => {
      setConversationIndex((current) =>
        current === conversations.length - 1 ? 0 : current + 1,
      );

      setPhase("customer");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/[0.055] blur-3xl" />

      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-[0_30px_90px_-35px_rgba(15,23,42,0.25)]">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <BrainCircuit className="h-5 w-5 text-primary" />

              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                LeadFlow AI
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-xs text-muted">Live lead analysis</p>
              </div>
            </div>
          </div>

          <div className="hidden rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-muted sm:block">
            Decision support
          </div>
        </div>

        {/* CHAT VIEWPORT */}
        <div className="h-[44rem] bg-gradient-to-b from-white via-white to-slate-50/70 p-5 sm:h-[42rem] sm:p-6">
          {/* CHAT LABEL */}
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              AI conversation
            </span>
          </div>

          <div className="flex h-[calc(100%-2rem)] min-h-0 flex-col gap-3">
            {/* CUSTOMER MESSAGE AREA */}
            <div className="h-[10rem] shrink-0">
              <motion.div
                key={`customer-${conversationIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: phase === "complete" ? 0 : 1,
                  y: phase === "complete" ? -8 : 0,
                }}
                transition={{ duration: 0.35 }}
                className="flex justify-end"
              >
                <div className="max-w-[88%]">
                  <div className="mb-1.5 flex items-center justify-end gap-2">
                    <span className="text-[11px] font-medium text-muted">
                      Customer
                    </span>

                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <UserRound className="h-3 w-3 text-slate-500" />
                    </div>
                  </div>

                  <div className="rounded-2xl rounded-tr-md bg-slate-900 px-4 py-3 text-sm leading-5 text-white shadow-sm break-words">
                    <TypingText
                      key={`customer-text-${conversationIndex}`}
                      text={conversation.customer}
                      onComplete={handleCustomerComplete}
                    />

                    {phase === "customer" && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                        }}
                        className="ml-0.5 inline-block h-4 w-px bg-primary align-middle"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* AI RESPONSE AREA */}
            <div className="h-[10rem] shrink-0">
              {(phase === "thinking" ||
                phase === "response" ||
                phase === "details") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>

                  <div className="min-w-0 max-w-[86%]">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-muted">
                        LeadFlow AI
                      </span>

                      <span className="text-[10px] text-slate-400">
                        analyzing
                      </span>
                    </div>

                    {/* THINKING */}
                    {phase === "thinking" && (
                      <div className="flex h-10 items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-white px-4 shadow-sm">
                        {[0, 1, 2].map((item) => (
                          <motion.span
                            key={item}
                            animate={{
                              y: [0, -4, 0],
                              opacity: [0.35, 1, 0.35],
                            }}
                            transition={{
                              duration: 0.9,
                              repeat: Infinity,
                              delay: item * 0.15,
                            }}
                            className="h-1.5 w-1.5 rounded-full bg-primary"
                          />
                        ))}
                      </div>
                    )}

                    {/* AI RESPONSE */}
                    {phase !== "thinking" && (
                      <div className="rounded-2xl rounded-tl-md border border-border bg-white px-4 py-3 text-sm leading-5 text-body shadow-sm break-words">
                        <TypingText
                          key={`response-${conversationIndex}`}
                          text={conversation.ai}
                          onComplete={handleResponseComplete}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* INTELLIGENCE RESULT AREA */}
            <div className="min-h-0 flex-1">
              {(phase === "details" || phase === "complete") && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: phase === "complete" ? 0 : 1,
                    y: phase === "complete" ? -8 : 0,
                  }}
                  transition={{ duration: 0.35 }}
                  className="h-full"
                >
                  <div className="h-full rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-3.5">
                    {/* RESULT HEADER */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-primary" />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                          Signals identified
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-emerald-600">
                        Structured
                      </span>
                    </div>

                    {/* EXTRACTED DETAILS */}
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      {conversation.details.map(([label, value], index) => (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06 }}
                          className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5"
                        >
                          <p className="text-[9px] font-medium uppercase tracking-wide text-muted">
                            {label}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] font-semibold leading-4 text-foreground">
                            {value}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* SCORE + TEMPERATURE */}
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      <div className="rounded-lg bg-slate-950 px-2.5 py-1.5">
                        <p className="text-[9px] font-medium text-slate-400">
                          Lead score
                        </p>

                        <div className="mt-0.5 flex items-baseline gap-1">
                          <span className="text-lg font-semibold leading-none text-white">
                            {conversation.score}
                          </span>

                          <span className="text-[9px] text-slate-500">
                            / 100
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-orange-50 px-2.5 py-1.5">
                        <p className="text-[9px] font-medium text-orange-700/70">
                          Temperature
                        </p>

                        <div className="mt-0.5 flex items-center gap-1.5">
                          <Thermometer className="h-3 w-3 text-orange-600" />

                          <span className="text-xs font-semibold text-orange-700">
                            {conversation.temperature}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RECOMMENDED ACTION */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-1.5 rounded-lg bg-primary-soft/70 px-2.5 py-2"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary-dark" />

                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-primary-dark">
                            Recommended next action
                          </p>

                          <p className="mt-0.5 text-[11px] font-semibold leading-4 text-slate-800">
                            {conversation.action}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-border bg-white px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI assistant active
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {conversationIndex + 1} / {conversations.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AIPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* NAVBAR */}
      <SiteNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl" />

        <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-12 lg:py-10 xl:gap-20">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Lead intelligence
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-[4.35rem] xl:text-[4.7rem]">
              AI that helps your team{" "}
              <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                understand the lead.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-body sm:text-lg sm:leading-8">
              LeadFlow turns unstructured customer inquiries into useful
              context, priority signals, and a clearer next action.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Understand inquiries
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Surface intent
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Recommend actions
              </span>
            </div>
          </motion.div>

          {/* RIGHT — LIVE AI CHATBOT */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative"
          >
            <AIChatPreview />
          </motion.div>
        </div>
      </section>

      {/* FROM MESSAGE TO ACTION */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.12em] text-primary">
              FROM MESSAGE TO ACTION
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl">
              AI is part of the workflow, not a separate feature.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Every intelligence step exists to make the next sales decision
              clearer.
            </p>
          </div>

          {/* CONNECTED CARDS */}
          <div className="relative mt-14">
            <div className="absolute left-[10%] right-[10%] top-14 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent xl:block" />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {intelligenceSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.number}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.07,
                    }}
                    className="group relative"
                  >
                    <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,0.32)]">
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/[0.045] blur-2xl transition-opacity group-hover:bg-primary/[0.09]" />

                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400">
                            {step.number}
                          </span>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-slate-100 transition group-hover:bg-primary-soft group-hover:ring-primary/10">
                            <Icon className="h-[18px] w-[18px]" />
                          </div>
                        </div>

                        <div className="mt-8">
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-dark">
                            {step.label}
                          </p>

                          <h3 className="mt-2 min-h-[3.5rem] text-lg font-semibold leading-6 tracking-tight text-foreground">
                            {step.title}
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-muted">
                            {step.description}
                          </p>
                        </div>

                        <div className="mt-6 border-t border-border pt-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium text-muted">
                              Intelligence layer
                            </span>

                            <span className="text-right text-[11px] font-semibold text-primary-dark">
                              {step.signal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index < intelligenceSteps.length - 1 && (
                      <div className="absolute -right-3 top-14 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-white xl:flex">
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* INTELLIGENCE DETAILS */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-semibold tracking-[0.12em] text-primary">
                INTELLIGENCE LAYER
              </p>

              <h2 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl">
                Five connected intelligence steps.
              </h2>

              <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
                LeadFlow does not need AI to replace your sales team. It uses AI
                to reduce the amount of interpretation and manual organization
                required before the team can act.
              </p>

              <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      AI decision support
                    </p>

                    <p className="text-xs text-muted">
                      Built around the sales workflow
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {["Understand", "Prioritize", "Recommend"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl bg-background px-3.5 py-3"
                    >
                      <span className="text-sm text-body">{item}</span>

                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {intelligenceDetails.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.number}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                    className="group rounded-[1.5rem] border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_20px_55px_-35px_rgba(15,23,42,0.28)] sm:p-7"
                  >
                    <div className="flex gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary transition group-hover:bg-primary-soft">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-bold tracking-[0.14em] text-slate-400">
                              STEP {step.number}
                            </span>

                            <p className="mt-1 text-sm font-semibold text-primary-dark">
                              {step.label}
                            </p>
                          </div>

                          <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-background text-slate-400 sm:flex">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                          {step.title}
                        </h3>

                        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* AI SUMMARY */}
      <section className="bg-[#111827] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24 lg:px-12 lg:py-28">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              AI summary
            </div>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Give the sales team the context before the conversation.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
              Instead of opening multiple messages and manually reconstructing
              the customer's needs, the team can start with a concise summary
              and then inspect the underlying details.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Customer requirements are visible.",
                "Intent and priority signals are surfaced.",
                "The next action is easier to understand.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <UserRound className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold">Rahim Ahmed</p>
                  <p className="text-xs text-slate-500">Website inquiry</p>
                </div>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Hot
              </span>
            </div>

            <div className="py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI summary
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                High-intent buyer looking for a 3-bedroom apartment in
                Bashundhara with an approximate budget of ৳1 Crore and a target
                move timeline of next month.
              </p>
            </div>

            <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.035] p-4">
                <p className="text-xs text-slate-500">Priority</p>

                <p className="mt-1 text-sm font-semibold text-white">
                  High attention
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.035] p-4">
                <p className="text-xs text-slate-500">Next action</p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Contact today
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.06] p-4">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <p className="text-xs leading-5 text-slate-300">
                AI outputs are decision-support signals. Your team can review
                the underlying lead information before taking action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE AI */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-[0.12em] text-primary">
              HUMAN + AI
            </p>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              AI should make decisions clearer, not make them for your team.
            </h2>

            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              LeadFlow is designed to surface useful signals while keeping the
              underlying customer information visible to the people making the
              final sales decision.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Context",
                text: "See the original inquiry alongside extracted information.",
              },
              {
                number: "02",
                title: "Signals",
                text: "Use scores, intent, and temperature as supporting information.",
              },
              {
                number: "03",
                title: "Action",
                text: "Let your team decide what to do with the available context.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <span className="text-xs font-bold tracking-[0.14em] text-primary">
                  {item.number}
                </span>

                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#111827] px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-primary">
                  Lead intelligence
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                  Turn customer conversations into useful sales context.
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                  Explore the experience or talk to us about bringing LeadFlow
                  into your business workflow.
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

      {/* FOOTER */}
      <SiteFooter/>
    </main>
  );
}
