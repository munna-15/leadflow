"use client";

export default function DashboardSkeleton() {
  return (
    <div aria-label="Loading dashboard" aria-busy="true" className="space-y-10">
      {/* Attention + Sales Pulse */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Attention Skeleton */}
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-6 py-6 sm:px-7">
            <div className="h-3 w-28 animate-pulse rounded-full bg-border" />

            <div className="mt-4 h-8 w-72 max-w-full animate-pulse rounded-xl bg-border" />

            <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-border/70" />
          </div>

          <div className="divide-y divide-border">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 px-6 py-5 sm:px-7"
              >
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-border" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-32 animate-pulse rounded-full bg-border" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-border/70" />
                  </div>

                  <div className="mt-2 h-3.5 w-3/4 animate-pulse rounded-full bg-border/70" />

                  <div className="mt-2 h-3 w-28 animate-pulse rounded-full bg-border/50" />
                </div>

                <div className="hidden shrink-0 items-center gap-4 sm:flex">
                  <div className="space-y-2 text-right">
                    <div className="ml-auto h-2.5 w-12 animate-pulse rounded-full bg-border" />
                    <div className="ml-auto h-6 w-8 animate-pulse rounded-lg bg-border" />
                  </div>

                  <div className="h-4 w-4 animate-pulse rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Pulse Skeleton */}
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-6 shadow-sm sm:p-7">
          <div className="relative">
            <div className="h-3 w-16 animate-pulse rounded-full bg-white/10" />

            <div className="mt-4 h-9 w-52 animate-pulse rounded-xl bg-white/10" />

            <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded-full bg-white/10" />

            <div className="mt-8 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />

                    <div className="space-y-2">
                      <div className="h-3.5 w-32 animate-pulse rounded-full bg-white/10" />
                      <div className="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
                    </div>
                  </div>

                  <div className="h-7 w-8 animate-pulse rounded-lg bg-white/10" />
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Skeleton */}
      <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-6 sm:px-7">
          <div className="h-3 w-28 animate-pulse rounded-full bg-border" />

          <div className="mt-4 h-8 w-64 animate-pulse rounded-xl bg-border" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-border/70" />
        </div>

        <div className="p-6 sm:p-7">
          <div className="grid gap-3 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-background p-5"
              >
                <div className="h-3 w-20 animate-pulse rounded-full bg-border" />

                <div className="mt-4 h-9 w-12 animate-pulse rounded-lg bg-border" />

                <div className="mt-5 h-2 w-full animate-pulse rounded-full bg-border/70" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="h-10 w-28 animate-pulse rounded-xl bg-border" />
            <div className="h-10 w-28 animate-pulse rounded-xl bg-border" />
          </div>
        </div>
      </section>

      {/* Recent Activity Skeleton */}
      <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-6 sm:px-7">
          <div className="h-3 w-32 animate-pulse rounded-full bg-border" />

          <div className="mt-4 h-8 w-56 animate-pulse rounded-xl bg-border" />
        </div>

        <div className="divide-y divide-border">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 px-6 py-5 sm:px-7"
            >
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-border" />

              <div className="min-w-0 flex-1">
                <div className="h-4 w-48 max-w-full animate-pulse rounded-full bg-border" />

                <div className="mt-2 h-3.5 w-72 max-w-full animate-pulse rounded-full bg-border/70" />

                <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-border/50" />
              </div>

              <div className="hidden h-3 w-16 animate-pulse rounded-full bg-border sm:block" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
