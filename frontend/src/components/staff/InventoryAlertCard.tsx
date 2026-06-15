import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown } from 'lucide-react'

interface Alert { ingredient: string; currentStock: number; minimumStock: number; unit: string; supplier?: { name?: string } }
interface Props { alerts: Alert[] }

export const InventoryAlertCard = ({ alerts }: Props) => {
  if (!alerts.length) return (
    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
      <p className="font-display text-sm text-emerald-700">✓ All stock levels healthy</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {alerts.map((a, i) => {
        const pct = Math.round((a.currentStock / a.minimumStock) * 100)
        const critical = a.currentStock === 0
        return (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className={`flex items-start gap-4 p-4 border rounded-2xl ${critical ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${critical ? 'bg-red-100' : 'bg-amber-100'}`}>
              {critical ? <AlertTriangle size={18} className="text-red-600" /> : <TrendingDown size={18} className="text-amber-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-display text-sm font-semibold text-espresso">{a.ingredient}</p>
                <span className={`font-display text-xs font-bold ${critical ? 'text-red-600' : 'text-amber-600'}`}>
                  {critical ? 'OUT OF STOCK' : `${pct}% of min`}
                </span>
              </div>
              <p className="font-sans text-xs text-ink-3">
                {a.currentStock} {a.unit} remaining · Min: {a.minimumStock} {a.unit}
              </p>
              {a.supplier?.name && <p className="font-sans text-xs text-ink-3 mt-0.5">Supplier: {a.supplier.name}</p>}
              <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${critical ? 'bg-red-500' : 'bg-amber-500'}`}
                  initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ duration: 0.6 }} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default InventoryAlertCard
