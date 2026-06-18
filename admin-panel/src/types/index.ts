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
  pushToken?: string;
  deviceInfo?: {
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
  question: { en: string };
  answer: { en: string };
  category: string;
  order: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQRequest {
  category: string;
  order: number;
  status: boolean;
  question: { en: string };
  answer: { en: string };
}

export interface UpdateFAQRequest {
  question?: { en: string };
  answer?: { en: string };
  category?: string;
  order?: number;
  status?: boolean;
}

// ============================================================
// Vehicle Profile Types
// ============================================================

export interface VehicleProfile {
  _id: string;
  optionCodes: string[];
  startYear: number;
  endYear: number;
  trimBadge: string[];
  modelType: string;
  marketingName: string;
  sources: string[];
  range: {
    coldWeather: { cityKm: number; highwayKm: number; combinedKm: number };
    mildWeather: { cityKm: number; highwayKm: number; combinedKm: number };
  };
  battery: Record<string, unknown>;
  charging: Record<string, unknown>;
  performance: Record<string, unknown>;
  energyConsumption: Record<string, unknown>;
  homeChargingOptions: Record<string, unknown>;
  fastCharging10To80: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleProfileRequest {
  optionCodes: string[];
  startYear: number;
  endYear: number;
  trimBadge: string[];
  modelType: string;
  marketingName: string;
  sources: string[];
  range: Record<string, unknown>;
  battery: Record<string, unknown>;
  charging: Record<string, unknown>;
  performance: Record<string, unknown>;
  energyConsumption: Record<string, unknown>;
  homeChargingOptions: Record<string, unknown>;
  fastCharging10To80: Record<string, unknown>;
}

export interface UpdateVehicleProfileRequest {
  [key: string]: unknown;
}

// ============================================================
// Subscription Plan Types
// ============================================================

export interface SubscriptionPlan {
  _id: string;
  vehicleLicence: number;
  planType: string;
  duration: string;
  price: number;
  trialDays: number;
  androidSkuCode: string;
  iosSkuCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanRequest {
  vehicleLicence: number;
  planType: string;
  duration: string;
  price: number;
  trialDays: number;
  androidSkuCode: string;
  iosSkuCode: string;
  status: string;
}

export interface UpdateSubscriptionPlanRequest {
  vehicleLicence?: number;
  planType?: string;
  duration?: string;
  price?: number;
  trialDays?: number;
  androidSkuCode?: string;
  iosSkuCode?: string;
  status?: string;
}

// ============================================================
// Support Ticket Types
// ============================================================

export type TicketStatus = "open" | "inProgress" | "resolved" | "closed";

export interface SupportTicket {
  _id: string;
  userId: string;
  title: string;
  status: TicketStatus;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketDetail extends SupportTicket {
  issueDetail: string;
  attachments: TicketAttachment[];
}

export interface TicketAttachment {
  key: string;
  fileName: string;
  type: string;
  url: string;
}

export interface TicketConversation {
  _id: string;
  ticketId: string;
  senderType: "admin" | "user";
  adminId?: string;
  message: string;
  internalNote: string;
  attachments: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTicketRequest {
  status: TicketStatus;
}

export interface CreateConversationRequest {
  message: string;
  internalNote: string;
  attachments: { key: string; fileName: string }[];
}

export interface TicketListResponse {
  items: SupportTicket[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ConversationListResponse {
  items: TicketConversation[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  vehicleInformation?: { en: string };
  [key: string]: { en: string } | string | undefined;
}

export interface UpdateAppContentRequest {
  [key: string]: { en: string };
}

// ============================================================
// App Settings Types
// ============================================================

export interface AllowedFileType {
  extension: string;
  maxSizeMB: number;
}

export interface AppSettings {
  _id: string;
  supportEmail: string;
  playStoreLink: string;
  appStoreLink: string;
  termsUrl: string;
  privacyUrl: string;
  allowedFileType: AllowedFileType[];
  instagram: string;
  linkedIn: string;
  facebook: string;
  twitter: string;
  reddit: string;
  ios: Record<string, unknown>;
  android: Record<string, unknown>;
  underMaintenance: boolean;
  [key: string]: unknown;
}

export interface UpdateAppSettingsRequest {
  [key: string]: unknown;
}

// ============================================================
// Partner Types
// ============================================================

export interface PartnerRegisterRequest {
  region: string;
  domain: string;
}

export interface FleetTelemetryError {
  vin: string;
  error: string;
  created_at: string;
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
