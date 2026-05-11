"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Package,
  Truck,
  Clock,
  CheckCircle,
  Fuel,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  cyan: "bg-cyan-50 text-cyan-600",
  red: "bg-red-50 text-red-600",
};

const statCards = [
  { label: "Total Deliveries", icon: Package, color: "blue" },
  { label: "On-Time Rate", icon: CheckCircle, color: "emerald" },
  { label: "Avg Delivery Time", icon: Clock, color: "purple" },
  { label: "Fuel Efficiency", icon: Fuel, color: "orange" },
  { label: "Fleet Utilization", icon: Truck, color: "cyan" },
  { label: "Cost per Delivery", icon: BarChart3, color: "red" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Logistics Analytics</h1>
        <p className="text-slate-500">Performance metrics and operational insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        {statCards.map((metric, i) => (
          <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <div className={`p-1.5 rounded-lg ${colorMap[metric.color]}`}>
                <metric.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">-</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Delivery Performance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={[]}>
              <defs>
                <linearGradient id="deliveriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="deliveries" stroke="#3b82f6" fill="url(#deliveriesGradient)" strokeWidth={2} name="Deliveries" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Fleet Efficiency vs Fuel</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#22c55e" strokeWidth={2} name="Efficiency %" />
              <Line type="monotone" dataKey="fuel" stroke="#f59e0b" strokeWidth={2} name="Fuel (L)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Weekly Performance Summary</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="deliveries" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Deliveries" />
            <Bar dataKey="efficiency" fill="#22c55e" radius={[4, 4, 0, 0]} name="Efficiency %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">AI Analytics Insights</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Connect operational data to receive AI-powered analytics insights, performance trends, and recommendations for cost optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
