import Link from "next/link";

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
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
              L
            </span>

            <span className="text-lg font-semibold tracking-tight text-foreground">
              LeadFlow
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#product"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Product
            </Link>

            <Link
              href="#solutions"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Solutions
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              How it works
            </Link>

            <Link
              href="#ai"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              AI
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <span className="mb-6 inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm">
            AI-powered lead management
          </span>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Turn every lead into a{" "}
            <span className="bg-linear-to-r from-[#111827] via-[#334155] to-[#0EA5E9] bg-clip-text text-transparent">
              meaningful opportunity.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-body sm:text-xl">
            LeadFlow helps businesses capture, qualify, organize, and follow up
            with leads before valuable opportunities slip away.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Start managing leads
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <ProblemSection />
      <HowItWorksSection />
      <AIQualificationSection />
      <LeadIntelligenceSection />
      <SalesWorkflowSection />
      <FollowUpIntelligenceSection />

      <SiteFooter />
    </main>
  );
}
