import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, XCircle, Clock, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:           <Clock size={14} className="text-amber-500" />,
  accepted:          <CheckCircle size={14} className="text-blue-500" />,
  preparing:         <ShoppingBag size={14} className="text-orange-500" />,
  ready:             <CheckCircle size={14} className="text-teal-500" />,
  out_for_delivery:  <Bike size={14} className="text-purple-500" />,
  delivered:         <CheckCircle size={14} className="text-emerald-600" />,
  cancelled:         <XCircle size={14} className="text-red-500" />,
  rejected:          <XCircle size={14} className="text-rose-500" />,
};

const STATUS_BG: Record<string, string> = {
  pending:           'bg-amber-50',
  accepted:          'bg-blue-50',
  preparing:         'bg-orange-50',
  ready:             'bg-teal-50',
  out_for_delivery:  'bg-purple-50',
  delivered:         'bg-emerald-50',
  cancelled:         'bg-red-50',
  rejected:          'bg-rose-50',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface Props { orders: Order[]; }

export const ActivityFeed = ({ orders }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    className="card-premium p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Recent Activity</p>
      <Link to="/admin/orders" className="font-display text-[11px] text-espresso hover:text-gold transition-colors">
        View all →
      </Link>
    </div>

    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-none">
      <AnimatePresence initial={false}>
        {orders.map((order, i) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="flex items-start gap-3 py-2 border-b border-beige/40 last:border-0"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${STATUS_BG[order.status] ?? 'bg-beige'}`}>
              {STATUS_ICON[order.status] ?? <ShoppingBag size={14} className="text-ink-3" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-xs text-espresso font-medium truncate">{order.orderNumber}</p>
                <span className="font-display text-xs text-gold font-semibold flex-shrink-0">{formatPrice(order.total)}</span>
              </div>
              <p className="font-sans text-[11px] text-ink-3 mt-0.5">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.orderType}
              </p>
            </div>
            <span className="font-sans text-[10px] text-ink-3 flex-shrink-0 mt-0.5">{timeAgo(order.createdAt)}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {orders.length === 0 && (
        <div className="py-8 text-center">
          <p className="font-sans text-sm text-ink-3">No recent orders</p>
        </div>
      )}
    </div>
  </motion.div>
);
