import { useState, useEffect } from 'react';
import { Download, TrendingUp, Package, Users as UsersIcon } from 'lucide-react';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { analyticsService } from '@/services/analytics';
import { orderAPI } from '@/api/services';
import { inventoryERP } from '@/services/inventoryERPService';
import { loyaltyService } from '@/services/loyaltyService';
import { staffService } from '@/services/staffService';
import { formatPrice } from '@/utils/format';

type ReportType = 'orders' | 'revenue' | 'stock' | 'customers' | 'staff';

const REPORTS: { type: ReportType; label: string; description: string; icon: React.ReactNode }[] = [
  { type: 'orders',    label: 'Orders Report',    description: 'All orders with status, items, and totals', icon: <Package size={20} /> },
  { type: 'revenue',   label: 'Revenue Report',    description: 'Sales and revenue trends over time',        icon: <TrendingUp size={20} /> },
  { type: 'stock',     label: 'Inventory Report',  description: 'Stock levels, costs, and supplier data',     icon: <Package size={20} /> },
  { type: 'customers', label: 'Customer Report',   description: 'Customer accounts and loyalty data',         icon: <UsersIcon size={20} /> },
  { type: 'staff',     label: 'Staff Report',      description: 'Employee roster and payroll basics',         icon: <UsersIcon size={20} /> },
];

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [sales, setSales]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [fetchingReport, setFetchingReport] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([analyticsService.getDashboard(), analyticsService.getSales('30d')])
      .then(([d, s]) => { setSummary(d); setSales(s); })
      .finally(() => setLoading(false));
  }, []);

  const openReport = async (type: ReportType) => {
    setFetchingReport(true);
    try {
      let data: any[] = [];
      if (type === 'orders')    { const { data: d } = await orderAPI.getAll({ limit: 200 }); data = d.data.orders ?? []; }
      if (type === 'stock')     data = await inventoryERP.getAll();
      if (type === 'customers') data = await loyaltyService.getCustomers();
      if (type === 'staff')     data = await staffService.getAll();
      setReportData(data);
      setActiveReport(type);
    } finally { setFetchingReport(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-espresso">Reports</h1>

      {loading ? <DashboardSkeleton /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-premium p-4">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Total Revenue</p>
            <p className="font-serif text-lg text-espresso mt-1">{formatPrice(summary?.totalRevenue ?? 0)}</p>
          </div>
          <div className="card-premium p-4">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">This Month</p>
            <p className="font-serif text-lg text-espresso mt-1">{formatPrice(summary?.monthRevenue ?? 0)}</p>
          </div>
          <div className="card-premium p-4">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Today's Orders</p>
            <p className="font-serif text-lg text-espresso mt-1">{summary?.todayOrders ?? 0}</p>
          </div>
          <div className="card-premium p-4">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Total Customers</p>
            <p className="font-serif text-lg text-espresso mt-1">{summary?.totalUsers ?? 0}</p>
          </div>
        </div>
      )}

      <div className="card-premium p-6">
        <p className="font-sans text-sm text-ink-2 mb-4">Generate a downloadable report (Excel or PDF where supported):</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REPORTS.map(r => (
            <button key={r.type} onClick={() => r.type === 'revenue' ? setActiveReport('revenue') : openReport(r.type)}
              disabled={fetchingReport}
              className="flex items-center gap-3 p-4 rounded-xl border border-beige/40 hover:border-gold/40 transition-all text-left disabled:opacity-50">
              <div className="w-10 h-10 rounded-xl bg-espresso/5 text-espresso/70 flex items-center justify-center flex-shrink-0">
                {r.icon}
              </div>
              <div className="flex-1">
                <p className="font-display text-sm text-espresso">{r.label}</p>
                <p className="font-sans text-xs text-ink-3">{r.description}</p>
              </div>
              <Download size={16} className="text-ink-3 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <ExcelExportModal
        isOpen={!!activeReport}
        onClose={() => { setActiveReport(null); setReportData([]); }}
        type={activeReport ?? 'orders'}
        data={reportData}
        salesData={sales}
        label={REPORTS.find(r => r.type === activeReport)?.label}
      />
    </div>
  );
}
