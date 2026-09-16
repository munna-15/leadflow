import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  PhoneCall,
  UserRound,
} from "lucide-react";

const activities = [
  {
    title: "Follow-up completed",
    description: "Rahim Ahmed was contacted about property availability.",
    time: "Today · 11:20 AM",
    icon: CheckCircle2,
  },
  {
    title: "Follow-up scheduled",
    description: "Meeting confirmation scheduled for Nadia Rahman.",
    time: "Today · 9:45 AM",
    icon: CalendarCheck2,
  },
  {
    title: "Call logged",
    description: "Karim Hasan was contacted after no response.",
    time: "Yesterday · 4:10 PM",
    icon: PhoneCall,
  },
  {
    title: "Reminder created",
    description: "Tanvir Hossain added to today's follow-up queue.",
    time: "Yesterday · 3:35 PM",
    icon: Clock3,
  },
  {
    title: "Lead assigned",
    description: "Farhan Ahmed was assigned for meeting coordination.",
    time: "Sep 13 · 2:15 PM",
    icon: UserRound,
  },
];

export default function FollowUpActivity() {
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
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;

          return (
            <div
              key={`${activity.title}-${activity.time}`}
              className="flex gap-3.5"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </div>

                {!isLast && <div className="my-2 w-px flex-1 bg-border" />}
              </div>

              <div className={`${isLast ? "pb-0" : "pb-6"} min-w-0`}>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {activity.title}
                  </h3>

                  <span className="text-xs font-medium text-muted">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1.5 text-sm leading-6 text-body">
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
