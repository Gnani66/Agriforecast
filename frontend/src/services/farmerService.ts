import { api } from './apiClient';
import type {
  FarmerDashboard,
  CropEntry,
  Forecast,
  MarketPrice,
  AIInsight,
} from '@/types';

export const farmerService = {
  getDashboard: () =>
    api.get<FarmerDashboard>('/farmer/dashboard'),

  getCrops: () =>
    api.get<CropEntry[]>('/farmer/crops'),

  createCrop: (data: Partial<CropEntry>) =>
    api.post<CropEntry>('/farmer/crops', data),

  updateCrop: (id: string, data: Partial<CropEntry>) =>
    api.put<CropEntry>(`/farmer/crops/${id}`, data),

  deleteCrop: (id: string) =>
    api.delete<{ message: string }>(`/farmer/crops/${id}`),

  getForecast: () =>
    api.get<Forecast[]>('/farmer/forecast'),

  getMarketPrices: (crop?: string) =>
    api.get<MarketPrice[]>(`/farmer/market${crop ? `?crop=${encodeURIComponent(crop)}` : ''}`),

  getHarvestReady: () =>
    api.get<CropEntry[]>('/farmer/harvest'),

  getInsights: () =>
    api.get<AIInsight[]>('/farmer/insights'),

  chatWithAI: (message: string, context?: Record<string, unknown>) =>
    api.post<{ response: string }>('/ai/chat', { message, context }),
};
