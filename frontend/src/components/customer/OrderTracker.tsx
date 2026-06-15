import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, ChefHat, Package, Bike, Home } from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import { formatDate } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'pending',          label: 'Order Placed',      icon: <Clock size={16} />    },
  { status: 'accepted',         label: 'Accepted',          icon: <CheckCircle size={16} />},
  { status: 'preparing',        label: 'Preparing',         icon: <ChefHat size={16} />  },
  { status: 'ready',            label: 'Ready',             icon: <Package size={16} />  },
  { status: 'out_for_delivery', label: 'Out for Delivery',  icon: <Bike size={16} />     },
  { status: 'delivered',        label: 'Delivered',         icon: <Home size={16} />     },
]

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0, accepted: 1, preparing: 2, ready: 3, out_for_delivery: 4, delivered: 5,
  cancelled: -1, rejected: -1,
}

interface Props { order: Order; onStatusChange?: (status: OrderStatus) => void }

export const OrderTracker = ({ order, onStatusChange }: Props) => {
  const { trackOrder, onOrderStatusUpdate } = useSocket()
  const currentStep = STATUS_ORDER[order.status] ?? 0

  useEffect(() => {
    trackOrder(order._id)
    const unsub = onOrderStatusUpdate((data) => {
      if (data.orderId === order._id) onStatusChange?.(data.status as OrderStatus)
    })
    return () => { unsub() }
  }, [order._id, trackOrder, onOrderStatusUpdate, onStatusChange])

  if (['cancelled', 'rejected'].includes(order.status)) {
    return (
      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-center">
        <p className="font-serif text-lg text-red-700">Order {order.status === 'cancelled' ? 'Cancelled' : 'Rejected'}</p>
        <p className="font-sans text-sm text-red-500 mt-1">
          {order.statusHistory?.find(h => h.status === order.status)?.note || 'Contact support for assistance.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="relative">
        {/* Track line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-beige/60" />
        <motion.div
          className="absolute top-5 left-5 h-0.5 bg-gold origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.max(0, currentStep) / (STEPS.length - 1) }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ right: 20 }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <motion.div
                key={step.status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.div
                  animate={active ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                    done   ? 'bg-gold border-gold text-cream' :
                    active ? 'bg-espresso border-espresso text-cream shadow-gold' :
                             'bg-cream border-beige text-ink-3'
                  }`}
                >
                  {done ? <CheckCircle size={16} /> : step.icon}
                </motion.div>
                <span className={`font-display text-[10px] text-center leading-tight max-w-[60px] ${active ? 'text-espresso font-semibold' : done ? 'text-gold' : 'text-ink-3'}`}>
                  {step.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Timeline history */}
      {order.statusHistory?.length > 0 && (
        <div className="space-y-3">
          {[...order.statusHistory].reverse().map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-gold' : 'bg-beige'}`} />
              <div>
                <p className="font-display text-sm font-medium text-espresso capitalize">{h.status.replace(/_/g, ' ')}</p>
                {h.note && <p className="font-sans text-xs text-ink-3">{h.note}</p>}
                <p className="font-sans text-xs text-ink-3/60 mt-0.5">{formatDate(h.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderTracker
