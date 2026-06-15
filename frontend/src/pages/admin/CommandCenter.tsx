import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Maximize2, Activity } from 'lucide-react';
import { LiveOrdersBoard } from '@/components/admin/command-center/LiveOrdersBoard';
import { RevenueTodayCard } from '@/components/admin/command-center/RevenueTodayCard';
import { ActiveCustomersCard } from '@/components/admin/command-center/ActiveCustomersCard';
import { StaffStatusBoard } from '@/components/admin/command-center/StaffStatusBoard';
import { LiveSalesChart } from '@/components/admin/command-center/LiveSalesChart';
import { TopSellingItemsCard } from '@/components/admin/command-center/TopSellingItemsCard';
import { InventoryAlerts } from '@/components/admin/command-center/InventoryAlerts';
import { LiveOrdersFeed } from '@/components/realtime/LiveOrdersFeed';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { analyticsService } from '@/services/analytics';
import { inventoryERP } from '@/services/inventoryERPService';
import { staffService } from '@/services/staffService';
import { MOCK_DASHBOARD_STATS, MOCK_EXTENDED_STATS, MOCK_SALES_BY_DAY } from '@/services/mockAnalytics';
import { MOCK_INVENTORY } from '@/services/mockInventory';
import { MOCK_EMPLOYEES } from '@/services/mockStaff';
import { isBackendOnline } from '@/services/backendStatus';

export default function CommandCenter() {
  const [data,      setData]      = useState<any>(null);
  const [sales,     setSales]     = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [fullscreen,  setFullscreen]  = useState(false);

  const load = useCallback(async () => {
    try {
      if (isBackendOnline()) {
        const [d, s, inv, emp] = await Promise.all([
          analyticsService.getDashboard(),
          analyticsService.getSales('7d'),
          inventoryERP.getLowStock(),
          staffService.getAll(),
        ]);
        setData(d); setSales(s); setInventory(inv); setEmployees(emp);
      } else {
        setData(MOCK_DASHBOARD_STATS);
        setSales(MOCK_SALES_BY_DAY.slice(-12));
        setInventory(MOCK_INVENTORY.filter(i => i.currentStock <= i.minimumStock));
        setEmployees(MOCK_EMPLOYEES);
      }
      setLastRefresh(new Date());
    } catch {
      setData(MOCK_DASHBOARD_STATS);
      setSales(MOCK_SALES_BY_DAY.slice(-12));
      setInventory(MOCK_INVENTORY.filter(i => i.currentStock <= i.minimumStock));
      setEmployees(MOCK_EMPLOYEES);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh every 60s
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, [load]);

  if (loading) return <DashboardSkeleton />;

  const stats = data ?? MOCK_DASHBOARD_STATS;
  const ext   = MOCK_EXTENDED_STATS;

  return (
    <div className={`space-y-5 ${fullscreen ? 'fixed inset-0 z-50 bg-canvas overflow-auto p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-espresso flex items-center justify-center">
            <Activity size={16} className="text-cream" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-espresso">Command Center</h1>
            <p className="font-sans text-xs text-ink-3">
              Live · Updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {/* Live pulse */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display text-[10px] text-emerald-700">LIVE</span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={load} className="btn-secondary h-9 px-3 gap-1.5 text-sm">
            <RefreshCw size={13} /> Refresh
          </motion.button>
          <button onClick={() => setFullscreen(f => !f)}
            className="btn-secondary h-9 px-3">
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueTodayCard todayRevenue={ext.todayRevenue} weekRevenue={ext.weekRevenue} monthRevenue={stats.monthRevenue} />
        <ActiveCustomersCard totalUsers={stats.totalUsers} todayOrders={stats.todayOrders} pendingOrders={ext.pendingOrders} />
        <StaffStatusBoard employees={employees} />
        <InventoryAlerts items={inventory} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Live orders board - 2 cols */}
        <div className="xl:col-span-2">
          <LiveOrdersBoard recentOrders={stats.recentOrders ?? []} />
        </div>
        {/* Live feed - socket-driven */}
        <div>
          <LiveOrdersFeed />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LiveSalesChart data={sales} />
        <TopSellingItemsCard items={stats.topItems ?? []} />
      </div>
    </div>
  );
}
