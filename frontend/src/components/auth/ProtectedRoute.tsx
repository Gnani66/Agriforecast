"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "farmer" | "retailer" | "distributor";
}

export default function ProtectedRoute({ children, allowedRole = "farmer" }: ProtectedRouteProps) {
  const router = useRouter();
  const { token, role } = useAuth();

  useEffect(() => {
    if (!token) {
      router.replace(`/${allowedRole}/login`);
      return;
    }

    if (role && role !== allowedRole) {
      router.replace(`/${role}/dashboard`);
    }
  }, [allowedRole, role, router, token]);

  if (!token || (role && role !== allowedRole)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
        Checking secure session
      </div>
    );
  }

  return <>{children}</>;
}
