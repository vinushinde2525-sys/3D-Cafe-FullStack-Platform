import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StaffStatistics } from '@/components/admin/staff/StaffStatistics';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { staffService, attendanceService, leaveService, shiftService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { StaffHRStats } from '@/types/staff';
import type { Attendance, Shift, LeaveRequest } from '@/types/staff';

const today = new Date().toISOString().split('T')[0];

const QUICK_LINKS = [
  { label: 'Employees',   to: '/admin/staff/employees',   color: 'bg-espresso/10 text-espresso'     },
  { label: 'Attendance',  to: '/admin/staff/attendance',  color: 'bg-emerald-50 text-emerald-700'   },
  { label: 'Shifts',      to: '/admin/staff/shifts',      color: 'bg-blue-50 text-blue-700'         },
  { label: 'Leaves',      to: '/admin/staff/leaves',      color: 'bg-amber-50 text-amber-700'       },
  { label: 'Payroll',     to: '/admin/staff/payroll',     color: 'bg-gold/10 text-gold'             },
  { label: 'Performance', to: '/admin/staff/performance', color: 'bg-violet-50 text-violet-700'     },
];

const STATUS_COLORS: Record<string, string> = {
  present: 'bg-emerald-100 text-emerald-700',
  absent:  'bg-red-100 text-red-700',
  on_leave:'bg-amber-100 text-amber-700',
  half_day:'bg-blue-100 text-blue-700',
};

export default function StaffDashboard() {
  const [stats,       setStats]      = useState<StaffHRStats | null>(null);
  const [attendance,  setAttendance] = useState<Attendance[]>([]);
  const [shifts,      setShifts]     = useState<Shift[]>([]);
  const [pendingLeaves,setPending]   = useState<LeaveRequest[]>([]);
  const [loading,     setLoading]    = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, a, sh, l] = await Promise.all([
        staffService.getStats(),
        attendanceService.getAll({ date: today }),
        shiftService.getAll({ date: today }),
        leaveService.getAll({ status: 'pending' }),
      ]);
      setStats(s); setAttendance(a); setShifts(sh); setPending(l);
    } catch { toast.error('Failed to load HR data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Staff HR</h1>
          <p className="font-sans text-sm text-ink-3 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={load} className="flex items-center gap-2 btn-secondary h-9 px-4 text-sm">
            <RefreshCw size={13} /> Refresh
          </motion.button>
          <Link to="/admin/staff/employees" className="btn-primary h-9 px-4 text-sm flex items-center gap-2">
            <Users size={13} /> Manage Staff
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      {stats && <StaffStatistics stats={stats} />}

      {/* Quick links */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {QUICK_LINKS.map(l => (
          <Link key={l.label} to={l.to}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${l.color} font-display text-xs font-medium hover:opacity-80 transition-opacity text-center`}>
            <ArrowRight size={14} />
            {l.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's attendance */}
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Today's Attendance</p>
            <Link to="/admin/staff/attendance" className="font-display text-[11px] text-espresso hover:text-gold transition-colors">View all →</Link>
          </div>
          <div className="space-y-2.5">
            {attendance.length === 0 && (
              <p className="font-sans text-sm text-ink-3 py-4 text-center">No attendance records for today</p>
            )}
            {attendance.map((a, i) => {
              const empName = typeof a.employee === 'object' ? (a.employee as any).name : `Employee ${a.employeeId}`;
              return (
                <motion.div key={a._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between py-2 border-b border-beige/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-espresso/10 flex items-center justify-center font-display text-xs text-espresso">
                      {a.employeeId.slice(-1)}
                    </div>
                    <div>
                      <p className="font-display text-xs text-espresso">{empName}</p>
                      {a.clockIn && <p className="font-sans text-[10px] text-ink-3">In: {a.clockIn} {a.clockOut ? `· Out: ${a.clockOut}` : '· On duty'}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.hoursWorked && <span className="font-display text-xs text-ink-2">{a.hoursWorked}h</span>}
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right column: shifts + pending leaves */}
        <div className="space-y-5">
          {/* Today's shifts */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Today's Shifts</p>
              <Link to="/admin/staff/shifts" className="font-display text-[11px] text-espresso hover:text-gold">Manage →</Link>
            </div>
            <div className="space-y-2">
              {shifts.map(sh => (
                <div key={sh._id} className="flex items-center justify-between py-2 border-b border-beige/30 last:border-0">
                  <div>
                    <p className="font-display text-xs text-espresso font-medium">{sh.name}</p>
                    <p className="font-sans text-[10px] text-ink-3">{sh.startTime} – {sh.endTime}</p>
                  </div>
                  <span className="font-display text-xs text-espresso">{sh.employees.length} staff</span>
                </div>
              ))}
              {shifts.length === 0 && <p className="font-sans text-sm text-ink-3 py-3 text-center">No shifts today</p>}
            </div>
          </div>

          {/* Pending leave requests */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Pending Leaves</p>
              <Link to="/admin/staff/leaves" className="font-display text-[11px] text-espresso hover:text-gold">Review →</Link>
            </div>
            {pendingLeaves.length === 0 ? (
              <p className="font-sans text-sm text-ink-3 py-3 text-center">No pending requests</p>
            ) : (
              <div className="space-y-2">
                {pendingLeaves.slice(0, 4).map(l => (
                  <div key={l._id} className="flex items-start justify-between gap-2 py-2 border-b border-beige/30 last:border-0">
                    <div className="min-w-0">
                      <p className="font-display text-xs text-espresso truncate">{l.employeeName}</p>
                      <p className="font-sans text-[10px] text-ink-3 capitalize">{l.type} · {l.days}d</p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-display text-[9px] flex-shrink-0">Pending</span>
                  </div>
                ))}
                {pendingLeaves.length > 4 && (
                  <p className="font-sans text-[11px] text-ink-3 text-center">+{pendingLeaves.length - 4} more</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
