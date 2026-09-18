"use client";

import {
  Activity as ActivityIcon,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Thermometer,
  UserPlus,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { Lead } from "@/services/lead.service";
import {
  getActivities,
  type Activity,
  type ActivityType,
} from "@/services/activity.service";

type LeadActivityProps = {
  lead: Lead;
};

const formatDateTime = (value: string) => {
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

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "lead_created":
      return CircleDot;

    case "lead_assigned":
      return UserPlus;

    case "lead_updated":
      return BrainCircuit;

    case "status_changed":
      return ActivityIcon;

    case "temperature_changed":
      return Thermometer;

    case "follow_up_scheduled":
      return CalendarDays;

    case "follow_up_rescheduled":
      return Clock3;

    case "follow_up_completed":
      return CheckCircle2;

    case "follow_up_cancelled":
      return XCircle;

    default:
      return CircleDot;
  }
};

const getActivityIconStyle = (type: ActivityType) => {
  switch (type) {
    case "lead_created":
      return "bg-primary-soft text-primary";

    case "lead_assigned":
      return "bg-primary-soft text-primary";

    case "lead_updated":
      return "bg-primary-soft text-primary";

    case "status_changed":
      return "bg-primary-soft text-primary";

    case "temperature_changed":
      return "bg-orange-50 text-orange-600";

    case "follow_up_scheduled":
      return "bg-primary-soft text-primary";

    case "follow_up_rescheduled":
      return "bg-amber-50 text-amber-600";

    case "follow_up_completed":
      return "bg-success/10 text-success";

    case "follow_up_cancelled":
      return "bg-danger/10 text-danger";

    default:
      return "bg-background text-muted";
  }
};

const sortActivities = (activities: Activity[]) => {
  return [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export default function LeadActivity({ lead }: LeadActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getActivities({
        lead: lead._id,
      });

      setActivities(sortActivities(data));
    } catch (error) {
      console.error("Failed to load lead activities:", error);

      setActivities([]);
      setError("Unable to load lead activity. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [lead._id]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getActivities({
          lead: lead._id,
        });

        if (cancelled) {
          return;
        }

        setActivities(sortActivities(data));
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load lead activities:", error);

        setActivities([]);
        setError("Unable to load lead activity. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [lead._id]);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Activity</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Lead timeline
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            A chronological record of actions and changes recorded for this
            lead.
          </p>
        </div>

        {!loading && (
          <button
            type="button"
            onClick={loadActivities}
            aria-label="Refresh lead activity"
            title="Refresh activity"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-7">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center rounded-2xl bg-background">
            <div className="flex items-center gap-2.5 text-sm font-medium text-muted">
              <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
              Loading activity...
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
            <p className="text-sm font-semibold text-danger">{error}</p>

            <button
              type="button"
              onClick={loadActivities}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-danger transition-colors hover:opacity-80"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-muted">
                <ActivityIcon className="h-4.5 w-4.5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  No activity yet
                </p>

                <p className="mt-1 text-sm leading-6 text-muted">
                  Lead activity will appear here as actions are recorded.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);

              const isLast = index === activities.length - 1;

              const iconStyle = getActivityIconStyle(activity.type);

              return (
                <div key={activity._id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                    >
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
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-body">
                      {activity.description}
                    </p>

                    {activity.actor && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                        <UserRoundCheck className="h-3.5 w-3.5" />

                        <span>{activity.actor.name}</span>
                      </div>
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
