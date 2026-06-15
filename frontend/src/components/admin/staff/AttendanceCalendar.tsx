import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { attendanceService } from '@/services/staffService';
import type { Attendance, Employee } from '@/types/staff';

const STATUS_DOT: Record<string, string> = {
  present:  'bg-emerald-400',
  absent:   'bg-red-400',
  on_leave: 'bg-amber-400',
  half_day: 'bg-blue-400',
  holiday:  'bg-violet-300',
  week_off: 'bg-slate-200',
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

interface Props { employees: Employee[]; selectedDate: string; onDateChange: (d: string) => void; }

export const AttendanceCalendar = ({ employees, selectedDate, onDateChange }: Props) => {
  const initDate  = new Date(selectedDate);
  const [year,  setYear]  = useState(initDate.getFullYear());
  const [month, setMonth] = useState(initDate.getMonth());
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const ym = `${year}-${String(month + 1).padStart(2, '0')}`;
    attendanceService.getAll({ month: ym })
      .then(setRecords)
      .finally(() => setLoading(false));
  }, [year, month]);

  const numDays = daysInMonth(year, month);
  const days = Array.from({ length: numDays }, (_, i) => i + 1);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const getStatus = (empId: string, day: number): string => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const rec = records.find(r => r.employee === empId && r.date === dateStr);
    const d = new Date(dateStr);
    if (!rec && d.getDay() === 0) return 'week_off';
    return rec?.status ?? '';
  };

  const monthName = new Date(year, month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="card-premium overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-beige/40 bg-canvas-2">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-beige/40 flex items-center justify-center transition-colors">
          <ChevronLeft size={16} />
        </button>
        <p className="font-display text-sm text-espresso font-semibold">{monthName}</p>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-beige/40 flex items-center justify-center transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-6 py-3 border-b border-beige/30">
        {Object.entries({ Present: 'present', Absent: 'absent', 'On Leave': 'on_leave', 'Half Day': 'half_day', 'Week Off': 'week_off' }).map(([label, key]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[key]}`} />
            <span className="font-sans text-[11px] text-ink-3">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="bg-canvas-2/50">
            <tr>
              <th className="px-4 py-2 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide sticky left-0 bg-canvas-2/50 min-w-[130px]">Employee</th>
              {days.map(d => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dow = new Date(dateStr).getDay();
                return (
                  <th key={d}
                    className={`px-1 py-2 font-display text-[10px] text-center min-w-[26px] cursor-pointer hover:text-gold transition-colors ${dow === 0 ? 'text-slate-400' : 'text-ink-3'} ${selectedDate === dateStr ? 'text-gold' : ''}`}
                    onClick={() => onDateChange(dateStr)}>
                    {d}
                  </th>
                );
              })}
              <th className="px-3 py-2 font-display text-[10px] text-ink-3 text-center">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            {employees.map((emp, i) => {
              const presentDays = days.filter(d => getStatus(emp._id, d) === 'present').length;
              const workDays = days.filter(d => getStatus(emp._id, d) !== 'week_off').length;
              const pct = workDays > 0 ? Math.round((presentDays / workDays) * 100) : 0;
              return (
                <motion.tr key={emp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-canvas-2/30 transition-colors">
                  <td className="px-4 py-2 sticky left-0 bg-cream min-w-[130px]">
                    <div>
                      <p className="font-display text-[11px] text-espresso font-medium truncate">{emp.name}</p>
                      <p className="font-sans text-[10px] text-ink-3">{emp.employeeId}</p>
                    </div>
                  </td>
                  {days.map(d => {
                    const status = getStatus(emp._id, d);
                    return (
                      <td key={d} className="px-1 py-2 text-center">
                        <div className="flex justify-center">
                          {status ? (
                            <div className={`w-4 h-4 rounded-sm ${STATUS_DOT[status] ?? 'bg-slate-200'}`} title={status} />
                          ) : (
                            <div className="w-4 h-4 rounded-sm border border-dashed border-beige/60" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center">
                    <span className={`font-display text-[11px] font-semibold ${pct >= 90 ? 'text-emerald-600' : pct >= 75 ? 'text-amber-600' : 'text-red-500'}`}>
                      {pct}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
          <div className="py-6 text-center font-sans text-sm text-ink-3">Loading attendance…</div>
        )}
      </div>
    </div>
  );
};
