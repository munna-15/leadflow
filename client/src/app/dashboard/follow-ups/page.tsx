import FollowUpActivity from "@/components/follow-ups/FollowUpActivity";
import FollowUpQueue from "@/components/follow-ups/FollowUpQueue";
import FollowUpsHeader from "@/components/follow-ups/FollowUpsHeader";
import FollowUpsOverview from "@/components/follow-ups/FollowUpsOverview";

export default function FollowUpsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <FollowUpsHeader />

      <FollowUpsOverview />

      <FollowUpQueue />

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="rounded-3xl border border-border bg-foreground p-6 text-white shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-sky-300">
            Follow-up discipline
          </p>

          <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Consistent follow-up keeps good opportunities alive.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            LeadFlow brings overdue conversations, today's actions, and upcoming
            meetings into one focused workspace so your team knows what deserves
            attention next.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-300">
            <span>Capture</span>
            <span className="text-sky-400">→</span>
            <span>Qualify</span>
            <span className="text-sky-400">→</span>
            <span>Follow up</span>
            <span className="text-sky-400">→</span>
            <span>Convert</span>
          </div>
        </div>

        <FollowUpActivity />
      </div>
    </div>
  );
}
