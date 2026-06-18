/**
 * Battery Doctor Admin Panel - Type Definitions
 * Generated from OpenAPI 3.0 spec (api-collection.json)
 */

// ============================================================
// API Response Wrapper
// ============================================================

export interface ApiResponse<T> {
  response: T;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

// ============================================================
// Authentication Types
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
  pushToken: string;
  deviceInfo: {
    device: string;
  };
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  admin: AdminUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ============================================================
// User Types
// ============================================================

export interface AssignSubscriptionRequest {
  entitlementIdentifier: string;
  endTimeMs: number;
}

// ============================================================
// FAQ Types
// ============================================================

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  isActive?: boolean;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  isActive?: boolean;
}

// ============================================================
// Vehicle Profile Types
// ============================================================

export interface VehicleProfile {
  _id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  batteryCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleProfileRequest {
  name: string;
  make: string;
  model: string;
  year: number;
  batteryCapacity: number;
  isActive?: boolean;
}

export interface UpdateVehicleProfileRequest {
  name?: string;
  make?: string;
  model?: string;
  year?: number;
  batteryCapacity?: number;
  isActive?: boolean;
}

// ============================================================
// Subscription Plan Types
// ============================================================

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive?: boolean;
}

export interface UpdateSubscriptionPlanRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  isActive?: boolean;
}

// ============================================================
// Support Ticket Types
// ============================================================

export interface SupportTicket {
  _id: string;
  userId: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface TicketConversation {
  _id: string;
  ticketId: string;
  message: string;
  sender: "admin" | "user";
  createdAt: string;
}

export interface UpdateTicketRequest {
  status?: "open" | "in_progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high";
}

export interface CreateConversationRequest {
  message: string;
}

// ============================================================
// Notification Types
// ============================================================

export interface SendNotificationRequest {
  notification: {
    title: string;
    body: string;
  };
  userId?: string;
  topic?: string;
}

// ============================================================
// App Content Types
// ============================================================

export interface AppContent {
  _id: string;
  batteryHealthScore: { en: string };
  degradation: { en: string };
  phantomDrain: { en: string };
  usableBatteryCapacity: { en: string };
  lifetimeEnergyUsed: { en: string };
  projectedSoh: { en: string };
  warrantyCoverage: { en: string };
  alerts: { en: string };
  recommendation: { en: string };
  stressFactor: { en: string };
  prioritydo: { en: string };
  rangeCalculator: { en: string };
  chargingInfo: { en: string };
}

export interface UpdateAppContentRequest {
  [key: string]: { en: string };
}

// ============================================================
// App Settings Types
// ============================================================

export interface AppSettings {
  _id: string;
  [key: string]: unknown;
}

export interface UpdateAppSettingsRequest {
  [key: string]: unknown;
}

// ============================================================
// Partner Types
// ============================================================

export interface PartnerRegisterRequest {
  name: string;
  email: string;
  company: string;
}

export interface FleetTelemetryError {
  _id: string;
  vin: string;
  error: string;
  createdAt: string;
}

// ============================================================
// Pagination Types
// ============================================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
