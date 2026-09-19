"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  LayoutDashboard,
  Menu,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  {
    label: "Overview",
    href: "/platform",
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    href: "/platform/clients",
    icon: UsersRound,
  },
  {
    label: "Settings",
    href: "/platform/settings",
    icon: Settings,
  },
];

export default function PlatformSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigationContent = (
    <>
      <div className="mb-4 px-3 text-[9px] font-semibold uppercase tracking-[0.22em] !text-white/35">
        Platform
      </div>

      <div className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/platform"
              ? pathname === "/platform"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative flex items-center gap-3.5 rounded-xl px-3 py-3.5",
                "transition-all duration-200",
                isActive
                  ? "bg-white/[0.035] !text-white"
                  : "!text-white/58 hover:bg-white/[0.025] hover:!text-white/90",
              ].join(" ")}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.45)]" />
              )}

              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]",
                  "transition-all duration-200",
                  isActive
                    ? "bg-sky-300/[0.09] !text-sky-200"
                    : "bg-white/[0.02] !text-white/55 group-hover:bg-white/[0.04] group-hover:!text-white/85",
                ].join(" ")}
              >
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
              </div>

              <span
                className={[
                  "!text-inherit text-[14px] tracking-[-0.01em]",
                  isActive ? "font-semibold" : "font-medium",
                ].join(" ")}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );

  const accountBlock = (
    <>
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06] !text-white text-[11px] font-semibold">
            P
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate !text-white/90 text-[13px] font-semibold">
              Platform Admin
            </p>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />

              <span className="!text-white/40 text-[10px]">Private access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1">
        <span className="!text-white/25 text-[9px] font-medium uppercase tracking-[0.18em]">
          LeadFlow
        </span>

        <span className="!text-white/20 text-[9px]">v1.0</span>
      </div>
    </>
  );

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP SIDEBAR                                                    */}
      {/* ------------------------------------------------------------------ */}

      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 overflow-hidden border-r border-white/[0.08] bg-[#08152D] lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-35%] top-[-10%] h-[360px] w-[360px] rounded-full bg-blue-500/[0.08] blur-[110px]" />

          <div className="absolute bottom-[-15%] right-[-25%] h-[320px] w-[320px] rounded-full bg-indigo-500/[0.06] blur-[100px]" />

          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        </div>

        <div className="relative flex h-full w-full flex-col">
          {/* Brand */}
          <div className="border-b border-white/[0.08] px-6 py-6">
            <Link href="/platform" className="group block">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.65)]" />

                    <span className="!text-white text-[18px] font-semibold tracking-[-0.025em]">
                      LEADFLOW
                    </span>
                  </div>

                  <div className="mt-2 pl-[18px] !text-white/45 text-[9px] font-medium uppercase tracking-[0.24em]">
                    Private Platform
                  </div>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] !text-white/55 transition-all duration-200 group-hover:border-sky-300/20 group-hover:bg-sky-400/[0.07] group-hover:!text-sky-200">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-8">{navigationContent}</nav>

          {/* Account */}
          <div className="px-4 pb-5">{accountBlock}</div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE TOP BAR                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E5E9EF] bg-[#08152D] px-4 shadow-[0_8px_30px_rgba(8,21,45,0.12)] lg:hidden">
        <Link href="/platform" className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]" />

          <div>
            <div className="!text-white text-[15px] font-semibold tracking-[-0.02em]">
              LEADFLOW
            </div>

            <div className="mt-0.5 !text-white/35 text-[8px] font-medium uppercase tracking-[0.2em]">
              Private Platform
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open platform navigation"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.05] !text-white/85 transition-all duration-200 hover:bg-white/[0.08]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE OVERLAY                                                       */}
      {/* ------------------------------------------------------------------ */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-[#020817]/65 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE DRAWER                                                        */}
      {/* ------------------------------------------------------------------ */}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[100] flex w-[286px] flex-col overflow-hidden",
          "border-r border-white/[0.08] bg-[#08152D]",
          "shadow-[20px_0_80px_rgba(2,8,23,0.3)]",
          "transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-35%] top-[-10%] h-[360px] w-[360px] rounded-full bg-blue-500/[0.08] blur-[110px]" />

          <div className="absolute bottom-[-15%] right-[-25%] h-[320px] w-[320px] rounded-full bg-indigo-500/[0.06] blur-[100px]" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5">
            <Link
              href="/platform"
              className="flex items-center gap-2.5"
              onClick={() => setMobileOpen(false)}
            >
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.65)]" />

              <div>
                <div className="!text-white text-[16px] font-semibold tracking-[-0.02em]">
                  LEADFLOW
                </div>

                <div className="mt-1 !text-white/35 text-[8px] font-medium uppercase tracking-[0.22em]">
                  Private Platform
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close platform navigation"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] !text-white/70 transition-colors hover:bg-white/[0.07] hover:!text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-7">
            {navigationContent}
          </nav>

          {/* Drawer account */}
          <div className="px-4 pb-5">{accountBlock}</div>
        </div>
      </aside>
    </>
  );
}
