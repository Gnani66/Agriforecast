"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DistributorSidebar from "@/components/distributor/sidebar/DistributorSidebar";
import DistributorTopbar from "@/components/distributor/topbar/DistributorTopbar";

export default function DistributorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/distributor/login" || pathname === "/distributor/signup") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute allowedRole="distributor">
      <div className="app-workspace min-h-screen flex">
        <DistributorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-h-screen">
          <DistributorTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
