"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Mail, MapPin, Building, Shield, HelpCircle } from "lucide-react";

export default function DistributorSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your logistics company preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Company Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Company Name</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900">{String(user?.companyName || "Swift Logistics")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Contact Name</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900">{String(user?.name || "Company Owner")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900">{String(user?.email || "contact@logistics.com")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Warehouse Location</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900">{String(user?.warehouseLocation || "Pune, Maharashtra")}</span>
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800">
              Update Company Info
            </button>
          </div>

          <div
            className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                { label: "Delay alerts", enabled: true },
                { label: "Warehouse capacity warnings", enabled: true },
                { label: "Fleet maintenance alerts", enabled: true },
                { label: "Daily performance summary", enabled: false },
                { label: "Weather impact notifications", enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-slate-700">{item.label}</span>
                  <button className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? "bg-slate-900" : "bg-slate-300"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Security</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Change Password</button>
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Two-Factor Auth</button>
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Active Sessions</button>
            </div>
          </div>

          <div
            className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Help and Support</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Documentation</button>
              <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Contact Support</button>
              <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
