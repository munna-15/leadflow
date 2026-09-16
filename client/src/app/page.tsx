import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

import SiteNavbar from "@/components/layout/SiteNavbar";

import ProblemSection from "@/components/home/ProblemSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import AIQualificationSection from "@/components/home/AIQualificationSection";
import LeadIntelligenceSection from "@/components/home/LeadIntelligenceSection";
import SalesWorkflowSection from "@/components/home/SalesWorkflowSection";
import FollowUpIntelligenceSection from "@/components/home/FollowUpIntelligenceSection";
import SiteFooter from "@/components/home/SiteFooter";

export default function Home() {
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
        <div className="absolute left-1/2 top-0 -z-10 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl" />

        <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-powered lead management
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Turn every lead into a{" "}
              <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
                meaningful opportunity.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-body sm:text-xl">
              LeadFlow helps businesses capture, qualify, organize, and follow
              up with leads before valuable opportunities slip away.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/get-started"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                Get LeadFlow
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/demo"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background"
              >
                Explore the demo
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Capture leads from your existing website
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                AI-powered qualification
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Follow-up visibility
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* EXISTING HOME STORY                                                */}
      {/* ------------------------------------------------------------------ */}

      <ProblemSection />

      <HowItWorksSection />

      <AIQualificationSection />

      <LeadIntelligenceSection />

      <SalesWorkflowSection />

      <FollowUpIntelligenceSection />

      {/* ------------------------------------------------------------------ */}
      {/* FINAL CONVERSION CTA                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden bg-[#111827] text-white">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Built around the next action
              </div>

              <h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                Stop letting valuable leads disappear between conversations.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Give your team one place to capture leads, understand intent,
                manage opportunities, and know what needs attention next.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/get-started"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Get LeadFlow
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/product"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore the product
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
