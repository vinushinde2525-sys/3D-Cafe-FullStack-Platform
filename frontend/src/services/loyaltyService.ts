/**
 * loyaltyService.ts — CRM, loyalty points, membership
 * Full offline-safe mock data + API wrappers.
 */
import api from '@/api/axios';
import { isBackendOnline } from '@/services/backendStatus';
import type { CustomerProfile, LoyaltyPoint, Membership, CRMStats, ReviewAnalytics, MembershipTier, LoyaltyConfig } from '@/types/crm';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// ── Config ────────────────────────────────────────────────────────────────────
export const LOYALTY_CONFIG: LoyaltyConfig = {
  pointsPerRupee:     1,    // 1pt per ₹10 spent (applied in service)
  rupeeValuePerPoint: 0.5,  // ₹0.50 per point
  minRedeemPoints:    100,
  pointExpiryDays:    365,
  tiers: {
    bronze:   { minPoints: 0,    discount: 0,  label: 'Bronze',   color: 'text-amber-700' },
    silver:   { minPoints: 500,  discount: 5,  label: 'Silver',   color: 'text-slate-500' },
    gold:     { minPoints: 1500, discount: 10, label: 'Gold',     color: 'text-yellow-500'},
    platinum: { minPoints: 4000, discount: 15, label: 'Platinum', color: 'text-violet-600'},
  },
};

export function getTier(points: number): MembershipTier {
  if (points >= 4000) return 'platinum';
  if (points >= 1500) return 'gold';
  if (points >= 500)  return 'silver';
  return 'bronze';
}

export function pointsToRupees(pts: number) {
  return pts * LOYALTY_CONFIG.rupeeValuePerPoint;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); };

export const MOCK_CUSTOMERS: CustomerProfile[] = [
  { _id: 'demo-customer',  name: 'John Doe',       email: 'customer@cafe3d.com', phone: '+91 98765 43210', role: 'customer', isVerified: true,  isBlocked: false, joinedAt: daysAgo(200), lastActive: daysAgo(1),  totalOrders: 47,  totalSpent: 18240, avgOrderValue: 388, loyaltyPoints: 1824, loyaltyTier: 'gold',     favoriteItems: [{ name: 'Caramel Cloud Latte', orderCount: 12 }, { name: 'Wagyu Smash Burger', orderCount: 8 }], favoriteCategory: 'Coffee',    orderFrequency: 4, addresses: [], referralCount: 3 },
  { _id: 'cust-2',         name: 'Priya Sharma',   email: 'priya@example.com',   phone: '+91 87654 32109', role: 'customer', isVerified: true,  isBlocked: false, joinedAt: daysAgo(180), lastActive: daysAgo(0),  totalOrders: 92,  totalSpent: 38400, avgOrderValue: 417, loyaltyPoints: 4200, loyaltyTier: 'platinum', favoriteItems: [{ name: 'Espresso Royale', orderCount: 28 }, { name: 'Tiramisu Classico', orderCount: 15 }], favoriteCategory: 'Coffee',    orderFrequency: 2, addresses: [], referralCount: 7 },
  { _id: 'cust-3',         name: 'Arjun Mehta',    email: 'arjun@example.com',   phone: '+91 76543 21098', role: 'customer', isVerified: true,  isBlocked: false, joinedAt: daysAgo(120), lastActive: daysAgo(3),  totalOrders: 24,  totalSpent: 9600,  avgOrderValue: 400, loyaltyPoints: 960,  loyaltyTier: 'silver',   favoriteItems: [{ name: 'Truffle Margherita', orderCount: 9 }, { name: 'BBQ Chicken Pizza', orderCount: 7 }], favoriteCategory: 'Pizza',     orderFrequency: 5, addresses: [], referralCount: 1 },
  { _id: 'cust-4',         name: 'Sneha Kulkarni', email: 'sneha@example.com',   phone: '+91 65432 10987', role: 'customer', isVerified: true,  isBlocked: false, joinedAt: daysAgo(90),  lastActive: daysAgo(7),  totalOrders: 11,  totalSpent: 3850,  avgOrderValue: 350, loyaltyPoints: 385,  loyaltyTier: 'bronze',   favoriteItems: [{ name: 'Mango Sunrise Smoothie', orderCount: 6 }], favoriteCategory: 'Beverages', orderFrequency: 8, addresses: [], referralCount: 0 },
  { _id: 'cust-5',         name: 'Rohan Desai',    email: 'rohan@example.com',   phone: '+91 54321 09876', role: 'customer', isVerified: false, isBlocked: false, joinedAt: daysAgo(30),  lastActive: daysAgo(14), totalOrders: 4,   totalSpent: 1240,  avgOrderValue: 310, loyaltyPoints: 124,  loyaltyTier: 'bronze',   favoriteItems: [{ name: 'Cappuccino Classico', orderCount: 3 }], favoriteCategory: 'Coffee',    orderFrequency: 7, addresses: [], referralCount: 0 },
  { _id: 'cust-6',         name: 'Kavya Nair',     email: 'kavya@example.com',   phone: '+91 43210 98765', role: 'customer', isVerified: true,  isBlocked: true,  joinedAt: daysAgo(250), lastActive: daysAgo(45), totalOrders: 3,   totalSpent: 840,   avgOrderValue: 280, loyaltyPoints: 84,   loyaltyTier: 'bronze',   favoriteItems: [], favoriteCategory: 'Desserts', orderFrequency: 30, addresses: [], referralCount: 0 },
];

