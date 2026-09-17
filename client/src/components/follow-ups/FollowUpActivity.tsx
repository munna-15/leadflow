"use client";

import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Pencil,
  Thermometer,
  UserRound,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import {
  getActivities,
  type Activity,
  type ActivityType,
} from "@/services/activity.service";

import { useEffect, useState } from "react";

type FollowUpActivityProps = {
  refreshKey?: number;
};

const activityIcons: Record<ActivityType, typeof CheckCircle2> = {
  lead_created: UserRoundCheck,
  lead_assigned: UserRound,
  lead_updated: Pencil,
  status_changed: CheckCircle2,
  temperature_changed: Thermometer,
  follow_up_scheduled: CalendarCheck2,
  follow_up_rescheduled: Clock3,
  follow_up_completed: CheckCircle2,
  follow_up_cancelled: XCircle,
};

const formatActivityTime = (value: string) => {
  const date = new Date(value);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);

    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);

    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return `Today · ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  const yesterday = new Date(now);

  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday · ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getActivityIcon = (type: ActivityType) => {
  return activityIcons[type] ?? Clock3;
};

export default function FollowUpActivity({
  refreshKey = 0,
}: FollowUpActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getActivities();

        if (mounted) {
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to load activities:", error);

        if (mounted) {
          setError("Unable to load recent activity.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div>
        <p className="text-sm font-semibold text-primary">Recent activity</p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          Follow-up history
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Recent actions taken across your sales conversations.
        </p>
      </div>

      <div className="mt-7">
        {loading && (
          <div className="space-y-5">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index} className="flex gap-3.5">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-primary-soft" />

                <div className="min-w-0 flex-1 space-y-2 pt-1">
                  <div className="h-4 w-40 animate-pulse rounded bg-border" />

                  <div className="h-3 w-24 animate-pulse rounded bg-border" />

                  <div className="h-3 w-full animate-pulse rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-danger/15 bg-danger/5 px-4 py-5">
            <p className="text-sm font-semibold text-danger">
              Activity unavailable
            </p>

            <p className="mt-1 text-sm leading-6 text-muted">{error}</p>
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 py-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Clock3 className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No activity yet
            </h3>

            <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted">
              Activity will appear here as leads and follow-ups are created,
              updated, scheduled, or completed.
            </p>
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="max-h-[460px] overflow-y-auto pr-1">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);

              const isLast = index === activities.length - 1;

              return (
                <div key={activity._id} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-4 w-4" />
                    </div>

                    {!isLast && <div className="my-2 w-px flex-1 bg-border" />}
                  </div>

                  <div className={`min-w-0 ${isLast ? "pb-0" : "pb-6"}`}>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {activity.title}
                      </h3>

                      <span className="text-xs font-medium text-muted">
                        {formatActivityTime(activity.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm leading-6 text-body">
                      {activity.description}
                    </p>

                    {activity.actor && (
                      <p className="mt-2 text-xs font-medium text-muted">
                        by{" "}
                        <span className="text-foreground">
                          {activity.actor.name}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
