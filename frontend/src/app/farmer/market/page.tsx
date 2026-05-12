"use client";

import FarmerLayout from "@/layouts/FarmerLayout";
import { farmerService } from "@/services/farmerService";
import { MapPin, AlertTriangle, Store, ArrowUpRight, ArrowDownRight, RefreshCw, Activity } from "lucide-react";
import useSWR from "swr";

const fetcher = async () => {
  const res = await farmerService.getLiveMarketPrices();
  if (res.success && res.data) {
    return res.data;
  }
  throw new Error(res.message || "Failed to fetch live prices");
};

export default function MarketPage() {
  // Poll every 30 seconds
  const { data: prices, error, isLoading, isValidating } = useSWR('liveMarketPrices', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (isLoading && !prices) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-48 bg-slate-200 rounded mt-2 animate-pulse" />
          </div>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded animate-pulse mb-2" />
            ))}
          </div>
        </div>
      </FarmerLayout>
    );
  }

  if (error && !prices) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Market Intelligence</p>
            <h1 className="text-xl font-semibold text-slate-900 mt-1">Live Market Prices</h1>
          </div>
          <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-6 text-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 text-sm font-medium">Error loading market data</p>
            <p className="text-red-600/80 text-xs mt-1">{error.message}</p>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Market Intelligence</p>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl font-semibold text-slate-900">Live Market Prices</h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                <Activity className="w-3 h-3 text-slate-500" /> Live
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Real-time wholesale commodity pricing from Agmarknet</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {isValidating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            Auto-updates every 30s
          </div>
        </div>

        {!prices || prices.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <Store className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No market data available</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Market price data is currently being fetched or is unavailable. Please check back later.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Regional Price Monitor</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="py-3 px-5">Commodity</th>
                    <th className="py-3 px-5">Market / Region</th>
                    <th className="py-3 px-5">Current Price (Modal)</th>
                    <th className="py-3 px-5">7-Day Avg</th>
                    <th className="py-3 px-5">Trend</th>
                    <th className="py-3 px-5">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p: any) => (
                    <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50/50 last:border-0 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900">{p.cropName}</div>
                        <div className="text-xs text-slate-500">{p.variety}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-slate-900">{p.market}</div>
                        <div className="text-xs text-slate-500">{p.district}, {p.state}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900">{formatPrice(p.modalPrice)}</div>
                        <div className="text-xs text-slate-500">Range: {formatPrice(p.minPrice)} - {formatPrice(p.maxPrice)}</div>
                      </td>
                      <td className="py-4 px-5 text-slate-600">
                        {formatPrice(p.sevenDayAvg)}
                      </td>
                      <td className="py-4 px-5">
                        {p.trend === "up" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200/50">
                            <ArrowUpRight className="w-3.5 h-3.5" /> High
                          </span>
                        ) : p.trend === "down" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            <ArrowDownRight className="w-3.5 h-3.5" /> Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            Stable
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
