
import {
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  UserPlus,
} from "lucide-react";

const activities = [
  {
    title: "Lead captured",
    description: "Rahim submitted an inquiry through the website.",
    time: "Today · 10:42 AM",
    icon: CircleDot,
  },
  {
    title: "AI qualification completed",
    description: "Lead scored 92 and classified as high-intent.",
    time: "Today · 10:43 AM",
    icon: BrainCircuit,
  },
  {
    title: "Lead assigned",
    description: "Assigned to Munna for sales follow-up.",
    time: "Today · 10:44 AM",
    icon: UserPlus,
  },
  {
    title: "Follow-up scheduled",
    description: "Initial follow-up was scheduled for today.",
    time: "Today · 10:45 AM",
    icon: CalendarDays,
  },
  {
    title: "Previous follow-up completed",
    description: "Sales team contacted the lead and discussed requirements.",
    time: "Sep 13 · 3:20 PM",
    icon: CheckCircle2,
  },
];

export default function LeadActivity() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
      <div>
        <p className="text-sm font-semibold text-primary">Activity</p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          Lead timeline
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          A chronological record of important actions and updates.
        </p>
      </div>

      <div className="mt-7">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={`${activity.title}-${activity.time}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                {!isLast && <div className="my-2 w-px flex-1 bg-border" />}
              </div>

              <div className={`${isLast ? "pb-0" : "pb-7"} min-w-0`}>
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
        })}
      </div>
    </section>
  );
}

