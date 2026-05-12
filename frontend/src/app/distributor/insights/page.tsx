"use client";

import { Brain } from "lucide-react";

const categoryData = [
  { label: "Weather", count: 0, color: "bg-slate-500" },
  { label: "Capacity", count: 0, color: "bg-red-500" },
  { label: "Demand", count: 0, color: "bg-slate-900" },
  { label: "Efficiency", count: 0, color: "bg-slate-500" },
  { label: "Maintenance", count: 0, color: "bg-slate-500" },
  { label: "Forecast", count: 0, color: "bg-slate-500" },
];

export default function DistributorInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Logistics Insights</h1>
        <p className="text-slate-500">Intelligent supply chain intelligence</p>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">AI Status: </span>
          Connect fleet and warehouse data to activate AI-powered insights.
        </p>
      </div>

      <div className="flex items-center justify-center h-[300px] bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="p-4 bg-slate-100 rounded-lg inline-flex mb-4">
            <Brain className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm mb-1">No insights available</p>
          <p className="text-slate-400 text-xs">Insights will appear once operational data is connected</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Insight Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryData.map((cat) => (
            <div key={cat.label} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${cat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-slate-900">{cat.count}</p>
              <p className="text-sm text-slate-500">{cat.label} Insights</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
