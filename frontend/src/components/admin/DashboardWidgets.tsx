import { RevenueCard } from './RevenueCard';
import { OrdersCard } from './OrdersCard';
import { InventoryCard } from './InventoryCard';
import { CustomerCard } from './CustomerCard';
import { QuickActions } from './QuickActions';
import { ActivityFeed } from './ActivityFeed';
import type { DashboardStats } from '@/types';

interface Props {
  stats: DashboardStats;
  extStats: {
    todayRevenue: number; weekRevenue: number; avgOrderValue: number;
    pendingOrders: number; completedOrders: number; cancelledOrders: number;
    totalStaff: number; lowStockItems: number; newCustomersToday: number;
  };
  lowStockItems?: any[];
}

export const DashboardWidgets = ({ stats, extStats, lowStockItems = [] }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {/* Row 1: Revenue + Orders + Quick Actions */}
    <RevenueCard data={stats.salesByDay} />
    <OrdersCard  ordersByStatus={stats.ordersByStatus} todayOrders={stats.todayOrders} />
    <QuickActions />

    {/* Row 2: Inventory + Customers + Activity */}
    <InventoryCard
      items={lowStockItems}
      totalItems={stats.totalItems}
    />
    <CustomerCard
      totalUsers={stats.totalUsers}
      newToday={extStats.newCustomersToday}
      newThisWeek={Math.round(extStats.newCustomersToday * 5)}
    />
    <ActivityFeed orders={stats.recentOrders} />
  </div>
);
