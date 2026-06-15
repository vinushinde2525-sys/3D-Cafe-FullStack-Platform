import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut } from 'lucide-react';
import { attendanceService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { Attendance, Employee, AttendanceStatus } from '@/types/staff';

const STATUSES: { value: AttendanceStatus; label: string; cls: string }[] = [
  { value: 'present',  label: 'Present',  cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'absent',   label: 'Absent',   cls: 'bg-red-100 text-red-700 border-red-200'             },
  { value: 'on_leave', label: 'On Leave', cls: 'bg-amber-100 text-amber-700 border-amber-200'       },
  { value: 'half_day', label: 'Half Day', cls: 'bg-blue-100 text-blue-700 border-blue-200'          },
  { value: 'holiday',  label: 'Holiday',  cls: 'bg-violet-100 text-violet-700 border-violet-200'    },
];

const ROLE_SHORT: Record<string, string> = {
  barista:'BAR', chef:'CHF', cashier:'CSH', delivery:'DLV', manager:'MGR', cleaner:'CLN', waiter:'WTR',
};

interface Props {
  records:      Attendance[];
  employees:    Employee[];
  selectedDate: string;
  onUpdate:     () => void;
}

export const AttendanceTable = ({ records, employees, selectedDate, onUpdate }: Props) => {
  const [saving, setSaving] = useState<string | null>(null);

  const getRecord = (empId: string) => records.find(r => r.employee === empId);

  const mark = async (empId: string, status: AttendanceStatus, note?: string) => {
    setSaving(empId);
    try {
      await attendanceService.markAttendance({ employee: empId, date: selectedDate, status, note });
      toast.success(`Marked ${status.replace('_', ' ')}`);
      onUpdate();
    } catch { toast.error('Failed to mark attendance'); }
    finally { setSaving(null); }
  };

  const clockAction = async (empId: string, action: 'in' | 'out') => {
    const now = new Date().toTimeString().slice(0, 5);
    setSaving(empId + action);
    try {
      const existing = getRecord(empId);
      await attendanceService.markAttendance({
        employee: empId, date: selectedDate, status: 'present',
        clockIn:  action === 'in'  ? now : existing?.clockIn,
        clockOut: action === 'out' ? now : existing?.clockOut,
      });
      toast.success(`Clocked ${action} at ${now}`);
      onUpdate();
    } catch { toast.error('Clock action failed'); }
    finally { setSaving(null); }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-beige/40">
      <table className="w-full text-sm">
        <thead className="bg-canvas-2 border-b border-beige/40 sticky top-0">
          <tr>
            {['Employee','Role','Status','Clock In','Clock Out','Hours','OT','Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-beige/20">
          <AnimatePresence initial={false}>
            {employees.map((emp, i) => {
              const rec = getRecord(emp._id);
              const isSav = saving === emp._id;
              return (
                <motion.tr key={emp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`hover:bg-canvas-2/40 transition-colors ${!rec ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-espresso/10 flex items-center justify-center font-display text-[10px] text-espresso flex-shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display text-xs text-espresso">{emp.name}</p>
                        <p className="font-sans text-[10px] text-ink-3">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-display text-[10px] text-ink-2 bg-canvas-2 px-1.5 py-0.5 rounded">
                      {ROLE_SHORT[emp.role] ?? emp.role.slice(0, 3).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {rec ? (
                      <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize border ${STATUSES.find(s => s.value === rec.status)?.cls ?? 'bg-slate-100 text-slate-600'}`}>
                        {rec.status.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="font-display text-[10px] text-ink-3 italic">Not marked</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-display text-xs text-espresso">{rec?.clockIn ?? '—'}</td>
                  <td className="px-4 py-3 font-display text-xs text-espresso">{rec?.clockOut ?? '—'}</td>
                  <td className="px-4 py-3 font-display text-xs text-ink-2">{rec?.hoursWorked ? `${rec.hoursWorked}h` : '—'}</td>
                  <td className="px-4 py-3 font-display text-xs text-amber-600">{rec?.overtime ? `+${rec.overtime}h` : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Quick status buttons */}
                      {STATUSES.slice(0, 3).map(s => (
                        <button key={s.value} disabled={isSav || rec?.status === s.value}
                          onClick={() => mark(emp._id, s.value)}
                          title={s.label}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-display border transition-all ${
                            rec?.status === s.value ? s.cls + ' opacity-100' : 'bg-canvas-2 border-beige/40 text-ink-3 hover:border-gold/40'
                          }`}>
                          {s.label.slice(0, 1)}
                        </button>
                      ))}
                      {/* Clock in/out */}
                      <button disabled={saving === emp._id + 'in'}
                        onClick={() => clockAction(emp._id, 'in')}
                        title="Clock In" className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <LogIn size={10} />
                      </button>
                      <button disabled={saving === emp._id + 'out'}
                        onClick={() => clockAction(emp._id, 'out')}
                        title="Clock Out" className="w-6 h-6 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <LogOut size={10} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
      {employees.length === 0 && (
        <div className="py-10 text-center"><p className="font-sans text-sm text-ink-3">No employees found</p></div>
      )}
    </div>
  );
};
