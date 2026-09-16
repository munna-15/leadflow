"use client";

import Link from "next/link";
import {
  BarChart3,
  Bell,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  Workflow,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    label: "Pipeline",
    href: "/dashboard/pipeline",
    icon: Workflow,
  },
  {
    label: "Follow-ups",
    href: "/dashboard/follow-ups",
    icon: ClipboardList,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

export default function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-surface lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-18 items-center border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
              L
            </span>

            <span className="text-lg font-semibold tracking-tight text-foreground">
              LeadFlow
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-primary-soft hover:text-primary"
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          <Link
            href="/dashboard/notifications"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <Bell className="h-4.5 w-4.5" />
            Notifications
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <Settings className="h-4.5 w-4.5" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
