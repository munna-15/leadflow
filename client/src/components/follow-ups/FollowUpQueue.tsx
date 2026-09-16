"use client";

import { AlertCircle, ArrowRight, CalendarDays } from "lucide-react";

import FollowUpCard from "./FollowUpCard";

const overdueFollowUps = [
  {
    id: "1",
    name: "Rahim Ahmed",
    initials: "RA",
    status: "Qualified",
    temperature: "Hot" as const,
    score: 92,
    reason: "Follow-up overdue",
    description:
      "Confirm apartment availability and arrange a property viewing while the lead still has a near-term buying timeline.",
    scheduledAt: "Due yesterday · 4:00 PM",
    timingLabel: "Overdue",
    timingType: "overdue" as const,
  },
  {
    id: "karim-hasan",
    name: "Karim Hasan",
    initials: "KH",
    status: "Contacted",
    temperature: "Hot" as const,
    score: 84,
    reason: "No response for 2 days",
    description:
      "Reconnect with Karim and check whether the apartment requirement is still active before the opportunity goes cold.",
    scheduledAt: "Due yesterday · 11:30 AM",
    timingLabel: "Overdue",
    timingType: "overdue" as const,
  },
];

const todayFollowUps = [
  {
    id: "nadia-rahman",
    name: "Nadia Rahman",
    initials: "NR",
    status: "Meeting",
    temperature: "Warm" as const,
    score: 78,
    reason: "Meeting confirmation",
    description:
      "Confirm tomorrow's property viewing and make sure the requested apartment options are ready.",
    scheduledAt: "Today · 3:30 PM",
    timingLabel: "Today",
    timingType: "today" as const,
  },
  {
    id: "tanvir-hossain",
    name: "Tanvir Hossain",
    initials: "TH",
    status: "New",
    temperature: "Warm" as const,
    score: 71,
    reason: "Initial qualification",
    description:
      "Contact Tanvir to understand his preferred location, budget, and expected move-in timeline.",
    scheduledAt: "Today · 5:00 PM",
    timingLabel: "Today",
    timingType: "today" as const,
  },
];

const upcomingFollowUps = [
  {
    id: "farhan-ahmed",
    name: "Farhan Ahmed",
    initials: "FA",
    status: "Meeting",
    temperature: "Hot" as const,
    score: 88,
    reason: "Property viewing",
    description:
      "Prepare the shortlisted properties and confirm the viewing details before the appointment.",
    scheduledAt: "Tomorrow · 10:30 AM",
    timingLabel: "Tomorrow",
    timingType: "upcoming" as const,
  },
  {
    id: "maya-islam",
    name: "Maya Islam",
    initials: "MI",
    status: "Meeting",
    temperature: "Warm" as const,
    score: 76,
    reason: "Meeting follow-up",
    description:
      "Check in after the initial discussion and prepare the next set of suitable property options.",
    scheduledAt: "Sep 18 · 2:00 PM",
    timingLabel: "Sep 18",
    timingType: "upcoming" as const,
  },
];

export default function FollowUpQueue() {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Action queue</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            What needs your attention
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Start with overdue conversations, then work through today's
            scheduled follow-ups.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:self-auto"
        >
          View all follow-ups
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-7 space-y-10">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Overdue</h3>

              <p className="text-xs text-muted">
                Conversations that need immediate attention
              </p>
            </div>

            <span className="ml-auto rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
              {overdueFollowUps.length}
            </span>
          </div>

          <div className="space-y-3">
            {overdueFollowUps.map((followUp) => (
              <FollowUpCard key={followUp.id} {...followUp} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <CalendarDays className="h-4.5 w-4.5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Today</h3>

              <p className="text-xs text-muted">
                Follow-ups scheduled for today
              </p>
            </div>

            <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              {todayFollowUps.length}
            </span>
          </div>

          <div className="space-y-3">
            {todayFollowUps.map((followUp) => (
              <FollowUpCard key={followUp.id} {...followUp} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-muted">
              <CalendarDays className="h-4.5 w-4.5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Upcoming
              </h3>

              <p className="text-xs text-muted">
                Scheduled conversations coming next
              </p>
            </div>

            <span className="ml-auto rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-muted">
              {upcomingFollowUps.length}
            </span>
          </div>

          <div className="space-y-3">
            {upcomingFollowUps.map((followUp) => (
              <FollowUpCard key={followUp.id} {...followUp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
