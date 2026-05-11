import { api } from './apiClient';
import type { WeatherData, WeatherForecastDay, ApiResponse } from '@/types';

export { api } from './apiClient';

export const weatherService = {
  getCurrentWeather: (city?: string) =>
    api.get<WeatherData>(`/weather/current?city=${encodeURIComponent(city || 'Pune')}`),

  getForecast: (city?: string, days?: number) =>
    api.get<WeatherForecastDay[]>(`/weather/forecast?city=${encodeURIComponent(city || 'Pune')}&days=${days || 7}`),
};

export const aiService = {
  chat: (message: string, context?: Record<string, unknown>) =>
    api.post<ApiResponse<{ response: string }>>('/ai/chat', { message, context }),

  getCropRecommendation: (data: Record<string, unknown>) =>
    api.post<ApiResponse<{ recommendation: string }>>('/ai/crop-recommendation', data),

  getMarketInsight: (data: Record<string, unknown>) =>
    api.post<ApiResponse<{ insight: string }>>('/ai/market-insight', data),

  getHarvestAdvice: (data: Record<string, unknown>) =>
    api.post<ApiResponse<{ advice: string }>>('/ai/harvest-advice', data),
};

export const forecastService = {
  getDemandForecast: (crop?: string) =>
    api.get<ApiResponse<unknown>>(`/forecast/demand?crop=${encodeURIComponent(crop || 'all')}`),

  getPriceTrends: (crop: string) =>
    api.get<ApiResponse<unknown[]>>(`/forecast/prices?crop=${encodeURIComponent(crop)}`),

  getRevenueForecast: () =>
    api.get<ApiResponse<{ revenue: number; growth: number }>>('/forecast/revenue'),
};
