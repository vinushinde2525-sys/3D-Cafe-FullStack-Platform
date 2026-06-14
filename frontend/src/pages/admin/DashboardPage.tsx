import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { analyticsService } from '@/services/analytics'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import { DashboardMetrics } from '@/components/admin/DashboardMetrics'
import { DashboardSkeleton } from '@/components/common/Skeletons'
import { formatDate } from '@/utils/format'
import type { DashboardStats } from '@/types'

export default function AdminDashboard() {
  const [stats, setStats]   = useState<DashboardStats | null>(null)
  const [sales, setSales]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([analyticsService.getDashboard(), analyticsService.getSales('30d')])
      .then(([s, sl]) => { setStats(s); setSales(sl) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-serif text-2xl text-espresso">Dashboard</h1>
        <p className="font-sans text-sm text-ink-3 mt-1">Last updated {formatDate(new Date().toISOString())}</p>
      </div>

      {stats && (
        <>
          <AdminStatsCards
            totalRevenue={stats.totalRevenue}
            monthRevenue={stats.monthRevenue}
            todayOrders={stats.todayOrders}
            totalUsers={stats.totalUsers}
            totalItems={stats.totalItems}
          />

          <DashboardMetrics salesData={sales} topItems={stats.topItems} ordersByStatus={stats.ordersByStatus} />

          {/* Recent orders */}
          <div className="card-premium p-6">
            <h3 className="font-serif text-lg text-espresso mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {stats.recentOrders?.map((o: any) => (
                <motion.div key={o._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between py-3 border-b border-beige/30 last:border-0">
                  <div>
                    <p className="font-display text-sm font-semibold text-espresso">{o.orderNumber}</p>
                    <p className="font-sans text-xs text-ink-3">{typeof o.user === 'object' ? o.user.name : o.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-base text-espresso">₹{o.total?.toLocaleString('en-IN')}</p>
                    <p className="font-display text-xs capitalize text-ink-3">{o.status?.replace(/_/g,' ')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
