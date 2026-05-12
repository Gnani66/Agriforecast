"use client";

import {
  Route,
  TrendingUp,
  Fuel,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const colorMap: Record<string, string> = {
  blue: "bg-slate-50 text-slate-500",
  emerald: "bg-slate-50 text-slate-500",
  purple: "bg-slate-50 text-slate-500",
  orange: "bg-slate-50 text-slate-500",
};

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Route Optimization</h1>
        <p className="text-slate-500">AI-powered route planning and fuel optimization</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Routes", icon: Route, color: "blue" },
          { label: "Avg Efficiency", icon: TrendingUp, color: "emerald" },
          { label: "Fuel Saved", icon: Fuel, color: "purple" },
          { label: "Time Saved", icon: Clock, color: "orange" },
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Fuel Optimization</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={[]}>
              <defs>
                <linearGradient id="fuelUsed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fuelOptimized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="fuelUsed" stroke="#ef4444" fill="url(#fuelUsed)" strokeWidth={2} name="Current Usage" />
              <Area type="monotone" dataKey="optimized" stroke="#18181b" fill="url(#fuelOptimized)" strokeWidth={2} name="Optimized" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Traffic Conditions</h3>
          <div className="flex items-center justify-center h-[280px] text-slate-400 text-sm">
            No traffic data available
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Route Efficiency Scores</h3>
        <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
          No route data available
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-100 rounded-lg">
            <Route className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">AI Route Optimization</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Based on real-time traffic data and historical patterns, optimal route recommendations will appear here. Connect your fleet data to enable AI-powered route suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
