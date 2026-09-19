"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

import { Toaster } from "sonner";

import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  return (
    <NotificationProvider>
      <div className="min-h-screen overflow-x-hidden bg-background">
        <DashboardSidebar
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="lg:pl-64">
          <DashboardHeader onMenuOpen={() => setIsMobileSidebarOpen(true)} />

          <main className="min-w-0">{children}</main>
        </div>

        <Toaster
          position="top-right"
          theme="light"
          richColors={false}
          closeButton
          toastOptions={{
            className:
              "border border-border bg-surface text-foreground shadow-lg",
            duration: 5000,
          }}
        />
      </div>
    </NotificationProvider>
  );
}
