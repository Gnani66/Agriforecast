"use client";

import { useState, useEffect } from "react";
import {
  Package, AlertTriangle, Search, Plus, BarChart3, RefreshCw, CheckCircle, X, Trash2,
} from "lucide-react";
import { retailerService } from "@/services/retailerService";
import type { InventoryItem } from "@/types";

const categories = ["All", "Vegetables", "Fruits", "Dairy", "Grains"];
const statuses = [
  { value: "all", label: "All Status" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "healthy", label: "Healthy" },
];
const storageTypes = ["Ambient", "Refrigerated", "Frozen", "Dry Storage"];

const statusBadge = (status: string) => {
  const map: Record<string, string> = { critical: "bg-red-50/50 text-red-700 border border-red-200/50", warning: "bg-amber-50/50 text-amber-700 border border-amber-200/50", healthy: "bg-slate-100 text-slate-700" };
  return map[status] || "bg-slate-100 text-slate-700";
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ product: "", category: "Vegetables", quantity: 0, purchasePrice: 0, sellingPrice: 0, expiryDate: "", storageType: "Ambient", supplierName: "", unit: "kg" });
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    const res = await retailerService.getInventory();
    if (res.success && res.data) setItems(res.data as InventoryItem[]);
    setLoading(false);
  };

  useEffect(() => {
    async function loadInventory() {
      const res = await retailerService.getInventory();
      if (res.success && res.data) setItems(res.data as InventoryItem[]);
      setLoading(false);
    }
    loadInventory();
  }, []);

  const filtered = items.filter(i => {
    const matchSearch = i.product.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || i.category === category;
    const matchStatus = status === "all" || i.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  const criticalCount = items.filter(i => i.status === "critical").length;
  const warningCount = items.filter(i => i.status === "warning").length;
  const healthyCount = items.filter(i => i.status === "healthy").length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await retailerService.addInventoryItem({
      product: form.product, category: form.category, quantity: form.quantity,
      purchasePrice: form.purchasePrice, sellingPrice: form.sellingPrice,
      expiryDate: form.expiryDate || undefined, storageType: form.storageType,
      supplierName: form.supplierName, unit: form.unit
    });
    if (res.success) {
      setShowModal(false);
      setForm({ product: "", category: "Vegetables", quantity: 0, purchasePrice: 0, sellingPrice: 0, expiryDate: "", storageType: "Ambient", supplierName: "", unit: "kg" });
      fetchInventory();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await retailerService.deleteInventory(id);
    fetchInventory();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Retail inventory</p>
          <h1 className="text-xl font-semibold text-slate-900 mt-1">Inventory Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor stock health and product movement</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchInventory} className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50"><RefreshCw className="w-3.5 h-3.5" /></button>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm"><Plus className="w-3.5 h-3.5" />Add Item</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: items.length, icon: Package },
          { label: "Critical Stock", value: criticalCount, icon: AlertTriangle },
          { label: "Low Stock", value: warningCount, icon: BarChart3 },
          { label: "Healthy Stock", value: healthyCount, icon: CheckCircle },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3"><stat.icon className="w-4 h-4 text-slate-400" /><p className="text-sm text-slate-500">{stat.label}</p></div>
            <p className="text-2xl font-semibold text-slate-900">{loading ? "..." : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none" />
          </div>
          <div className="flex items-center gap-3">
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-500">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-500">
              {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Quantity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Stock Level</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Demand</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400"><p>Loading...</p></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400"><Package className="w-8 h-8 mx-auto mb-2" /><p>No products in inventory</p><p className="text-sm mt-1">Click Add Item to get started</p></td></tr>
              ) : filtered.map(item => (
                <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">{item.product}</td>
                  <td className="py-3 px-4 text-slate-600">{item.category}</td>
                  <td className="py-3 px-4 text-slate-800">{item.quantity} {item.unit}</td>
                  <td className="py-3 px-4">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.status === "critical" ? "bg-red-500" : item.status === "warning" ? "bg-amber-500" : "bg-slate-900"}`}
                        style={{ width: `${Math.min(100, (item.quantity / (item.maxStock || 100)) * 100)}%` }} />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.demand >= 80 ? "bg-slate-100 text-slate-700" : item.demand >= 50 ? "bg-amber-50/50 text-amber-700" : "bg-red-50/50 text-red-700"}`}>
                      {item.demand}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800">₹{item.sellingPrice || item.price || 0}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(item.status)}`}>{item.status}</span></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Add Inventory Item</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400" placeholder="e.g. Milk" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    {["Vegetables", "Fruits", "Dairy", "Grains", "Spices", "Oils", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <div className="flex gap-2">
                    <input required type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400" />
                    <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-24 px-2 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600">
                      <option value="kg">kg</option>
                      <option value="packets">packets</option>
                      <option value="liters">liters</option>
                      <option value="pieces">pieces</option>
                      <option value="bunches">bunches</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price (₹)</label>
                  <input type="number" min="0" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                  <input type="number" min="0" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Storage Type</label>
                  <select value={form.storageType} onChange={e => setForm({ ...form, storageType: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    {storageTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
                  <input value={form.supplierName} onChange={e => setForm({ ...form, supplierName: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400" placeholder="Optional" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-3 py-2 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800 disabled:opacity-50">{submitting ? "Adding..." : "Add Item"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
