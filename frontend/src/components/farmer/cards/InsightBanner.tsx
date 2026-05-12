"use client";

import { TrendingUp, CloudRain, BarChart3, X } from "lucide-react";
import { useState } from "react";

interface Insight {
  type: "demand" | "weather" | "market";
  message: string;
}

interface InsightBannerProps {
  insights: Insight[];
}

const typeConfig: Record<string, { icon: React.ElementType; label: string }> = {
  demand: { icon: TrendingUp, label: "Demand Alert" },
  weather: { icon: CloudRain, label: "Weather Alert" },
  market: { icon: BarChart3, label: "Market Alert" },
};

export default function InsightBanner({ insights }: InsightBannerProps) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visibleInsights = insights.filter((_, i) => !dismissed.includes(i));

  if (visibleInsights.length === 0) return null;

  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">AI Insights</span>
      </div>
      <div className="space-y-2">
        {visibleInsights.map((insight, index) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div key={index} className="flex items-start gap-3 bg-white/5 rounded-md p-3">
              <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{config.label}</span>
                <p className="text-sm text-slate-300 font-medium">{insight.message}</p>
              </div>
              <button
                onClick={() => setDismissed([...dismissed, index])}
                className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
