import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react'
import { formatPrice } from '@/utils/format'

interface Props { totalRevenue: number; monthRevenue: number; todayOrders: number; totalUsers: number; totalItems: number }

export const AdminStatsCards = ({ totalRevenue, monthRevenue, todayOrders, totalUsers, totalItems }: Props) => {
  const cards = [
    { label: 'Total Revenue',   value: formatPrice(totalRevenue), sub: `${formatPrice(monthRevenue)} this month`, icon: <TrendingUp size={20} />, color: 'text-gold', bg: 'bg-gold/10' },
    { label: "Today's Orders",  value: todayOrders,               sub: 'orders received today',                  icon: <ShoppingBag size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Customers',       value: totalUsers,                sub: 'registered accounts',                    icon: <Users size={20} />,       color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Menu Items',      value: totalItems,                sub: 'active items',                           icon: <Package size={20} />,     color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((c, i) => (
        <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="card-premium p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="font-display text-xs text-ink-3 uppercase tracking-widest">{c.label}</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
              <span className={c.color}>{c.icon}</span>
            </div>
          </div>
          <p className="font-serif text-2xl text-espresso mb-1">{c.value}</p>
          <p className="font-sans text-xs text-ink-3">{c.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default AdminStatsCards
