import { AnimatePresence } from 'framer-motion'
import { KitchenOrderCard } from './KitchenOrderCard'
import type { Order } from '@/types'

const COLUMNS = [
  { status: ['pending'],            label: 'New Orders',   color: 'text-amber-600'  },
  { status: ['accepted','preparing'],label: 'In Kitchen',  color: 'text-blue-600'   },
  { status: ['ready'],              label: 'Ready',        color: 'text-emerald-600' },
]

interface Props { orders: Order[]; onUpdate: () => void }

export const KitchenQueue = ({ orders, onUpdate }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
    {COLUMNS.map(col => {
      const colOrders = orders.filter(o => col.status.includes(o.status))
      return (
        <div key={col.label} className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-display text-sm font-semibold uppercase tracking-wider ${col.color}`}>{col.label}</h3>
            <span className="w-6 h-6 rounded-full bg-canvas-2 flex items-center justify-center font-display text-xs font-bold text-ink-2">{colOrders.length}</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto scrollbar-none flex-1" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <AnimatePresence>
              {colOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="font-sans text-sm text-ink-3">No orders here</p>
                </div>
              ) : (
                colOrders.map(order => (
                  <KitchenOrderCard key={order._id} order={order} onUpdate={onUpdate} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      )
    })}
  </div>
)

export default KitchenQueue
