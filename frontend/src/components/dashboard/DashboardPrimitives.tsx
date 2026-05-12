import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tone = "emerald" | "blue" | "amber" | "red" | "slate";

const toneClass: Record<Tone, string> = {
  emerald: "text-slate-700 bg-slate-50/50 border-slate-200/50",
  blue: "text-slate-700 bg-slate-50/50 border-slate-200/50",
  amber: "text-amber-700 bg-amber-50/50 border-amber-200/50",
  red: "text-red-700 bg-red-50/50 border-red-200/50",
  slate: "text-slate-700 bg-slate-50 border-slate-200",
};

const iconToneClass: Record<Tone, string> = {
  emerald: "text-slate-500",
  blue: "text-slate-500",
  amber: "text-amber-600",
  red: "text-red-600",
  slate: "text-slate-500",
};

export function DashboardHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="pb-4 border-b border-slate-200 mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function ActionButton({
  href,
  onClick,
  icon: Icon,
  children,
  variant = "primary",
}: {
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800 shadow-sm"
      : "inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-sm";

  const content = (
    <>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function KpiCard({
  label,
  value,
  detail,
  progress,
  tone = "slate",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  progress?: number;
  tone?: Tone;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex min-h-[7rem] flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
              {Icon && <Icon className={`h-4 w-4 ${iconToneClass[tone]}`} />}
              {label}
            </p>
            {tone !== "slate" && <ArrowUpRight className={`h-4 w-4 ${iconToneClass[tone]}`} />}
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        {(detail || progress !== undefined) && (
          <div className="mt-3 flex items-center gap-3">
            {progress !== undefined && (
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
              </div>
            )}
            {detail && <span className={`text-xs font-medium ${iconToneClass[tone]}`}>{detail}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 bg-slate-50/50">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${toneClass[tone]}`}>
    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${tone === 'emerald' ? 'bg-slate-500' : tone === 'amber' ? 'bg-amber-500' : tone === 'red' ? 'bg-red-500' : tone === 'blue' ? 'bg-slate-500' : 'bg-slate-400'}`}></span>
    {children}
  </span>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 flex flex-col items-center justify-center text-center">
      <div className="max-w-md">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export function AlertCard({
  title,
  description,
  meta,
  icon: Icon,
}: {
  title: string;
  description: string;
  meta?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm relative overflow-hidden transition hover:border-slate-300 group">
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-900/10 transition group-hover:bg-slate-900/20" />
      <div className="flex items-start gap-3 pl-2">
        <Icon className="h-5 w-5 shrink-0 text-slate-400 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            {meta && <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">{meta}</span>}
          </div>
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function SetupLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link href={href} className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div>
        <p className="text-sm font-semibold text-slate-900 flex justify-between items-center">
          {label}
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition" />
        </p>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
