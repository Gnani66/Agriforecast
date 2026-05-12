"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, TrendingUp, Clock, DollarSign, Bell, RefreshCw, AlertTriangle, BarChart3 } from "lucide-react";
import { retailerService } from "@/services/retailerService";

type Tab = "reorder" | "forecast" | "history";

interface ProcurementItem {
  product: string;
  currentStock?: number;
  minStock?: number;
  suggestedQuantity?: number;
  avgDailySales?: number;
  urgency?: "high" | "medium" | "low" | string;
  reason?: string;
}

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("reorder");
  const [recs, setRecs] = useState<ProcurementItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await retailerService.getProcurement();
    if (res.success && res.data) setRecs(res.data as ProcurementItem[]);
    setLoading(false);
  };

  useEffect(() => {
    async function loadProcurement() {
      const res = await retailerService.getProcurement();
      if (res.success && res.data) setRecs(res.data as ProcurementItem[]);
      setLoading(false);
    }
    loadProcurement();
  }, []);

  const highPriority = recs.filter(r => r.urgency === "high");
  const totalCost = recs.reduce((s, r) => s + ((r.suggestedQuantity || 0) * ((r.avgDailySales || 0) * 30)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Smart Procurement Engine</h1><p className="text-slate-500">AI-driven purchase recommendations and demand planning</p></div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"><RefreshCw className="w-4 h-4" />Refresh</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Reorder Alerts", value: loading ? "--" : recs.length, icon: Bell, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "High Priority", value: loading ? "--" : highPriority.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Est. Procurement", value: loading ? "--" : `₹${totalCost.toLocaleString()}`, icon: DollarSign, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "Items Analyzed", value: loading ? "--" : recs.length, icon: Clock, color: "text-slate-500", bg: "bg-slate-50" },
        ].map((metric, i) => (
          <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${metric.bg}`}><metric.icon className={`w-5 h-5 ${metric.color}`} /></div><div><p className="text-2xl font-bold text-slate-800">{metric.value}</p><p className="text-sm text-slate-500">{metric.label}</p></div></div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {([{ id: "reorder", label: "Reorder Alerts", icon: Bell }, { id: "forecast", label: "Demand Forecast", icon: TrendingUp }, { id: "history", label: "Procurement History", icon: Clock }] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id ? "border-emerald-600 text-slate-500" : "border-transparent text-slate-500 hover:text-slate-700"}`}><tab.icon className="w-4 h-4" />{tab.label}</button>
        ))}
      </div>

      {activeTab === "reorder" && (
        <div className="space-y-4">
          {loading ? <div className="bg-white rounded-lg p-12 text-center"><p className="text-slate-400">Loading...</p></div> : recs.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-slate-200"><ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-300" /><p className="text-slate-500">No procurement recommendations yet</p><p className="text-sm text-slate-400 mt-1">Add inventory items to get recommendations</p></div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">Reorder Alerts</h3>
                <div className="space-y-3">{highPriority.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div><p className="font-medium text-slate-800">{r.product}</p><p className="text-xs text-slate-500">Stock: {r.currentStock} | Min: {r.minStock}</p></div>
                    <span className="px-2 py-1 bg-red-200 text-red-700 rounded-full text-xs font-medium">{r.urgency}</span>
                  </div>
                ))}</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">Recommended Purchases</h3>
                <div className="space-y-3">{recs.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div><p className="font-medium text-slate-800">{r.product}</p><p className="text-xs text-slate-500">Suggested: {r.suggestedQuantity} units</p></div>
                    <span className="text-sm font-medium text-slate-500">{r.urgency === "high" ? "Order now" : r.urgency === "medium" ? "Order soon" : "Hold"}</span>
                  </div>
                ))}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "forecast" && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Demand Forecast</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Current Stock</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Avg Daily Sales</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Predicted Demand</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Trend</th></tr></thead>
              <tbody>{recs.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400"><BarChart3 className="w-8 h-8 mx-auto mb-2" /><p>Forecast data will appear once demand patterns are established</p></td></tr>
              ) : recs.map((r, i) => (
                <tr key={i} className="border-b border-slate-100"><td className="py-3 px-4 font-medium">{r.product}</td><td className="py-3 px-4">{r.currentStock}</td><td className="py-3 px-4">{r.avgDailySales?.toFixed(1)}</td><td className="py-3 px-4">{r.suggestedQuantity}</td><td className="py-3 px-4"><span className={`text-xs font-medium ${r.urgency === "high" ? "text-red-600" : r.urgency === "medium" ? "text-amber-600" : "text-slate-500"}`}>{r.reason}</span></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Procurement Recommendations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Current Stock</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Suggested Qty</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Urgency</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Reason</th></tr></thead>
              <tbody>{recs.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400"><Clock className="w-8 h-8 mx-auto mb-2" /><p>No recommendations yet</p></td></tr>
              ) : recs.map((r, i) => (
                <tr key={i} className="border-b border-slate-100"><td className="py-3 px-4 font-medium">{r.product}</td><td className="py-3 px-4">{r.currentStock}</td><td className="py-3 px-4">{r.suggestedQuantity}</td><td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${r.urgency === "high" ? "bg-red-100 text-red-700" : r.urgency === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>{r.urgency}</span></td><td className="py-3 px-4 text-sm text-slate-500">{r.reason}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
