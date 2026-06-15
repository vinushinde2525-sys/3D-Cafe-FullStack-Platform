import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { AttendanceTable } from '@/components/admin/staff/AttendanceTable';
import { AttendanceCalendar } from '@/components/admin/staff/AttendanceCalendar';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { FoodGridSkeleton } from '@/components/common/Skeletons';
import { attendanceService, staffService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { Attendance, Employee } from '@/types/staff';

const today = new Date().toISOString().split('T')[0];

export default function AttendancePage() {
  const [date,       setDate]       = useState(today);
  const [view,       setView]       = useState<'table'|'calendar'>('table');
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees,  setEmployees]  = useState<Employee[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [exportOpen, setExportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, e] = await Promise.all([
        attendanceService.getAll({ date }),
        staffService.getAll(),
      ]);
      setAttendance(a); setEmployees(e);
    } catch { toast.error('Failed to load attendance'); }
    finally { setLoading(false); }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const markBulk = async (status: string) => {
    const unmarked = employees.filter(e => !attendance.find(a => a.employee === e._id));
    if (unmarked.length === 0) { toast.success('All staff already marked'); return; }
    try {
      await Promise.all(unmarked.map(e =>
        attendanceService.markAttendance({ employee: e._id, date, status })
      ));
      toast.success(`Marked ${unmarked.length} employees as ${status}`);
      load();
    } catch { toast.error('Bulk mark failed'); }
  };

  const summary = {
    present:  attendance.filter(a => a.status === 'present').length,
    absent:   attendance.filter(a => a.status === 'absent').length,
    on_leave: attendance.filter(a => a.status === 'on_leave').length,
    half_day: attendance.filter(a => a.status === 'half_day').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Attendance</h1>
          <p className="font-sans text-sm text-ink-3">{employees.length} employees tracked</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-sans text-ink-2 outline-none" />
          <div className="flex items-center gap-1 bg-canvas-2 rounded-xl p-1">
            {(['table','calendar'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 h-7 rounded-lg font-display text-xs capitalize transition-all ${view === v ? 'bg-cream text-espresso shadow-warm-sm' : 'text-ink-3 hover:text-espresso'}`}>
                {v}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={load} className="btn-secondary h-9 px-3 text-sm gap-1.5">
            <RefreshCw size={13} />
          </motion.button>
          <button onClick={() => setExportOpen(true)} className="btn-secondary h-9 px-3 text-sm gap-1.5 flex items-center">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Present',  value: summary.present,  cls: 'bg-emerald-100 text-emerald-700' },
          { label: 'Absent',   value: summary.absent,   cls: 'bg-red-100 text-red-700'         },
          { label: 'On Leave', value: summary.on_leave, cls: 'bg-amber-100 text-amber-700'     },
          { label: 'Half Day', value: summary.half_day, cls: 'bg-blue-100 text-blue-700'       },
          { label: 'Unmarked', value: employees.length - attendance.length, cls: 'bg-slate-100 text-slate-600' },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${s.cls}`}>
            <span className="font-serif text-base font-semibold">{s.value}</span>
            <span className="font-display text-[11px]">{s.label}</span>
          </div>
        ))}
        {employees.length > attendance.length && (
          <button onClick={() => markBulk('present')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-espresso text-cream font-display text-[11px] hover:bg-espresso/80 transition-colors">
            <Plus size={12} /> Mark Remaining Present
          </button>
        )}
      </div>

      {loading ? <FoodGridSkeleton count={4} /> : (
        view === 'table'
          ? <AttendanceTable records={attendance} employees={employees} onUpdate={load} selectedDate={date} />
          : <AttendanceCalendar employees={employees} selectedDate={date} onDateChange={setDate} />
      )}

      <ExcelExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        type="attendance"
        label="Attendance"
        data={attendance.map(a => ({
          ...a,
          employee: typeof a.employee === 'object' ? a.employee : (employees.find(e => e._id === a.employee)?.name ?? a.employee),
        }))}
      />
    </div>
  );
}
