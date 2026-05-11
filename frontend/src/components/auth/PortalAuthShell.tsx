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

const accents = {
  emerald: {
    brand: "text-emerald-700",
    icon: "bg-emerald-600 text-white",
    panel: "border-emerald-200 bg-emerald-50 text-emerald-900",
    link: "text-emerald-700 hover:text-emerald-900",
  },
  blue: {
    brand: "text-blue-700",
    icon: "bg-blue-600 text-white",
    panel: "border-blue-200 bg-blue-50 text-blue-900",
    link: "text-blue-700 hover:text-blue-900",
  },
};

export default function PortalAuthShell({
  roleLabel,
  title,
  subtitle,
  mode,
  alternateHref,
  alternateLabel,
  Icon,
  accent = "emerald",
  children,
}: PortalAuthShellProps) {
  const tone = accents[accent];

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[0.92fr_1fr]">
        <section className="hidden border-r border-slate-200 bg-white px-10 py-8 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone.icon}`}>
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">AgriForecast</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          </Link>

          <div className="mt-16 max-w-md">
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${tone.brand}`}>Secure workspace</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
              Operating system for perishable agriculture decisions.
            </h1>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Forecast demand, control inventory exposure, and keep field, store, and logistics teams working from the same source of truth.
            </p>
          </div>

          <div className="mt-auto grid gap-3 text-sm">
            {["Role-based access", "Operational forecasting", "Audit-ready workflows"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                <span className="font-medium text-slate-700">{item}</span>
                <span className="h-2 w-2 rounded-full bg-slate-300" />
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-[480px]">
            <div className="mb-7 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">AgriForecast</span>
              </Link>
              <span className="text-xs font-medium text-slate-500">{roleLabel}</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {mode === "login" ? "Sign in" : "Create account"}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                  </div>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.panel}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">{children}</div>
            </div>

            <p className="mt-5 text-center text-sm text-slate-600">
              {alternateLabel}{" "}
              <Link href={alternateHref} className={`font-semibold ${tone.link}`}>
                {mode === "login" ? "Create an account" : "Sign in"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
