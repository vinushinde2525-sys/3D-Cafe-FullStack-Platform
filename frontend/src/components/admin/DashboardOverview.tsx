import { motion } from 'framer-motion';
import { DashboardStats } from './DashboardStats';
import { DashboardWidgets } from './DashboardWidgets';
import { DashboardMetrics } from './DashboardMetrics';
import type { DashboardStats as DashStats } from '@/types';

interface ExtStats {
  todayRevenue: number; weekRevenue: number; avgOrderValue: number;
  pendingOrders: number; completedOrders: number; cancelledOrders: number;
  totalStaff: number; lowStockItems: number; newCustomersToday: number;
}

interface Props {
  stats: DashStats;
  salesData: any[];
  extStats: ExtStats;
  lowStockItems?: any[];
}

export const DashboardOverview = ({ stats, salesData, extStats, lowStockItems = [] }: Props) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    {/* All metric cards */}
    <DashboardStats
      todayRevenue={extStats.todayRevenue}
      weekRevenue={extStats.weekRevenue}
      monthRevenue={stats.monthRevenue}
      totalRevenue={stats.totalRevenue}
      todayOrders={stats.todayOrders}
      pendingOrders={extStats.pendingOrders}
      completedOrders={extStats.completedOrders}
      cancelledOrders={extStats.cancelledOrders}
      totalUsers={stats.totalUsers}
      totalStaff={extStats.totalStaff}
      newCustomersToday={extStats.newCustomersToday}
      avgOrderValue={extStats.avgOrderValue}
      lowStockItems={extStats.lowStockItems}
      totalItems={stats.totalItems}
    />

    {/* Widget grid: revenue sparkline, orders donut, inventory, customers, activity */}
    <DashboardWidgets stats={stats} extStats={extStats} lowStockItems={lowStockItems} />

    {/* Charts: revenue trend, orders trend, top items */}
    <DashboardMetrics
      salesData={salesData}
      topItems={stats.topItems}
      ordersByStatus={stats.ordersByStatus}
    />
  </motion.div>
);
