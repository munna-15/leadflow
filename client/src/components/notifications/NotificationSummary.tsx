import {
  AlertCircle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Flame,
} from "lucide-react";

const summaryItems = [
  {
    label: "Unread",
    value: "7",
    description: "Notifications waiting",
    icon: Bell,
    tone: "primary",
  },
  {
    label: "Needs attention",
    value: "3",
    description: "Requires action",
    icon: AlertCircle,
    tone: "danger",
  },
  {
    label: "Hot lead alerts",
    value: "2",
    description: "High-intent opportunities",
    icon: Flame,
    tone: "warning",
  },
  {
    label: "Upcoming",
    value: "4",
    description: "Meetings & reminders",
    icon: CalendarClock,
    tone: "neutral",
  },
];

const toneStyles = {
  primary: {
    icon: "bg-primary-soft text-primary",
    value: "text-primary",
    accent: "bg-primary",
  },
  danger: {
    icon: "bg-red-50 text-red-600",
    value: "text-red-600",
    accent: "bg-red-500",
  },
  warning: {
    icon: "bg-orange-50 text-orange-600",
    value: "text-orange-600",
    accent: "bg-orange-500",
  },
  neutral: {
    icon: "bg-background text-muted",
    value: "text-foreground",
    accent: "bg-foreground",
  },
};

export default function NotificationSummary() {
  return (
    <section className="mt-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-y-0">
          {summaryItems.map((item, index) => {
            const Icon = item.icon;
            const styles = toneStyles[item.tone as keyof typeof toneStyles];

            const isLast = index === summaryItems.length - 1;

            return (
              <div
                key={item.label}
                className={`group relative p-5 transition-colors hover:bg-background sm:p-6 ${
                  !isLast ? "lg:border-r lg:border-border" : ""
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 ${styles.accent} opacity-70`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  {item.tone === "danger" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Action needed
                    </span>
                  )}

                  {item.tone === "warning" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                      Priority
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-muted">{item.label}</p>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-semibold tracking-tight ${styles.value}`}
                    >
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {item.tone === "primary" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    ) : null}

                    <p className="text-xs font-medium text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
