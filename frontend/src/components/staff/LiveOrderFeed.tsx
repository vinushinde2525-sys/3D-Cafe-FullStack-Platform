import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '@/hooks/useSocket'
import { formatPrice } from '@/utils/format'

interface FeedEvent { id: string; orderNumber: string; event: string; detail: string; time: Date; color: string }

export const LiveOrderFeed = () => {
  const { onNewOrder, onOrderUpdated, joinKitchen } = useSocket()
  const [events, setEvents] = useState<FeedEvent[]>([])

  const push = (e: FeedEvent) =>
    setEvents(prev => [e, ...prev].slice(0, 30))

  useEffect(() => {
    joinKitchen()
    const unNew = onNewOrder(d => push({ id: Date.now().toString(), orderNumber: d.orderNumber, event: 'New Order', detail: `${d.itemCount} items · ${formatPrice(d.total)}`, time: new Date(), color: 'text-amber-600' }))
    const unUpd = onOrderUpdated(d => push({ id: Date.now().toString(), orderNumber: d.orderId, event: 'Status Changed', detail: d.status.replace(/_/g, ' '), time: new Date(), color: 'text-blue-600' }))
    return () => { unNew(); unUpd() }
  }, [joinKitchen, onNewOrder, onOrderUpdated])

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-none">
      {events.length === 0 ? (
        <p className="font-sans text-sm text-ink-3 text-center py-8">Waiting for orders…</p>
      ) : (
        <AnimatePresence>
          {events.map(e => (
            <motion.div key={e.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-3 bg-canvas-2 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-xs font-semibold ${e.color}`}>{e.event}</span>
                  <span className="font-sans text-xs text-ink-3">{e.orderNumber}</span>
                </div>
                <p className="font-sans text-xs text-ink-2 capitalize">{e.detail}</p>
              </div>
              <p className="font-sans text-[10px] text-ink-3 flex-shrink-0">
                {e.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}

export default LiveOrderFeed
