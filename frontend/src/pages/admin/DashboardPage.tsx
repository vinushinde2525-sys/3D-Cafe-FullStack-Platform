import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { analyticsService } from '@/services/analytics'
import { DashboardOverview } from '@/components/admin/DashboardOverview'
import { DashboardSkeleton } from '@/components/common/Skeletons'
import { formatDate } from '@/utils/format'
import { isBackendOnline } from '@/services/backendStatus'
import {
  MOCK_DASHBOARD_STATS,
  MOCK_SALES_BY_DAY,
  MOCK_EXTENDED_STATS,
} from '@/services/mockAnalytics'
import type { DashboardStats } from '@/types'

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null)
  const [sales,   setSales]   = useState<any[]>([])
  const [ext,     setExt]     = useState(MOCK_EXTENDED_STATS)
  const [loading, setLoading] = useState(true)
  const [updated, setUpdated] = useState(new Date())

  const load = async () => {
    setLoading(true)
    if (isBackendOnline()) {
      try {
        const [s, sl] = await Promise.all([
          analyticsService.getDashboard(),
          analyticsService.getSales('30d'),
        ])
        setStats(s); setSales(sl)
        setUpdated(new Date())
        setLoading(false)
        return
      } catch { /* fall through to mock */ }
    }
    // Demo mode — instant, no network
    setStats(MOCK_DASHBOARD_STATS)
    setSales(MOCK_SALES_BY_DAY)
    setExt(MOCK_EXTENDED_STATS)
    setUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Dashboard</h1>
          <p className="font-sans text-sm text-ink-3 mt-0.5">
            Last updated {formatDate(updated.toISOString())}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={load}
          className="flex items-center gap-2 btn-secondary h-9 px-4 text-sm"
        >
          <RefreshCw size={14} />
          Refresh
        </motion.button>
      </div>

      {stats && (
        <DashboardOverview
          stats={stats}
          salesData={sales}
          extStats={ext}
        />
      )}
    </div>
  )
}
