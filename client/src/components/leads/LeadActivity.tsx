"use client";

import { BrainCircuit, CalendarDays, CircleDot, UserPlus } from "lucide-react";

import type { Lead } from "@/services/lead.service";

type LeadActivityProps = {
  lead: Lead;
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: typeof CircleDot;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatFollowUpTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function LeadActivity({ lead }: LeadActivityProps) {
  const activities: ActivityItem[] = [
    {
      id: "created",
      title: "Lead captured",
      description: `Lead was added to LeadFlow through ${lead.source || "manual"} capture.`,
      time: formatDateTime(lead.createdAt),
      icon: CircleDot,
    },
  ];

  if (lead.updatedAt && lead.updatedAt !== lead.createdAt) {
    activities.push({
      id: "updated",
      title: "Lead updated",
      description: "Lead information or sales state was updated.",
      time: formatDateTime(lead.updatedAt),
      icon: BrainCircuit,
    });
  }

  if (lead.assignedTo) {
    activities.push({
      id: "assigned",
      title: "Lead assigned",
      description: `Assigned to ${lead.assignedTo.name} for sales follow-up.`,
      time: formatDateTime(lead.updatedAt),
      icon: UserPlus,
    });
  }

  if (lead.nextFollowUpAt) {
    activities.push({
      id: "follow-up",
      title: "Follow-up scheduled",
      description: `Next follow-up is scheduled for ${formatFollowUpTime(
        lead.nextFollowUpAt,
      )}.`,
      time: formatDateTime(lead.updatedAt),
      icon: CalendarDays,
    });
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div>
        <p className="text-sm font-semibold text-primary">Activity</p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          Lead timeline
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          A chronological record of information currently available for this
          lead.
        </p>
      </div>

      <div className="mt-7">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = activity.icon;
            const isLast = index === activities.length - 1;

            return (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  {!isLast && <div className="my-2 w-px flex-1 bg-border" />}
                </div>

                <div className={`min-w-0 ${isLast ? "pb-0" : "pb-7"}`}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {activity.title}
                    </h3>

                    <span className="text-xs font-medium text-muted">
                      {activity.time}
                    </span>
                  </div>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-body">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-background p-6">
            <p className="text-sm font-semibold text-foreground">
              No activity yet
            </p>

            <p className="mt-1 text-sm leading-6 text-muted">
              Lead activity will appear here as actions are recorded.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
