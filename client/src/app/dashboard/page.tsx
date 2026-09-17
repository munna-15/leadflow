import AttentionPanel from "@/components/dashboard/AttentionPanel";
import PipelineSnapshot from "@/components/dashboard/PipelineSnapshot";

import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Monday, September 15
        </p>

        <div className="relative mt-3 inline-block">
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -inset-y-4 -z-10 bg-gradient-to-r from-primary/10 via-sky-400/5 to-transparent blur-2xl"
          />

          <h1 className="bg-gradient-to-br from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-5xl font-semibold leading-[1.05] tracking-[-0.055em] text-transparent sm:text-6xl lg:text-7xl">
            Good morning, Munna
            <span className="text-primary/80">.</span>
          </h1>
        </div>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Here’s what needs your attention today.
        </p>
      </div>

      <AttentionPanel />
      <PipelineSnapshot/>
      <RecentActivity/>
    </div>
  );
}
