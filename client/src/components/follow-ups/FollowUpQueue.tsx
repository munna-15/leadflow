"use client";

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { FollowUp } from "@/services/followUp.service";

import FollowUpCard from "./FollowUpCard";

type FollowUpQueueProps = {
  followUps: FollowUp[];
  onCompleted?: (followUpId: string) => void;
  onDeleted?: (followUpId: string) => void;
  onEdit?: (followUpId: string) => void;
};

type QueueFollowUp = {
  followUpId: string;
  leadId: string;
  name: string;
  initials: string;
  status: string;
  temperature: "Hot" | "Warm" | "Cold";
  score: number;
  reason: string;
  description: string;
  scheduledAt: string;
  timingLabel: string;
  timingType: "overdue" | "today" | "upcoming";
  phone: string | null;
  email: string | null;
  type: FollowUp["type"];
};

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatUpcomingDate = (date: Date) => {
  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  ) {
    return `Tomorrow · ${formatTime(date)}`;
  }

  return `${formatDate(date)} · ${formatTime(date)}`;
};

const isSameDay = (firstDate: Date, secondDate: Date) => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const isOverdue = (followUp: FollowUp, now: Date) => {
  return (
    followUp.status === "scheduled" &&
    new Date(followUp.scheduledAt).getTime() < now.getTime()
  );
};

const isToday = (followUp: FollowUp, now: Date) => {
  const scheduledDate = new Date(followUp.scheduledAt);

  return followUp.status === "scheduled" && isSameDay(scheduledDate, now);
};

const isUpcoming = (followUp: FollowUp, now: Date) => {
  const scheduledDate = new Date(followUp.scheduledAt);

  const endDate = new Date(now);

  endDate.setDate(endDate.getDate() + 3);
  endDate.setHours(23, 59, 59, 999);

  return (
    followUp.status === "scheduled" &&
    scheduledDate.getTime() > now.getTime() &&
    scheduledDate.getTime() <= endDate.getTime()
  );
};

const getReason = (
  followUp: FollowUp,
  timingType: "overdue" | "today" | "upcoming",
) => {
  if (timingType === "overdue") {
    return "Follow-up overdue";
  }

  if (followUp.lead.temperature === "hot") {
    return "High-priority follow-up";
  }

  if (timingType === "today") {
    return "Scheduled today";
  }

  return "Upcoming conversation";
};

const getDescription = (followUp: FollowUp) => {
  if (followUp.notes?.trim()) {
    return followUp.notes;
  }

  switch (followUp.type) {
    case "call":
      return "Contact the lead and move the conversation toward the next sales step.";

    case "message":
      return "Reconnect with the lead and keep the opportunity moving forward.";

    case "email":
      return "Send the planned email and continue the conversation with the lead.";

    case "meeting":
      return "Prepare for the meeting and make sure the next step is clearly defined.";

    default:
      return "Review the lead and complete the scheduled follow-up.";
  }
};

const toQueueItem = (
  followUp: FollowUp,
  timingType: "overdue" | "today" | "upcoming",
): QueueFollowUp => {
  const scheduledDate = new Date(followUp.scheduledAt);

  let timingLabel = "";

  if (timingType === "overdue") {
    timingLabel = "Overdue";
  } else if (timingType === "today") {
    timingLabel = "Today";
  } else {
    timingLabel = formatUpcomingDate(scheduledDate);
  }

  return {
    followUpId: followUp._id,
    leadId: followUp.lead._id,
    name: followUp.lead.name,
    initials: getInitials(followUp.lead.name),
    status:
      followUp.lead.status.charAt(0).toUpperCase() +
      followUp.lead.status.slice(1),
    temperature: (followUp.lead.temperature.charAt(0).toUpperCase() +
      followUp.lead.temperature.slice(1)) as "Hot" | "Warm" | "Cold",
    score: followUp.lead.score,
    reason: getReason(followUp, timingType),
    description: getDescription(followUp),
    scheduledAt:
      timingType === "overdue"
        ? `Due ${formatUpcomingDate(scheduledDate)}`
        : timingLabel,
    timingLabel,
    timingType,
    phone: followUp.lead.phone,
    email: followUp.lead.email,
    type: followUp.type,
  };
};

