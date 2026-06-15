import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CreditCard, Star, Package, Users, ChefHat } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

type ActivityType = 'order_placed' | 'payment' | 'review' | 'low_stock' | 'new_customer' | 'order_ready';

interface Activity {
  id:          string;
  type:        ActivityType;
  title:       string;
  description: string;
  value?:      string;
  time:        string;
}

const ACT_CONFIG: Record<ActivityType, { icon: React.ReactNode; bg: string; color: string }> = {
  order_placed:  { icon: <ShoppingBag size={13} />, bg: 'bg-blue-50',    color: 'text-blue-600'    },
  payment:       { icon: <CreditCard size={13} />,  bg: 'bg-emerald-50', color: 'text-emerald-600' },
  review:        { icon: <Star size={13} />,        bg: 'bg-gold/10',    color: 'text-gold'        },
  low_stock:     { icon: <Package size={13} />,     bg: 'bg-red-50',     color: 'text-red-500'     },
  new_customer:  { icon: <Users size={13} />,       bg: 'bg-violet-50',  color: 'text-violet-600'  },
  order_ready:   { icon: <ChefHat size={13} />,     bg: 'bg-teal-50',    color: 'text-teal-600'    },
};

function buildActivitiesFromOrders(orders: Order[]): Activity[] {
  const activities: Activity[] = [];
  orders.slice(0, 8).forEach((o, i) => {
    activities.push({
      id:    `order-${o._id}`,
      type:  'order_placed',
      title: 'New Order',
      description: `${o.orderNumber} · ${o.items.length} item${o.items.length !== 1 ? 's' : ''}`,
      value: formatPrice(o.total),
      time:  o.createdAt,
    });
    if (o.paymentStatus === 'paid') {
      activities.push({
        id:    `pay-${o._id}`,
        type:  'payment',
        title: 'Payment Received',
        description: `${o.orderNumber} via ${o.paymentMethod}`,
        value: formatPrice(o.total),
        time:  o.createdAt,
      });
    }
    if (o.status === 'ready' || o.status === 'delivered') {
      activities.push({
        id:    `ready-${o._id}`,
        type:  'order_ready',
        title: 'Order Ready',
        description: `${o.orderNumber} completed`,
        time:  o.createdAt,
      });
    }
  });

  // Add some synthetic activities for demo richness
  activities.push(
    { id: 'rev-1', type: 'review',       title: 'New Review',      description: 'Tiramisu Classico — ★★★★★',       time: new Date(Date.now() - 8 * 60000).toISOString() },
    { id: 'cust-1',type: 'new_customer', title: 'New Customer',    description: 'Priya Sharma just signed up',      time: new Date(Date.now() - 22 * 60000).toISOString() },
    { id: 'stk-1', type: 'low_stock',    title: 'Low Stock Alert', description: 'Oat Milk (Barista) running low',   time: new Date(Date.now() - 35 * 60000).toISOString() },
  );

  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 12);
}

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

interface Props { orders: Order[]; }

export const RecentActivityFeed = ({ orders }: Props) => {
  const activities = buildActivitiesFromOrders(orders);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Activity</p>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <span className="font-sans text-[10px] text-ink-3">Live</span>
      </div>

      {/* Feed */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-none">
        <AnimatePresence initial={false}>
          {activities.map((act, i) => {
            const cfg = ACT_CONFIG[act.type];
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
                className="flex items-start gap-3 py-2 border-b border-beige/20 last:border-0"
              >
                {/* Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                  <span className={cfg.color}>{cfg.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-display text-xs text-espresso font-medium leading-tight">{act.title}</p>
                    <span className="font-sans text-[10px] text-ink-3 flex-shrink-0">{timeAgo(act.time)}</span>
                  </div>
                  <p className="font-sans text-[11px] text-ink-3 mt-0.5 truncate">{act.description}</p>
                  {act.value && (
                    <p className="font-display text-[11px] text-gold font-semibold mt-0.5">{act.value}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="py-8 text-center">
            <p className="font-sans text-sm text-ink-3">No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
