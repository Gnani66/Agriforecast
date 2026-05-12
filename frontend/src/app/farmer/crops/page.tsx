"use client";

import { useState, useEffect, useCallback } from "react";
import FarmerLayout from "@/layouts/FarmerLayout";
import { farmerService } from "@/services/farmerService";
import type { CropEntry } from "@/types";
import toast from "react-hot-toast";
import {
  Plus, Edit2, Trash2, Sprout, Calendar, Ruler,
  Droplets, X, AlertTriangle,
} from "lucide-react";

const CROP_CATEGORIES = ["Vegetable", "Fruit", "Grain", "Other"];
const IRRIGATION_TYPES = ["Drip", "Flood", "Sprinkler", "Rainfed"];
const CROP_STATUSES = ["Planted", "Growing", "Harvested", "Failed"] as const;

interface CropFormData {
  cropName: string;
  cropCategory: string;
  plantingDate: string;
  expectedHarvestDate: string;
  quantityPlanted: number;
  landAllocation: number;
  expectedYield: number;
  irrigationType: string;
  status: string;
}

const emptyForm: CropFormData = {
  cropName: "",
  cropCategory: "Vegetable",
  plantingDate: "",
  expectedHarvestDate: "",
  quantityPlanted: 0,
  landAllocation: 0,
  expectedYield: 0,
  irrigationType: "Drip",
  status: "Planted",
};

export default function CropsPage() {
  const [crops, setCrops] = useState<CropEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CropFormData>(emptyForm);

  const loadCrops = useCallback(async () => {
    setError("");
    try {
      const res = await farmerService.getCrops();
      if (res.success && res.data) {
        setCrops(res.data);
      } else {
        setError(res.message || "Failed to fetch crops");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCrops();
  }, [loadCrops]);

  const retry = () => { setLoading(true); loadCrops(); };
  const afterMutate = () => { loadCrops(); setShowForm(false); setDeletingId(null); };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (crop: CropEntry) => {
    setForm({
      cropName: crop.cropName,
      cropCategory: crop.cropCategory,
      plantingDate: crop.plantingDate ? crop.plantingDate.split("T")[0] : "",
      expectedHarvestDate: crop.expectedHarvestDate ? crop.expectedHarvestDate.split("T")[0] : "",
      quantityPlanted: crop.quantityPlanted,
      landAllocation: crop.landAllocation,
      expectedYield: crop.expectedYield,
      irrigationType: crop.irrigationType,
      status: crop.status,
    });
    setEditingId(crop._id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.cropName.trim()) {
      toast.error("Crop name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await farmerService.updateCrop(editingId, form);
        if (res.success) {
          toast.success("Crop updated successfully");
        } else {
          toast.error(res.message || "Failed to update crop");
          return;
        }
      } else {
        const res = await farmerService.createCrop(form);
        if (res.success) {
          toast.success("Crop added successfully");
        } else {
          toast.error(res.message || "Failed to add crop");
          return;
        }
      }
      setShowForm(false);
      afterMutate();
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await farmerService.deleteCrop(deletingId);
      if (res.success) {
        toast.success("Crop deleted");
        setDeletingId(null);
        afterMutate();
      } else {
        toast.error(res.message || "Failed to delete crop");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleFormChange = (field: keyof CropFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planted": return "bg-slate-100 text-slate-700";
      case "Growing": return "bg-slate-100 text-slate-700";
      case "Harvested": return "bg-amber-100 text-amber-700";
      case "Failed": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Vegetable": return "bg-slate-100 text-slate-700";
      case "Fruit": return "bg-amber-50/50 text-amber-700";
      case "Grain": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-slate-100 rounded mt-2 animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <div className="h-5 w-28 bg-slate-200 rounded animate-pulse mb-3" />
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </FarmerLayout>
    );
  }

  if (error) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">Crop Intelligence</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Failed to load crops</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <button
              onClick={retry}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Crop Intelligence</h1>
            <p className="text-slate-500 mt-1">Manage your crops and planting data</p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Crop
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Crop" : "Add New Crop"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Crop Name *</label>
                <input
                  type="text"
                  value={form.cropName}
                  onChange={(e) => handleFormChange("cropName", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                  placeholder="e.g. Tomato"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={form.cropCategory}
                  onChange={(e) => handleFormChange("cropCategory", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                >
                  {CROP_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Planting Date</label>
                <input
                  type="date"
                  value={form.plantingDate}
                  onChange={(e) => handleFormChange("plantingDate", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Harvest Date</label>
                <input
                  type="date"
                  value={form.expectedHarvestDate}
                  onChange={(e) => handleFormChange("expectedHarvestDate", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Planted</label>
                <input
                  type="number"
                  min={0}
                  value={form.quantityPlanted}
                  onChange={(e) => handleFormChange("quantityPlanted", Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Land Allocation (acres)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.landAllocation}
                  onChange={(e) => handleFormChange("landAllocation", Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Yield (quintals)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.expectedYield}
                  onChange={(e) => handleFormChange("expectedYield", Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Irrigation Type</label>
                <select
                  value={form.irrigationType}
                  onChange={(e) => handleFormChange("irrigationType", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                >
                  {IRRIGATION_TYPES.map((irr) => (
                    <option key={irr} value={irr}>{irr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:border-emerald-500 outline-none"
                >
                  {CROP_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
              >
                {submitting ? "Saving..." : editingId ? "Update Crop" : "Add Crop"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {crops.length === 0 && !showForm ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No crops added yet</h3>
            <p className="text-sm text-slate-500 mb-4">Start by adding your first crop entry</p>
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Crop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop._id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{crop.cropName}</h3>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getCategoryColor(crop.cropCategory)}`}>
                      {crop.cropCategory}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(crop.status)}`}>
                    {crop.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-slate-400" />
                    <span>{crop.landAllocation} acres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-slate-400" />
                    <span>{crop.irrigationType}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEditForm(crop)}
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-500 transition-colors px-3 py-1.5 rounded hover:bg-slate-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingId(crop._id)}
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deletingId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Crop</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                Are you sure you want to delete this crop? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
