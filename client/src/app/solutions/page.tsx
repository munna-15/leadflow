"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Headphones,
  Megaphone,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteFooter from "@/components/home/SiteFooter";

const solutions = [
  {
    icon: Building2,
    title: "Real estate",
    description:
      "Manage property inquiries, understand buyer intent, prioritize serious prospects, and keep follow-ups moving.",
    useCases: [
      "Property inquiries",
      "Buyer qualification",
      "Viewing follow-ups",
      "Lead prioritization",
    ],
  },
  {
    icon: Megaphone,
    title: "Agencies",
    description:
      "Keep inbound inquiries organized from first contact through discovery, proposal, and client follow-up.",
    useCases: [
      "Service inquiries",
      "Discovery leads",
      "Proposal follow-ups",
      "Sales pipeline",
    ],
  },
  {
    icon: Stethoscope,
    title: "Clinics & healthcare",
    description:
      "Organize patient inquiries and appointment-related conversations so important follow-ups remain visible.",
    useCases: [
      "Appointment inquiries",
      "Service requests",
      "Follow-up reminders",
      "Lead ownership",
    ],
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Track prospective students and keep admissions-related conversations organized across the sales journey.",
    useCases: [
      "Course inquiries",
      "Student qualification",
      "Admission follow-ups",
      "Counselling pipeline",
    ],
  },
  {
    icon: Headphones,
    title: "Professional services",
    description:
      "Turn incoming service requests into structured opportunities with clear ownership and next actions.",
    useCases: [
      "Consultation requests",
      "Service qualification",
      "Client follow-ups",
      "Opportunity tracking",
    ],
  },
  {
    icon: Users,
    title: "Growing sales teams",
    description:
      "Give teams one shared system for lead context, assignment, pipeline visibility, and follow-up discipline.",
    useCases: [
      "Lead assignment",
      "Team visibility",
      "Pipeline management",
      "Activity tracking",
    ],
  },
];

const commonProblems = [
  {
    title: "Leads arrive from too many places",
    text: "Website forms, messages, calls, and other inquiries can become difficult to track when there is no central workflow.",
  },
  {
    title: "Intent is difficult to see",
    text: "A contact record alone does not tell your team how serious an opportunity is or what matters to the lead.",
  },
  {
    title: "Follow-ups depend on memory",
    text: "Without clear ownership and timing, valuable conversations can go quiet after the initial interaction.",
  },
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* NAVBAR                                                              */}
      {/* ------------------------------------------------------------------ */}

      <SiteNavbar/>

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[32rem] w-[46rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:px-12 lg:pb-32 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Built for different sales workflows
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              One lead system that adapts to your{" "}
              <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                business.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-body sm:text-xl">
              Whether you sell properties, services, education, consultations,
              or something else, LeadFlow gives your team a connected way to
              capture, understand, and follow up with opportunities.
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
                Talk to us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SOLUTIONS                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-primary">
              Solutions
            </p>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Different businesses. The same need for visibility.
            </h2>

            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              LeadFlow focuses on the common workflow behind modern lead-driven
              businesses while leaving room for each business to use its own
              process and terminology.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;

              return (
                <motion.article
                  key={solution.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="group flex flex-col rounded-[1.5rem] border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-900/[0.05] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                    {solution.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {solution.description}
                  </p>

                  <div className="mt-6 space-y-2.5 border-t border-border pt-5">
                    {solution.useCases.map((useCase) => (
                      <div
                        key={useCase}
                        className="flex items-start gap-2.5 text-sm text-body"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{useCase}</span>
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
      {/* COMMON PROBLEM                                                      */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24 lg:px-12 lg:py-32">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary">
              The common problem
            </p>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Different industries can still have the same lead problems.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
              The details of a sale change from business to business. The need
              for timely context, ownership, and follow-up does not.
            </p>
          </div>

          <div className="space-y-4">
            {commonProblems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {problem.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      {problem.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FLEXIBLE WORKFLOW                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-[#111827] text-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-primary">
              Flexible by design
            </p>

            <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Your business keeps its workflow. LeadFlow gives it structure.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
              The system can support different lead sources, qualification
              criteria, sales stages, team responsibilities, and follow-up
              processes without changing the core product.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Lead sources",
                text: "Website forms, campaigns, referrals, and manual entry.",
              },
              {
                title: "Qualification",
                text: "Different questions and signals can shape lead context.",
              },
              {
                title: "Pipeline",
                text: "Sales stages can reflect how your team actually works.",
              },
              {
                title: "Follow-up",
                text: "Actions stay connected to the opportunity and owner.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  0{index + 1}
                </p>

                <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Want to see the workflow in action?
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Explore a sample LeadFlow workspace.
              </p>
            </div>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-sky-300"
            >
              Open demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface p-7 shadow-xl shadow-slate-900/[0.05] ring-1 ring-border sm:p-10 lg:p-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Built around your business
              </div>

              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                Ready to give your team a clearer way to manage opportunities?
              </h2>

              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                See how LeadFlow can fit into the way your business captures,
                qualifies, and follows up with leads.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/get-started"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
                >
                  Get LeadFlow
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/product"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
                >
                  Explore the product
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
