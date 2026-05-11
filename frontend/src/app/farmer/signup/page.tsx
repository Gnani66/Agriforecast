"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, Sprout, User } from "lucide-react";
import PortalAuthShell from "@/components/auth/PortalAuthShell";
import { useAuth } from "@/context/AuthContext";
import { signupFarmer } from "@/services/farmerAuthService";

export default function FarmerSignup() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    region: "",
    farmType: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signupFarmer(formData);
      login(data);
      router.push("/farmer/dashboard");
    } catch {
      setError("We could not create the account. Review the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalAuthShell
      roleLabel="Farmer workspace"
      title="Create your farm account"
      subtitle="Set up the operating profile used for forecasts and crop planning."
      mode="signup"
      alternateHref="/farmer/login"
      alternateLabel="Already registered?"
      Icon={Sprout}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={User} label="Full name" name="name" value={formData.name} onChange={handleChange} placeholder="Aarav Patil" required />
          <Field icon={Phone} label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
        </div>

        <Field icon={Mail} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="farmer@example.com" required />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Region" name="region" value={formData.region} onChange={handleChange} options={["Maharashtra", "Karnataka", "Gujarat", "Uttar Pradesh", "Punjab"]} />
          <Select label="Farm type" name="farmType" value={formData.farmType} onChange={handleChange} options={["Vegetable Farm", "Fruit Orchard", "Grain Farm", "Mixed Farm"]} />
        </div>

        <button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Creating account" : "Create account"}
        </button>
      </form>
    </PortalAuthShell>
  );
}

function Field({ icon: Icon, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: typeof User; label: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input {...props} className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
      </div>
    </div>
  );
}

function Select({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <select {...props} required className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option.toLowerCase().replaceAll(" ", "-")}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
