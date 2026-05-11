"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signupDistributor } from "@/services/distributorAuthService";
import PortalAuthShell from "@/components/auth/PortalAuthShell";
import { Truck, Mail, Lock, User, MapPin, Building, Warehouse } from "lucide-react";

export default function DistributorSignup() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    fleetSize: "",
    warehouseLocation: "",
    serviceRegion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signupDistributor({ ...form, fleetSize: Number.parseInt(form.fleetSize, 10) });
      login(data);
      router.push("/distributor/dashboard");
    } catch (error) {
      console.error(error);
      setError("We could not create the distributor account. Review the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <PortalAuthShell roleLabel="Distributor workspace" title="Create logistics access" subtitle="Set up fleet, shipment, warehouse, and route controls for your distribution team." mode="signup" alternateHref="/distributor/login" alternateLabel="Already registered?" Icon={Truck} accent="blue">
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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Company name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" name="companyName" value={form.companyName} onChange={handleChange} required className={inputClass} placeholder="Swift Logistics" />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="distributor@company.com" />
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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Fleet size</label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="number" name="fleetSize" value={form.fleetSize} onChange={handleChange} required min={1} className={inputClass} placeholder="25" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Service region</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" name="serviceRegion" value={form.serviceRegion} onChange={handleChange} required className={inputClass} placeholder="Maharashtra" />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Warehouse location</label>
          <div className="relative">
            <Warehouse className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" name="warehouseLocation" value={form.warehouseLocation} onChange={handleChange} required className={inputClass} placeholder="Pune, Maharashtra" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Creating account" : "Create distributor account"}
        </button>
      </form>
    </PortalAuthShell>
  );
}
