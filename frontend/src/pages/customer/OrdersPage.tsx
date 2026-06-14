import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronRight, RefreshCw } from 'lucide-react'
import { orderAPI } from '@/api/services'
import { Badge } from '@/components/ui/Badge'
import { MotionButton, LinkButton} from '@/components/ui/Button'
import { OrderCardSkeleton } from '@/components/common/Skeletons'
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/utils/format'
import { isBackendOnline } from '@/services/backendStatus'
import type { Order } from '@/types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetch = async (p = 1) => {
    setLoading(true)
    if (isBackendOnline()) {
      try {
        const { data } = await orderAPI.getMyOrders({ page: p, limit: 10 })
        const list = data.data.orders ?? []
        if (list.length > 0) {
          setOrders(prev => p === 1 ? list : [...prev, ...list])
          setHasMore(p < data.data.pages)
          setLoading(false)
          return
        }
      } catch { /* backend offline — fall through */ }
    }
    // Fallback: load from localStorage (demo orders)
    try {
      const stored: Order[] = JSON.parse(localStorage.getItem('cafe_orders') || '[]')
      setOrders(stored)
      setHasMore(false)
    } catch { setOrders([]) }
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="eyebrow">My account</span>
          <h1 className="font-serif text-display text-espresso mt-1">Order History</h1>
        </motion.div>

        {loading && orders.length === 0 ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <OrderCardSkeleton key={i} />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={52} className="text-beige mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-espresso mb-2">No orders yet</h3>
            <p className="font-sans text-sm text-ink-3 mb-8">Your order history will appear here.</p>
            <LinkButton to="/menu" variant="espresso" pill size="lg">Browse Menu</LinkButton>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/orders/${order._id}`} className="block card-premium p-5 hover:shadow-warm transition-shadow group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-display text-sm font-semibold text-espresso">{order.orderNumber}</p>
                      <p className="font-sans text-xs text-ink-3 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-display font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <ChevronRight size={16} className="text-ink-3 group-hover:text-espresso transition-colors" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-sm text-ink-2">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                    <p className="font-serif text-lg text-espresso">{formatPrice(order.total)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
            {hasMore && (
              <div className="text-center pt-4">
                <MotionButton onClick={() => { setPage(p => p + 1); fetch(page + 1) }} variant="cream" size="md" pill isLoading={loading} leftIcon={<RefreshCw size={14} />}>
                  Load More
                </MotionButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
