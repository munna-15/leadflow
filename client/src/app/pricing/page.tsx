"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Globe2,
  Layers3,
  Sparkles,
  Workflow,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import SiteNavbar from "@/components/layout/SiteNavbar";

import SiteFooter from "@/components/home/SiteFooter";

const plans = [
  {
    name: "LeadFlow Starter",
    eyebrow: "Core lead management",
    description:
      "A structured foundation for businesses that need one clear place to manage leads and follow-ups.",
    price: "Custom",
    icon: Layers3,
    features: [
      "Lead management",
      "Sales pipeline",
      "Follow-up tracking",
      "Core dashboard",
      "Team access",
    ],
    href: "/get-started",
    featured: false,
  },
  {
    name: "LeadFlow Intelligence",
    eyebrow: "AI-powered sales intelligence",
    description:
      "For teams that want to understand lead intent, prioritize opportunities and turn conversations into clearer actions.",
    price: "Custom",
    icon: Sparkles,
    features: [
      "Everything in Starter",
      "AI qualification",
      "Lead scoring",
      "Lead intelligence",
      "AI-generated summaries",
      "Recommended next actions",
      "Advanced analytics",
    ],
    href: "/get-started",
    featured: true,
  },
  {
    name: "LeadFlow Custom",
    eyebrow: "Built around your workflow",
    description:
      "For businesses that need custom integrations, automation or a LeadFlow setup shaped around their existing systems.",
    price: "Let's discuss",
    icon: Workflow,
    features: [
      "Custom business workflow",
      "Website integration",
      "Custom lead capture",
      "Automation",
      "Third-party integrations",
      "Custom branding",
      "Dedicated setup",
    ],
    href: "/get-started",
    featured: false,
  },
];

const investmentFactors = [
  {
    title: "Lead volume",
    description:
      "The number of leads your team handles can affect system configuration and AI usage.",
    icon: Globe2,
  },
  {
    title: "Team size",
    description:
      "User roles, access levels and sales workflows can be configured around your team.",
    icon: Layers3,
  },
  {
    title: "Integrations",
    description:
      "Existing websites, forms, communication channels and third-party tools can shape the setup.",
    icon: Workflow,
  },
  {
    title: "Automation",
    description:
      "The amount of follow-up automation and business logic required can change the implementation scope.",
    icon: Sparkles,
  },
];

const faqs = [
  {
    question: "Is LeadFlow a monthly SaaS subscription?",
    answer:
      "LeadFlow is currently offered as a service/product solution. The setup is shaped around your business rather than forcing every client into the same subscription structure.",
  },
  {
    question: "Can LeadFlow connect to my existing website?",
    answer:
      "Yes. Existing website forms and lead capture points can be connected to your LeadFlow system so incoming inquiries can enter the same workflow.",
  },
  {
    question: "What if I don't have a website?",
    answer:
      "A website can be included as part of a custom setup. We can build the customer-facing website and connect it with your LeadFlow system.",
  },
  {
    question: "Can I start with the basic system and add AI later?",
    answer:
      "Yes. The core lead management workflow can be established first, with AI qualification and additional intelligence added as the business workflow develops.",
  },
  {
    question: "How is the final price determined?",
    answer:
      "Pricing depends on the number of users and leads, AI usage, integrations, automation requirements, custom workflows and whether a new website is required.",
  },
];


