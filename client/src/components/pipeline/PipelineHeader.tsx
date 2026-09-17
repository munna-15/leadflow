"use client";

export default function PipelineHeader() {
  return (
    <div className="flex flex-col gap-7">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-primary to-primary" />

          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Sales workflow
          </p>

          <span className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
        </div>

        <div className="relative mt-3 inline-block">
          <div
            aria-hidden="true"
            className="absolute -inset-x-5 -inset-y-3 -z-10 bg-gradient-to-r from-primary/10 via-sky-400/5 to-transparent blur-2xl"
          />

          <h1 className="bg-gradient-to-br from-[#0B1220] via-[#334155] to-[#0EA5E9] bg-clip-text text-5xl font-semibold leading-[1.05] tracking-[-0.055em] text-transparent sm:text-6xl">
            Pipeline
            <span className="ml-1 text-primary/80">.</span>
          </h1>
        </div>

        <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Move opportunities forward and see where every active lead stands.
        </p>
      </div>
    </div>
  );
}
