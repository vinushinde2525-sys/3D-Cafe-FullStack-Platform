import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InventoryItem } from '@/types/inventory';

interface Props { items: InventoryItem[]; }

export const LowStockWidget = ({ items }: Props) => {
  const sorted = [...items].sort((a, b) => {
    const ra = a.currentStock / (a.minimumStock || 1);
    const rb = b.currentStock / (b.minimumStock || 1);
    return ra - rb;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle size={15} className="text-red-600" />
          </div>
          <div>
            <p className="font-display text-xs text-espresso font-semibold">Low Stock Alert</p>
            <p className="font-sans text-[10px] text-ink-3">{items.length} item{items.length !== 1 ? 's' : ''} need attention</p>
          </div>
        </div>
        <Link to="/admin/inventory" className="text-[11px] font-display text-espresso hover:text-gold transition-colors flex items-center gap-1">
          View all <ArrowRight size={11} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center">
          <Package size={24} className="text-emerald-400 mx-auto mb-2" />
          <p className="font-sans text-sm text-ink-3">All stock levels healthy</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.slice(0, 6).map((item, i) => {
            const pct = Math.min(100, (item.currentStock / item.maximumStock) * 100);
            const isOut = item.currentStock === 0;
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOut ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <span className="font-sans text-xs text-espresso truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className={`font-display text-xs font-semibold ${isOut ? 'text-red-600' : 'text-amber-600'}`}>
                      {item.currentStock} / {item.minimumStock} {item.unit}
                    </span>
                    {isOut && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-display text-[9px] font-semibold">OUT</span>
                    )}
                  </div>
                </div>
                <div className="h-1 bg-beige/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.06 + 0.1, duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${isOut ? 'bg-red-500' : pct < 20 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  />
                </div>
              </motion.div>
            );
          })}
          {sorted.length > 6 && (
            <p className="font-sans text-[11px] text-ink-3 text-center pt-1">+{sorted.length - 6} more items</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
