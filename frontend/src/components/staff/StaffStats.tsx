import { motion } from 'framer-motion'
import { ShoppingBag, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

interface Props { pending: number; preparing: number; completed: number; alerts: number }

export const StaffStats = ({ pending, preparing, completed, alerts }: Props) => {
  const cards = [
    { label: 'New Orders',   value: pending,   icon: <ShoppingBag size={18} />,   color: 'text-amber-600',  bg: 'bg-amber-50'   },
    { label: 'In Kitchen',   value: preparing, icon: <Clock size={18} />,          color: 'text-blue-600',   bg: 'bg-blue-50'    },
    { label: 'Completed',    value: completed, icon: <CheckCircle size={18} />,    color: 'text-emerald-600',bg: 'bg-emerald-50' },
    { label: 'Stock Alerts', value: alerts,    icon: <AlertTriangle size={18} />,  color: 'text-red-600',    bg: 'bg-red-50'     },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="card-premium p-5 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
            <span className={c.color}>{c.icon}</span>
          </div>
          <div>
            <p className="font-serif text-2xl text-espresso">{c.value}</p>
            <p className="font-display text-xs text-ink-3 uppercase tracking-wide">{c.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default StaffStats
