import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import type { Employee } from '@/types/staff';

interface Props { employees: Employee[]; }
export const StaffStatusBoard = ({ employees }: Props) => {
  const active   = employees.filter(e => e.status === 'active').length;
  const onLeave  = employees.filter(e => e.status === 'on_leave').length;
  const byRole   = employees.reduce<Record<string, number>>((acc, e) => { acc[e.role] = (acc[e.role] || 0) + 1; return acc; }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }} className="card-premium p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Staff Status</p>
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
          <UserCheck size={15} className="text-teal-600" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="font-serif text-2xl text-espresso">{active}</p>
        <p className="font-sans text-xs text-ink-3 mb-0.5">active / {employees.length}</p>
      </div>
      {onLeave > 0 && (
        <p className="font-sans text-[10px] text-amber-600 mt-1">{onLeave} on leave</p>
      )}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {Object.entries(byRole).map(([role, count]) => (
          <span key={role} className="px-2 py-0.5 rounded-full bg-canvas-2 font-display text-[9px] text-ink-2 capitalize">
            {count} {role}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
