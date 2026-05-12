"use client";

import { useState, useEffect } from "react";
import { BarChart3, DollarSign, Package, Clock, Plus, X } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { retailerService } from "@/services/retailerService";
import type { SalesRecord } from "@/types";

export default function SalesTrendsPage() {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ product: "", quantity: 0, unitPrice: 0, date: new Date().toISOString().split("T")[0] });
  const [submitting, setSubmitting] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    const res = await retailerService.getSales();
    if (res.success && res.data) setSales(res.data as SalesRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    async function loadSales() {
      const res = await retailerService.getSales();
      if (res.success && res.data) setSales(res.data as SalesRecord[]);
      setLoading(false);
    }
    loadSales();
  }, []);

  const totalRevenue = sales.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const totalUnits = sales.reduce((s, r) => s + (r.quantity || 0), 0);
  const avgTransaction = sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0;

  const hourlyData = Array.from({ length: 8 }, (_, i) => {
    const hour = `${6 + i * 2}${i === 0 ? "AM" : i < 3 ? "AM" : "PM"}`;
    const hourSales = sales.filter(s => {
      const h = new Date(s.date).getHours();
      return h >= 6 + i * 2 && h < 8 + i * 2;
    });
    return { hour, sales: hourSales.reduce((s, r) => s + (r.totalAmount || 0), 0) };
  });

  const paymentData = [
    { method: "UPI", value: sales.filter(s => s.paymentMethod === "UPI" || !s.paymentMethod).length || 1, color: "#18181b" },
    { method: "Cash", value: sales.filter(s => s.paymentMethod === "Cash").length || 0, color: "#71717a" },
    { method: "Card", value: sales.filter(s => s.paymentMethod === "Card").length || 0, color: "#d4d4d8" },
  ];
  const totalP = paymentData.reduce((s, d) => s + d.value, 0);

  const topProducts = [...new Set(sales.map(s => s.product))].slice(0, 5).map(p => ({
    product: p,
    revenue: sales.filter(s => s.product === p).reduce((s, r) => s + (r.totalAmount || 0), 0),
    units: sales.filter(s => s.product === p).reduce((s, r) => s + (r.quantity || 0), 0),
    trend: sales.filter(s => s.product === p && new Date(s.date) >= new Date(Date.now() - 7 * 86400000)).length,
  }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await retailerService.addSale({
      product: form.product, quantity: form.quantity, unitPrice: form.unitPrice,
      totalAmount: form.quantity * form.unitPrice, date: form.date,
    });
    if (res.success) { setShowModal(false); setForm({ product: "", quantity: 0, unitPrice: 0, date: new Date().toISOString().split("T")[0] }); fetchSales(); }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Retail analytics</p>
          <h1 className="text-xl font-semibold text-slate-900 mt-1">Sales Trends</h1>
          <p className="text-sm text-slate-500 mt-0.5">Detailed sales analytics and customer patterns</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm"><Plus className="w-3.5 h-3.5" />Add Sale</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", value: loading ? "--" : `₹${totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: "Transactions", value: loading ? "--" : sales.length, icon: BarChart3 },
          { label: "Avg Transaction", value: loading ? "--" : `₹${avgTransaction.toLocaleString()}`, icon: Package },
          { label: "Total Units", value: loading ? "--" : totalUnits, icon: Clock },
        ].map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <metric.icon className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-500">{metric.label}</p>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Hourly Sales Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hourlyData}><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#18181b" stopOpacity={0.08} /><stop offset="95%" stopColor="#18181b" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" /><XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#a1a1aa" /><YAxis tick={{ fontSize: 11 }} stroke="#a1a1aa" /><Tooltip /><Area type="monotone" dataKey="sales" stroke="#18181b" strokeWidth={2} fill="url(#sg)" /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Payment Methods</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart><Pie data={paymentData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">{paymentData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">{paymentData.map(m => <div key={m.method} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} /><span className="text-sm text-slate-500">{m.method}</span></div><span className="text-sm font-medium text-slate-900">{totalP > 0 ? Math.round(m.value / totalP * 100) : 0}%</span></div>)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-900">Top Selling Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th className="py-3 px-5">Product</th><th className="py-3 px-5">Revenue</th><th className="py-3 px-5">Units Sold</th><th className="py-3 px-5">Trend</th></tr></thead>
            <tbody>{topProducts.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center text-slate-400 text-sm"><Package className="w-6 h-6 mx-auto mb-2" /><p>No sales data available</p><p className="text-xs mt-1">Click Add Sale to record your first transaction</p></td></tr>
            ) : topProducts.map((p, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0"><td className="py-4 px-5 font-semibold text-slate-900">{p.product}</td><td className="py-4 px-5 font-semibold text-slate-900">₹{p.revenue.toLocaleString()}</td><td className="py-4 px-5 text-slate-600">{p.units}</td><td className="py-4 px-5"><span className={`text-xs font-medium ${p.trend > 0 ? "text-slate-900" : "text-slate-400"}`}>{p.trend > 0 ? `↑ ${p.trend} this week` : "No recent"}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-slate-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-slate-900">Record Sale</h3><button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-50 rounded-md"><X className="w-4 h-4 text-slate-400" /></button></div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Product Name</label><input required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none" placeholder="e.g. Milk" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label><input required type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Unit Price (₹)</label><input required type="number" min="0" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none" /></div>
              <p className="text-xs text-slate-500">Total: ₹{(form.quantity * form.unitPrice).toLocaleString()}</p>
              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={submitting} className="px-3 py-2 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-800 disabled:opacity-50">{submitting ? "Saving..." : "Save Sale"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
