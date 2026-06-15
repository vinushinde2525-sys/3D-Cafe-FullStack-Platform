import { motion } from 'framer-motion';
import { Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InventoryItem } from '@/types/inventory';

interface Props { items: InventoryItem[]; daysThreshold?: number; }

function urgencyColor(days: number) {
  if (days <= 0)  return { bg: 'bg-red-100',    text: 'text-red-700',   badge: 'Expired',    dot: 'bg-red-500'   };
  if (days <= 2)  return { bg: 'bg-red-50',     text: 'text-red-600',   badge: 'Critical',   dot: 'bg-red-400'   };
  if (days <= 5)  return { bg: 'bg-amber-50',   text: 'text-amber-700', badge: `${days}d`,   dot: 'bg-amber-400' };
  return            { bg: 'bg-yellow-50',  text: 'text-yellow-700',badge: `${days}d`,   dot: 'bg-yellow-400'};
}

export const ExpiringProductsWidget = ({ items, daysThreshold = 7 }: Props) => {
  const expiring = items
    .filter(i => i.daysRemaining !== undefined && i.daysRemaining <= daysThreshold)
    .sort((a, b) => (a.daysRemaining ?? 999) - (b.daysRemaining ?? 999));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Calendar size={15} className="text-amber-600" />
          </div>
          <div>
            <p className="font-display text-xs text-espresso font-semibold">Expiring Soon</p>
            <p className="font-sans text-[10px] text-ink-3">Within {daysThreshold} days</p>
          </div>
        </div>
        <Link to="/admin/inventory" className="text-[11px] font-display text-espresso hover:text-gold transition-colors flex items-center gap-1">
          View all <ArrowRight size={11} />
        </Link>
      </div>

      {expiring.length === 0 ? (
        <div className="py-6 text-center">
          <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
          <p className="font-sans text-sm text-ink-3">No items expiring soon</p>
        </div>
      ) : (
        <div className="space-y-2">
          {expiring.slice(0, 7).map((item, i) => {
            const u = urgencyColor(item.daysRemaining ?? 0);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl ${u.bg}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${u.dot}`} />
                  <div className="min-w-0">
                    <p className="font-sans text-xs text-espresso truncate">{item.name}</p>
                    <p className="font-sans text-[10px] text-ink-3">{item.currentStock} {item.unit} · {item.category}</p>
                  </div>
                </div>
                <span className={`font-display text-xs font-semibold flex-shrink-0 ml-2 ${u.text}`}>
                  {item.daysRemaining === 0 ? 'Today' : u.badge}
                </span>
              </motion.div>
            );
          })}
          {expiring.length > 7 && (
            <p className="font-sans text-[11px] text-ink-3 text-center pt-1">+{expiring.length - 7} more expiring</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
