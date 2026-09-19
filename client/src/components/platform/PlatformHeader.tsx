"use client";

import Link from "next/link";
import { Activity, ChevronRight, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

type PlatformPageConfig = {
  eyebrow: string;
  title: string;
  description: string;
};

const pageConfig: Record<string, PlatformPageConfig> = {
  "/platform": {
    eyebrow: "Platform / Overview",
    title: "Platform overview",
    description:
      "A focused view of workspace activity, client onboarding and the current operating state of LeadFlow.",
  },

  "/platform/clients": {
    eyebrow: "Platform / Clients",
    title: "Client workspaces",
    description:
      "Manage connected businesses, workspace access and the client onboarding lifecycle.",
  },

  "/platform/settings": {
    eyebrow: "Platform / Settings",
    title: "Platform settings",
    description:
      "Review platform identity, access configuration and operational controls.",
  },
};

export default function PlatformHeader() {
  const pathname = usePathname();

  const config = pageConfig[pathname] || pageConfig["/platform"];

  return (
    <header className="border-b border-[#E6EAF0] bg-[#F7F8FA]">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          {/* ---------------------------------------------------------------- */}
          {/* HEADING                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>LeadFlow</span>

              <ChevronRight className="h-3 w-3 text-slate-300" />

              <span className="text-slate-500">
                {config.eyebrow.replace("Platform / ", "")}
              </span>
            </div>

            <div className="mt-4">
              <h1 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.055em] text-[#0B1220] sm:text-[42px] lg:text-[46px]">
                {config.title}
              </h1>

              <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-[#66748A] sm:text-sm">
                {config.description}
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* PLATFORM STATUS                                                  */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex shrink-0 items-center">
            <div className="flex items-center gap-3 border-l border-[#DDE3EA] pl-5 sm:pl-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.035)]">
                <ShieldCheck
                  className="h-4 w-4 text-emerald-600"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                  Platform state
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]" />

                  <span className="text-xs font-semibold text-slate-700">
                    Operational
                  </span>
                </div>
              </div>
            </div>

            <div className="ml-6 hidden h-10 w-px bg-[#E3E7ED] xl:block" />

            <Link
              href="/platform/settings"
              className="ml-6 hidden items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 xl:inline-flex"
            >
              <Activity className="h-3.5 w-3.5" />
              Private access
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