export default function FollowUpQueue({
  followUps,
  onCompleted,
  onDeleted,
  onEdit,
}: FollowUpQueueProps) {
  const [showAll, setShowAll] = useState(false);

  const now = new Date();

  const scheduledFollowUps = useMemo(() => {
    return followUps
      .filter((followUp) => followUp.status === "scheduled")
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
  }, [followUps]);

  const overdueFollowUps = useMemo(() => {
    return followUps
      .filter((followUp) => isOverdue(followUp, now))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      )
      .map((followUp) => toQueueItem(followUp, "overdue"));
  }, [followUps, now]);

  const todayFollowUps = useMemo(() => {
    return followUps
      .filter((followUp) => isToday(followUp, now))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      )
      .map((followUp) => toQueueItem(followUp, "today"));
  }, [followUps, now]);

  const upcomingFollowUps = useMemo(() => {
    return followUps
      .filter((followUp) => isUpcoming(followUp, now))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      )
      .map((followUp) => toQueueItem(followUp, "upcoming"));
  }, [followUps, now]);

  const allScheduledItems = useMemo(() => {
    return scheduledFollowUps.map((followUp) => {
      const timingType = isOverdue(followUp, now)
        ? "overdue"
        : isToday(followUp, now)
          ? "today"
          : "upcoming";

      return toQueueItem(followUp, timingType);
    });
  }, [scheduledFollowUps, now]);

  const hasQueueItems =
    overdueFollowUps.length > 0 ||
    todayFollowUps.length > 0 ||
    upcomingFollowUps.length > 0;

  const hasScheduledItems = allScheduledItems.length > 0;

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Action queue</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {showAll ? "All scheduled follow-ups" : "What needs your attention"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            {showAll
              ? "Review every scheduled conversation across your sales pipeline."
              : "Start with overdue conversations, then work through today's scheduled follow-ups."}
          </p>
        </div>

        {hasScheduledItems && (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:self-auto"
          >
            {showAll ? "Show action queue" : "View all follow-ups"}

            <ArrowRight
              className={`h-4 w-4 transition-transform duration-200 ${
                showAll ? "rotate-180" : "group-hover:translate-x-0.5"
              }`}
            />
          </button>
        )}
      </div>

      {showAll ? (
        <div className="mt-7">
          {!hasScheduledItems ? (
            <EmptyQueue />
          ) : (
            <div className="space-y-3">
              {allScheduledItems.map((followUp) => (
                <FollowUpCard
                  key={followUp.followUpId}
                  {...followUp}
                  onCompleted={onCompleted}
                  onDeleted={onDeleted}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      ) : !hasQueueItems ? (
        <div className="mt-7 rounded-3xl border border-border bg-surface px-6 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-foreground">
            You&apos;re all caught up
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            There are no overdue, today, or upcoming follow-ups in the next
            three days.
          </p>

          {hasScheduledItems && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View all scheduled follow-ups
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="mt-7 space-y-10">
          {overdueFollowUps.length > 0 && (
            <QueueGroup
              title="Overdue"
              description="Conversations that need immediate attention"
              count={overdueFollowUps.length}
              variant="overdue"
            >
              {overdueFollowUps.map((followUp) => (
                <FollowUpCard
                  key={followUp.followUpId}
                  {...followUp}
                  onCompleted={onCompleted}
                  onDeleted={onDeleted}
                  onEdit={onEdit}
                />
              ))}
            </QueueGroup>
          )}

          {todayFollowUps.length > 0 && (
            <QueueGroup
              title="Today"
              description="Follow-ups scheduled for today"
              count={todayFollowUps.length}
              variant="today"
            >
              {todayFollowUps.map((followUp) => (
                <FollowUpCard
                  key={followUp.followUpId}
                  {...followUp}
                  onCompleted={onCompleted}
                  onDeleted={onDeleted}
                  onEdit={onEdit}
                />
              ))}
            </QueueGroup>
          )}

          {upcomingFollowUps.length > 0 && (
            <QueueGroup
              title="Upcoming"
              description="Scheduled conversations coming next"
              count={upcomingFollowUps.length}
              variant="upcoming"
            >
              {upcomingFollowUps.map((followUp) => (
                <FollowUpCard
                  key={followUp.followUpId}
                  {...followUp}
                  onCompleted={onCompleted}
                  onDeleted={onDeleted}
                  onEdit={onEdit}
                />
              ))}
            </QueueGroup>
          )}
        </div>
      )}
    </section>
  );
}

type QueueGroupProps = {
  title: string;
  description: string;
  count: number;
  variant: "overdue" | "today" | "upcoming";
  children: React.ReactNode;
};

function QueueGroup({
  title,
  description,
  count,
  variant,
  children,
}: QueueGroupProps) {
  const styles = {
    overdue: {
      wrapper: "bg-red-50 text-red-600",
      icon: AlertCircle,
      count: "bg-red-50 text-red-600",
    },
    today: {
      wrapper: "bg-primary-soft text-primary",
      icon: CalendarDays,
      count: "bg-primary-soft text-primary",
    },
    upcoming: {
      wrapper: "bg-background text-muted",
      icon: CalendarDays,
      count: "bg-background text-muted",
    },
  };

  const config = styles[variant];
  const Icon = config.icon;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.wrapper}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>

          <p className="text-xs text-muted">{description}</p>
        </div>

        <span
          className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${config.count}`}
        >
          {count}
        </span>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        No scheduled follow-ups
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        Schedule a follow-up to keep your sales conversations moving.
      </p>
    </div>
  );
}
