import { useState, useEffect, useCallback } from 'react';
import { Users, TrendingUp, Star, Award, Download } from 'lucide-react';
import { CustomerTable } from '@/components/admin/customers/CustomerTable';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { MotionButton } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { loyaltyService } from '@/services/loyaltyService';
import { formatPrice } from '@/utils/format';
import type { CustomerProfile, CRMStats } from '@/types/crm';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [stats, setStats]         = useState<CRMStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [exportOpen, setExportOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([loyaltyService.getCustomers(), loyaltyService.getCRMStats()]);
      setCustomers(c); setStats(s);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const cards = stats ? [
    { label: 'Total Customers',   value: stats.totalCustomers.toLocaleString(), icon: <Users size={16} />,      bg: 'bg-gold/10',    accent: 'text-gold' },
    { label: 'New This Month',    value: stats.newThisMonth,                    icon: <TrendingUp size={16} />, bg: 'bg-emerald-50', accent: 'text-emerald-600' },
    { label: 'Returning Rate',    value: `${stats.returningRate}%`,             icon: <Award size={16} />,      bg: 'bg-blue-50',    accent: 'text-blue-600' },
    { label: 'Avg Lifetime Value',value: formatPrice(stats.avgLifetimeValue),   icon: <Star size={16} />,       bg: 'bg-violet-50',  accent: 'text-violet-600' },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Customers — CRM</h1>
        <MotionButton onClick={() => setExportOpen(true)} variant="cream" size="sm" pill leftIcon={<Download size={14} />}>
          Export
        </MotionButton>
      </div>

      {loading && !stats ? <DashboardSkeleton /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(c => (
            <div key={c.label} className="card-premium p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} ${c.accent}`}>{c.icon}</div>
              <div>
                <p className="font-serif text-lg text-espresso">{c.value}</p>
                <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card-premium overflow-hidden p-5">
        {loading ? <DashboardSkeleton /> : <CustomerTable customers={customers} onUpdate={fetchAll} />}
      </div>

      <ExcelExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        type="customers"
        label="Customers"
        data={customers.map(c => ({
          name: c.name, email: c.email, phone: c.phone, role: c.role,
          isVerified: c.isVerified, isBlocked: c.isBlocked,
          loyaltyPoints: c.loyaltyPoints, totalOrders: c.totalOrders,
          totalSpent: c.totalSpent, createdAt: c.joinedAt,
        }))}
      />
    </div>
  );
}
