import type { ApiResponse, WeatherData, WeatherForecastDay } from '@/types';

export const getWeather = async (city?: string): Promise<ApiResponse<WeatherData>> => {
  const { api } = await import('./apiClient');
  return api.get<WeatherData>(`/weather/current?city=${encodeURIComponent(city || '')}`);
};

export const getForecast = async (city?: string, days?: number): Promise<ApiResponse<WeatherForecastDay[]>> => {
  const { api } = await import('./apiClient');
  return api.get<WeatherForecastDay[]>(`/weather/forecast?city=${encodeURIComponent(city || '')}&days=${days || 7}`);
};
