// ── User ────────────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'staff' | 'admin';

export interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  addresses: Address[];
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

// ── Food ────────────────────────────────────────────────────────────────────
export type FoodCategory = 'Coffee' | 'Tea' | 'Burgers' | 'Pizza' | 'Sandwiches' | 'Desserts' | 'Beverages' | 'Breakfast' | 'Pasta' | 'Salads';

export interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface Customization {
  name: string;
  options: { label: string; extraPrice: number }[];
}

export interface FoodImage {
  url: string;
  publicId: string;
}

export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: FoodCategory;
  images: FoodImage[];
  model3dUrl?: string;
  ingredients?: string[];
  allergens?: string[];
  nutrition?: Nutrition;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  isSpecial: boolean;
  preparationTime: number;
  rating: number;
  reviewCount: number;
  orderCount: number;
  tags?: string[];
  customizations?: Customization[];
  createdAt: string;
}

// ── Cart ────────────────────────────────────────────────────────────────────
export interface CartCustomization {
  name: string;
  option: string;
  extraPrice: number;
}

export interface CartItem {
  foodItem: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations: CartCustomization[];
}

// ── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rejected';
export type OrderType = 'delivery' | 'pickup';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'stripe' | 'cash' | 'wallet';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: Partial<User> | string;
  items: CartItem[];
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  orderType: OrderType;
  deliveryAddress?: Partial<Address>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  rating?: number;
  createdAt: string;
}

// ── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  _id: string;
  user: Partial<User>;
  foodItem: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: FoodImage[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

// ── Coupon ───────────────────────────────────────────────────────────────────
export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiryDate: string;
}

// ── API ──────────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items?: T[];
  orders?: T[];
  users?: T[];
  total: number;
  page: number;
  pages: number;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// ── Analytics ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  totalUsers: number;
  totalItems: number;
  recentOrders: Order[];
  topItems: { _id: string; name: string; totalOrders: number; revenue: number }[];
  salesByDay: { _id: string; orders: number; revenue: number }[];
  ordersByStatus: { _id: OrderStatus; count: number }[];
}
