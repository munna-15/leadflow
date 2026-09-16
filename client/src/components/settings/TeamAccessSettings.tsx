"use client";

import { MoreHorizontal, ShieldCheck, UserPlus, Users } from "lucide-react";

const members = [
  {
    name: "Munna",
    email: "munna@example.com",
    initials: "M",
    role: "Owner",
    status: "Active",
    leads: 38,
  },
  {
    name: "Nadia Karim",
    email: "nadia@example.com",
    initials: "NK",
    role: "Sales",
    status: "Active",
    leads: 31,
  },
  {
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    initials: "TA",
    role: "Sales",
    status: "Active",
    leads: 28,
  },
];

const roleDescriptions = [
  {
    role: "Owner",
    description: "Full workspace access, team management, and system settings.",
  },
  {
    role: "Admin",
    description: "Manage leads, workflow, reports, and operational settings.",
  },
  {
    role: "Sales",
    description: "Manage assigned leads, follow-ups, and sales activities.",
  },
];

export default function TeamAccessSettings() {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border px-6 py-6 sm:px-7 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Team & access</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Manage your sales team
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Control who can access the workspace and define the level of
            responsibility each team member has.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Invite member
        </button>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Users className="h-4.5 w-4.5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Workspace members
            </p>

            <p className="mt-0.5 text-xs text-muted">
              3 members with access to this workspace
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-[minmax(0,1.6fr)_140px_110px_50px] items-center gap-4 border-b border-border bg-background/60 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted sm:grid">
            <span>Member</span>
            <span>Role</span>
            <span>Leads</span>
            <span />
          </div>

          <div className="divide-y divide-border">
            {members.map((member) => (
              <div
                key={member.email}
                className="flex flex-col gap-4 px-4 py-4 transition-colors hover:bg-background sm:grid sm:grid-cols-[minmax(0,1.6fr)_140px_110px_50px] sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                    {member.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {member.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:block">
                  <span className="text-xs text-muted sm:hidden">Role</span>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-body">
                    {member.role === "Owner" && (
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    )}
                    {member.role}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:block">
                  <span className="text-xs text-muted sm:hidden">
                    Assigned leads
                  </span>

                  <span className="text-sm font-semibold text-foreground">
                    {member.leads}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 sm:hidden">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {member.status}
                  </span>

                  <button
                    type="button"
                    aria-label={`Manage ${member.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />

            <h3 className="text-sm font-semibold text-foreground">
              Access levels
            </h3>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {roleDescriptions.map((item) => (
              <div key={item.role} className="rounded-2xl bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {item.role}
                  </p>

                  <span className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <p className="mt-2 text-xs leading-5 text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background/60 px-6 py-4 sm:px-7">
        <p className="text-xs leading-5 text-muted">
          Role permissions will be enforced by the backend when authentication
          and authorization are connected.
        </p>
      </div>
    </section>
  );
}
