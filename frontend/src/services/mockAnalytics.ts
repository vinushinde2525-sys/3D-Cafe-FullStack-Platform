/**
 * mockAnalytics.ts — offline-safe dashboard data
 * Used when backend is unavailable.
 */
import { MOCK_FOOD_ITEMS } from '@/services/mockData';
import type { DashboardStats, Order } from '@/types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];

function daysAgo(n: number) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
}

export const MOCK_RECENT_ORDERS: Order[] = Array.from({ length: 12 }, (_, i) => ({
  _id: `mock-ord-${i}`,
  orderNumber: `ORD-${(1000 + i).toString(36).toUpperCase()}`,
  user: 'demo-customer',
  items: [
    { foodItem: MOCK_FOOD_ITEMS[i % MOCK_FOOD_ITEMS.length]._id,
      name:     MOCK_FOOD_ITEMS[i % MOCK_FOOD_ITEMS.length].name,
      price:    MOCK_FOOD_ITEMS[i % MOCK_FOOD_ITEMS.length].price,
      quantity: 1 + (i % 3), customizations: [], image: MOCK_FOOD_ITEMS[i % MOCK_FOOD_ITEMS.length].images?.[0]?.url ?? '' }
  ],
  status: (['pending','accepted','preparing','ready','delivered','cancelled'] as const)[i % 6],
  statusHistory: [{ status: 'pending', timestamp: daysAgo(i).toISOString(), note: '' }],
  orderType: i % 3 === 0 ? 'pickup' : 'delivery',
  subtotal: 400 + i * 80,
  tax: 40 + i * 4,
  deliveryFee: i % 3 === 0 ? 0 : 40,
  discount: 0, couponDiscount: 0,
  total: 440 + i * 84,
  paymentStatus: i < 8 ? 'paid' : 'pending',
  paymentMethod: 'stripe',
  createdAt: daysAgo(i).toISOString(),
}));

export const MOCK_SALES_BY_DAY = Array.from({ length: 30 }, (_, i) => ({
  _id: fmt(daysAgo(29 - i)),
  orders: 4 + Math.floor(Math.sin(i * 0.4) * 3 + Math.random() * 5),
  revenue: 1800 + Math.floor(Math.sin(i * 0.3) * 600 + Math.random() * 800),
}));

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRevenue:   284750,
  monthRevenue:   42300,
  todayOrders:    23,
  totalUsers:     1240,
  totalItems:     MOCK_FOOD_ITEMS.length,
  recentOrders:   MOCK_RECENT_ORDERS.slice(0, 5),
  topItems: MOCK_FOOD_ITEMS
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5)
    .map(f => ({ _id: f._id, name: f.name, totalOrders: f.orderCount, revenue: f.price * Math.floor(f.orderCount * 0.8) })),
  salesByDay: MOCK_SALES_BY_DAY,
  ordersByStatus: [
    { _id: 'pending',           count: 8  },
    { _id: 'accepted',          count: 4  },
    { _id: 'preparing',         count: 6  },
    { _id: 'ready',             count: 2  },
    { _id: 'out_for_delivery',  count: 3  },
    { _id: 'delivered',         count: 89 },
    { _id: 'cancelled',         count: 7  },
  ],
};

// Extended stats not in DashboardStats type — used by new cards
export const MOCK_EXTENDED_STATS = {
  todayRevenue:      8240,
  weekRevenue:       38900,
  avgOrderValue:     385,
  pendingOrders:     8,
  completedOrders:   89,
  cancelledOrders:   7,
  totalStaff:        5,
  lowStockItems:     3,
  newCustomersToday: 4,
};
