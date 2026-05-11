"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Warehouse,
  BarChart3,
  Brain,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Package,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/distributor/dashboard" },
  { label: "Shipments", icon: Package, href: "/distributor/shipments" },
  { label: "Fleet", icon: Truck, href: "/distributor/fleet" },
  { label: "Routes", icon: MapPin, href: "/distributor/routes" },
  { label: "Warehouses", icon: Warehouse, href: "/distributor/warehouses" },
  { label: "Analytics", icon: BarChart3, href: "/distributor/analytics" },
  { label: "AI Insights", icon: Brain, href: "/distributor/insights" },
  { label: "AI Assistant", icon: MessageSquare, href: "/distributor/assistant" },
  { label: "Settings", icon: Settings, href: "/distributor/settings" },
];

export default function DistributorSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 lg:static lg:translate-x-0 shadow-lg"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Distributor</h2>
                <p className="text-xs text-slate-500">Logistics Hub</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
