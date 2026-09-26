"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-white/85 backdrop-blur-xl">
      {" "}
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* BRAND */}{" "}
        <Link
          href="/"
          className="relative z-50 flex items-center gap-2.5"
          aria-label="LeadFlow home"
        >
          {" "}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
            L{" "}
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
        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2.5 sm:gap-3 lg:flex">
          <Link
            href="/auth/login"
            className="px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
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
        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted/30 lg:hidden"
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>
      </div>
      {/* MOBILE BACKDROP */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-[72px] z-40 bg-foreground/5 backdrop-blur-[2px] lg:hidden"
        />
      )}
      {/* MOBILE MENU */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-border/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.10)] lg:hidden">
          <div className="px-5 pb-5 sm:px-8">
            {/* MENU HEADER */}
            <div className="flex items-center justify-between border-b border-border/60 py-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Navigation
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted/70">
                LeadFlow
              </span>
            </div>

            {/* NAVIGATION */}
            <div>
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex min-h-[58px] items-center justify-between border-b border-border/60 transition-colors duration-200 ${
                      active
                        ? "text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          active
                            ? "bg-primary"
                            : "bg-transparent group-hover:bg-primary/40"
                        }`}
                      />

                      <span className="text-[16px] font-medium tracking-[-0.02em]">
                        {item.label}
                      </span>
                    </span>

                    <ArrowUpRight
                      className={`h-4 w-4 transition-all duration-200 ${
                        active
                          ? "text-primary"
                          : "text-muted/60 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      }`}
                      strokeWidth={1.8}
                    />
                  </Link>
                );
              })}
            </div>

            {/* MOBILE ACTIONS */}
            <div className="mt-5 space-y-3">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-muted/30"
              >
                Sign in
                <ArrowUpRight
                  className="h-4 w-4 text-muted"
                  strokeWidth={1.8}
                />
              </Link>

              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
                className="flex h-12 w-full items-center justify-between rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                Get LeadFlow
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
