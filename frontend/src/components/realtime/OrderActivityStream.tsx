import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, ChefHat, Package, Bike, CheckCircle,
  ShoppingBag, XCircle, AlertTriangle, Circle
} from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import { useAppSelector } from '@/store'
import { formatRelative } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { OrderStatus } from '@/types'

// ── Status icon & style map ───────────────────────────────────────────────────
const STATUS_META: Record<OrderStatus, { icon: React.ReactNode; label: string; ring: string; text: string }> = {
  pending:          { icon: <Clock size={13} />,         label: 'Order Placed',      ring: 'ring-amber-300',   text: 'text-amber-600'  },
  accepted:         { icon: <ShoppingBag size={13} />,   label: 'Accepted',          ring: 'ring-blue-300',    text: 'text-blue-600'   },
  preparing:        { icon: <ChefHat size={13} />,       label: 'In Kitchen',        ring: 'ring-orange-300',  text: 'text-orange-600' },
  ready:            { icon: <Package size={13} />,       label: 'Ready',             ring: 'ring-emerald-400', text: 'text-emerald-600'},
  out_for_delivery: { icon: <Bike size={13} />,          label: 'Out for Delivery',  ring: 'ring-purple-300',  text: 'text-purple-600' },
  delivered:        { icon: <CheckCircle size={13} />,   label: 'Delivered',         ring: 'ring-emerald-500', text: 'text-emerald-700'},
  cancelled:        { icon: <XCircle size={13} />,       label: 'Cancelled',         ring: 'ring-red-300',     text: 'text-red-600'    },
  rejected:         { icon: <AlertTriangle size={13} />, label: 'Rejected',          ring: 'ring-red-400',     text: 'text-red-700'    },
}

interface StreamEntry {
  id:          string
  orderId:     string
  orderNumber: string
  status:      OrderStatus
  note?:       string
  timestamp:   Date
  isNew:       boolean
}

interface Props {
  /** If supplied, shows only events for this order (customer view) */
  orderId?:     string
  /** Max entries to keep before trimming */
  maxEntries?:  number
  showHeader?:  boolean
  compact?:     boolean
  className?:   string
}

export const OrderActivityStream = ({
  orderId,
  maxEntries  = 100,
  showHeader  = true,
  compact     = false,
  className,
}: Props) => {
  const { isAuthenticated } = useAppSelector(s => s.auth)
  const { onOrderStatusUpdate, trackOrder } = useSocket()

  const [entries, setEntries]   = useState<StreamEntry[]>([])
  const [total, setTotal]       = useState(0)
  const containerRef            = useRef<HTMLDivElement>(null)

  const push = useCallback((e: Omit<StreamEntry, 'id' | 'isNew'>) => {
    const entry: StreamEntry = { ...e, id: `${Date.now()}-${Math.random()}`, isNew: true }
    setEntries(prev => [entry, ...prev].slice(0, maxEntries))
    setTotal(n => n + 1)
    // Clear "new" flag after animation
    setTimeout(() => {
      setEntries(prev => prev.map(x => x.id === entry.id ? { ...x, isNew: false } : x))
    }, 1500)
  }, [maxEntries])

  // Track specific order if orderId provided (customer order tracking page)
  useEffect(() => {
    if (orderId) trackOrder(orderId)
  }, [orderId, trackOrder])

  // Subscribe to status events
  useEffect(() => {
    if (!isAuthenticated) return

    const unsub = onOrderStatusUpdate(data => {
      if (orderId && data.orderId !== orderId) return // filter for specific order
      push({
        orderId:     data.orderId,
        orderNumber: data.orderNumber,
        status:      data.status as OrderStatus,
        note:        data.note,
        timestamp:   new Date(data.timestamp || Date.now()),
      })
    })

    return unsub
  }, [isAuthenticated, orderId, onOrderStatusUpdate, push])

  if (!isAuthenticated) return null

  return (
    <div className={cn('space-y-3', className)}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle size={8} className="text-emerald-500 fill-emerald-500" />
            <span className="font-display text-xs font-semibold text-ink-2 uppercase tracking-wider">
              Activity Stream
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-ink-3">{total} events</span>
            {entries.length > 0 && (
              <button
                onClick={() => { setEntries([]); setTotal(0) }}
                className="font-display text-xs text-ink-3 hover:text-espresso transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stream list */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-y-auto scrollbar-none',
          compact ? 'max-h-64' : 'max-h-[420px]'
        )}
      >
        {/* Vertical timeline rail */}
        {entries.length > 1 && (
          <div className="absolute left-[22px] top-6 bottom-6 w-px bg-beige/60 pointer-events-none" />
        )}

        <AnimatePresence initial={false}>
          {entries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <ChefHat size={32} className="text-beige mx-auto mb-3" />
              <p className="font-sans text-sm text-ink-3">No activity yet.</p>
              <p className="font-sans text-xs text-ink-3/60 mt-1">Events appear here in real time.</p>
            </motion.div>
          ) : (
            entries.map((entry, i) => {
              const meta = STATUS_META[entry.status] ?? STATUS_META.pending
              const isLast = i === entries.length - 1

              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: -16, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="flex gap-3 pb-4"
                >
                  {/* Status dot / icon */}
                  <div className="flex-shrink-0 flex flex-col items-center z-10">
                    <motion.div
                      animate={entry.isNew ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center ring-2 flex-shrink-0',
                        'bg-cream shadow-warm-sm',
                        meta.ring,
                        meta.text
                      )}
                    >
                      {meta.icon}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={cn(
                    'flex-1 min-w-0 pt-2.5',
                    !isLast && !compact && 'pb-1'
                  )}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={cn('font-display text-sm font-semibold', meta.text)}>
                          {meta.label}
                        </span>
                        {!orderId && entry.orderNumber && (
                          <span className="font-display text-xs text-ink-3 ml-2">
                            {entry.orderNumber}
                          </span>
                        )}
                        {entry.isNew && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-gold/15 text-gold font-display text-[9px] font-bold uppercase tracking-wider"
                          >
                            NEW
                          </motion.span>
                        )}
                      </div>
                      <span className="font-sans text-[10px] text-ink-3 flex-shrink-0 mt-0.5">
                        {formatRelative(entry.timestamp)}
                      </span>
                    </div>

                    {entry.note && !compact && (
                      <p className="font-sans text-xs text-ink-3 mt-1 leading-relaxed">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OrderActivityStream
