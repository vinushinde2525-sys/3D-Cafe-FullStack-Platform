import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Shift, Employee } from '@/types/staff';

const SHIFT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  morning:   { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200' },
  afternoon: { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-200'  },
  evening:   { bg: 'bg-violet-100',  text: 'text-violet-800',  border: 'border-violet-200'},
  night:     { bg: 'bg-slate-100',   text: 'text-slate-700',   border: 'border-slate-200' },
  split:     { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200'},
};
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

interface Props {
  shifts:    Shift[];
  employees: Employee[];
  onAddShift: (date: string) => void;
  onEditShift:(shift: Shift) => void;
}

export const ShiftCalendar = ({ shifts, employees, onAddShift, onEditShift }: Props) => {
  const [baseDate, setBaseDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay()); // Start of week
    return d;
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return d;
  });

  const prevWeek = () => setBaseDate(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
  const nextWeek = () => setBaseDate(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
  const todayStr = new Date().toISOString().split('T')[0];

  const getShifts = (date: Date) => {
    const ds = date.toISOString().split('T')[0];
    return shifts.filter(s => s.date === ds);
  };

  const getEmpName = (id: string) => employees.find(e => e._id === id)?.name?.split(' ')[0] ?? id.slice(-4);

  const weekLabel = `${weekDays[0].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="card-premium overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-beige/40 bg-canvas-2">
        <button onClick={prevWeek} className="w-8 h-8 rounded-lg hover:bg-beige/40 flex items-center justify-center">
          <ChevronLeft size={16} />
        </button>
        <p className="font-display text-sm text-espresso font-semibold">{weekLabel}</p>
        <button onClick={nextWeek} className="w-8 h-8 rounded-lg hover:bg-beige/40 flex items-center justify-center">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-6 py-3 border-b border-beige/20">
        {Object.entries(SHIFT_COLORS).map(([type, cls]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${cls.bg} border ${cls.border}`} />
            <span className="font-display text-[10px] text-ink-3 capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 divide-x divide-beige/30">
        {weekDays.map((day, di) => {
          const ds   = day.toISOString().split('T')[0];
          const isToday = ds === todayStr;
          const dayShifts = getShifts(day);
          return (
            <div key={ds} className={`min-h-[160px] p-2 ${isToday ? 'bg-gold/5' : ''}`}>
              {/* Day header */}
              <div className={`text-center mb-2 py-1 rounded-lg ${isToday ? 'bg-espresso text-cream' : ''}`}>
                <p className={`font-display text-[10px] ${isToday ? 'text-cream' : 'text-ink-3'}`}>{DAYS[di]}</p>
                <p className={`font-serif text-sm ${isToday ? 'text-cream' : 'text-espresso'}`}>{day.getDate()}</p>
              </div>

              {/* Shifts */}
              <div className="space-y-1.5">
                {dayShifts.map(sh => {
                  const cls = SHIFT_COLORS[sh.type] ?? SHIFT_COLORS.morning;
                  return (
                    <motion.div
                      key={sh._id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onEditShift(sh)}
                      className={`p-1.5 rounded-lg border cursor-pointer ${cls.bg} ${cls.border} ${cls.text}`}
                    >
                      <p className="font-display text-[9px] font-semibold leading-tight truncate">{sh.name}</p>
                      <p className="font-sans text-[9px] opacity-70">{sh.startTime}–{sh.endTime}</p>
                      <p className="font-sans text-[9px] opacity-70 mt-0.5">
                        {sh.employees.slice(0, 2).map(id => getEmpName(id)).join(', ')}
                        {sh.employees.length > 2 ? ` +${sh.employees.length - 2}` : ''}
                      </p>
                    </motion.div>
                  );
                })}

                {/* Add shift */}
                <button
                  onClick={() => onAddShift(ds)}
                  className="w-full py-1.5 rounded-lg border border-dashed border-beige/60 flex items-center justify-center text-ink-3 hover:border-gold/50 hover:text-gold transition-colors"
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
