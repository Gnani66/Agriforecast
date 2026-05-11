"use client";

import FarmerLayout from "@/layouts/FarmerLayout";
import { Calendar } from "lucide-react";

export default function HarvestPage() {
  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Harvest Planning</h1>
            <p className="text-slate-500 mt-1">Optimal harvest timing based on demand and weather</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-900">Harvest Timeline</h3>
          </div>
          <div className="text-center py-12 text-sm text-slate-400">
            Add your crop data to see harvest timelines, demand peaks, and weather impacts.
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
