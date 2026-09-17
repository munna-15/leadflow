export default function LeadDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-28 rounded bg-border/60" />

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="border-b border-border p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-background" />

              <div className="flex-1">
                <div className="h-7 w-52 max-w-full rounded bg-background" />

                <div className="mt-3 h-4 w-72 max-w-full rounded bg-background" />

                <div className="mt-4 h-4 w-96 max-w-full rounded bg-background" />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-10 w-28 rounded-xl bg-background" />
              <div className="h-10 w-10 rounded-xl bg-background" />
            </div>
          </div>
        </div>

        <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-surface px-6 py-5 sm:px-8">
              <div className="h-3 w-20 rounded bg-background" />

              <div className="mt-3 h-6 w-24 rounded bg-background" />

              <div className="mt-2 h-3 w-32 rounded bg-background" />
            </div>
          ))}
        </div>

        <div className="border-t border-border bg-background/60 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-4 w-64 max-w-full rounded bg-border/60" />

            <div className="h-10 w-36 rounded-xl bg-border/60" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex gap-3.5">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-background" />

              <div className="flex-1">
                <div className="h-5 w-28 rounded bg-background" />

                <div className="mt-2 h-3 w-48 rounded bg-background" />
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-background p-5 sm:p-6">
              <div className="h-4 w-28 rounded bg-border/60" />

              <div className="mt-3 h-4 w-full rounded bg-border/60" />

              <div className="mt-2 h-4 w-4/5 rounded bg-border/60" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="h-3 w-20 rounded bg-background" />
                  <div className="mt-3 h-4 w-28 rounded bg-background" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
            <div className="h-4 w-28 rounded bg-background" />
            <div className="mt-2 h-5 w-56 rounded bg-background" />
            <div className="mt-2 h-3 w-80 max-w-full rounded bg-background" />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-surface" />

                    <div className="flex-1">
                      <div className="h-3 w-20 rounded bg-border/60" />
                      <div className="mt-2 h-4 w-28 rounded bg-border/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
            <div className="flex gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-background" />

              <div className="flex-1">
                <div className="h-4 w-28 rounded bg-background" />
                <div className="mt-2 h-5 w-48 rounded bg-background" />
                <div className="mt-2 h-3 w-full rounded bg-background" />
              </div>
            </div>

            <div className="mt-6 h-24 rounded-2xl bg-background" />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="h-11 rounded-xl bg-background" />
              <div className="h-11 rounded-xl bg-background" />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
            <div className="h-4 w-20 rounded bg-background" />
            <div className="mt-2 h-5 w-40 rounded bg-background" />
            <div className="mt-2 h-3 w-72 max-w-full rounded bg-background" />

            <div className="mt-7 space-y-7">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-background" />

                  <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-background" />
                    <div className="mt-2 h-3 w-full rounded bg-background" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-background" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
