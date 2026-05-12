"use client";

import { useState, useEffect } from "react";
import { TrendingDown, DollarSign, Package, Calendar, BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { retailerService } from "@/services/retailerService";

interface ForecastItem {
  product: string;
  category?: string;
  predictedDemand?: number;
  currentStock?: number;
  avgDailySales?: number;
  demand?: string;
  increase?: string;
  trend?: string;
}

interface RetailForecastData {
  forecasts?: ForecastItem[];
  summary?: {
    averageConfidence?: number;
  };
  spikeAlerts?: Array<{ message: string }>;
}

export default function ForecastingPage() {
  const [forecastData, setForecastData] = useState<RetailForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    setLoading(true);
    const res = await retailerService.getDemandForecast();
    if (res.success && res.data) setForecastData(res.data as RetailForecastData);
    setLoading(false);
  };

  useEffect(() => {
    async function loadForecast() {
      const res = await retailerService.getDemandForecast();
      if (res.success && res.data) setForecastData(res.data as RetailForecastData);
      setLoading(false);
    }
    loadForecast();
  }, []);

  const forecasts = forecastData?.forecasts || [];
  const spikeAlerts = forecastData?.spikeAlerts || [];
  const totalPredicted = forecasts.reduce((s, f) => s + (f.predictedDemand || 0), 0);
  const totalStock = forecasts.reduce((s, f) => s + (f.currentStock || 0), 0);
  const highDemand = forecasts.filter((f) => f.demand === "High").length;
  const avgConf = forecastData?.summary?.averageConfidence || 0;

  const weeklyData = [
    { day: "Mon", sales: 0, forecast: Math.round(totalPredicted * 0.14), units: 0 },
    { day: "Tue", sales: 0, forecast: Math.round(totalPredicted * 0.15), units: 0 },
    { day: "Wed", sales: 0, forecast: Math.round(totalPredicted * 0.14), units: 0 },
    { day: "Thu", sales: 0, forecast: Math.round(totalPredicted * 0.13), units: 0 },
    { day: "Fri", sales: 0, forecast: Math.round(totalPredicted * 0.15), units: 0 },
    { day: "Sat", sales: 0, forecast: Math.round(totalPredicted * 0.16), units: 0 },
    { day: "Sun", sales: 0, forecast: Math.round(totalPredicted * 0.13), units: 0 },
  ];

  const categories = [...new Set(forecasts.map((f) => f.category).filter((category): category is string => Boolean(category)))];
  const categoryData = categories.map((cat) => {
    const items = forecasts.filter((f) => f.category === cat);
    return { category: cat, current: items.reduce((s, f) => s + (f.predictedDemand || 0), 0), previous: items.reduce((s, f) => s + (f.avgDailySales || 0), 0) * 7, growth: 0 };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Sales Forecasting</h1><p className="text-slate-500">Predictive analytics and demand trends</p></div>
        <button onClick={fetchForecast} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"><RefreshCw className="w-4 h-4" />Refresh</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Weekly Forecast", value: loading ? "--" : totalPredicted.toLocaleString(), change: "+12%", up: true, icon: DollarSign, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "Total Stock", value: loading ? "--" : totalStock.toLocaleString(), change: "--", up: true, icon: Package, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "High Demand Items", value: loading ? "--" : highDemand, change: `+${highDemand}`, up: true, icon: BarChart3, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "Confidence", value: loading ? "--" : `${avgConf}%`, change: "--", up: true, icon: TrendingDown, color: "text-slate-500", bg: "bg-slate-50" },
        ].map((metric, i) => (
          <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between">
              <div><p className="text-sm text-slate-500">{metric.label}</p><p className="text-2xl font-bold text-slate-800 mt-1">{metric.value}</p></div>
              <div className={`p-2 rounded-lg ${metric.bg}`}><metric.icon className={`w-5 h-5 ${metric.color}`} /></div>
            </div>
            <div className="mt-3 flex items-center gap-1">{metric.up ? <ArrowUpRight className="w-4 h-4 text-slate-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}<span className={`text-sm font-medium ${metric.up ? "text-slate-500" : "text-red-500"}`}>{metric.change}</span><span className="text-sm text-slate-400">vs last week</span></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Weekly Sales vs Forecast</h3>
            <div className="flex items-center gap-4 text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500" /><span className="text-slate-500">Actual Sales</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400" /><span className="text-slate-500">Forecast</span></div></div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" /><Tooltip />
              <Bar dataKey="sales" fill="#18181b" opacity={0.8} radius={[4, 4, 0, 0]} name="Actual" /><Line type="monotone" dataKey="forecast" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Revenue by Category</h3>
          {categoryData.length > 0 ? (
            <div className="space-y-4">{categoryData.map((c, i) => (
              <div key={i}><div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{c.category}</span><span className="font-medium">₹{c.current.toLocaleString()}</span></div><div className="w-full h-2 bg-slate-100 rounded-full"><div className="h-full bg-slate-900 rounded-full" style={{ width: `${Math.min(100, (c.current / (totalPredicted || 1)) * 100)}%` }} /></div></div>
            ))}</div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-400"><span className="text-sm">No data available</span></div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">Demand Forecast Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Category</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Current Stock</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Avg Daily Sales</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Demand</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Increase</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Trend</th></tr></thead>
            <tbody>{forecasts.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-slate-400"><BarChart3 className="w-8 h-8 mx-auto mb-2" /><p>Forecast data will appear once inventory and sales data is available</p></td></tr>
            ) : forecasts.map((f, i) => (
              <tr key={i} className="border-b border-slate-100"><td className="py-3 px-4 font-medium text-slate-800">{f.product}</td><td className="py-3 px-4 text-slate-600">{f.category || "--"}</td><td className="py-3 px-4">{f.currentStock}</td><td className="py-3 px-4">{f.avgDailySales?.toFixed(1)}</td><td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${f.demand === "High" ? "bg-slate-100 text-slate-700" : f.demand === "Medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{f.demand}</span></td><td className="py-3 px-4">{f.increase}</td><td className="py-3 px-4"><span className={`font-medium ${f.trend === "Increasing" ? "text-slate-500" : f.trend === "Decreasing" ? "text-red-600" : "text-slate-600"}`}>{f.trend}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {spikeAlerts.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-50 rounded-lg"><Calendar className="w-6 h-6 text-slate-500" /></div>
            <div><h3 className="font-semibold text-slate-800 mb-2">Demand Spike Alerts</h3>
              <div className="space-y-2">{spikeAlerts.map((a, i) => <p key={i} className="text-sm text-slate-600">Warning: {a.message}</p>)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
