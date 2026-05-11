"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Settings } from "lucide-react";
import {
  ActionButton,
  DashboardHeader,
  EmptyState,
  KpiCard,
  Panel,
  SetupLink,
  StatusPill,
} from "@/components/dashboard/DashboardPrimitives";
import { distributorService } from "@/services/distributorService";
import type { DistributorDashboard } from "@/types";

const setupTasks = [
  {
    label: "Register fleet",
    href: "/distributor/fleet",
    description: "Add vehicles, drivers, fuel status, and service readiness.",
  },
  {
    label: "Add warehouses",
    href: "/distributor/warehouses",
    description: "Capture capacity, utilization, and warehouse efficiency.",
  },
  {
    label: "Create shipments",
    href: "/distributor/shipments",
    description: "Track origin, destination, progress, priority, and ETA.",
  },
  {
    label: "Configure routes",
    href: "/distributor/routes",
    description: "Review destination clusters and active shipment lanes.",
  },
];

export default function DistributorDashboard() {
  const [data, setData] = useState<DistributorDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const response = await distributorService.getDashboard();
    if (response.success && response.data) setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    async function loadDashboard() {
      const response = await distributorService.getDashboard();
      if (response.success && response.data) setData(response.data);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const hasLiveData = Boolean(data && ((data.totalShipments ?? 0) > 0 || (data.fleetSize ?? 0) > 0 || (data.totalCapacity ?? 0) > 0));
  const warehouseUtilization = data?.totalCapacity ? Math.round(((data.totalUsed ?? 0) / data.totalCapacity) * 100) : 0;
  const fleetUtilization = data?.fleetSize ? Math.round(((data.activeVehicles ?? 0) / data.fleetSize) * 100) : 0;
  const deliveredRate = data?.totalShipments ? Math.round(((data.delivered ?? 0) / data.totalShipments) * 100) : 0;

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
        eyebrow="Distributor operations"
        title="Logistics control room"
        description="Shipment volume, fleet readiness, warehouse capacity, and operational setup health for distribution teams."
        actions={
          <>
            <ActionButton variant="secondary" icon={RefreshCw} onClick={fetchData}>Refresh</ActionButton>
            <ActionButton variant="secondary" href="/distributor/settings" icon={Settings}>Configure</ActionButton>
            <ActionButton href="/distributor/shipments" icon={Plus}>New shipment</ActionButton>
          </>
        }
      />

      {!hasLiveData && (
        <>
          <EmptyState
            title="No live distributor data connected"
            description="Add fleet, warehouse, and shipment records to activate logistics metrics. Empty dashboards should guide setup without inventing numbers."
            action={<ActionButton href="/distributor/shipments" icon={Plus}>Create shipment</ActionButton>}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {setupTasks.map((task) => (
              <SetupLink key={task.href} href={task.href} label={task.label} description={task.description} />
            ))}
          </div>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total shipments" value={data?.totalShipments ?? 0} detail={`${data?.activeShipments ?? 0} active`} tone="blue" progress={deliveredRate} />
        <KpiCard label="Fleet readiness" value={`${fleetUtilization}%`} detail={`${data?.activeVehicles ?? 0}/${data?.fleetSize ?? 0} active`} tone={fleetUtilization > 70 ? "emerald" : "amber"} progress={fleetUtilization} />
        <KpiCard label="Warehouse use" value={`${warehouseUtilization}%`} detail={`${data?.totalUsed ?? 0}/${data?.totalCapacity ?? 0} capacity`} tone={warehouseUtilization > 85 ? "amber" : "blue"} progress={warehouseUtilization} />
        <KpiCard label="Network trips" value={data?.totalTrips ?? 0} detail={`${data?.warehouseEfficiency ?? 0}% warehouse efficiency`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Panel title="Operations Readiness" description="Data coverage needed for reliable distributor analytics.">
          <div className="grid gap-3 p-5 md:grid-cols-3">
            <ReadinessItem label="Fleet records" value={data?.fleetSize ?? 0} ready={(data?.fleetSize ?? 0) > 0} />
            <ReadinessItem label="Shipment records" value={data?.totalShipments ?? 0} ready={(data?.totalShipments ?? 0) > 0} />
            <ReadinessItem label="Warehouse capacity" value={data?.totalCapacity ?? 0} ready={(data?.totalCapacity ?? 0) > 0} />
          </div>
        </Panel>

        <Panel title="Fleet Mix" description="Vehicle availability by operating state.">
          <div className="divide-y divide-slate-100 px-5">
            <FleetRow label="Active vehicles" value={data?.activeVehicles ?? 0} tone="emerald" />
            <FleetRow label="Idle vehicles" value={data?.idleVehicles ?? 0} tone="slate" />
            <FleetRow label="Maintenance" value={data?.maintenanceVehicles ?? 0} tone="amber" />
          </div>
        </Panel>
      </div>

      <Panel title="Setup Workbench" description="Direct paths to complete the operational data model.">
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          {setupTasks.map((task) => (
            <SetupLink key={task.href} href={task.href} label={task.label} description={task.description} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ReadinessItem({ label, value, ready }: { label: string; value: number; ready: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
        </div>
        <StatusPill tone={ready ? "emerald" : "amber"}>{ready ? "Ready" : "Missing"}</StatusPill>
      </div>
    </div>
  );
}

function FleetRow({ label, value, tone }: { label: string; value: number; tone: "emerald" | "amber" | "slate" }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <p className="font-medium text-slate-700">{label}</p>
      <StatusPill tone={tone}>{value}</StatusPill>
    </div>
  );
}
