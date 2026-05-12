"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Bot, ChevronDown, Menu, Search } from "lucide-react";

export default function RetailerTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();

  const initials = String(user?.storeName || user?.name || "Retailer")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden min-w-56 lg:block">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operations Control</p>
            <p className="text-lg font-semibold tracking-tight text-slate-900 mt-0.5">AgriFlow AI Platform</p>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
          <div className="flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-slate-200 bg-slate-50/50 px-3 transition-colors focus-within:border-slate-300 focus-within:bg-white shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inventory, sales, suppliers..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="hidden h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm xl:flex">
            <Bot className="h-3.5 w-3.5 text-slate-400" />
            AI active
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
            </span>
          </div>

          <button className="hidden h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 lg:flex">
            Retailer
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white shadow-sm">
            {initials || "RT"}
          </div>
        </div>
      </div>
    </header>
  );
}
