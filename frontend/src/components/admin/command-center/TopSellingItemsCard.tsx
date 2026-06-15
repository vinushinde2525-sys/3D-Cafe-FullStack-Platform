import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import { resolveItemImage } from '@/utils/foodImage';

interface TopItem { _id: string; name: string; totalOrders: number; revenue: number; }
interface Props { items: TopItem[]; }

const MEDAL = ['🥇', '🥈', '🥉'];

export const TopSellingItemsCard = ({ items }: Props) => {
  const maxOrders = Math.max(...items.map(i => i.totalOrders), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center">
            <Trophy size={14} className="text-gold" />
          </div>
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Top Selling</p>
        </div>
        <span className="font-sans text-[11px] text-ink-3">This period</span>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-sans text-sm text-ink-3">No sales data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 6).map((item, i) => {
            const pct = Math.round((item.totalOrders / maxOrders) * 100);
            const imgUrl = resolveItemImage(undefined, item.name, '');
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank */}
                    <span className="text-sm flex-shrink-0 w-5 text-center">
                      {i < 3 ? MEDAL[i] : <span className="font-display text-xs text-ink-3">{i + 1}</span>}
                    </span>
                    {/* Thumbnail */}
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-canvas-2 flex-shrink-0">
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-xs text-espresso font-medium truncate">{item.name}</p>
                      <p className="font-sans text-[10px] text-ink-3">{item.totalOrders} orders</p>
                    </div>
                  </div>
                  <span className="font-display text-xs text-gold font-semibold flex-shrink-0 ml-2">
                    {formatPrice(item.revenue)}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="ml-7 h-1 bg-beige/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.06 + 0.15, duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${i === 0 ? 'bg-gold' : i === 1 ? 'bg-espresso/60' : 'bg-beige'}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
