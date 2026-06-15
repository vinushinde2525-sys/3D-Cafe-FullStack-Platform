import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, RefreshCw } from 'lucide-react'
import { orderAPI } from '@/api/services'
import { useCart } from '@/hooks/useCart'
import { OrderTracker } from '@/components/customer/OrderTracker'
import { MotionButton } from '@/components/ui/Button'
import { OrderCardSkeleton } from '@/components/common/Skeletons'
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!id) return
    try {
      const { data } = await orderAPI.getById(id)
      setOrder(data.data)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  const handleStatusChange = useCallback((s: OrderStatus) => {
    setOrder(o => o ? { ...o, status: s } : o)
  }, [])

  const handleReorder = () => {
    if (!order) return
    order.items.forEach(item => {
      if (typeof item.foodItem !== 'string') return
      addToCart({ _id: item.foodItem, name: item.name, price: item.price, images: [{ url: item.image || '', publicId: '' }] } as any, item.quantity, item.customizations as any)
    })
  }

  if (loading) return <div className="pt-24 max-w-3xl mx-auto px-5"><OrderCardSkeleton /></div>
  if (!order) return <div className="pt-24 text-center"><p className="font-sans text-ink-3">Order not found.</p></div>

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-5 md:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/orders" className="flex items-center gap-2 text-ink-3 hover:text-espresso font-display text-sm transition-colors">
            <ArrowLeft size={16} /> My Orders
          </Link>
          <MotionButton onClick={handleReorder} variant="cream" size="sm" pill leftIcon={<RefreshCw size={13} />}>
            Reorder
          </MotionButton>
        </div>

        {/* Order header card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="eyebrow mb-1">{order.orderNumber}</p>
              <h1 className="font-serif text-2xl text-espresso">Order Details</h1>
              <p className="font-sans text-sm text-ink-3 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`text-xs font-display font-semibold px-3 py-1.5 rounded-full border ${getOrderStatusColor(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </span>
          </div>

          {/* Tracker */}
          <OrderTracker order={order} onStatusChange={handleStatusChange} />
        </motion.div>

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-premium p-6">
          <h2 className="font-serif text-lg text-espresso mb-4 flex items-center gap-2"><ShoppingBag size={18} className="text-gold" /> Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 py-3 border-b border-beige/30 last:border-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-canvas-2 flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">☕</div>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-serif text-base text-espresso">{item.name}</p>
                    <p className="font-serif text-base text-espresso">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <p className="font-sans text-xs text-ink-3">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  {item.customizations?.length > 0 && (
                    <p className="font-sans text-xs text-ink-3 mt-0.5">{item.customizations.map((c: any) => c.option).join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Totals */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-premium p-6 space-y-3">
          <h2 className="font-serif text-lg text-espresso mb-4">Bill Summary</h2>
          {[
            { label: 'Subtotal',         value: formatPrice(order.subtotal) },
            { label: 'Tax (5%)',          value: formatPrice(order.tax) },
            { label: 'Delivery',          value: order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee) },
            ...(order.couponDiscount > 0 ? [{ label: `Coupon (${order.couponCode})`, value: `–${formatPrice(order.couponDiscount)}`, green: true }] : []),
          ].map(({ label, value, green }: any) => (
            <div key={label} className="flex justify-between">
              <span className="font-sans text-sm text-ink-2">{label}</span>
              <span className={`font-display text-sm font-medium ${green ? 'text-emerald-600' : 'text-ink'}`}>{value}</span>
            </div>
          ))}
          <div className="border-t border-beige/50 pt-3 flex justify-between">
            <span className="font-serif text-lg text-espresso">Total</span>
            <span className="font-serif text-xl text-espresso">{formatPrice(order.total)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
