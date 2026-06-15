import { motion } from 'framer-motion';
import { DollarSign, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface Props { todayRevenue: number; weekRevenue: number; monthRevenue: number; }

export const RevenueTodayCard = ({ todayRevenue, weekRevenue, monthRevenue }: Props) => {
  const weekDayAvg = weekRevenue / 7;
  const vsAvg = weekDayAvg > 0 ? ((todayRevenue - weekDayAvg) / weekDayAvg) * 100 : 0;
  const up = vsAvg >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-premium p-5 relative overflow-hidden"
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gold/8" />
      <div className="flex items-start justify-between mb-3">
        <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Today's Revenue</p>
        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
          <DollarSign size={15} className="text-gold" />
        </div>
      </div>
      <p className="font-serif text-2xl text-espresso">{formatPrice(todayRevenue)}</p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className={`flex items-center gap-0.5 font-display text-[11px] font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
          <TrendingUp size={11} className={up ? '' : 'rotate-180'} />
          {Math.abs(vsAvg).toFixed(1)}%
        </span>
        <span className="font-sans text-[10px] text-ink-3">vs daily avg</span>
      </div>
      <p className="font-sans text-[10px] text-ink-3 mt-2">Month: {formatPrice(monthRevenue)}</p>
    </motion.div>
  );
};
