"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bot,
  Calendar,
  CloudSun,
  Grid2X2,
  Leaf,
  LineChart,
  LogOut,
  Settings,
  Sprout,
  X,
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: Grid2X2 },
  { label: "My Produce", href: "/farmer/crops", icon: Sprout },
  { label: "Forecasting", href: "/farmer/forecast", icon: LineChart },
  { label: "Harvest Planning", href: "/farmer/harvest", icon: Calendar },
  { label: "Weather", href: "/farmer/weather", icon: CloudSun },
  { label: "Market Trends", href: "/farmer/market", icon: BarChart3 },
  { label: "AI Insights", href: "/farmer/insights", icon: Bot },
  { label: "Notifications", href: "/farmer/assistant", icon: Bell },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

export default function FarmerSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200 bg-white
          transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <Link href="/farmer/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-950 text-white shadow-sm">
              <Leaf className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">AgriFlow AI</p>
            </div>
          </Link>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Overview</p>
          <div className="space-y-0.5">
            {menu.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${active ? "text-slate-900" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-900">Farm workspace</p>
            <p className="mt-0.5 text-xs text-slate-500">Produce supplier</p>
          </div>
          <Link href="/" className="mt-2 flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-600" />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}
