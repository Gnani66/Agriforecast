"use client";

import { useState, useEffect } from "react";
import FarmerLayout from "@/layouts/FarmerLayout";
import { api } from "@/services/apiClient";
import type { WeatherData } from "@/types";
import {
  CloudSun, Droplets, Wind, Thermometer,
  AlertTriangle, CloudRain, Sun, Cloud, CloudSnow,
} from "lucide-react";

const conditionIconMap: Record<string, typeof CloudSun> = {
  rain: CloudRain,
  drizzle: CloudRain,
  thunder: CloudRain,
  cloud: Cloud,
  sun: Sun,
  clear: Sun,
  snow: CloudSnow,
};

function getConditionIcon(condition: string): typeof CloudSun {
  const c = condition?.toLowerCase() || "";
  for (const [key, icon] of Object.entries(conditionIconMap)) {
    if (c.includes(key)) return icon;
  }
  return CloudSun;
}

function renderWeatherIcon(condition: string, className: string) {
  const Icon = getConditionIcon(condition);
  return <Icon className={className} strokeWidth={1.5} />;
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "high": return "bg-red-100 border-red-300 text-red-700";
    case "medium": return "bg-amber-100 border-amber-300 text-amber-700";
    case "low": return "bg-yellow-100 border-yellow-300 text-yellow-700";
    default: return "bg-slate-100 border-slate-300 text-slate-700";
  }
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get<WeatherData>("/farmer/weather");
        if (mounted) {
          if (res.success && res.data) {
            setWeather(res.data);
          } else {
            setError(res.message || "Failed to fetch weather data");
          }
        }
      } catch {
        if (mounted) setError("Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchWeather();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-52 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-slate-100 rounded-lg animate-pulse h-[72px] w-[72px]" />
                <div>
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                  <div className="h-10 w-24 bg-slate-100 rounded animate-pulse mt-2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
              <div className="h-5 w-20 bg-slate-200 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  if (error) {
    return (
      <FarmerLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">Weather Analysis</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Error loading weather data</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      </FarmerLayout>
    );
  }

  if (!weather) return null;

  return (
    <FarmerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Weather Analysis</h1>
            <p className="text-slate-500 mt-1">Real-time weather intelligence for farming decisions</p>
          </div>
        </div>

        {weather.risks && weather.risks.length > 0 && (
          <div className="space-y-2">
            {weather.risks.map((risk, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}>
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm capitalize">{risk.type}</p>
                  <p className="text-sm mt-0.5">{risk.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                                {renderWeatherIcon(weather.condition, "w-10 h-10 text-blue-500")}
              </div>
              <div>
                <p className="text-sm text-slate-500">{weather.city} - {weather.condition}</p>
                <p className="text-4xl font-bold text-slate-900">{Math.round(weather.temp)} C</p>
                <p className="text-sm text-slate-500">Feels like {Math.round(weather.feelsLike)} C</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-slate-500">Rainfall</p>
                <p className="font-semibold text-slate-900">{weather.rainfall ?? 0} mm</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-slate-500">Pressure</p>
                <p className="font-semibold text-slate-900">{weather.pressure} hPa</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-slate-500">Visibility</p>
                <p className="font-semibold text-slate-900">{(weather.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-slate-600">Temperature</span>
                  </div>
                  <span className="font-medium text-slate-900">{Math.round(weather.temp)} C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-slate-600">Humidity</span>
                  </div>
                  <span className="font-medium text-slate-900">{weather.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-slate-500" />
                    <span className="text-sm text-slate-600">Wind Speed</span>
                  </div>
                  <span className="font-medium text-slate-900">{weather.wind} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {weather.forecast && weather.forecast.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                    </p>
                    {renderWeatherIcon(day.condition, "w-6 h-6 mx-auto my-2 text-blue-500")}
                    <p className="text-xs text-slate-500 truncate">{day.condition}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {Math.round(day.high)} / {Math.round(day.low)} C
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Droplets className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-slate-500">{day.humidity}%</span>
                    </div>
                    {day.rainfall > 0 && (
                      <p className="text-xs text-blue-600 mt-1">{day.rainfall} mm</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
