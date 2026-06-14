import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '@/api/services'
import { OrderStatusControls } from '@/components/staff/OrderStatusControls'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/utils/format'
import { DashboardSkeleton } from '@/components/common/Skeletons'
import type { Order } from '@/types'

const STATUS_OPTS = ['all','pending','accepted','preparing','ready','out_for_delivery','delivered','cancelled']

export default function StaffOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [status, setStatus]   = useState('all')
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    try {
      const params: any = { limit: 50 }
      if (status !== 'all') params.status = status
      const { data } = await orderAPI.getAll(params)
      setOrders(data.data.orders ?? [])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [status])

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-espresso">Manage Orders</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full font-display text-xs font-medium transition-all capitalize ${s === status ? 'bg-espresso text-cream' : 'bg-cream border border-beige/60 text-ink-2 hover:border-gold/40'}`}>
            {s === 'all' ? 'All' : getOrderStatusLabel(s as any)}
          </button>
        ))}
      </div>

      {loading ? <DashboardSkeleton /> : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="card-premium p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-display text-sm font-semibold text-espresso">{o.orderNumber}</p>
                  <p className="font-sans text-xs text-ink-3">{formatDate(o.createdAt)}</p>
                </div>
                <span className={`text-[10px] font-display font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(o.status)}`}>
                  {getOrderStatusLabel(o.status)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-sans text-sm text-ink-2">{o.items?.length} items · {formatPrice(o.total)}</p>
                <OrderStatusControls orderId={o._id} currentStatus={o.status} onUpdate={fetch} />
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center font-sans text-sm text-ink-3 py-12">No orders found.</p>}
        </div>
      )}
    </div>
  )
}
