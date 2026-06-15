import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EmployeeProfileCard } from '@/components/admin/staff/EmployeeProfileCard';
import { EmployeeTimeline } from '@/components/admin/staff/EmployeeTimeline';
import { AttendanceCalendar } from '@/components/admin/staff/AttendanceCalendar';
import { Skeleton, FoodGridSkeleton } from '@/components/common/Skeletons';
import { staffService, attendanceService, payrollService, leaveService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { Employee, Attendance, PayrollRecord, LeaveRequest } from '@/types/staff';
import type { TimelineEvent } from '@/components/admin/staff/EmployeeTimeline';

const TABS = ['Overview', 'Attendance', 'Leave', 'Payroll'] as const;
type Tab = typeof TABS[number];

function buildTimeline(
  attendance: Attendance[],
  leaves: LeaveRequest[],
  payroll: PayrollRecord[],
  employee: Employee,
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  events.push({
    _id: 'hired', type: 'hired', title: 'Joined Café 3D',
    description: `Started as ${employee.role} in ${employee.department}`,
    date: employee.joinDate, status: 'positive',
  });

  attendance.filter(a => a.status === 'absent').forEach(a =>
    events.push({ _id: `att-${a._id}`, type: 'attendance', title: 'Absence Recorded', description: a.note ?? 'Absent without reason', date: a.date, status: 'negative' })
  );

  leaves.filter(l => l.status === 'approved').forEach(l =>
    events.push({ _id: `lv-${l._id}`, type: 'leave', title: `${l.type} Leave Approved`, description: `${l.days} day(s) · ${l.reason}`, date: l.startDate, status: 'neutral' })
  );

  payroll.filter(p => p.status === 'paid').forEach(p =>
    events.push({ _id: `pay-${p._id}`, type: 'payroll', title: 'Salary Disbursed', description: `₹${p.netSalary.toLocaleString()} for ${p.month}`, date: p.createdAt, status: 'positive' })
  );

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);
}

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [employee,  setEmployee]  = useState<Employee | null>(null);
  const [attendance,setAttendance]= useState<Attendance[]>([]);
  const [leaves,    setLeaves]    = useState<LeaveRequest[]>([]);
  const [payroll,   setPayroll]   = useState<PayrollRecord[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<Tab>('Overview');
  const [monthView, setMonthView] = useState(new Date().toISOString().slice(0, 7));

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [emp, att, lv, pay] = await Promise.all([
        staffService.getById(id),
        attendanceService.getEmployeeHistory(id, monthView),
        leaveService.getAll({ employee: id } as any),
        payrollService.getAll({ employee: id } as any),
      ]);
      setEmployee(emp); setAttendance(att); setLeaves(lv); setPayroll(pay);
    } catch { toast.error('Failed to load employee'); }
    finally { setLoading(false); }
  }, [id, monthView]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="lg:col-span-2"><FoodGridSkeleton count={3} /></div>
        </div>
      </div>
    );
  }

  if (!employee) return (
    <div className="py-20 text-center">
      <p className="font-sans text-sm text-ink-3">Employee not found.</p>
      <Link to="/admin/staff/employees" className="font-display text-sm text-espresso hover:text-gold mt-2 block">← Back to Employees</Link>
    </div>
  );

  const timeline = buildTimeline(attendance, leaves, payroll, employee);
  const empForCalendar = [employee];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link to="/admin/staff/employees" className="flex items-center gap-1.5 font-display text-sm text-ink-3 hover:text-espresso transition-colors">
          <ArrowLeft size={14} /> Employees
        </Link>
        <span className="text-ink-3">/</span>
        <span className="font-display text-sm text-espresso">{employee.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div>
          <EmployeeProfileCard employee={employee} onEdit={() => toast.success('Edit mode — use Employees page')} />
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tab strip */}
          <div className="flex items-center gap-1 bg-canvas-2 rounded-xl p-1 w-fit">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg font-display text-xs transition-all ${tab === t ? 'bg-cream text-espresso shadow-warm-sm' : 'text-ink-3 hover:text-espresso'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'Overview' && (
              <div className="space-y-5">
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Attendance',  value: `${attendance.filter(a => a.status === 'present').length} / ${attendance.length}`, sub: 'this month' },
                    { label: 'Leaves Used', value: leaves.filter(l => l.status === 'approved').reduce((s, l) => s + l.days, 0), sub: 'approved days' },
                    { label: 'Net Salary',  value: payroll[0] ? `₹${payroll[0].netSalary.toLocaleString()}` : '—', sub: 'last month' },
                  ].map(s => (
                    <div key={s.label} className="card-premium p-4 text-center">
                      <p className="font-serif text-lg text-espresso">{s.value}</p>
                      <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">{s.label}</p>
                      <p className="font-sans text-[10px] text-ink-3">{s.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Timeline */}
                <div className="card-premium p-6">
                  <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest mb-5">Activity Timeline</p>
                  <EmployeeTimeline events={timeline} />
                </div>
              </div>
            )}

            {tab === 'Attendance' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="font-display text-xs text-ink-3">Month</label>
                  <input type="month" value={monthView} onChange={e => setMonthView(e.target.value)}
                    className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm outline-none" />
                </div>
                <AttendanceCalendar employees={empForCalendar} selectedDate={monthView + '-01'} onDateChange={() => {}} />
              </div>
            )}

            {tab === 'Leave' && (
              <div className="card-premium overflow-hidden">
                <div className="px-5 py-3 border-b border-beige/40 bg-canvas-2">
                  <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Leave History</p>
                </div>
                <div className="divide-y divide-beige/20">
                  {leaves.length === 0 ? (
                    <p className="py-8 text-center font-sans text-sm text-ink-3">No leave records</p>
                  ) : leaves.map(l => (
                    <div key={l._id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="font-display text-xs text-espresso capitalize">{l.type} leave · {l.days} days</p>
                        <p className="font-sans text-[11px] text-ink-3">{new Date(l.startDate).toLocaleDateString('en-IN')} – {new Date(l.endDate).toLocaleDateString('en-IN')}</p>
                        <p className="font-sans text-[11px] text-ink-2 italic">{l.reason}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${
                        l.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        l.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        l.status === 'pending'  ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>{l.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Payroll' && (
              <div className="card-premium overflow-hidden">
                <div className="px-5 py-3 border-b border-beige/40 bg-canvas-2">
                  <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Payroll History</p>
                </div>
                <div className="divide-y divide-beige/20">
                  {payroll.length === 0 ? (
                    <p className="py-8 text-center font-sans text-sm text-ink-3">No payroll records</p>
                  ) : payroll.map(p => (
                    <div key={p._id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="font-display text-xs text-espresso">{p.month}</p>
                        <p className="font-sans text-[11px] text-ink-3">{p.daysPresent} days present · OT ₹{p.overtime}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-sm text-espresso font-semibold">₹{p.netSalary.toLocaleString()}</p>
                        <span className={`px-1.5 py-0.5 rounded-full font-display text-[9px] capitalize ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
