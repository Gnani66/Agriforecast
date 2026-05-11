"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signupRetailer } from "@/services/retailerAuthService";
import PortalAuthShell from "@/components/auth/PortalAuthShell";
import { Store, Mail, Lock, User, MapPin, Package } from "lucide-react";
import type { SignupFormData } from "@/types";

export default function RetailerSignup() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    storeName: "",
    storeType: "",
    region: "",
    inventoryCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signupRetailer(form);
      login(data);
      router.push("/retailer/dashboard");
    } catch (error) {
      console.error(error);
      setError("We could not create the retailer account. Review the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
  const selectClass = "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  return (
    <PortalAuthShell roleLabel="Retailer workspace" title="Create store access" subtitle="Set up inventory, sales, procurement, and waste controls for your retail operation." mode="signup" alternateHref="/retailer/login" alternateLabel="Already registered?" Icon={Store}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Your name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Account owner" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Store name</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" name="storeName" value={form.storeName} onChange={handleChange} required className={inputClass} placeholder="Fresh Market" />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="retailer@example.com" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} className={inputClass} placeholder="Minimum 6 characters" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Store type</label>
            <select name="storeType" value={form.storeType} onChange={handleChange} required className={selectClass}>
              <option value="">Select type</option>
              <option value="grocery">Grocery store</option>
              <option value="supermarket">Supermarket</option>
              <option value="convenience">Convenience store</option>
              <option value="wholesale">Wholesale</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Region</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" name="region" value={form.region} onChange={handleChange} required className={inputClass} placeholder="Pune" />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Inventory category</label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select name="inventoryCategory" value={form.inventoryCategory} onChange={handleChange} required className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
              <option value="">Select category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy">Dairy</option>
              <option value="grains">Grains</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Creating account" : "Create retailer account"}
        </button>
      </form>
    </PortalAuthShell>
  );
}
