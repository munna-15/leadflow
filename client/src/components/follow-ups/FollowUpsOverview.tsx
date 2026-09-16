import {
  AlertCircle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Flame,
  ListChecks,
} from "lucide-react";

const overviewItems = [
  {
    label: "Due today",
    value: "4",
    meta: "2 completed",
    description: "Actions waiting today",
    icon: ListChecks,
    tone: "primary",
    progress: 50,
  },
  {
    label: "Overdue",
    value: "2",
    meta: "Needs attention",
    description: "Conversations waiting too long",
    icon: AlertCircle,
    tone: "danger",
    progress: 100,
  },
  {
    label: "High priority",
    value: "3",
    meta: "Hot leads",
    description: "Worth contacting first",
    icon: Flame,
    tone: "warning",
    progress: 75,
  },
  {
    label: "Upcoming",
    value: "7",
    meta: "Next 3 days",
    description: "Scheduled conversations",
    icon: CalendarClock,
    tone: "neutral",
    progress: 68,
  },
];

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary",
    accent: "bg-primary",
    value: "text-primary",
    ring: "border-primary/20",
  },
  danger: {
    icon: "bg-red-50 text-red-600",
    accent: "bg-red-500",
    value: "text-red-600",
    ring: "border-red-200/70",
  },
  warning: {
    icon: "bg-orange-50 text-orange-600",
    accent: "bg-orange-500",
    value: "text-orange-600",
    ring: "border-orange-200/70",
  },
  neutral: {
    icon: "bg-background text-muted",
    accent: "bg-foreground",
    value: "text-foreground",
    ring: "border-border",
  },
};

export default function FollowUpsOverview() {
  return (
    <section className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewItems.map((item) => {
          const Icon = item.icon;
          const styles = toneStyles[item.tone as keyof typeof toneStyles];

          return (
            <div
              key={item.label}
              className={`group relative overflow-hidden rounded-3xl border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${styles.ring}`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${styles.accent} opacity-80`}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted transition-all duration-300 group-hover:bg-primary-soft group-hover:text-primary">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-semibold tracking-tight ${styles.value}`}
                      >
                        {item.value}
                      </span>

                      <span className="text-xs font-medium text-muted">
                        {item.meta}
                      </span>
                    </div>
                  </div>

                  {item.tone === "primary" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <p className="mt-2 text-sm leading-5 text-muted">
                  {item.description}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[11px] font-medium text-muted">
                  <span>
                    {item.tone === "danger"
                      ? "Attention required"
                      : item.tone === "primary"
                        ? "Today's progress"
                        : item.tone === "warning"
                          ? "Priority queue"
                          : "Schedule coverage"}
                  </span>

                  <span>{item.progress}%</span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className={`h-full rounded-full ${styles.accent} transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
