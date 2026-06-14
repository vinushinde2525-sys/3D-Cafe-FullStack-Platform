import { useState, useEffect } from 'react'
import { orderAPI } from '@/api/services'
import { OrderStatusControls } from '@/components/staff/OrderStatusControls'
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/utils/format'
import { DashboardSkeleton } from '@/components/common/Skeletons'
import type { Order } from '@/types'

const STATUS_OPTS = ['all','pending','accepted','preparing','ready','out_for_delivery','delivered','cancelled','rejected']

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [status, setStatus]   = useState('all')
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [total, setTotal]     = useState(0)

  const fetch = async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 20 }
      if (status !== 'all') params.status = status
      const { data } = await orderAPI.getAll(params)
      setOrders(data.data.orders ?? []); setTotal(data.data.total ?? 0)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [status, page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Orders <span className="font-sans text-base text-ink-3 ml-2">({total})</span></h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTS.map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-1.5 rounded-full font-display text-xs font-medium transition-all capitalize ${s === status ? 'bg-espresso text-cream' : 'bg-cream border border-beige/60 text-ink-2 hover:border-gold/40'}`}>
            {s === 'all' ? 'All' : getOrderStatusLabel(s as any)}
          </button>
        ))}
      </div>
      {loading ? <DashboardSkeleton /> : (
        <div className="card-premium overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-beige/40 bg-canvas-2">
              <tr>{['Order','Customer','Items','Total','Status','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-display text-xs text-ink-3 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-beige/20">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-canvas-2/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-display text-sm font-semibold text-espresso">{o.orderNumber}</p>
                    <p className="font-sans text-xs text-ink-3">{formatDate(o.createdAt)}</p>
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-ink-2">
                    {typeof o.user === 'object' ? (o.user as any).name : '—'}
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-ink-3">{o.items?.length}</td>
                  <td className="px-4 py-4 font-serif text-base text-espresso">{formatPrice(o.total)}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-display font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(o.status)}`}>
                      {getOrderStatusLabel(o.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusControls orderId={o._id} currentStatus={o.status} onUpdate={fetch} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center font-sans text-sm text-ink-3 py-12">No orders found.</p>}
        </div>
      )}
    </div>
  )
}
