import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Target,
  Users,
} from "lucide-react";

const teamMembers = [
  {
    name: "Munna",
    role: "Owner",
    initials: "M",
    assigned: 38,
    qualified: 29,
    meetings: 14,
    won: 6,
    followUp: 94,
    response: "2h 18m",
    trend: "+16%",
    status: "Strong momentum",
  },
  {
    name: "Nadia Karim",
    role: "Sales",
    initials: "NK",
    assigned: 31,
    qualified: 21,
    meetings: 9,
    won: 3,
    followUp: 87,
    response: "3h 42m",
    trend: "+8%",
    status: "Consistent",
  },
  {
    name: "Tanvir Ahmed",
    role: "Sales",
    initials: "TA",
    assigned: 28,
    qualified: 18,
    meetings: 6,
    won: 2,
    followUp: 79,
    response: "5h 06m",
    trend: "-4%",
    status: "Needs attention",
  },
  {
    name: "Sadia Rahman",
    role: "Sales",
    initials: "SR",
    assigned: 27,
    qualified: 14,
    meetings: 2,
    won: 1,
    followUp: 72,
    response: "7h 24m",
    trend: "-9%",
    status: "Follow-up gap",
  },
];

export default function LeadPerformance() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Lead performance
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              How the team is moving opportunities forward
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Review lead ownership, qualification progress, meetings,
              conversion, and follow-up discipline without turning performance
              into a simple ranking.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-background px-3.5 py-2 text-xs font-semibold text-body">
            <Users className="h-3.5 w-3.5 text-primary" />4 team members
          </div>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-background/60">
              <th className="px-7 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                Team member
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                Leads
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                Qualified
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                Meetings
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                Won
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                Follow-up
              </th>

              <th className="px-7 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                Response
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {teamMembers.map((member) => {
              const needsAttention = member.status !== "Strong momentum";

              return (
                <tr
                  key={member.name}
                  className="group transition-colors hover:bg-background/70"
                >
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                        {member.initials}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {member.name}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-muted">
                            {member.role}
                          </span>

                          <span
                            className={`text-[11px] font-semibold ${
                              member.trend.startsWith("+")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {member.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span className="text-sm font-semibold text-foreground">
                      {member.assigned}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <div>
                      <span className="text-sm font-semibold text-foreground">
                        {member.qualified}
                      </span>

                      <p className="mt-1 text-[11px] text-muted">
                        {Math.round((member.qualified / member.assigned) * 100)}
                        %
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span className="text-sm font-semibold text-foreground">
                      {member.meetings}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <span className="text-sm font-semibold text-green-600">
                      {member.won}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <div className="w-28">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {member.followUp}%
                        </span>

                        <CheckCircle2 className="h-3.5 w-3.5 text-muted" />
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${member.followUp}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-7 py-5">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5 text-muted" />

                      <span className="text-xs font-medium text-body">
                        {member.response}
                      </span>
                    </div>

                    <div
                      className={`mt-1.5 text-[11px] font-semibold ${
                        needsAttention ? "text-orange-600" : "text-green-600"
                      }`}
                    >
                      {member.status}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-border lg:hidden">
        {teamMembers.map((member) => {
          const qualificationRate = Math.round(
            (member.qualified / member.assigned) * 100,
          );

          const needsAttention = member.status !== "Strong momentum";

          return (
            <div key={member.name} className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-semibold text-primary">
                  {member.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {member.name}
                      </h3>

                      <p className="mt-0.5 text-xs text-muted">{member.role}</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        member.trend.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {member.trend.startsWith("+") ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}

                      {member.trend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-background p-3.5">
                  <p className="text-[11px] font-medium text-muted">Leads</p>

                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {member.assigned}
                  </p>
                </div>

                <div className="rounded-2xl bg-background p-3.5">
                  <p className="text-[11px] font-medium text-muted">
                    Qualified
                  </p>

                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {member.qualified}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-muted">
                    {qualificationRate}%
                  </p>
                </div>

                <div className="rounded-2xl bg-background p-3.5">
                  <p className="text-[11px] font-medium text-muted">Meetings</p>

                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {member.meetings}
                  </p>
                </div>

                <div className="rounded-2xl bg-background p-3.5">
                  <p className="text-[11px] font-medium text-muted">Won</p>

                  <p className="mt-1 text-lg font-semibold text-green-600">
                    {member.won}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />

                    <span className="text-xs font-semibold text-foreground">
                      Follow-up discipline
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-primary">
                    {member.followUp}%
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${member.followUp}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-3.5 w-3.5 text-muted" />

                    <span className="text-xs text-muted">Avg. response</span>
                  </div>

                  <span className="text-xs font-semibold text-body">
                    {member.response}
                  </span>
                </div>
              </div>

              <div
                className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  needsAttention
                    ? "bg-orange-50 text-orange-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />

                {member.status}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
