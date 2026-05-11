"use client";

import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import FarmerLayout from "@/layouts/FarmerLayout";
import {
  ActionButton,
  DashboardHeader,
  EmptyState,
  KpiCard,
  Panel,
  StatusPill,
} from "@/components/dashboard/DashboardPrimitives";
import { farmerService } from "@/services/farmerService";
import type { FarmerDashboard } from "@/types";

function formatCurrency(value: number) {
  return `\u20B9${value.toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("grow") || normalized.includes("plant")) return "emerald" as const;
  if (normalized.includes("ready")) return "amber" as const;
  return "slate" as const;
}

export default function FarmerDashboardPage() {
  const [data, setData] = useState<FarmerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const result = await farmerService.getDashboard();
      if (result.success && result.data) setData(result.data);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div className="h-28 animate-pulse rounded-lg border border-slate-200 bg-white" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white" />
        </div>
      </FarmerLayout>
    );
  }

  if (!data) {
    return (
      <FarmerLayout>
        <EmptyState
          title="Dashboard data could not be loaded"
          description="The production workspace did not return farmer metrics. Refresh the page or verify the backend connection."
        />
      </FarmerLayout>
    );
  }

  const hasCrops = data.recentCrops.length > 0;
  const harvestCoverage = data.cropPlansCount > 0 ? Math.round((data.readyForHarvest / data.cropPlansCount) * 100) : 0;

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <DashboardHeader
          eyebrow="Farmer operations"
          title="Production control room"
          description="A concise operating view of crop plans, harvest windows, demand pressure, market rates, and weather risk."
          actions={
            <>
              <ActionButton variant="secondary" icon={Download}>Export</ActionButton>
              <ActionButton href="/farmer/harvest" icon={Plus}>Plan harvest</ActionButton>
            </>
          }
        />

        {!hasCrops && (
          <EmptyState
            title="No crop plans on this workspace"
            description="Add crop plans to activate harvest schedules, revenue projection, market price matching, and demand scoring."
            action={<ActionButton href="/farmer/crops" icon={Plus}>Add crop plan</ActionButton>}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Crop plans" value={data.cropPlansCount} detail={`${data.activeCrops} active`} tone="emerald" />
          <KpiCard label="Demand index" value={`${data.demandIndex ?? 0}%`} progress={data.demandIndex ?? 0} detail="Market pull" />
          <KpiCard label="Ready for harvest" value={data.readyForHarvest} progress={harvestCoverage} detail={`${harvestCoverage}% of plans`} tone="amber" />
          <KpiCard
            label="Forecasted revenue"
            value={formatCurrency(data.forecastedRevenue ?? 0)}
            detail={`${data.weatherRiskLevel ?? "low"} weather risk`}
            tone={data.weatherRiskLevel === "high" ? "red" : data.weatherRiskLevel === "medium" ? "amber" : "emerald"}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
          <Panel title="Crop Pipeline" description="Recent plans sorted by activity and readiness.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Crop</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Acreage</th>
                    <th className="px-5 py-3">Harvest</th>
                    <th className="px-5 py-3">Yield</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentCrops.map((item) => (
                    <tr key={item._id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4 font-semibold text-slate-950">{item.cropName}</td>
                      <td className="px-5 py-4 text-slate-600">{item.cropCategory}</td>
                      <td className="px-5 py-4 text-slate-600">{item.landAllocation} ac</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(item.expectedHarvestDate)}</td>
                      <td className="px-5 py-4 text-slate-600">{item.expectedYield} qtl</td>
                      <td className="px-5 py-4"><StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Harvest Queue" description="Near-term crop movement.">
            <div className="divide-y divide-slate-100 px-5">
              {data.upcomingHarvests.length > 0 ? (
                data.upcomingHarvests.map((harvest) => (
                  <div key={harvest._id} className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{harvest.cropName}</p>
                        <p className="mt-1 text-sm text-slate-500">{harvest.expectedYield} qtl expected · {harvest.cropCategory}</p>
                      </div>
                      <StatusPill tone="slate">{formatDate(harvest.expectedHarvestDate)}</StatusPill>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-sm text-slate-500">No harvests scheduled in the near-term queue.</div>
              )}
            </div>
          </Panel>
        </div>

        <Panel title="Market Prices" description="Wholesale reference prices for crops currently in planning.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Crop</th>
                  <th className="px-5 py-3">Variety</th>
                  <th className="px-5 py-3">Modal price</th>
                  <th className="px-5 py-3">Range</th>
                  <th className="px-5 py-3">Market</th>
                </tr>
              </thead>
              <tbody>
                {data.marketPrices.map((market) => (
                  <tr key={market._id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-4 font-semibold text-slate-950">{market.cropName}</td>
                    <td className="px-5 py-4 text-slate-600">{market.variety}</td>
                    <td className="px-5 py-4 font-semibold text-slate-950">{formatCurrency(market.modalPrice)}</td>
                    <td className="px-5 py-4 text-slate-600">{formatCurrency(market.minPrice)} - {formatCurrency(market.maxPrice)}</td>
                    <td className="px-5 py-4 text-slate-600">{market.market}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </FarmerLayout>
  );
}
