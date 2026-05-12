"use client";

import { useState, useEffect } from "react";
import FarmerLayout from "@/layouts/FarmerLayout";
import { farmerService } from "@/services/farmerService";
import type { HarvestPrediction } from "@/types";
import { Calendar, AlertTriangle, CheckCircle2, Clock, BarChart3 } from "lucide-react";

export default function HarvestPage() {
  const [predictions, setPredictions] = useState<HarvestPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await farmerService.getHarvestReady();
        if (res.success && res.data) {
          setPredictions(res.data);
        } else {
          setError(res.message || "Failed to fetch harvest predictions");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const riskBadge = (level: string) => {
    if (level === "Low") return "bg-emerald-100 text-emerald-700";
    if (level === "Medium") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const peakIcon = (timing: string) => {
    if (timing === "Now") return <Clock className="w-4 h-4 text-red-500" />;
    if (timing === "Soon") return <Clock className="w-4 h-4 text-amber-500" />;
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-56 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-72 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded animate-pulse" />
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
          <h1 className="text-2xl font-bold text-slate-900">Harvest Planning</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Error loading harvest data</p>
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
            <h1 className="text-2xl font-bold text-slate-900">Harvest Planning</h1>
            <p className="text-slate-500 mt-1">Optimal harvest timing based on demand and weather</p>
          </div>
        </div>

        {predictions.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No harvest predictions</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Add active crops with expected harvest dates to see personalized harvest timelines and recommendations.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {predictions.map((p, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{p.cropName}</h3>
                      <p className="text-xs text-slate-500">
                        Planted: {new Date(p.plantingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${riskBadge(p.riskLevel)}`}>
                      {p.riskLevel === "Low" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {p.riskLevel} Risk
                    </span>
                    {peakIcon(p.demandPeakTiming)}
                    <span className="text-xs font-medium text-slate-600">{p.demandPeakTiming}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Expected Harvest</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(p.expectedHarvestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Harvest Window</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(p.bestHarvestWindowStart).toLocaleDateString()} - {new Date(p.bestHarvestWindowEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Days Until Harvest</p>
                    <p className={`text-sm font-semibold ${p.daysUntilHarvest <= 0 ? "text-red-600" : "text-slate-900"}`}>
                      {p.daysUntilHarvest <= 0 ? "Overdue" : `${p.daysUntilHarvest} days`}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-amber-800 mb-1">Recommendation</p>
                  <p className="text-sm text-amber-700">{p.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
