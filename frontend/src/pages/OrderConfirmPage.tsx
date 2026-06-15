import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, MapPin, ShoppingBag, Home } from 'lucide-react'
import { LinkButton} from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/utils/format'
import type { Order } from '@/types'

export default function OrderConfirmPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Load from localStorage (placed by CheckoutPage)
    try {
      const history: Order[] = JSON.parse(localStorage.getItem('cafe_orders') || '[]')
      const found = id
        ? history.find(o => o._id === id || o.orderNumber === id)
        : history[0]
      setOrder(found ?? null)
    } catch { setOrder(null) }
  }, [id])

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-lg mx-auto px-5 md:px-8 text-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={48} className="text-emerald-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          <span className="eyebrow text-gold">Order Confirmed!</span>
          <h1 className="font-serif text-4xl text-espresso">Thank you!</h1>
          {order && (
            <p className="font-sans text-base text-ink-3">
              Order <strong className="text-espresso font-display">{order.orderNumber}</strong> has been placed.
            </p>
          )}
          <p className="font-sans text-sm text-ink-3">
            Estimated delivery: <strong className="text-espresso">25–35 minutes</strong>
          </p>
        </motion.div>

        {/* Order detail card */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="card-premium p-6 text-left mb-6 space-y-4"
          >
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-display text-sm font-medium text-amber-600 capitalize">
                  {order.status}
                </span>
              </div>
              <span className="font-sans text-xs text-ink-3">{formatDate(order.createdAt)}</span>
            </div>

            {/* Items */}
            <div className="space-y-2 border-t border-beige/40 pt-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-canvas-2 flex-shrink-0">
                      {(item as any).image
                        ? <img src={(item as any).image} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-sm">☕</div>}
                    </div>
                    <span className="font-sans text-sm text-ink-2">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-ink-3 font-sans">×{item.quantity}</span>
                    <span className="font-display font-medium text-espresso">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-beige/40 pt-4 space-y-2">
              {[
                { label: 'Subtotal',  value: formatPrice(order.subtotal) },
                { label: 'Tax (5%)', value: formatPrice(order.tax) },
                { label: 'Delivery', value: order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="font-sans text-sm text-ink-3">{label}</span>
                  <span className="font-display text-sm text-ink">{value}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-beige/40 pt-2">
                <span className="font-serif text-base text-espresso">Total</span>
                <span className="font-serif text-xl text-espresso">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Delivery info */}
            {order.deliveryAddress?.street && (
              <div className="flex items-start gap-2 p-3 bg-canvas-2 rounded-xl">
                <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <p className="font-sans text-xs text-ink-2">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}
                </p>
              </div>
            )}

            {/* Est. time */}
            <div className="flex items-center gap-2 p-3 bg-canvas-2 rounded-xl">
              <Clock size={14} className="text-gold flex-shrink-0" />
              <p className="font-sans text-xs text-ink-2">Estimated arrival: 25–35 minutes</p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex gap-3 justify-center flex-wrap"
        >
          <LinkButton to="/orders" variant="espresso" pill size="md" leftIcon={<ShoppingBag size={15} />}>
            View Orders
          </LinkButton>
          <LinkButton to="/" variant="cream" pill size="md" leftIcon={<Home size={15} />}>
            Back to Home
          </LinkButton>
        </motion.div>

        <p className="font-sans text-xs text-ink-3 mt-6">
          <span className="text-gold">Demo mode:</span> Order saved locally. No real payment was charged.
        </p>
      </div>
    </div>
  )
}
