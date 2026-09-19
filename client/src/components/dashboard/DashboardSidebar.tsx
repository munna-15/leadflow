"use client";

import {
  BarChart3,
  Bell,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useNotifications } from "@/components/notifications/NotificationProvider";

type DashboardSidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
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

export default function DashboardSidebar({
  isMobileOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const { unreadCount } = useNotifications();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderNavigation = (item: NavigationItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={onClose}
        aria-current={active ? "page" : undefined}
        className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-primary-soft text-primary"
            : "text-muted hover:bg-primary-soft/70 hover:text-primary"
        }`}
      >
        <Icon
          className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 ${
            active ? "scale-105" : "group-hover:scale-105"
          }`}
        />

        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:h-18 sm:px-6">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            L
          </span>

          <span className="truncate text-lg font-semibold tracking-tight text-foreground">
            LeadFlow
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav
        aria-label="Primary navigation"
        className="flex-1 overflow-y-auto px-3 py-5 sm:py-6"
      >
        <div className="space-y-1">{navigation.map(renderNavigation)}</div>
      </nav>

      <div className="shrink-0 space-y-1 border-t border-border p-3">
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          aria-current={
            isActive("/dashboard/notifications") ? "page" : undefined
          }
          className={`flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive("/dashboard/notifications")
              ? "bg-primary-soft text-primary"
              : "text-muted hover:bg-background hover:text-foreground"
          }`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <Bell className="h-4.5 w-4.5 shrink-0" />

            <span className="truncate">Notifications</span>
          </span>

          {unreadCount > 0 && (
            <span className="shrink-0 rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold leading-4 text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        <Link
          href="/dashboard/settings"
          onClick={onClose}
          aria-current={isActive("/dashboard/settings") ? "page" : undefined}
          className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive("/dashboard/settings")
              ? "bg-primary-soft text-primary"
              : "text-muted hover:bg-background hover:text-foreground"
          }`}
        >
          <Settings className="h-4.5 w-4.5 shrink-0" />

          <span className="truncate">Settings</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-surface shadow-2xl shadow-black/10 transition-transform duration-300 ease-out lg:z-40 lg:w-64 lg:translate-x-0 lg:shadow-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
