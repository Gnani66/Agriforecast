"use client";

import {
  Truck,
  Wrench,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const colorMap: Record<string, string> = {
  blue: "bg-slate-50 text-slate-500",
  emerald: "bg-slate-50 text-slate-500",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-slate-50 text-slate-500",
};

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fleet Monitoring</h1>
        <p className="text-slate-500">Track vehicle status, fuel usage, and maintenance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Total Vehicles", icon: Truck, color: "blue" },
          { label: "Active Now", icon: CheckCircle, color: "emerald" },
          { label: "Idle", icon: Clock, color: "amber" },
          { label: "Maintenance", icon: Wrench, color: "red" },
          { label: "Avg Efficiency", icon: TrendingUp, color: "purple" },
        ].map((stat, i) => (
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colorMap[stat.color]}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-900">Vehicle Fleet</h3>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">
            Add Vehicle
          </button>
        </div>
        <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
          No fleet data available
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Maintenance Alerts</h3>
        <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
          No maintenance alerts
        </div>
      </div>
    </div>
  );
}
