import { api } from './apiClient';
import type {
  RetailerDashboard,
  InventoryItem,
  WasteRecord,
  ProcurementRecommendation,
  SalesRecord,
  DemandForecastPoint,
} from '@/types';

interface InventoryParams {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface SalesParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const retailerService = {
  getDashboard: () =>
    api.get<RetailerDashboard>('/retailer/dashboard'),

  getInventory: (params?: InventoryParams) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return api.get<InventoryItem[]>(`/retailer/inventory${qs ? `?${qs}` : ''}`);
  },

  addInventoryItem: (data: Record<string, unknown>) =>
    api.post<InventoryItem>('/retailer/inventory', data),

  updateInventory: (id: string, data: Partial<InventoryItem>) =>
    api.put<InventoryItem>(`/retailer/inventory/${id}`, data),

  deleteInventory: (id: string) =>
    api.delete<{ message: string }>(`/retailer/inventory/${id}`),

  getWasteAlerts: () =>
    api.get<WasteRecord[]>('/retailer/waste'),

  getProcurement: () =>
    api.get<ProcurementRecommendation[]>('/retailer/procurement'),

  getSales: (params?: SalesParams) => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return api.get<SalesRecord[]>(`/retailer/sales${qs ? `?${qs}` : ''}`);
  },

  addSale: (data: Record<string, unknown>) =>
    api.post<SalesRecord>('/retailer/sales', data),

  getDemandForecast: () =>
    api.get<DemandForecastPoint[]>('/retailer/forecast'),

  chatWithAI: (message: string) =>
    api.post<{ response: string }>('/retail-ai/chat', { message }),

  getInsights: () =>
    api.get<AIInsight[]>('/retail-ai/insights'),
};
