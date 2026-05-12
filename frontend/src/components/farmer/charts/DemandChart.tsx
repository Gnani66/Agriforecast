"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DemandChart() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Demand Forecast</h3>
          <p className="text-xs text-slate-500 mt-0.5">8-week demand prediction with projected trends</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="text-slate-600">Actual Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-600">Projected</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#71717a" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} tickFormatter={(v) => `${v/1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e4e4e7", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              labelStyle={{ color: "#18181b", fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="demand" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
            <Area type="monotone" dataKey="projected" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
        Chart data will be displayed when forecast data is available.
      </div>
    </div>
  );
}