export const MOCK_LOYALTY_POINTS: LoyaltyPoint[] = [
  { _id: 'lp-1', user: 'demo-customer', type: 'order_earned', points: 120,  balance: 1824, reference: 'ORD-001', description: 'Points earned on order #ORD-001',        createdAt: daysAgo(1) },
  { _id: 'lp-2', user: 'demo-customer', type: 'order_earned', points: 88,   balance: 1704, reference: 'ORD-002', description: 'Points earned on order #ORD-002',        createdAt: daysAgo(3) },
  { _id: 'lp-3', user: 'demo-customer', type: 'order_redeemed', points: -200, balance: 1616, reference: 'ORD-003', description: 'Redeemed 200 points (₹100 off)',       createdAt: daysAgo(5) },
  { _id: 'lp-4', user: 'demo-customer', type: 'referral',    points: 250,  balance: 1816, description: 'Referral bonus — friend joined',                                 createdAt: daysAgo(10) },
  { _id: 'lp-5', user: 'demo-customer', type: 'birthday',    points: 500,  balance: 1566, description: 'Birthday bonus 🎂',                                              createdAt: daysAgo(30) },
  { _id: 'lp-6', user: 'demo-customer', type: 'signup',      points: 100,  balance: 100,  description: 'Welcome bonus',                                                  createdAt: daysAgo(200) },
];

export const MOCK_MEMBERSHIPS: Membership[] = [
  { _id: 'mem-1', user: 'cust-2', tier: 'platinum', startDate: daysAgo(60), endDate: new Date(Date.now() + 305 * 86400000).toISOString(), isActive: true, benefits: ['15% on all orders','Free delivery always','Priority kitchen','Birthday 2x points','Early menu access'], price: 2999, autoRenew: true, createdAt: daysAgo(60) },
  { _id: 'mem-2', user: 'demo-customer', tier: 'gold', startDate: daysAgo(30), endDate: new Date(Date.now() + 335 * 86400000).toISOString(), isActive: true, benefits: ['10% on all orders','Free delivery ₹300+','10% extra points'], price: 1499, autoRenew: false, createdAt: daysAgo(30) },
];

export const MOCK_CRM_STATS: CRMStats = {
  totalCustomers:    1240,
  newThisMonth:      84,
  returningRate:     68.4,
  avgLifetimeValue:  12340,
  avgOrderFrequency: 4.2,
  totalLoyaltyPoints: 184200,
  pointsRedeemed:    42000,
  membershipCount:   186,
  tierBreakdown: { bronze: 820, silver: 280, gold: 120, platinum: 20 },
  topSpenders: MOCK_CUSTOMERS.slice(0, 4),
};

