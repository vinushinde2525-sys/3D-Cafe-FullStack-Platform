import { motion } from 'framer-motion';
import { Users, UserPlus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  totalUsers: number;
  newToday: number;
  newThisWeek: number;
  topCustomers?: { name: string; email: string; totalSpent: number; totalOrders: number }[];
}

export const CustomerCard = ({ totalUsers, newToday, newThisWeek, topCustomers = [] }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    className="card-premium p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Customers</p>
        <p className="font-serif text-2xl text-espresso mt-1">{totalUsers.toLocaleString()}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
        <Users size={18} className="text-violet-600" />
      </div>
    </div>

    <div className="flex gap-4 mb-5">
      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
        <UserPlus size={12} />
        <span className="font-display text-xs font-semibold">+{newToday} today</span>
      </div>
      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
        <TrendingUp size={12} />
        <span className="font-display text-xs font-semibold">+{newThisWeek} this week</span>
      </div>
    </div>

    {topCustomers.length > 0 && (
      <>
        <p className="font-display text-[10px] uppercase tracking-widest text-ink-3 mb-2">Top Customers</p>
        <div className="space-y-2">
          {topCustomers.slice(0, 4).map((c) => (
            <div key={c.email} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-espresso/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-[11px] text-espresso font-semibold">
                  {c.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-xs text-espresso truncate">{c.name}</p>
                <p className="font-sans text-[10px] text-ink-3">{c.totalOrders} orders</p>
              </div>
              <span className="font-display text-xs text-gold font-semibold flex-shrink-0">
                ₹{c.totalSpent.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </>
    )}

    <Link
      to="/admin/users"
      className="mt-4 flex items-center gap-1.5 font-display text-xs text-espresso hover:text-gold transition-colors"
    >
      <Users size={12} /> View all customers
    </Link>
  </motion.div>
);
