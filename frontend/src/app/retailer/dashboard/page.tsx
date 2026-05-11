"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import {
  ActionButton,
  DashboardHeader,
  EmptyState,
  KpiCard,
  Panel,
  SetupLink,
  StatusPill,
} from "@/components/dashboard/DashboardPrimitives";
import { retailerService } from "@/services/retailerService";
import type { RetailerDashboard } from "@/types";

function formatCurrency(value: number) {
  return `\u20B9${value.toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function inventoryTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "critical") return "red" as const;
  if (normalized === "warning") return "amber" as const;
  return "emerald" as const;
}

export default function RetailerDashboard() {
  const [data, setData] = useState<RetailerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await retailerService.getDashboard();
    if (res.success && res.data) setData(res.data as RetailerDashboard);
    setLoading(false);
  };

  useEffect(() => {
    async function loadDashboard() {
      const res = await retailerService.getDashboard();
      if (res.success && res.data) setData(res.data as RetailerDashboard);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const hasInventory = Boolean(data && data.totalInventory > 0);
  const riskShare = data && data.totalInventory > 0 ? Math.round((data.lowStockItems / data.totalInventory) * 100) : 0;

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-lg border border-slate-200 bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        eyebrow="Retail operations"
        title="Store control room"
        description="Inventory health, sales velocity, spoilage exposure, and replenishment signals in one production workspace."
        actions={
          <>
            <ActionButton variant="secondary" icon={RefreshCw} onClick={fetchData}>Refresh</ActionButton>
            <ActionButton href="/retailer/inventory" icon={Plus}>Add stock</ActionButton>
          </>
        }
      />

      {!hasInventory && (
        <>
          <EmptyState
            title="No live retailer data connected"
            description="Add inventory and sales records to activate retail metrics. Until then, the dashboard stays intentionally quiet instead of showing placeholder numbers."
            action={<ActionButton href="/retailer/inventory" icon={Plus}>Add inventory</ActionButton>}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SetupLink href="/retailer/inventory" label="Inventory records" description="Create stock lines with quantity, supplier, expiry, and sell price." />
            <SetupLink href="/retailer/sales" label="Sales records" description="Record daily sales to power velocity and revenue reporting." />
            <SetupLink href="/retailer/procurement" label="Procurement" description="Review replenishment suggestions when demand data is available." />
            <SetupLink href="/retailer/waste" label="Waste review" description="Track spoilage exposure and corrective actions." />
          </div>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Inventory lines" value={data?.totalInventory ?? "--"} detail={`${data?.lowStockItems ?? 0} need attention`} tone={riskShare > 30 ? "red" : riskShare > 0 ? "amber" : "emerald"} progress={riskShare} />
        <KpiCard label="Today sales" value={data ? formatCurrency(data.todaySales) : "--"} detail="Booked since midnight" />
        <KpiCard label="Spoilage risk" value={data?.spoilageRisk ?? "--"} detail="High-risk lines" tone={(data?.spoilageRisk ?? 0) > 0 ? "amber" : "emerald"} />
        <KpiCard label="Revenue projection" value={data ? formatCurrency(data.revenueProjection) : "--"} detail={`${data?.fastMoving ?? 0} fast-moving items`} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Panel title="Recent Sales" description="Latest transactions by product and volume.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Units</th>
                  <th className="px-5 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentSales?.length ? (
                  data.recentSales.map((sale) => (
                    <tr key={sale._id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4 font-semibold text-slate-950">{sale.product}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(sale.date)}</td>
                      <td className="px-5 py-4 text-slate-600">{sale.quantity}</td>
                      <td className="px-5 py-4 font-semibold text-slate-950">{formatCurrency(sale.totalAmount || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-8 text-sm text-slate-500" colSpan={4}>No sales records yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Inventory Alerts" description="Stock lines crossing reorder or quality thresholds.">
          <div className="divide-y divide-slate-100 px-5">
            {data?.inventoryAlerts?.length ? (
              data.inventoryAlerts.map((item) => (
                <div key={item._id} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{item.product}</p>
                      <p className="mt-1 text-sm text-slate-500">Stock {item.quantity} {item.unit} / min {item.minStock}</p>
                    </div>
                    <StatusPill tone={inventoryTone(item.status)}>{item.status}</StatusPill>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-sm text-slate-500">All tracked items are within operating range.</div>
            )}
          </div>
        </Panel>
      </div>

      <Panel title="Commercial Snapshot" description="Value at risk and velocity indicators for store operators.">
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Stock value</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(data?.totalStockValue ?? 0)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Low-stock ratio</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{riskShare}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Fast movers</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{data?.fastMoving ?? 0}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
