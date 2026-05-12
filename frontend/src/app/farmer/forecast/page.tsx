"use client";

import { useState, useEffect } from "react";
import FarmerLayout from "@/layouts/FarmerLayout";
import { farmerService } from "@/services/farmerService";
import type { Forecast } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await farmerService.getForecast();
        if (res.success && res.data) {
          setForecasts(res.data);
        } else {
          setError(res.message || "Failed to fetch forecasts");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const demandForecasts = forecasts.filter((f) => f.type === "demand");
  const chartData = demandForecasts.map((f) => ({
    period: f.period,
    value: f.predictedValue,
    confidence: f.confidence,
  }));

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-56 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-72 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="h-72 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  if (error) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">Demand Forecasting</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Error loading forecasts</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Demand Forecasting</h1>
            <p className="text-slate-500 mt-1">AI-powered demand predictions and market analytics</p>
          </div>
        </div>

        {forecasts.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No forecasts available</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Add crop data first, then visit this page to see AI-powered demand forecasts for your crops.
            </p>
          </div>
        ) : (
          <>
            {chartData.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-slate-500" />
                  <h3 className="text-lg font-semibold text-slate-900">Demand Forecast Trend</h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#18181b" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} fill="url(#colorForecast)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 pb-0">
                <h3 className="text-lg font-semibold text-slate-900">All Forecasts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Crop Name</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Type</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Predicted Value</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Confidence</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Period</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecasts.map((f) => (
                      <tr key={f._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-6 text-sm font-medium text-slate-900">{f.cropName}</td>
                        <td className="py-3 px-6 text-sm text-slate-600 capitalize">{f.type}</td>
                        <td className="py-3 px-6 text-sm text-slate-900">{f.predictedValue}</td>
                        <td className="py-3 px-6 text-sm">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              f.confidence >= 80
                                ? "bg-slate-100 text-slate-700"
                                : f.confidence >= 60
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {f.confidence}%
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-600">{f.period}</td>
                        <td className="py-3 px-6 text-sm text-slate-500">{new Date(f.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </FarmerLayout>
  );
}
