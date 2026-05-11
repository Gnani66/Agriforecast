"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, CheckCircle, Package, RefreshCw } from "lucide-react";
import { retailerService } from "@/services/retailerService";

export default function WasteAnalytics() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const fetchWaste = async () => {
    setLoading(true);
    const res = await retailerService.getWasteAlerts();
    if (res.success && res.data) setAlerts(res.data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchWaste(); }, []);

  const filtered = selectedSeverity === "all" ? alerts : alerts.filter(a => a.severity === selectedSeverity);

  const critical = alerts.filter(a => a.severity === "critical").length;
  const high = alerts.filter(a => a.severity === "high").length;
  const potentialLoss = alerts.reduce((s, a) => s + (a.value || 0), 0);
  const recoverable = alerts.filter(a => a.severity === "low" || a.severity === "medium").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Waste Prediction Engine</h1><p className="text-slate-500">AI-powered spoilage and expiry risk analysis</p></div>
        <button onClick={fetchWaste} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"><RefreshCw className="w-4 h-4" />Refresh</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Critical Alerts", value: loading ? "--" : critical, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          { label: "High Risk Items", value: loading ? "--" : high, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Potential Loss", value: loading ? "--" : `₹${potentialLoss.toLocaleString()}`, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
          { label: "Recoverable", value: loading ? "--" : recoverable, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div><div><p className="text-2xl font-bold text-slate-800">{stat.value}</p><p className="text-sm text-slate-500">{stat.label}</p></div></div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500">Filter:</span>
        {["all", "critical", "high", "medium", "low"].map(sev => (
          <button key={sev} onClick={() => setSelectedSeverity(sev)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedSeverity === sev ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{sev.charAt(0).toUpperCase() + sev.slice(1)}</button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-slate-200"><p className="text-slate-400">Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-slate-200"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" /><h3 className="text-lg font-semibold text-slate-800">All Clear</h3><p className="text-slate-500">No waste alerts at this time.</p></div>
        ) : filtered.map((alert, i) => (
          <div key={i} className={`bg-white rounded-lg p-5 shadow-sm border-l-4 ${alert.severity === "critical" ? "border-l-red-500" : alert.severity === "high" ? "border-l-orange-500" : alert.severity === "medium" ? "border-l-amber-500" : "border-l-green-500"}`}>
            <div className="flex items-start justify-between">
              <div><h4 className="font-semibold text-slate-800">{alert.product}</h4><p className="text-sm text-slate-500 mt-1">{alert.recommendedAction || alert.reason}</p></div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.severity === "critical" ? "bg-red-100 text-red-700" : alert.severity === "high" ? "bg-orange-100 text-orange-700" : alert.severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{alert.severity}</span>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-slate-500"><span>Qty: {alert.quantity}</span>{alert.value ? <span>Value: ₹{alert.value}</span> : null}{alert.reason ? <span>Reason: {alert.reason}</span> : null}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
