import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
  pending:          { icon: <Clock size={12} />,        cls: 'bg-amber-100 text-amber-700',   label: 'Pending'   },
  accepted:         { icon: <CheckCircle size={12} />,  cls: 'bg-blue-100 text-blue-700',     label: 'Accepted'  },
  preparing:        { icon: <ShoppingBag size={12} />,  cls: 'bg-orange-100 text-orange-700', label: 'Preparing' },
  ready:            { icon: <CheckCircle size={12} />,  cls: 'bg-teal-100 text-teal-700',     label: 'Ready'     },
  out_for_delivery: { icon: <Bike size={12} />,         cls: 'bg-purple-100 text-purple-700', label: 'On Way'    },
  delivered:        { icon: <CheckCircle size={12} />,  cls: 'bg-emerald-100 text-emerald-700',label:'Delivered' },
  cancelled:        { icon: <Clock size={12} />,        cls: 'bg-red-100 text-red-700',       label: 'Cancelled' },
};

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

interface Props { recentOrders: Order[]; }
export const LiveOrdersBoard = ({ recentOrders }: Props) => (
  <div className="card-premium p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Live Orders</p>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <Link to="/admin/orders" className="font-display text-[11px] text-espresso hover:text-gold">
        View all →
      </Link>
    </div>

    {recentOrders.length === 0 ? (
      <div className="py-8 text-center">
        <ShoppingBag size={24} className="text-ink-3 mx-auto mb-2" />
        <p className="font-sans text-sm text-ink-3">No recent orders</p>
      </div>
    ) : (
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-none">
        <AnimatePresence initial={false}>
          {recentOrders.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between py-2.5 border-b border-beige/30 last:border-0 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-xs text-espresso font-medium">{order.orderNumber}</p>
                    <p className="font-sans text-[10px] text-ink-3">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.orderType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-display text-xs text-espresso font-semibold">{formatPrice(order.total)}</p>
                    <p className="font-sans text-[10px] text-ink-3">{timeAgo(order.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-display text-[9px] ${cfg.cls}`}>{cfg.label}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    )}
  </div>
);
