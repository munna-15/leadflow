
import {
  Activity,
  CheckCircle2,
  Target,
  Users,
} from "lucide-react";

import type { AnalyticsTeamMember } from "@/services/analytics.service";

interface LeadPerformanceProps {
  team: AnalyticsTeamMember[];
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export default function LeadPerformance({
  team,
}: LeadPerformanceProps) {
  const totalTeamMembers = team.length;

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-6 py-6 sm:px-7 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Team activity & ownership
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              How the team is managing opportunities
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Review lead ownership, qualification, closed outcomes, follow-ups,
              and activity across your active team.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-background px-3.5 py-2 text-xs font-semibold text-body">
            <Users className="h-3.5 w-3.5 text-primary" />

            {totalTeamMembers}{" "}
            {totalTeamMembers === 1 ? "team member" : "team members"}
          </div>
        </div>
      </div>

      {team.length === 0 ? (
        <div className="px-6 py-16 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-muted">
            <Users className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No team activity yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Team ownership and activity will appear here once users and lead
            assignments are active.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/60">
                  <th className="px-7 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Team member
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Assigned
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Qualified
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Won
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Follow-ups
                  </th>

                  <th className="px-7 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Activities
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {team.map((member) => {
                  const qualificationRate =
                    member.assignedLeads > 0
                      ? Math.round(
                          (member.qualifiedLeads /
                            member.assignedLeads) *
                            100,
                        )
                      : 0;

                  return (
                    <tr
                      key={member.user.id}
                      className="group transition-colors hover:bg-background/70"
                    >
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                            {getInitials(member.user.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {member.user.name}
                            </p>

                            <p className="mt-1 text-xs capitalize text-muted">
                              {member.user.role.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <span className="text-sm font-semibold text-foreground">
                          {member.assignedLeads.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-5">
                        <div>
                          <span className="text-sm font-semibold text-foreground">
                            {member.qualifiedLeads.toLocaleString()}
                          </span>

                          <p className="mt-1 text-[11px] text-muted">
                            {qualificationRate}% of assigned
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <span className="text-sm font-semibold text-green-600">
                          {member.wonLeads.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />

                          <span className="text-sm font-semibold text-foreground">
                            {member.followUps.toLocaleString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-7 py-5">
                        <div className="flex items-center gap-2">
                          <Activity className="h-3.5 w-3.5 text-muted" />

                          <span className="text-sm font-semibold text-foreground">
                            {member.activities.toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border lg:hidden">
            {team.map((member) => {
              const qualificationRate =
                member.assignedLeads > 0
                  ? Math.round(
                      (member.qualifiedLeads /
                        member.assignedLeads) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={member.user.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-semibold text-primary">
                      {getInitials(member.user.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {member.user.name}
                      </h3>

                      <p className="mt-0.5 text-xs capitalize text-muted">
                        {member.user.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-background p-3.5">
                      <p className="text-[11px] font-medium text-muted">
                        Assigned
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {member.assignedLeads.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-background p-3.5">
                      <p className="text-[11px] font-medium text-muted">
                        Qualified
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {member.qualifiedLeads.toLocaleString()}
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-muted">
                        {qualificationRate}% of assigned
                      </p>
                    </div>

                    <div className="rounded-2xl bg-background p-3.5">
                      <p className="text-[11px] font-medium text-muted">
                        Won
                      </p>

                      <p className="mt-1 text-lg font-semibold text-green-600">
                        {member.wonLeads.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-background p-3.5">
                      <p className="text-[11px] font-medium text-muted">
                        Follow-ups
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {member.followUps.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-background p-3.5">
                      <p className="text-[11px] font-medium text-muted">
                        Activities
                      </p>

                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {member.activities.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />

                        <span className="text-xs font-semibold text-foreground">
                          Qualification progress
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-primary">
                        {qualificationRate}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            Math.max(qualificationRate, 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-muted">
                      <span>
                        {member.qualifiedLeads.toLocaleString()} qualified
                      </span>

                      <span>
                        {member.assignedLeads.toLocaleString()} assigned
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

