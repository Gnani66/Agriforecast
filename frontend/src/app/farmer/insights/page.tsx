"use client";

import FarmerLayout from "@/layouts/FarmerLayout";

export default function InsightsPage() {
  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
            <p className="text-slate-500 mt-1">Intelligent analysis and recommendations for your farm</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="text-center py-12">
            <p className="text-slate-400">AI insights will appear here once your farm data is connected and analyzed.</p>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
