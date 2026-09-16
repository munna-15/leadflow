"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

const navigation = [
  {
    label: "Product",
    href: "/product",
  },
  {
    label: "Solutions",
    href: "/solutions",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "AI",
    href: "/ai",
  },
  {
    label: "Demo",
    href: "/demo",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

export default function SiteNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* BRAND */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="LeadFlow home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
            L
          </span>

          <span className="text-lg font-semibold tracking-tight text-foreground">
            LeadFlow
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute inset-x-0 -bottom-[1px] mx-auto h-0.5 w-5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/auth/login"
            className="hidden px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/get-started"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark sm:px-5"
          >
            Get LeadFlow
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
