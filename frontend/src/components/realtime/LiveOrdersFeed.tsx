import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChefHat, Bike, Clock, AlertTriangle, Wifi, WifiOff } from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import { useAppSelector } from '@/store'
import { formatPrice } from '@/utils/format'
import { cn } from '@/utils/cn'

// ── Event types ───────────────────────────────────────────────────────────────
type EventKind = 'new_order' | 'status_change' | 'kitchen_alert' | 'delivery' | 'system'

interface FeedEvent {
  id:          string
  kind:        EventKind
  orderNumber: string
  title:       string
  detail:      string
  time:        Date
  meta?:       Record<string, unknown>
}

// ── Visual config per event kind ──────────────────────────────────────────────
const EVENT_CONFIG: Record<EventKind, { icon: React.ReactNode; color: string; dot: string }> = {
  new_order:      { icon: <ShoppingBag size={14} />,  color: 'text-amber-600 bg-amber-50 border-amber-200',  dot: 'bg-amber-400'  },
  status_change:  { icon: <ChefHat size={14} />,      color: 'text-blue-600 bg-blue-50 border-blue-200',     dot: 'bg-blue-400'   },
  kitchen_alert:  { icon: <AlertTriangle size={14} />,color: 'text-red-600 bg-red-50 border-red-300',        dot: 'bg-red-500'    },
  delivery:       { icon: <Bike size={14} />,          color: 'text-purple-600 bg-purple-50 border-purple-200', dot: 'bg-purple-400' },
  system:         { icon: <Clock size={14} />,         color: 'text-ink-3 bg-canvas-2 border-beige/50',      dot: 'bg-beige'      },
}

const STATUS_TO_KIND: Record<string, EventKind> = {
  pending:          'new_order',
  accepted:         'status_change',
  preparing:        'status_change',
  ready:            'kitchen_alert',
  out_for_delivery: 'delivery',
  delivered:        'delivery',
  cancelled:        'system',
  rejected:         'kitchen_alert',
}

interface Props {
  maxItems?:    number
  autoScroll?:  boolean
  compact?:     boolean
  className?:   string
}

// ── Component ─────────────────────────────────────────────────────────────────
export const LiveOrdersFeed = ({
  maxItems   = 50,
  autoScroll = true,
  compact    = false,
  className,
}: Props) => {
  const { isAuthenticated } = useAppSelector(s => s.auth)
  const { isConnected, onNewOrder, onOrderUpdated, onOrderStatusUpdate, joinKitchen } = useSocket()

  const [events, setEvents]   = useState<FeedEvent[]>([])
  const [paused, setPaused]   = useState(false)
  const [unseen, setUnseen]   = useState(0)
  const scrollRef             = useRef<HTMLDivElement>(null)
  const pausedRef             = useRef(paused)

  useEffect(() => { pausedRef.current = paused }, [paused])

  // ── Push new event ──────────────────────────────────────────────────────────
  const push = useCallback((e: Omit<FeedEvent, 'id' | 'time'>) => {
    const event: FeedEvent = { ...e, id: `${Date.now()}-${Math.random()}`, time: new Date() }
    setEvents(prev => [event, ...prev].slice(0, maxItems))
    if (pausedRef.current) setUnseen(n => n + 1)
  }, [maxItems])

  // ── Socket subscriptions ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return

    joinKitchen()

    const unNew = onNewOrder(d =>
      push({
        kind:        'new_order',
        orderNumber: d.orderNumber,
        title:       'New Order Received',
        detail:      `${d.itemCount} item${d.itemCount !== 1 ? 's' : ''} · ${formatPrice(d.total)}`,
        meta:        d,
      })
    )

    const unUpd = onOrderUpdated(d =>
      push({
        kind:        STATUS_TO_KIND[d.status] ?? 'status_change',
        orderNumber: d.orderId,
        title:       'Order Updated',
        detail:      d.status.replace(/_/g, ' '),
        meta:        d,
      })
    )

    const unStatus = onOrderStatusUpdate(d =>
      push({
        kind:        STATUS_TO_KIND[d.status] ?? 'status_change',
        orderNumber: d.orderNumber,
        title:       `Status → ${d.status.replace(/_/g, ' ')}`,
        detail:      d.note || '',
        meta:        d,
      })
    )

    return () => { unNew(); unUpd(); unStatus() }
  }, [isAuthenticated, joinKitchen, onNewOrder, onOrderUpdated, onOrderStatusUpdate, push])

  // ── Auto-scroll to newest (top, since newest first) ─────────────────────────
  useEffect(() => {
    if (!autoScroll || paused || !scrollRef.current) return
    scrollRef.current.scrollTop = 0
  }, [events, autoScroll, paused])

  const resume = () => { setPaused(false); setUnseen(0) }

  if (!isAuthenticated) return null

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-emerald-500' : 'bg-red-400')}
            animate={isConnected ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-display text-xs font-medium text-ink-2">
            {isConnected ? 'Live Feed' : 'Reconnecting…'}
          </span>
          {events.length > 0 && (
            <span className="font-display text-xs text-ink-3">({events.length})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unseen > 0 && (
            <motion.button
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={resume}
              className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/25 rounded-full font-display text-xs text-gold hover:bg-gold/15 transition-colors"
            >
              ↑ {unseen} new
            </motion.button>
          )}
          <button
            onClick={() => { setPaused(v => !v); if (paused) setUnseen(0) }}
            className="font-display text-xs text-ink-3 hover:text-espresso transition-colors"
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          {events.length > 0 && (
            <button
              onClick={() => setEvents([])}
              className="font-display text-xs text-ink-3 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Feed */}
      <div
        ref={scrollRef}
        className={cn(
          'overflow-y-auto scrollbar-none space-y-2',
          compact ? 'max-h-48' : 'max-h-80'
        )}
        onMouseEnter={() => autoScroll && setPaused(true)}
        onMouseLeave={() => { if (!unseen) setPaused(false) }}
      >
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-canvas-2 flex items-center justify-center mb-3">
                {isConnected
                  ? <Wifi size={18} className="text-beige" />
                  : <WifiOff size={18} className="text-red-300" />}
              </div>
              <p className="font-sans text-xs text-ink-3">
                {isConnected ? 'Waiting for activity…' : 'Socket disconnected'}
              </p>
            </motion.div>
          ) : (
            events.map((event) => {
              const cfg = EVENT_CONFIG[event.kind]
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className={cn(
                    'flex items-start gap-3 p-3 border rounded-xl',
                    cfg.color,
                    compact && 'py-2'
                  )}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-xs font-semibold truncate">{event.title}</p>
                      <p className="font-sans text-[10px] text-current/60 flex-shrink-0">
                        {event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!compact && (
                      <p className="font-sans text-[11px] text-current/70 mt-0.5 truncate">
                        {event.orderNumber && <span className="font-medium">{event.orderNumber}</span>}
                        {event.detail && <span className="ml-1 capitalize">{event.detail}</span>}
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

export default LiveOrdersFeed
