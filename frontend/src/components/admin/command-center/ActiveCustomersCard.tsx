// ActiveCustomersCard
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Clock } from 'lucide-react';

interface ActiveCustomersProps { totalUsers: number; todayOrders: number; pendingOrders: number; }
export const ActiveCustomersCard = ({ totalUsers, todayOrders, pendingOrders }: ActiveCustomersProps) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.05 }} className="card-premium p-5">
    <div className="flex items-start justify-between mb-3">
      <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Customers</p>
      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
        <Users size={15} className="text-violet-600" />
      </div>
    </div>
    <p className="font-serif text-2xl text-espresso">{totalUsers.toLocaleString()}</p>
    <div className="flex items-center gap-3 mt-2">
      <div className="flex items-center gap-1">
        <ShoppingBag size={11} className="text-blue-500" />
        <span className="font-display text-[11px] text-ink-2">{todayOrders} orders today</span>
      </div>
    </div>
    <div className="flex items-center gap-1 mt-1">
      <Clock size={11} className="text-amber-500" />
      <span className="font-sans text-[10px] text-ink-3">{pendingOrders} pending</span>
    </div>
  </motion.div>
);
