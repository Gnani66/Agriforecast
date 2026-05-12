"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RetailerSidebar from "@/components/retailer/sidebar/RetailerSidebar";
import RetailerTopbar from "@/components/retailer/topbar/RetailerTopbar";

export default function RetailerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/retailer/login" || pathname === "/retailer/signup") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute allowedRole="retailer">
      <div className="app-workspace min-h-screen flex">
        <RetailerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-h-screen">
          <RetailerTopbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
