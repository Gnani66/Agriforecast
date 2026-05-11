import { api } from './apiClient';
import type {
  DistributorDashboard,
  Shipment,
  Warehouse,
  FleetVehicle,
  Route,
} from '@/types';

export const distributorService = {
  getDashboard: () =>
    api.get<DistributorDashboard>('/distributor/dashboard'),

  getShipments: () =>
    api.get<Shipment[]>('/distributor/shipments'),

  updateShipment: (id: string, data: Partial<Shipment>) =>
    api.put<Shipment>(`/distributor/shipments/${id}`, data),

  getWarehouses: () =>
    api.get<Warehouse[]>('/distributor/warehouses'),

  getFleet: () =>
    api.get<FleetVehicle[]>('/distributor/fleet'),

  getRoutes: () =>
    api.get<Route[]>('/distributor/routes'),

  getAnalytics: () =>
    api.get<Record<string, unknown>>('/distributor/analytics'),

  chatWithAI: (message: string) =>
    api.post<{ response: string }>('/ai/chat', { message }),
};
