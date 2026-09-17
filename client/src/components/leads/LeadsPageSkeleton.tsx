export default function LeadsPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="h-3 w-32 rounded bg-border/60" />

          <div className="mt-4 h-14 w-48 rounded-xl bg-border/60 sm:h-16 sm:w-56" />

          <div className="mt-4 h-5 w-96 max-w-full rounded bg-border/50" />
        </div>

        <div className="h-12 w-32 rounded-xl bg-border/60" />
      </div>

      {/* Lead stats */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-4 sm:px-7">
          <div className="h-4 w-24 rounded bg-border/60" />
          <div className="mt-2 h-3 w-64 max-w-full rounded bg-border/50" />
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border-b border-border px-5 py-6 last:border-b-0 sm:px-7 xl:border-b-0 xl:border-r xl:last:border-r-0"
            >
              <div className="h-3 w-24 rounded bg-border/50" />

              <div className="mt-5 h-10 w-14 rounded bg-border/60" />

              <div className="mt-2 h-3 w-28 rounded bg-border/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Lead list */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="h-5 w-28 rounded bg-border/60" />
              <div className="mt-2 h-3 w-64 max-w-full rounded bg-border/40" />
            </div>

            <div className="h-10 w-64 max-w-full rounded-xl bg-border/50" />
          </div>
        </div>

        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex flex-col gap-4 px-5 py-5 sm:px-7 lg:flex-row lg:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-border/50" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-36 max-w-full rounded bg-border/60" />

                  <div className="mt-2 h-3 w-52 max-w-full rounded bg-border/40" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="h-7 w-16 rounded-full bg-border/40" />
                <div className="h-7 w-20 rounded-full bg-border/40" />
                <div className="h-4 w-20 rounded bg-border/40" />
                <div className="h-4 w-10 rounded bg-border/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
