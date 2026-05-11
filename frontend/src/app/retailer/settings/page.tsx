"use client";

import { useAuth } from "@/context/AuthContext";
import { Store, User, Mail, MapPin, Shield, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function RetailerSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your store preferences and account</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
          >
            <h2 className="font-semibold text-slate-800 mb-4">Store Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Store Name</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <Store className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-800">{String(user?.storeName || "Fresh Mart")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Owner Name</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-800">{String(user?.name || "Store Owner")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-800">{String(user?.email || "retailer@example.com")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Region</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-800">{String(user?.region || "Pune")}</span>
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Update Store Info
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
          >
            <h2 className="font-semibold text-slate-800 mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                { label: "Low stock alerts", enabled: true },
                { label: "Expiry warnings", enabled: true },
                { label: "Procurement recommendations", enabled: true },
                { label: "Daily sales summary", enabled: false },
                { label: "AI insights digest", enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-slate-700">{item.label}</span>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      item.enabled ? "bg-emerald-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        item.enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Security</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                Two-Factor Auth
              </button>
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                Active Sessions
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Help and Support</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                Documentation
              </button>
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                Contact Support
              </button>
              <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
