import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface DataPoint { _id: string; revenue: number; orders: number; }
interface Props { data: DataPoint[]; }

export const LiveSalesChart = ({ data }: Props) => {
  if (!data.length) return (
    <div className="card-premium p-6 flex items-center justify-center min-h-[220px]">
      <p className="font-sans text-sm text-ink-3">No sales data</p>
    </div>
  );

  const max    = Math.max(...data.map(d => d.revenue), 1);
  const total  = data.reduce((s, d) => s + d.revenue, 0);
  const half   = Math.floor(data.length / 2);
  const prev   = data.slice(0, half).reduce((s, d) => s + d.revenue, 0);
  const curr   = data.slice(half).reduce((s, d) => s + d.revenue, 0);
  const pct    = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  const up     = pct >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Sales Trend</p>
          <p className="font-serif text-2xl text-espresso mt-1">{formatPrice(total)}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`flex items-center gap-0.5 font-display text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
              {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(pct).toFixed(1)}%
            </span>
            <span className="font-sans text-[11px] text-ink-3">vs prev period</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Orders</p>
          <p className="font-serif text-lg text-espresso">{data.reduce((s, d) => s + d.orders, 0)}</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1 h-24 mt-2">
        {data.map((d, i) => {
          const h     = Math.max(4, Math.round((d.revenue / max) * 100));
          const isNew = i >= data.length - Math.ceil(data.length / 3);
          return (
            <motion.div
              key={d._id}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.015, duration: 0.35, ease: 'easeOut' }}
              style={{ height: `${h}%`, originY: 1 }}
              className={`flex-1 rounded-t-sm transition-colors ${isNew ? 'bg-gold' : 'bg-beige/60'} hover:bg-espresso cursor-pointer`}
              title={`${d._id}: ${formatPrice(d.revenue)} · ${d.orders} orders`}
            />
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-sans text-[10px] text-ink-3">{data[0]?._id}</span>
        <span className="font-sans text-[10px] text-ink-3">{data[data.length - 1]?._id}</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-beige/30">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-beige/60" />
          <span className="font-sans text-[10px] text-ink-3">Earlier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gold" />
          <span className="font-sans text-[10px] text-ink-3">Recent</span>
        </div>
      </div>
    </motion.div>
  );
};
