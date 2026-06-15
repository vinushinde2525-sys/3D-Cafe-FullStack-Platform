import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle } from 'lucide-react'
import { orderAPI } from '@/api/services'
import { MotionButton } from '@/components/ui/Button'
import { formatPrice } from '@/utils/format'
import type { Order } from '@/types'
import toast from 'react-hot-toast'

interface Props { order: Order; onUpdate: () => void }

const elapsed = (created: string) => {
  const mins = Math.floor((Date.now() - new Date(created).getTime()) / 60000)
  return mins
}

const urgencyColor = (mins: number) =>
  mins > 25 ? 'border-red-400 bg-red-50' :
  mins > 15 ? 'border-amber-400 bg-amber-50' :
              'border-beige/50 bg-cream'

const TRANSITIONS: Record<string, string[]> = {
  pending:   ['accepted', 'rejected'],
  accepted:  ['preparing'],
  preparing: ['ready'],
  ready:     ['out_for_delivery', 'delivered'],
}

const LABELS: Record<string, string> = {
  accepted: 'Accept', preparing: 'Start Cooking', ready: 'Mark Ready',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', rejected: 'Reject',
}

export const KitchenOrderCard = ({ order, onUpdate }: Props) => {
  const [loading, setLoading] = useState<string | null>(null)
  const mins = elapsed(order.createdAt)
  const next = TRANSITIONS[order.status] || []

  const updateStatus = async (status: string) => {
    setLoading(status)
    try {
      await orderAPI.updateStatus(order._id, status)
      toast.success(`Order ${order.orderNumber} → ${status.replace(/_/g, ' ')}`)
      onUpdate()
    } catch { toast.error('Update failed') }
    finally { setLoading(null) }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className={`border-2 rounded-2xl overflow-hidden shadow-warm-sm ${urgencyColor(mins)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-beige/30">
        <div>
          <p className="font-display text-sm font-semibold text-espresso">{order.orderNumber}</p>
          <p className="font-sans text-xs text-ink-3 capitalize">{order.orderType}</p>
        </div>
        <div className="flex items-center gap-2">
          {mins > 15 && <AlertTriangle size={14} className={mins > 25 ? 'text-red-500' : 'text-amber-500'} />}
          <div className="flex items-center gap-1 text-xs font-display font-medium text-ink-2">
            <Clock size={12} className="text-gold" />
            {mins}m
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-1.5 max-h-40 overflow-y-auto scrollbar-none">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="font-sans text-ink-2 truncate max-w-[60%]">{item.name}</span>
            <span className="font-display font-semibold text-espresso ml-2">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Special instructions */}
      {order.specialInstructions && (
        <div className="mx-4 mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="font-sans text-xs text-amber-700">📝 {order.specialInstructions}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-beige/30 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-sans text-ink-3">Total</span>
          <span className="font-display font-semibold text-espresso">{formatPrice(order.total)}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {next.map(status => (
            <MotionButton
              key={status}
              onClick={() => updateStatus(status)}
              isLoading={loading === status}
              variant={status === 'rejected' ? 'destructive' : 'espresso'}
              size="sm"
              pill
              className="flex-1 min-w-0 text-xs"
            >
              {loading === status ? '…' : LABELS[status] || status}
            </MotionButton>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default KitchenOrderCard
