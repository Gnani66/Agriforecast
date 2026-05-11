"use client";

import { motion } from "framer-motion";
import {
  Warehouse,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Warehouse Intelligence</h1>
        <p className="text-slate-500">Monitor storage capacity and dispatch performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Warehouses", icon: Warehouse, color: "blue" },
          { label: "Avg Utilization", icon: TrendingUp, color: "emerald" },
          { label: "Active Shipments", icon: Package, color: "purple" },
          { label: "Dispatch Rate", icon: Truck, color: "orange" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colorMap[stat.color]}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-6">Warehouse Overview</h3>
        <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
          No warehouse data available
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
          No recent activity
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Warehouse className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">AI Warehouse Insights</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Connect warehouse data to receive AI-powered capacity recommendations, efficiency benchmarks, and redistribution suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
