import type { ReactNode } from "react";

import PlatformHeader from "@/components/platform/PlatformHeader";
import PlatformSidebar from "@/components/platform/PlatformSidebar";

interface PlatformLayoutProps {
  children: ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#111827]">
      <div className="flex min-h-screen">
        <PlatformSidebar />

        <main className="min-w-0 flex-1 pt-16 lg:pt-0">
          <PlatformHeader />

          <div className="min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