export const MOCK_REVIEW_ANALYTICS: ReviewAnalytics = {
  totalReviews: 847,
  avgRating:    4.6,
  distribution: { 5: 512, 4: 218, 3: 74, 2: 28, 1: 15 },
  recentReviews: [],
  topRatedItems: [
    { name: 'Tiramisu Classico',    avgRating: 4.9, count: 156 },
    { name: 'Caramel Cloud Latte',  avgRating: 4.9, count: 230 },
    { name: 'Truffle Margherita',   avgRating: 4.8, count: 63  },
    { name: 'Wagyu Smash Burger',   avgRating: 4.7, count: 87  },
  ],
  flaggedCount: 3,
};

// ── API Service ───────────────────────────────────────────────────────────────
export const loyaltyService = {
  async getCustomers(params?: Record<string, string>): Promise<CustomerProfile[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_CUSTOMERS; }
    try { const { data } = await api.get('/users/crm', { params }); return data.data; }
    catch { return MOCK_CUSTOMERS; }
  },

  async getCustomer(id: string): Promise<CustomerProfile> {
    if (!isBackendOnline()) { await delay(); return MOCK_CUSTOMERS.find(c => c._id === id) ?? MOCK_CUSTOMERS[0]; }
    try { const { data } = await api.get(`/users/${id}/crm`); return data.data; }
    catch { return MOCK_CUSTOMERS.find(c => c._id === id) ?? MOCK_CUSTOMERS[0]; }
  },

  async getLoyaltyHistory(userId: string): Promise<LoyaltyPoint[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_LOYALTY_POINTS.filter(p => p.user === userId); }
    try { const { data } = await api.get(`/users/${userId}/loyalty`); return data.data; }
    catch { return MOCK_LOYALTY_POINTS.filter(p => p.user === userId); }
  },

  async adjustPoints(userId: string, points: number, reason: string): Promise<void> {
    if (!isBackendOnline()) { await delay(400); return; }
    await api.post(`/users/${userId}/loyalty/adjust`, { points, reason });
  },

  async getMembership(userId: string): Promise<Membership | null> {
    if (!isBackendOnline()) { await delay(); return MOCK_MEMBERSHIPS.find(m => m.user === userId) ?? null; }
    try { const { data } = await api.get(`/users/${userId}/membership`); return data.data; }
    catch { return MOCK_MEMBERSHIPS.find(m => m.user === userId) ?? null; }
  },

  async purchaseMembership(userId: string, tier: MembershipTier): Promise<Membership> {
    if (!isBackendOnline()) {
      await delay(600);
      const cfg = { bronze: { price: 0, days: 365 }, silver: { price: 499, days: 365 }, gold: { price: 1499, days: 365 }, platinum: { price: 2999, days: 365 } };
      const c = cfg[tier];
      return { _id: `mem-${Date.now()}`, user: userId, tier, startDate: new Date().toISOString(), endDate: new Date(Date.now() + c.days * 86400000).toISOString(), isActive: true, benefits: [], price: c.price, autoRenew: false, createdAt: new Date().toISOString() };
    }
    const { data } = await api.post(`/users/${userId}/membership`, { tier });
    return data.data;
  },

  async getCRMStats(): Promise<CRMStats> {
    if (!isBackendOnline()) { await delay(); return MOCK_CRM_STATS; }
    try { const { data } = await api.get('/users/crm/stats'); return data.data; }
    catch { return MOCK_CRM_STATS; }
  },

  async getReviewAnalytics(): Promise<ReviewAnalytics> {
    if (!isBackendOnline()) { await delay(); return MOCK_REVIEW_ANALYTICS; }
    try { const { data } = await api.get('/reviews/analytics'); return data.data; }
    catch { return MOCK_REVIEW_ANALYTICS; }
  },

  async blockCustomer(userId: string, block: boolean): Promise<void> {
    if (!isBackendOnline()) {
      await delay(300);
      const customer = MOCK_CUSTOMERS.find(c => c._id === userId);
      if (customer) customer.isBlocked = block;
      return;
    }
    await api.patch(`/users/${userId}/toggle-block`);
  },

  async updateNotes(userId: string, notes: string): Promise<void> {
    if (!isBackendOnline()) { await delay(300); return; }
    await api.patch(`/users/${userId}/notes`, { notes });
  },
};
