"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Leaf,
  Calendar,
  CloudSun,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  Sprout,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
      { label: "Forecasting", href: "/farmer/forecast", icon: TrendingUp },
      { label: "Crop Intelligence", href: "/farmer/crops", icon: Leaf },
      { label: "Harvest Planning", href: "/farmer/harvest", icon: Calendar },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { label: "Weather", href: "/farmer/weather", icon: CloudSun },
      { label: "Market Trends", href: "/farmer/market", icon: BarChart3 },
      { label: "AI Insights", href: "/farmer/insights", icon: TrendingUp },
    ]
  },
  {
    title: "Tools",
    items: [
      { label: "AI Assistant", href: "/farmer/assistant", icon: Bot },
      { label: "Settings", href: "/farmer/settings", icon: Settings },
    ]
  }
];

interface FarmerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FarmerSidebar({ isOpen, onClose }: FarmerSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <Link href="/farmer/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <span className="text-base font-semibold text-slate-900">AgriForecast</span>
              <span className="block text-[10px] text-slate-500 -mt-0.5">Farmer Portal</span>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose()}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${active
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400"}`} strokeWidth={1.5} />
                    {item.label}
                    {item.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
                        active ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-200 space-y-1">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
