import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CustomerProfileCard } from '@/components/admin/customers/CustomerProfileCard';
import { CustomerRewardHistory } from '@/components/admin/customers/CustomerRewardHistory';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { loyaltyService } from '@/services/loyaltyService';
import type { CustomerProfile, LoyaltyPoint } from '@/types/crm';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [history, setHistory]   = useState<LoyaltyPoint[]>([]);
  const [loading, setLoading]   = useState(true);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, h] = await Promise.all([loyaltyService.getCustomer(id), loyaltyService.getLoyaltyHistory(id)]);
      setCustomer(c); setHistory(h);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="inline-flex items-center gap-1.5 font-display text-xs text-ink-3 hover:text-espresso">
        <ArrowLeft size={14} /> Back to Customers
      </Link>

      {loading || !customer ? <DashboardSkeleton /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CustomerProfileCard customer={customer} onUpdate={fetchAll} />
          </div>
          <div className="lg:col-span-2">
            <div className="card-premium p-5">
              <h2 className="font-serif text-base text-espresso mb-4">Reward History</h2>
              <CustomerRewardHistory events={history} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
