import { useState, useEffect } from 'react'
import { analyticsService } from '@/services/analytics'
import { RevenueTrendChart } from '@/components/admin/charts/RevenueTrendChart'
import { OrdersTrendChart } from '@/components/admin/charts/OrdersTrendChart'
import { PopularItemsChart } from '@/components/admin/charts/PopularItemsChart'
import { CustomerGrowthChart } from '@/components/admin/charts/CustomerGrowthChart'
import { DashboardSkeleton } from '@/components/common/Skeletons'
import { formatPrice } from '@/utils/format'

type Period = '7d' | '30d' | '90d' | '1y'

export default function AnalyticsPage() {
  const [period, setPeriod]   = useState<Period>('30d')
  const [data, setData]       = useState<any>(null)
  const [sales, setSales]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([analyticsService.getDashboard(), analyticsService.getSales(period)])
      .then(([d, s]) => { setData(d); setSales(s) })
      .finally(() => setLoading(false))
  }, [period])

  const PERIODS: { val: Period; label: string }[] = [
    { val: '7d', label: '7 days' }, { val: '30d', label: '30 days' },
    { val: '90d', label: '90 days' }, { val: '1y', label: '1 year' },
  ]

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Analytics</h1>
        <div className="flex gap-1 bg-canvas-2 rounded-xl p-1">
          {PERIODS.map(p => (
            <button key={p.val} onClick={() => setPeriod(p.val)}
              className={`px-4 py-1.5 rounded-lg font-display text-xs font-medium transition-all ${period === p.val ? 'bg-cream text-espresso shadow-warm-sm' : 'text-ink-3 hover:text-espresso'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',  value: formatPrice(data?.totalRevenue ?? 0) },
          { label: 'Month Revenue',  value: formatPrice(data?.monthRevenue ?? 0) },
          { label: "Today's Orders", value: data?.todayOrders ?? 0 },
          { label: 'Total Customers',value: data?.totalUsers ?? 0 },
        ].map(kpi => (
          <div key={kpi.label} className="card-premium p-5">
            <p className="font-display text-xs text-ink-3 uppercase tracking-widest mb-2">{kpi.label}</p>
            <p className="font-serif text-2xl text-espresso">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h3 className="font-serif text-lg text-espresso mb-4">Revenue Trend</h3>
          <RevenueTrendChart data={sales} />
        </div>
        <div className="card-premium p-6">
          <h3 className="font-serif text-lg text-espresso mb-4">Orders Trend</h3>
          <OrdersTrendChart data={sales} />
        </div>
        <div className="card-premium p-6">
          <h3 className="font-serif text-lg text-espresso mb-4">Order vs Revenue</h3>
          <CustomerGrowthChart data={sales} />
        </div>
        <div className="card-premium p-6">
          <h3 className="font-serif text-lg text-espresso mb-4">Top Selling Items</h3>
          <PopularItemsChart data={data?.topItems ?? []} />
        </div>
      </div>
    </div>
  )
}
