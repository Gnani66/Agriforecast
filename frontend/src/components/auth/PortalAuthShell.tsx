"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface PortalAuthShellProps {
  roleLabel: string;
  title: string;
  subtitle: string;
  mode: "login" | "signup";
  alternateHref: string;
  alternateLabel: string;
  Icon: LucideIcon;
  accent?: "emerald" | "blue";
  children: React.ReactNode;
}

export default function PortalAuthShell({
  roleLabel,
  title,
  subtitle,
  mode,
  alternateHref,
  alternateLabel,
  Icon,
  children,
}: PortalAuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex flex-col items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/10 group-hover:bg-slate-800 transition-colors">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold tracking-tight text-slate-900">AgriForecast</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-0.5">{roleLabel}</p>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white px-4 py-8 shadow-sm ring-1 ring-slate-200 sm:rounded-xl sm:px-10">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
            <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          </div>

          {children}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {alternateLabel}{" "}
          <Link href={alternateHref} className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">
            {mode === "login" ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
