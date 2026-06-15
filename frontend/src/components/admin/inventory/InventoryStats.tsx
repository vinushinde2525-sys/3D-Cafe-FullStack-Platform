import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingDown, Calendar, ShoppingCart, Truck, DollarSign, Activity } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { InventoryStats as InventoryStatsType } from '@/types/inventory';

interface Props { stats: InventoryStatsType; }

export const InventoryStats = ({ stats }: Props) => {
  const cards = [
    { label: 'Stock Value',      value: formatPrice(stats.totalValue),      sub: `${stats.totalItems} items`,               icon: <DollarSign size={16} />,   bg: 'bg-gold/10',      accent: 'text-gold'          },
    { label: 'Low Stock',        value: stats.lowStockCount,                sub: 'need reorder',                             icon: <AlertTriangle size={16} />, bg: 'bg-red-50',       accent: 'text-red-600',   alert: stats.lowStockCount > 0 },
    { label: 'Expiring Soon',    value: stats.expiringCount,                sub: 'within 7 days',                            icon: <Calendar size={16} />,      bg: 'bg-amber-50',     accent: 'text-amber-600', alert: stats.expiringCount > 0 },
    { label: "Today's Purchases",value: formatPrice(stats.todayPurchases),  sub: 'received stock',                           icon: <ShoppingCart size={16} />,  bg: 'bg-emerald-50',   accent: 'text-emerald-600'   },
    { label: "Today's Waste",    value: formatPrice(stats.wasteCostToday),  sub: 'loss recorded',                            icon: <TrendingDown size={16} />,  bg: 'bg-rose-50',      accent: 'text-rose-600'      },
    { label: 'Pending POs',      value: stats.pendingPOs,                   sub: 'purchase orders',                          icon: <Truck size={16} />,         bg: 'bg-blue-50',      accent: 'text-blue-600'      },
    { label: 'Suppliers',        value: stats.supplierCount,                sub: 'active partners',                          icon: <Package size={16} />,       bg: 'bg-violet-50',    accent: 'text-violet-600'    },
    { label: 'Top Usage',        value: stats.topUsedItems[0]?.name ?? '—', sub: `${stats.topUsedItems[0]?.usageRate}/day ${stats.topUsedItems[0]?.unit ?? ''}`, icon: <Activity size={16} />, bg: 'bg-teal-50', accent: 'text-teal-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`card-premium p-4 ${c.alert ? 'ring-1 ring-red-200' : ''}`}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest leading-tight">{c.label}</p>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
              <span className={c.accent}>{c.icon}</span>
            </div>
          </div>
          <p className="font-serif text-lg text-espresso truncate">{c.value}</p>
          <p className="font-sans text-[11px] text-ink-3 mt-0.5 truncate">{c.sub}</p>
        </motion.div>
      ))}
    </div>
  );
};
