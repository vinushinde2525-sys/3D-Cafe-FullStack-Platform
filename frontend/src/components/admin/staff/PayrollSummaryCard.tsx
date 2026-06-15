import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { PayrollRecord } from '@/types/staff';

interface Props { records: PayrollRecord[]; month: string; }

export const PayrollSummaryCard = ({ records, month }: Props) => {
  const paid      = records.filter(r => r.status === 'paid');
  const pending   = records.filter(r => r.status !== 'paid');
  const totalNet  = records.reduce((s, r) => s + r.netSalary, 0);
  const totalBase = records.reduce((s, r) => s + r.baseSalary, 0);
  const totalOT   = records.reduce((s, r) => s + r.overtime, 0);
  const totalDed  = records.reduce((s, r) => s + r.deductions + r.tax, 0);
  const totalAlw  = records.reduce((s, r) => s + r.allowances, 0);
  const avgDaysPresent = records.length
    ? Math.round(records.reduce((s,r) => s + r.daysPresent, 0) / records.length)
    : 0;

  const monthLabel = new Date(month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6 relative overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gold/5" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-espresso/3" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Payroll Summary</p>
            <p className="font-serif text-xl text-espresso mt-1">{monthLabel}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <DollarSign size={18} className="text-gold" />
          </div>
        </div>

        {/* Total net */}
        <div className="mb-5 pb-5 border-b border-beige/40">
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide mb-1">Total Net Payroll</p>
          <p className="font-serif text-3xl text-espresso">{formatPrice(totalNet)}</p>
          <div className="flex items-center gap-3 mt-2 text-[11px]">
            <div className="flex items-center gap-1 text-emerald-600">
              <Users size={11} /> {paid.length}/{records.length} paid
            </div>
            {pending.length > 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <TrendingUp size={11} /> {pending.length} pending
              </div>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2.5">
          {[
            { label: 'Base Salaries',  value: totalBase, icon: <DollarSign size={12} />,   cls: 'text-espresso'   },
            { label: 'Allowances',     value: totalAlw,  icon: <TrendingUp size={12} />,    cls: 'text-emerald-600' },
            { label: 'Overtime',       value: totalOT,   icon: <TrendingUp size={12} />,    cls: 'text-blue-600'   },
            { label: 'Deductions/Tax', value: totalDed,  icon: <TrendingDown size={12} />,  cls: 'text-red-500',  neg: true },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={row.cls}>{row.icon}</span>
                <span className="font-sans text-xs text-ink-2">{row.label}</span>
              </div>
              <span className={`font-display text-xs font-semibold ${row.cls}`}>
                {row.neg ? '-' : '+'}{formatPrice(row.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Attendance avg */}
        <div className="mt-4 pt-4 border-t border-beige/30 flex items-center justify-between text-xs">
          <span className="font-sans text-ink-3">Avg days present</span>
          <span className="font-display text-espresso font-semibold">{avgDaysPresent} days</span>
        </div>
      </div>
    </motion.div>
  );
};
