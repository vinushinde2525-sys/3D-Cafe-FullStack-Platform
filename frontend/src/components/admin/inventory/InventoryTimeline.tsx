import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, RefreshCw, Trash2, ShoppingCart, ArrowLeftRight, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { StockMovement, StockMoveType } from '@/types/inventory';

const TYPE_CONFIG: Record<StockMoveType, { icon: React.ReactNode; label: string; color: string; bg: string; sign: string }> = {
  restock:    { icon: <ArrowUp size={13} />,         label: 'Restock',    color: 'text-emerald-600', bg: 'bg-emerald-50', sign: '+' },
  usage:      { icon: <ArrowDown size={13} />,        label: 'Usage',      color: 'text-amber-600',   bg: 'bg-amber-50',   sign: '-' },
  waste:      { icon: <Trash2 size={13} />,           label: 'Waste',      color: 'text-red-500',     bg: 'bg-red-50',     sign: '-' },
  transfer:   { icon: <ArrowLeftRight size={13} />,   label: 'Transfer',   color: 'text-blue-600',    bg: 'bg-blue-50',    sign: '→' },
  adjustment: { icon: <RefreshCw size={13} />,        label: 'Adjustment', color: 'text-violet-600',  bg: 'bg-violet-50',  sign: '±' },
  return:     { icon: <RotateCcw size={13} />,        label: 'Return',     color: 'text-teal-600',    bg: 'bg-teal-50',    sign: '+' },
  purchase:   { icon: <ShoppingCart size={13} />,     label: 'Purchase',   color: 'text-indigo-600',  bg: 'bg-indigo-50',  sign: '+' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

interface Props { movements: StockMovement[]; compact?: boolean; }

export const InventoryTimeline = ({ movements, compact = false }: Props) => {
  if (movements.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-sans text-sm text-ink-3">No stock movements recorded</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      {!compact && (
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-beige/60" />
      )}

      <div className="space-y-3">
        {movements.map((m, i) => {
          const cfg = TYPE_CONFIG[m.type] ?? TYPE_CONFIG.adjustment;
          return (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className={`flex items-start gap-3 ${compact ? '' : 'pl-0'}`}
            >
              {/* Icon dot */}
              <div className={`w-[38px] h-[38px] rounded-full flex-shrink-0 flex items-center justify-center border-2 border-cream ${cfg.bg} relative z-10`}>
                <span className={cfg.color}>{cfg.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-3 border-b border-beige/30 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-xs text-espresso font-semibold">{m.itemName}</span>
                      <span className={`px-1.5 py-0.5 rounded-full font-display text-[10px] ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {m.reference && (
                        <span className="font-sans text-[10px] text-ink-3">ref: {m.reference}</span>
                      )}
                    </div>
                    <p className="font-sans text-[11px] text-ink-3 mt-0.5">
                      {m.unitBefore} → {m.unitAfter} units · by {m.performedBy}
                    </p>
                    {m.note && <p className="font-sans text-[11px] text-ink-2 mt-0.5 italic">"{m.note}"</p>}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className={`font-display text-sm font-semibold ${
                      cfg.sign === '+' ? 'text-emerald-600' :
                      cfg.sign === '-' ? 'text-red-600' : cfg.color
                    }`}>
                      {cfg.sign}{m.quantity}
                    </p>
                    {m.totalCost !== undefined && m.totalCost > 0 && (
                      <p className="font-sans text-[10px] text-ink-3">{formatPrice(m.totalCost)}</p>
                    )}
                    <p className="font-sans text-[10px] text-ink-3 mt-0.5">{timeAgo(m.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
