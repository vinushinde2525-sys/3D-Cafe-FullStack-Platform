import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface RevenuePoint { _id: string; revenue: number; orders: number; }
interface Props { data: RevenuePoint[]; period?: string; }

export const RevenueCard = ({ data, period = '30 days' }: Props) => {
  const total   = data.reduce((s, d) => s + d.revenue, 0);
  const prev    = data.slice(0, Math.floor(data.length / 2)).reduce((s, d) => s + d.revenue, 0);
  const curr    = data.slice(Math.floor(data.length / 2)).reduce((s, d) => s + d.revenue, 0);
  const pct     = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  const up      = pct >= 0;
  const max     = Math.max(...data.map(d => d.revenue), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6"
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Revenue</p>
          <p className="font-serif text-2xl text-espresso mt-1">{formatPrice(total)}</p>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(pct).toFixed(1)}%
        </div>
      </div>
      <p className="font-sans text-[11px] text-ink-3 mb-5">Last {period}</p>

      {/* Mini sparkline */}
      <div className="flex items-end gap-0.5 h-16">
        {data.map((d, i) => {
          const h = Math.max(4, Math.round((d.revenue / max) * 100));
          const isRecent = i >= data.length - 7;
          return (
            <motion.div
              key={d._id}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.012, duration: 0.3, ease: 'easeOut' }}
              style={{ height: `${h}%`, originY: 1 }}
              className={`flex-1 rounded-t-sm ${isRecent ? 'bg-gold' : 'bg-beige'}`}
              title={`${d._id}: ${formatPrice(d.revenue)}`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="font-sans text-[11px] text-ink-3">{data[0]?._id}</span>
        <span className="font-sans text-[11px] text-ink-3">{data[data.length - 1]?._id}</span>
      </div>
    </motion.div>
  );
};
