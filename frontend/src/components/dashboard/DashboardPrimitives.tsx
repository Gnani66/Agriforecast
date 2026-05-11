import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Tone = "emerald" | "blue" | "amber" | "red" | "slate";

const toneClass: Record<Tone, string> = {
  emerald: "text-emerald-700 bg-emerald-50 border-emerald-100",
  blue: "text-blue-700 bg-blue-50 border-blue-100",
  amber: "text-amber-700 bg-amber-50 border-amber-100",
  red: "text-red-700 bg-red-50 border-red-100",
  slate: "text-slate-700 bg-slate-100 border-slate-200",
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
    <div className="border-b border-slate-200 pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
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
      ? "inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      : "inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4" />}
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
}: {
  label: string;
  value: string | number;
  detail?: string;
  progress?: number;
  tone?: Tone;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex min-h-24 flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        {(detail || progress !== undefined) && (
          <div className="mt-4">
            {progress !== undefined && (
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
              </div>
            )}
            {detail && <p className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${toneClass[tone]}`}>{detail}</p>}
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
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold capitalize ${toneClass[tone]}`}>{children}</span>;
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
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-8">
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        {action && <div className="mt-5">{action}</div>}
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
    <Link href={href} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950">{label}</p>
          <p className="mt-2 text-sm leading-5 text-slate-500">{description}</p>
        </div>
        <span className="mt-0.5 text-sm font-semibold text-slate-400 transition group-hover:text-slate-900">Open</span>
      </div>
    </Link>
  );
}
