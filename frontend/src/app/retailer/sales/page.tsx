"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, DollarSign, Package, Clock, Eye, Plus, X } from "lucide-react";
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

  useEffect(() => { fetchSales(); }, []);

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
    { method: "UPI", value: sales.filter(s => s.paymentMethod === "UPI" || !s.paymentMethod).length || 1, color: "#10b981" },
    { method: "Cash", value: sales.filter(s => s.paymentMethod === "Cash").length || 0, color: "#3b82f6" },
    { method: "Card", value: sales.filter(s => s.paymentMethod === "Card").length || 0, color: "#a855f7" },
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
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Sales Trends</h1><p className="text-slate-500">Detailed sales analytics and customer patterns</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"><Plus className="w-4 h-4" />Add Sale</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Sales", value: loading ? "--" : `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "Transactions", value: loading ? "--" : sales.length, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Avg Transaction", value: loading ? "--" : `₹${avgTransaction.toLocaleString()}`, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Units", value: loading ? "--" : totalUnits, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((metric, i) => (
          <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${metric.bg}`}><metric.icon className={`w-5 h-5 ${metric.color}`} /></div><div><p className="text-2xl font-bold text-slate-800">{metric.value}</p><p className="text-sm text-slate-500">{metric.label}</p></div></div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Hourly Sales Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hourlyData}><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#94a3b8" /><YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" /><Tooltip /><Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} fill="url(#sg)" /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Payment Methods</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart><Pie data={paymentData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">{paymentData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">{paymentData.map(m => <div key={m.method} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} /><span className="text-sm text-slate-500">{m.method}</span></div><span className="text-sm font-medium text-slate-800">{totalP > 0 ? Math.round(m.value / totalP * 100) : 0}%</span></div>)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-slate-800">Top Selling Products</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Revenue</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Units Sold</th><th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Trend</th></tr></thead>
            <tbody>{topProducts.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center text-slate-400"><Package className="w-8 h-8 mx-auto mb-2" /><p>No sales data available</p><p className="text-sm mt-1">Click "Add Sale" to record your first transaction</p></td></tr>
            ) : topProducts.map((p, i) => (
              <tr key={i} className="border-b border-slate-100"><td className="py-3 px-4 font-medium text-slate-800">{p.product}</td><td className="py-3 px-4 text-green-600 font-medium">₹{p.revenue.toLocaleString()}</td><td className="py-3 px-4">{p.units}</td><td className="py-3 px-4"><span className={`text-xs font-medium ${p.trend > 0 ? "text-green-600" : "text-slate-400"}`}>{p.trend > 0 ? `↑ ${p.trend} this week` : "No recent"}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-slate-800">Record Sale</h3><button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label><input required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Milk" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label><input required type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Unit Price (₹)</label><input required type="number" min="0" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
              <p className="text-sm text-slate-500">Total: ₹{(form.quantity * form.unitPrice).toLocaleString()}</p>
              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">{submitting ? "Saving..." : "Save Sale"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
