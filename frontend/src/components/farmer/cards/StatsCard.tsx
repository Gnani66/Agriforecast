import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:shadow transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trendUp ? "bg-slate-100 text-slate-700" : "bg-red-50/50 text-red-600"
          }`}>
            {trend}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
