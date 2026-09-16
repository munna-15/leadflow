"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BrainCircuit,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";

const productLinks = [
  {
    label: "Product",
    href: "/product",
    icon: LayoutDashboard,
  },
  {
    label: "Lead management",
    href: "/product",
    icon: Users,
  },
  {
    label: "AI qualification",
    href: "/ai",
    icon: BrainCircuit,
  },
  {
    label: "Follow-ups",
    href: "/how-it-works",
    icon: ClipboardList,
  },
  {
    label: "Demo",
    href: "/demo",
    icon: PlayCircle,
  },
];

const exploreLinks = [
  {
    label: "Solutions",
    href: "/solutions",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: CircleDollarSign,
  },
  {
    label: "Contact",
    href: "/get-started",
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[#111827] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-20">
          {/* ---------------------------------------------------------------- */}
          {/* BRAND                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="LeadFlow home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
                L
              </span>

              <span className="text-lg font-semibold tracking-tight">
                LeadFlow
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              AI-powered lead management and follow-up for businesses that want
              every opportunity to stay visible, actionable, and moving forward.
            </p>

            <Link
              href="/get-started"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-sky-300"
            >
              Get LeadFlow
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built around the next action
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* PRODUCT                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div>
            <p className="text-sm font-semibold text-white">Product</p>

            <div className="mt-5 space-y-3.5">
              {productLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-primary" />

                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* EXPLORE                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div>
            <p className="text-sm font-semibold text-white">Explore</p>

            <div className="mt-5 space-y-3.5">
              {exploreLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {item.icon && (
                    <item.icon className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-primary" />
                  )}

                  {item.label}
                </Link>
              ))}

              <Link
                href="/auth/login"
                className="block text-sm text-slate-400 transition-colors hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/get-started"
                className="block text-sm text-slate-400 transition-colors hover:text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* BOTTOM BAR                                                         */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 sm:text-sm">
            © 2026 LeadFlow. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-500 sm:text-sm">
            <span>Built for modern sales teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
