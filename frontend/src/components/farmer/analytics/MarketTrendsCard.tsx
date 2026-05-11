"use client";

export default function MarketTrendsCard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Market Trends</h3>
        <span className="text-xs text-slate-400">Live prices</span>
      </div>

      <div className="text-center py-8">
        <p className="text-sm text-slate-400">Market price data will appear here once available.</p>
      </div>
    </div>
  );
}
