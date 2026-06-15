import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { getOrderStatusLabel } from '@/utils/format';
import type { OrderStatus } from '@/types';

interface StatusCount { _id: OrderStatus; count: number; }
interface Props { ordersByStatus: StatusCount[]; todayOrders: number; }

const STATUS_COLORS: Record<string, string> = {
  pending:           'bg-amber-400',
  accepted:          'bg-blue-400',
  preparing:         'bg-orange-400',
  ready:             'bg-teal-400',
  out_for_delivery:  'bg-purple-400',
  delivered:         'bg-emerald-400',
  cancelled:         'bg-red-400',
  rejected:          'bg-rose-400',
};

export const OrdersCard = ({ ordersByStatus, todayOrders }: Props) => {
  const total = ordersByStatus.reduce((s, o) => s + o.count, 0) || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Orders</p>
          <p className="font-serif text-2xl text-espresso mt-1">{total}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <ShoppingBag size={18} className="text-blue-600" />
        </div>
      </div>
      <p className="font-sans text-[11px] text-ink-3 mb-4">{todayOrders} today</p>

      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-4">
        {ordersByStatus.map(({ _id, count }) => (
          <motion.div
            key={_id}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: `${(count / total) * 100}%`, originX: 0 }}
            className={`${STATUS_COLORS[_id] ?? 'bg-beige'} rounded-full`}
            title={`${getOrderStatusLabel(_id)}: ${count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        {ordersByStatus.slice(0, 6).map(({ _id, count }) => (
          <div key={_id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_COLORS[_id] ?? 'bg-beige'}`} />
              <span className="font-sans text-[11px] text-ink-2">{getOrderStatusLabel(_id)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[11px] text-espresso font-medium">{count}</span>
              <span className="font-sans text-[10px] text-ink-3">{Math.round((count / total) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
