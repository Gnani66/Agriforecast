"use client";

import { useState, useEffect } from "react";
import FarmerLayout from "@/layouts/FarmerLayout";
import { farmerService } from "@/services/farmerService";
import type { AIInsight } from "@/types";
import { Lightbulb, AlertTriangle, TrendingUp, CloudSun, BarChart3 } from "lucide-react";

const severityIcon = (severity?: string) => {
  if (severity === "high") return <AlertTriangle className="w-5 h-5 text-red-500" />;
  if (severity === "medium") return <Lightbulb className="w-5 h-5 text-amber-500" />;
  return <Lightbulb className="w-5 h-5 text-emerald-500" />;
};

const severityBg = (severity?: string) => {
  if (severity === "high") return "bg-red-50 border-red-200";
  if (severity === "medium") return "bg-amber-50 border-amber-200";
  return "bg-emerald-50 border-emerald-200";
};

const typeIcon = (type: string) => {
  if (type === "demand_spike" || type === "demand") return <TrendingUp className="w-4 h-4" />;
  if (type === "weather_risk" || type === "weather") return <CloudSun className="w-4 h-4" />;
  return <BarChart3 className="w-4 h-4" />;
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await farmerService.getInsights();
        if (res.success && res.data) {
          setInsights(res.data);
        } else {
          setError(res.message || "Failed to fetch insights");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </FarmerLayout>
    );
  }

  if (error) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Error loading insights</p>
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
            <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
            <p className="text-slate-500 mt-1">Intelligent analysis and recommendations for your farm</p>
          </div>
        </div>

        {insights.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No insights available</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Add crop data to receive AI-powered market and weather insights tailored to your farm.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {insights.map((insight, i) => (
              <div key={i} className={`rounded-lg border p-5 ${severityBg(insight.severity)}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">{severityIcon(insight.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 capitalize">
                        {typeIcon(insight.type)}
                        {insight.type.replace(/_/g, " ")}
                      </span>
                      {insight.severity && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          insight.severity === "high" ? "bg-red-100 text-red-700" :
                          insight.severity === "medium" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {insight.severity}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{insight.title}</h3>
                    <p className="text-sm text-slate-600">{insight.description}</p>
                    {insight.action && (
                      <p className="text-sm font-medium text-slate-700 mt-2">→ {insight.action}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
