"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  Brain,
  MessageSquare,
  Settings,
  LogOut,
  X,
  BarChart3,
  Truck,
} from "lucide-react";

const retailerMenu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/retailer/dashboard" },
  { label: "Inventory", icon: Package, href: "/retailer/inventory" },
  { label: "Waste Analytics", icon: AlertTriangle, href: "/retailer/waste" },
  { label: "Procurement", icon: ShoppingCart, href: "/retailer/procurement" },
  { label: "Forecasting", icon: TrendingUp, href: "/retailer/forecasting" },
  { label: "Sales Trends", icon: BarChart3, href: "/retailer/sales" },
  { label: "AI Insights", icon: Brain, href: "/retailer/insights" },
  { label: "AI Assistant", icon: MessageSquare, href: "/retailer/assistant" },
  { label: "Settings", icon: Settings, href: "/retailer/settings" },
];

export default function RetailerSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 lg:static lg:translate-x-0 shadow-sm"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Retailer Portal</h2>
                <p className="text-xs text-slate-500">Smart Inventory</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {retailerMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
