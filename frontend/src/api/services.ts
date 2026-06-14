import api from './axios';
import type { User, FoodItem, Order, Review, Coupon, PaginatedResponse, DashboardStats, AuthTokens, LoginCredentials, RegisterData } from '@/types';

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: RegisterData) => api.post<{ data: { user: User } & AuthTokens }>('/auth/register', data),
  login: (data: LoginCredentials) => api.post<{ data: { user: User } & AuthTokens }>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get<{ data: User }>('/auth/me'),
  refreshToken: () => api.post<{ data: AuthTokens }>('/auth/refresh-token'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string, confirmPassword: string) => api.post(`/auth/reset-password/${token}`, { password, confirmPassword }),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
  googleLogin: () => { window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/google`; },
};

// ── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get<{ data: User }>('/users/profile'),
  updateProfile: (data: FormData) => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.put('/users/change-password', data),
  addAddress: (data: Partial<User['addresses'][0]>) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: Partial<User['addresses'][0]>) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
  // Admin
  getAll: (params: Record<string, unknown>) => api.get<{ data: PaginatedResponse<User> }>('/users', { params }),
  getById: (id: string) => api.get<{ data: { user: User } }>(`/users/${id}`),
  toggleBlock: (id: string) => api.patch(`/users/${id}/toggle-block`),
  updateRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
};

// ── Food ─────────────────────────────────────────────────────────────────────
export const foodAPI = {
  getAll: (params: Record<string, unknown>) => api.get<{ data: PaginatedResponse<FoodItem> & { items: FoodItem[] } }>('/food', { params }),
  getById: (id: string) => api.get<{ data: FoodItem }>(`/food/${id}`),
  getFeatured: () => api.get<{ data: FoodItem[] }>('/food/featured'),
  getCategories: () => api.get<{ data: string[] }>('/food/categories'),
  getTopRated: () => api.get<{ data: FoodItem[] }>('/food/top-rated'),
  getSpecials: () => api.get<{ data: FoodItem[] }>('/food/specials'),
  create: (data: FormData) => api.post('/food', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData | Record<string, unknown>) => api.put(`/food/${id}`, data),
  delete: (id: string) => api.delete(`/food/${id}`),
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  create: (data: Record<string, unknown>) => api.post<{ data: Order }>('/orders', data),
  getMyOrders: (params?: Record<string, unknown>) => api.get<{ data: PaginatedResponse<Order> & { orders: Order[] } }>('/orders/my-orders', { params }),
  getById: (id: string) => api.get<{ data: Order }>(`/orders/${id}`),
  getAll: (params?: Record<string, unknown>) => api.get<{ data: PaginatedResponse<Order> & { orders: Order[] } }>('/orders', { params }),
  updateStatus: (id: string, status: string, note?: string) => api.patch(`/orders/${id}/status`, { status, note }),
  cancel: (id: string, reason?: string) => api.patch(`/orders/${id}/cancel`, { reason }),
  getStats: () => api.get('/orders/stats'),
};

// ── Cart Validation ───────────────────────────────────────────────────────────
export const cartAPI = {
  validate: (data: Record<string, unknown>) => api.post<{ data: { subtotal: number; tax: number; deliveryFee: number; discount: number; couponDiscount: number; total: number } }>('/cart/validate', data),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewAPI = {
  getForFood: (foodId: string, params?: Record<string, unknown>) => api.get<{ data: { reviews: Review[] } }>(`/food/${foodId}/reviews`, { params }),
  create: (foodId: string, data: Partial<Review>) => api.post(`/food/${foodId}/reviews`, data),
  markHelpful: (id: string) => api.patch(`/reviews/${id}/helpful`),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// ── Coupons ───────────────────────────────────────────────────────────────────
export const couponAPI = {
  validate: (code: string, orderAmount: number) => api.post<{ data: { coupon: Coupon; discount: number } }>('/coupons/validate', { code, orderAmount }),
  getAll: (params?: Record<string, unknown>) => api.get<{ data: Coupon[] }>('/coupons', { params }),
  create: (data: Partial<Coupon>) => api.post('/coupons', data),
  update: (id: string, data: Partial<Coupon>) => api.put(`/coupons/${id}`, data),
  delete: (id: string) => api.delete(`/coupons/${id}`),
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createIntent: (orderId: string) => api.post<{ data: { clientSecret: string; paymentIntentId: string } }>('/payments/create-intent', { orderId }),
  confirm: (paymentIntentId: string) => api.post<{ data: Order }>('/payments/confirm', { paymentIntentId }),
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => api.get<{ data: DashboardStats }>('/analytics/dashboard'),
  getSales: (period?: string) => api.get('/analytics/sales', { params: { period } }),
};

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadImage: (file: File, folder?: string) => {
    const fd = new FormData(); fd.append('image', file); if (folder) fd.append('folder', folder);
    return api.post<{ data: { url: string; publicId: string } }>('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteImage: (publicId: string) => api.delete('/upload/image', { data: { publicId } }),
};
