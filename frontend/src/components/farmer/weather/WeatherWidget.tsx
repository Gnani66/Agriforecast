"use client";

import { CloudSun, Droplets, Wind } from "lucide-react";

export default function WeatherWidget() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Weather</h3>
        <span className="text-sm text-slate-500">Loading location...</span>
      </div>

      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="p-3 bg-blue-50 rounded-lg">
          <CloudSun className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-900">-- C</p>
          <p className="text-sm text-slate-500">Weather data loading</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Droplets className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-slate-900">--%</p>
            <p className="text-xs text-slate-500">Humidity</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Wind className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-900">-- km/h</p>
            <p className="text-xs text-slate-500">Wind</p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg text-center">
        <p className="text-sm text-slate-500">Connect a weather API to display forecasts.</p>
      </div>
    </div>
  );
}
