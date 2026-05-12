export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export interface AuthResponse {
  token: string;
  farmer?: Farmer;
  retailer?: Retailer;
  distributor?: Distributor;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  [key: string]: string | number | undefined;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface FarmerDashboard {
  cropPlansCount: number;
  activeCrops: number;
  readyForHarvest: number;
  forecastedRevenue: number;
  demandIndex: number;
  weatherRisk: number;
  weatherRiskLevel: 'low' | 'medium' | 'high';
  recentCrops: CropEntry[];
  upcomingHarvests: CropEntry[];
  marketPrices: MarketPrice[];
}

export interface RetailerDashboard {
  totalInventory: number;
  lowStockItems: number;
  spoilageRisk: number;
  todaySales: number;
  fastMoving: number;
  revenueProjection: number;
  totalStockValue?: number;
  recentSales: SalesRecord[];
  inventoryAlerts: InventoryItem[];
}

export interface DistributorDashboard {
  totalShipments?: number;
  activeShipments: number;
  delivered?: number;
  delayedDeliveries?: number;
  fleetUtilization?: number;
  onTimeRate?: number;
  avgDeliveryTime?: number;
  fuelEfficiency?: number;
  recentShipments?: Shipment[];
  fleetStatus?: FleetVehicle[];
  totalCapacity?: number;
  totalUsed?: number;
  warehouseEfficiency?: number;
  fleetSize?: number;
  activeVehicles?: number;
  idleVehicles?: number;
  maintenanceVehicles?: number;
  totalTrips?: number;
}

export interface CropEntry {
  _id: string;
  farmerId: string;
  cropName: string;
  cropCategory: string;
  plantingDate: string;
  expectedHarvestDate: string;
  quantityPlanted: number;
  landAllocation: number;
  expectedYield: number;
  irrigationType: string;
  status: string;
  createdAt: string;
}

export interface FarmerDashboard {
  cropPlansCount: number;
  activeCrops: number;
  readyForHarvest: number;
  forecastedRevenue: number;
  demandIndex: number;
  weatherRisk: number;
  weatherRiskLevel: 'low' | 'medium' | 'high';
  recentCrops: CropEntry[];
  upcomingHarvests: CropEntry[];
  marketPrices: MarketPrice[];
}

export interface Forecast {
  _id: string;
  userId: string;
  userType: string;
  type: string;
  cropName: string;
  predictedValue: number;
  actualValue: number | null;
  confidence: number;
  period: string;
  date: string;
}

export interface MarketPrice {
  _id: string;
  cropName: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  pressure: number;
  visibility: number;
  condition: string;
  rainfall: number;
  city: string;
  risks: WeatherRisk[];
  forecast: WeatherForecastDay[];
}

export interface WeatherRisk {
  type: string;
  severity: string;
  message: string;
}

export interface WeatherForecastDay {
  date: string;
  high: number;
  low: number;
  humidity: number;
  rainfall: number;
  condition: string;
}

export interface InventoryItem {
  _id: string;
  retailerId: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  avgDaily: number;
  price: number;
  purchasePrice: number;
  sellingPrice: number;
  storageType: string;
  supplierName: string;
  expiryDate: string;
  turnover: string;
  demand: number;
  status: string;
}

export interface WasteRecord {
  _id: string;
  product: string;
  quantity: number;
  value: number;
  reason: string;
  severity: string;
  status: string;
  recommendedAction: string;
  createdAt: string;
}

export interface SalesRecord {
  _id: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  date: string;
}

export interface Shipment {
  _id: string;
  origin: string;
  destination: string;
  status: string;
  eta: string;
  priority: string;
  weight: string;
  vehicle: string;
  progress: number;
}

export interface FleetVehicle {
  _id: string;
  plate: string;
  model: string;
  driver: string;
  status: string;
  location: string;
  fuel: number;
  mileage: string;
  nextService: string;
  totalTrips: number;
}

export interface Warehouse {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  used: number;
  efficiency: number;
}

export interface HarvestPrediction {
  cropName: string;
  plantingDate: string;
  expectedHarvestDate: string;
  bestHarvestWindowStart: string;
  bestHarvestWindowEnd: string;
  demandPeakTiming: string;
  riskLevel: string;
  recommendation: string;
  daysUntilHarvest: number;
  generatedAt: string;
}

export interface AIInsight {
  type: string;
  title: string;
  description: string;
  action: string;
  severity?: "low" | "medium" | "high";
}

export interface Farmer {
  _id: string;
  name: string;
  email: string;
  region: string;
  farmType: string;
}

export interface Retailer {
  _id: string;
  name: string;
  email: string;
  storeName: string;
  storeType: string;
  region: string;
  inventoryCategory: string;
}

export interface Distributor {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  fleetSize: number;
  warehouseLocation: string;
  serviceRegion: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface Route {
  id: string;
  name: string;
  distance: string;
  avgTime: string;
  traffic: "Light" | "Moderate" | "Heavy";
  efficiency: number;
  fuelSavings: number;
}

export interface TrafficCondition {
  route: string;
  status: "Light" | "Moderate" | "Heavy";
  delay: string;
}

export interface RecentActivity {
  type: "received" | "dispatched" | "pending" | "alert";
  item: string;
  warehouse: string;
  time: string;
  status: "Completed" | "Processing" | "Warning";
}

export interface WasteAlert {
  id: string;
  product: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  impact: string;
  action: string;
  quantity: string;
  value: string;
}

export interface ProcurementRecommendation {
  product: string;
  qty: string;
  price: string;
  confidence: number;
  supplier: string;
  delivery: string;
}

export interface SalesTrend {
  day: string;
  sales: number;
  forecast: number;
  units: number;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  storeName: string;
  storeType: string;
  region: string;
  inventoryCategory: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ReorderAlert {
  product: string;
  current: number;
  min: number;
  suggested: number;
  urgency: "high" | "medium" | "low";
  reason: string;
}

export interface DemandForecastPoint {
  day: string;
  predicted: number;
  actual: number | null;
}

export interface HourlySalesPoint {
  hour: string;
  sales: number;
}

export interface PaymentMethodData {
  method: string;
  value: number;
  color: string;
}

export interface TopProduct {
  name: string;
  revenue: number;
  units: number;
  trend: number;
}

export interface InsightCategory {
  label: string;
  count: number;
  color: string;
}
