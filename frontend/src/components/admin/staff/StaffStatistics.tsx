import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Umbrella, Clock, Calendar, DollarSign, BarChart2, TrendingUp, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { StaffHRStats } from '@/types/staff';

interface Props { stats: StaffHRStats; }

export const StaffStatistics = ({ stats }: Props) => {
  const cards = [
    { label: 'Total Staff',      value: stats.totalEmployees,                   icon: <Users size={16} />,       bg: 'bg-espresso/10', accent: 'text-espresso'     },
    { label: 'Present Today',    value: stats.presentToday,                     icon: <UserCheck size={16} />,   bg: 'bg-emerald-50',  accent: 'text-emerald-600'  },
    { label: 'Absent Today',     value: stats.absentToday,                      icon: <UserX size={16} />,       bg: 'bg-red-50',      accent: 'text-red-500',      alert: stats.absentToday > 0 },
    { label: 'On Leave',         value: stats.onLeaveToday,                     icon: <Umbrella size={16} />,    bg: 'bg-amber-50',    accent: 'text-amber-600'    },
    { label: 'Pending Leaves',   value: stats.pendingLeaves,                    icon: <AlertCircle size={16} />, bg: 'bg-orange-50',   accent: 'text-orange-600',   alert: stats.pendingLeaves > 0 },
    { label: 'On Shift Now',     value: stats.currentShiftCount,                icon: <Clock size={16} />,       bg: 'bg-blue-50',     accent: 'text-blue-600'     },
    { label: 'Monthly Payroll',  value: formatPrice(stats.monthlyPayroll),      icon: <DollarSign size={16} />,  bg: 'bg-gold/10',     accent: 'text-gold'         },
    { label: 'Attendance Rate',  value: `${stats.avgAttendance.toFixed(1)}%`,   icon: <Calendar size={16} />,    bg: 'bg-teal-50',     accent: 'text-teal-600'     },
    { label: 'Avg Performance',  value: `${stats.avgPerformance.toFixed(1)}/5`, icon: <TrendingUp size={16} />,  bg: 'bg-violet-50',   accent: 'text-violet-600'   },
    { label: 'Roles Filled',     value: Object.values(stats.byRole).filter(v => v > 0).length, icon: <BarChart2 size={16} />, bg: 'bg-indigo-50', accent: 'text-indigo-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.045, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`card-premium p-4 ${c.alert ? 'ring-1 ring-red-200' : ''}`}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="font-display text-[9px] text-ink-3 uppercase tracking-widest leading-tight">{c.label}</p>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
              <span className={c.accent}>{c.icon}</span>
            </div>
          </div>
          <p className="font-serif text-xl text-espresso">{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
};
