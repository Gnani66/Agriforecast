"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import FarmerSidebar from "@/components/farmer/sidebar/FarmerSidebar";
import FarmerTopbar from "@/components/farmer/topbar/FarmerTopbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface FarmerLayoutProps {
  children: React.ReactNode;
}

export default function FarmerLayout({ children }: FarmerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRole="farmer">
      <div className="min-h-screen bg-slate-50 flex">
        <FarmerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <div className="flex-1 flex flex-col min-h-screen">
          <FarmerTopbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
