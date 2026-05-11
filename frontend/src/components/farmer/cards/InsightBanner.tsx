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
    <div className="bg-emerald-600 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-white/80 text-sm font-medium">AI Insights</span>
      </div>
      <div className="space-y-2">
        {visibleInsights.map((insight, index) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div key={index} className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Icon className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-white/60">{config.label}</span>
                <p className="text-sm text-white font-medium">{insight.message}</p>
              </div>
              <button
                onClick={() => setDismissed([...dismissed, index])}
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
