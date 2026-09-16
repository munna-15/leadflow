import AttentionPanel from "@/components/dashboard/AttentionPanel";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Monday, September 15</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Good morning, Munna.
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-7 text-muted">
          Here’s what needs your attention today.
        </p>
      </div>

      <AttentionPanel />
    </div>
  );
}