function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[number];
  index: number;
}) {
  const Icon = plan.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className={`relative flex h-full flex-col rounded-[1.5rem] border p-6 sm:p-7 ${
        plan.featured
          ? "border-primary/40 bg-slate-950 text-white shadow-[0_25px_70px_-30px_rgba(14,165,233,0.45)]"
          : "border-border bg-white text-foreground shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)]"
      }`}
    >
      {plan.featured && (
        <div className="absolute right-5 top-5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300">
          Recommended
        </div>
      )}

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          plan.featured
            ? "bg-white/10 text-sky-300"
            : "bg-primary-soft text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p
        className={`mt-7 text-xs font-semibold uppercase tracking-[0.14em] ${
          plan.featured ? "text-sky-300" : "text-primary"
        }`}
      >
        {plan.eyebrow}
      </p>

      <h2
        className={`mt-2 text-2xl font-semibold tracking-[-0.035em] ${
          plan.featured ? "text-white" : "text-foreground"
        }`}
      >
        {plan.name}
      </h2>

      <p
        className={`mt-4 min-h-[5.5rem] text-sm leading-6 ${
          plan.featured ? "text-slate-300" : "text-muted"
        }`}
      >
        {plan.description}
      </p>

      <div
        className={`mt-7 border-y py-5 ${
          plan.featured ? "border-white/10" : "border-border"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            plan.featured ? "text-slate-400" : "text-muted"
          }`}
        >
          Investment
        </p>

        <p
          className={`mt-1 text-2xl font-semibold tracking-[-0.03em] ${
            plan.featured ? "text-white" : "text-foreground"
          }`}
        >
          {plan.price}
        </p>
      </div>

      <div className="mt-6 flex-1">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.12em] ${
            plan.featured ? "text-slate-400" : "text-muted"
          }`}
        >
          Included
        </p>

        <ul className="mt-4 space-y-3.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  plan.featured
                    ? "bg-primary/15 text-sky-300"
                    : "bg-primary-soft text-primary"
                }`}
              >
                <Check className="h-3 w-3" />
              </span>

              <span
                className={`text-sm leading-5 ${
                  plan.featured ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={plan.href}
        className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
          plan.featured
            ? "bg-primary text-white shadow-[0_12px_35px_-12px_rgba(14,165,233,0.7)] hover:bg-primary-dark"
            : "border border-border bg-slate-50 text-foreground hover:border-slate-300 hover:bg-slate-100"
        }`}
      >
        {plan.featured ? "Get a custom plan" : "Discuss this setup"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}

function FAQItem({
  item,
  index,
  openIndex,
  setOpenIndex,
}: {
  item: (typeof faqs)[number];
  index: number;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}) {
  const isOpen = openIndex === index;

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-foreground sm:text-base">
          {item.question}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="max-w-3xl pb-5 pr-8 text-sm leading-6 text-muted">
          {item.answer}
        </p>
      </motion.div>
    </div>
  );
}



export default function PricingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.10),transparent_58%)]" />
        <div className="absolute left-1/2 top-28 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel>Flexible LeadFlow setups</SectionLabel>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mx-auto mt-7 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              The right LeadFlow setup starts with{" "}
              <span className="bg-gradient-to-r from-slate-950 via-slate-700 to-primary bg-clip-text text-transparent">
                your business.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
            >
              Choose the level of lead management and intelligence you need.
              For custom workflows, integrations and automation, we shape
              LeadFlow around the way your business actually works.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_-12px_rgba(14,165,233,0.6)] transition hover:bg-primary-dark"
              >
                Get a custom plan
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-slate-50"
              >
                Explore the demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Choose your setup</SectionLabel>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            Start with what your sales team needs now.
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            Every business has a different lead volume, workflow and level of
            automation. These setups give you a clear starting point without
            forcing your business into a rigid package.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Custom investment</SectionLabel>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                Your investment depends on the system you actually need.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">
                We don't want to sell you features you won't use. The final
                scope is shaped around your business, team, lead volume and
                workflow.
              </p>

              <Link
                href="/get-started"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                Tell us how your business works
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {investmentFactors.map((factor, index) => {
                const Icon = factor.icon;

                return (
                  <motion.div
                    key={factor.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="rounded-2xl border border-border bg-slate-50/70 p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-foreground">
                      {factor.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      {factor.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>What you get</SectionLabel>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            More than a dashboard.
            <br />
            A clearer sales workflow.
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            LeadFlow connects the important parts of your lead journey so your
            team can spend less time organizing information and more time
            acting on it.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950 md:grid-cols-4">
          {[
            ["Capture", "Bring inquiries into one structured workflow."],
            ["Understand", "Surface intent, requirements and useful context."],
            ["Prioritize", "Give your team clearer signals about what matters."],
            ["Act", "Turn intelligence into the next meaningful action."],
          ].map(([title, description], index) => (
            <div
              key={title}
              className={`p-6 sm:p-7 ${
                index !== 3 ? "border-b border-white/10 md:border-b-0 md:border-r" : ""
              }`}
            >
              <span className="text-xs font-semibold text-sky-300">
                0{index + 1}
              </span>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <CircleHelp className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Questions before getting started?
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
              Here are a few things businesses usually want to know.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-slate-50 px-5 sm:px-7">
            {faqs.map((item, index) => (
              <FAQItem
                key={item.question}
                item={item}
                index={index}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Build the right system
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Tell us how your business works.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              We'll help shape the right LeadFlow setup around your lead
              workflow, team and growth goals.
            </p>

            <Link
              href="/get-started"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_-12px_rgba(14,165,233,0.7)] transition hover:bg-primary-dark"
            >
              Get a custom plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}