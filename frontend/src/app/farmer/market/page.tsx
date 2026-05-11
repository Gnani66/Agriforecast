"use client";

import { useState, useEffect } from "react";
import FarmerLayout from "@/layouts/FarmerLayout";
import { farmerService } from "@/services/farmerService";
import type { MarketPrice } from "@/types";
import { MapPin, AlertTriangle, Store } from "lucide-react";

export default function MarketPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await farmerService.getMarketPrices();
        if (res.success && res.data) {
          setPrices(res.data);
        } else {
          setError(res.message || "Failed to fetch market prices");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-100 rounded mt-2 animate-pulse" />
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

  if (error) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">Market Trends</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Error loading market data</p>
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
            <h1 className="text-2xl font-bold text-slate-900">Market Trends</h1>
            <p className="text-slate-500 mt-1">Real-time market prices and regional analytics</p>
          </div>
        </div>

        {prices.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No market data available</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Market price data will be available once seeded. Contact admin to initialize market data.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">Regional Price Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Crop</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Variety</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Modal Price</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Price Range</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Market</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">District</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p) => (
                    <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-6 text-sm font-medium text-slate-900">{p.cropName}</td>
                      <td className="py-3 px-6 text-sm text-slate-600">{p.variety}</td>
                      <td className="py-3 px-6 text-sm font-semibold text-emerald-700">{formatPrice(p.modalPrice)}</td>
                      <td className="py-3 px-6 text-sm text-slate-600">
                        {formatPrice(p.minPrice)} - {formatPrice(p.maxPrice)}
                      </td>
                      <td className="py-3 px-6 text-sm text-slate-900">{p.market}</td>
                      <td className="py-3 px-6 text-sm text-slate-600">
                        {p.district}, {p.state}
                      </td>
                      <td className="py-3 px-6 text-sm text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
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
