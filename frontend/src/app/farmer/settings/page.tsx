"use client";

import FarmerLayout from "@/layouts/FarmerLayout";
import { User, Bell, Lock, MapPin } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile Information", desc: "Name, phone, email, farm details" },
        { icon: Lock, label: "Security", desc: "Password, authentication settings" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", desc: "Push, SMS, email preferences" },
        { icon: MapPin, label: "Location", desc: "Farm location, region settings" },
      ]
    },
  ];

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account and preferences</p>
        </div>

        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <item.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          Log out of your account
        </button>
      </div>
    </FarmerLayout>
  );
}
