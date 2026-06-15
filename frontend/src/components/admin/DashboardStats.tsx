import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Users, Package,
  Clock, CheckCircle, XCircle, UserCheck,
  AlertTriangle, DollarSign, BarChart2, Zap,
} from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface Props {
  todayRevenue:      number;
  weekRevenue:       number;
  monthRevenue:      number;
  totalRevenue:      number;
  todayOrders:       number;
  pendingOrders:     number;
  completedOrders:   number;
  cancelledOrders:   number;
  totalUsers:        number;
  totalStaff:        number;
  newCustomersToday: number;
  avgOrderValue:     number;
  lowStockItems:     number;
  totalItems:        number;
}

interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}

export const DashboardStats = (props: Props) => {
  const {
    todayRevenue, weekRevenue, monthRevenue, totalRevenue,
    todayOrders, pendingOrders, completedOrders, cancelledOrders,
    totalUsers, totalStaff, newCustomersToday, avgOrderValue,
    lowStockItems, totalItems,
  } = props;

  const cards: StatCard[] = [
    {
      label: "Today's Revenue", value: formatPrice(todayRevenue),
      sub: `${formatPrice(weekRevenue)} this week`,
      icon: <DollarSign size={18} />, accent: 'text-gold', bg: 'bg-gold/10',
    },
    {
      label: 'Monthly Revenue', value: formatPrice(monthRevenue),
      sub: `${formatPrice(totalRevenue)} all time`,
      icon: <TrendingUp size={18} />, accent: 'text-amber-600', bg: 'bg-amber-50',
    },
    {
      label: "Today's Orders", value: todayOrders,
      sub: `${pendingOrders} pending`,
      icon: <ShoppingBag size={18} />, accent: 'text-blue-600', bg: 'bg-blue-50',
    },
    {
      label: 'Avg Order Value', value: formatPrice(avgOrderValue),
      sub: 'per transaction',
      icon: <BarChart2 size={18} />, accent: 'text-indigo-600', bg: 'bg-indigo-50',
    },
    {
      label: 'Pending Orders', value: pendingOrders,
      sub: 'awaiting action',
      icon: <Clock size={18} />, accent: 'text-orange-500', bg: 'bg-orange-50',
    },
    {
      label: 'Completed', value: completedOrders,
      sub: 'delivered successfully',
      icon: <CheckCircle size={18} />, accent: 'text-emerald-600', bg: 'bg-emerald-50',
    },
    {
      label: 'Cancelled', value: cancelledOrders,
      sub: 'this period',
      icon: <XCircle size={18} />, accent: 'text-red-500', bg: 'bg-red-50',
    },
    {
      label: 'Total Customers', value: totalUsers,
      sub: `+${newCustomersToday} today`,
      icon: <Users size={18} />, accent: 'text-violet-600', bg: 'bg-violet-50',
    },
    {
      label: 'Staff Members', value: totalStaff,
      sub: 'active accounts',
      icon: <UserCheck size={18} />, accent: 'text-teal-600', bg: 'bg-teal-50',
    },
    {
      label: 'Low Stock', value: lowStockItems,
      sub: `of ${totalItems} items`,
      icon: <AlertTriangle size={18} />, accent: lowStockItems > 0 ? 'text-red-500' : 'text-emerald-600', bg: lowStockItems > 0 ? 'bg-red-50' : 'bg-emerald-50',
    },
    {
      label: 'Menu Items', value: totalItems,
      sub: 'active products',
      icon: <Package size={18} />, accent: 'text-pink-600', bg: 'bg-pink-50',
    },
    {
      label: 'Quick Wins', value: `${Math.round((completedOrders / (completedOrders + cancelledOrders + 1)) * 100)}%`,
      sub: 'fulfilment rate',
      icon: <Zap size={18} />, accent: 'text-gold', bg: 'bg-gold/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.045, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="card-premium p-5 hover:shadow-warm-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest leading-tight">{c.label}</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
              <span className={c.accent}>{c.icon}</span>
            </div>
          </div>
          <p className="font-serif text-xl text-espresso mb-0.5">{c.value}</p>
          <p className="font-sans text-[11px] text-ink-3 leading-tight">{c.sub}</p>
        </motion.div>
      ))}
    </div>
  );
};
