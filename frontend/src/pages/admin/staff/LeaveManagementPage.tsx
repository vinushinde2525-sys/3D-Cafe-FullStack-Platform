import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, Plus } from 'lucide-react';
import { LeaveRequestTable } from '@/components/admin/staff/LeaveRequestTable';
import { LeaveApprovalModal } from '@/components/admin/staff/LeaveApprovalModal';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { FoodGridSkeleton } from '@/components/common/Skeletons';
import { leaveService, staffService } from '@/services/staffService';
import { MotionButton } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import type { LeaveRequest, Employee } from '@/types/staff';

const LEAVE_TYPES = ['sick','casual','earned','maternity','paternity','unpaid'];

export default function LeaveManagementPage() {
  const [requests,  setRequests]  = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [viewing,   setViewing]   = useState<LeaveRequest | null>(null);
  const [showNew,   setShowNew]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [exportOpen,setExportOpen]= useState(false);
  const [newForm,   setNewForm]   = useState({
    employee: '', type: 'sick', startDate: '', endDate: '', reason: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [reqs, emps] = await Promise.all([leaveService.getAll(), staffService.getAll()]);
      setRequests(reqs); setEmployees(emps);
    } catch { toast.error('Failed to load leave data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const summary = {
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    total:    requests.length,
  };

  const calcDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1);
  };

  const submitNew = async () => {
    if (!newForm.employee || !newForm.startDate || !newForm.endDate || !newForm.reason.trim()) {
      toast.error('Fill all fields'); return;
    }
    const emp = employees.find(e => e._id === newForm.employee);
    setSaving(true);
    try {
      await leaveService.request({
        employee: newForm.employee,
        employeeName: emp?.name ?? '',
        type: newForm.type as any,
        startDate: newForm.startDate,
        endDate: newForm.endDate,
        days: calcDays(newForm.startDate, newForm.endDate),
        reason: newForm.reason,
      });
      toast.success('Leave request submitted');
      setShowNew(false);
      setNewForm({ employee: '', type: 'sick', startDate: '', endDate: '', reason: '' });
      load();
    } catch { toast.error('Submission failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Leave Management</h1>
          <p className="font-sans text-sm text-ink-3">{summary.pending} pending · {summary.total} total requests</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={load} className="btn-secondary h-9 px-3">
            <RefreshCw size={13} />
          </motion.button>
          <MotionButton onClick={() => setExportOpen(true)} className="btn-secondary h-9 px-4 text-sm gap-2">
            <Download size={13} /> Export
          </MotionButton>
          <MotionButton onClick={() => setShowNew(true)} className="btn-primary h-9 px-4 text-sm gap-2">
            <Plus size={13} /> New Request
          </MotionButton>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Pending',  value: summary.pending,  cls: 'bg-amber-100 text-amber-700'   },
          { label: 'Approved', value: summary.approved, cls: 'bg-emerald-100 text-emerald-700'},
          { label: 'Rejected', value: summary.rejected, cls: 'bg-red-100 text-red-700'       },
          { label: 'Total',    value: summary.total,    cls: 'bg-canvas-2 text-espresso'     },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-full ${s.cls}`}>
            <span className="font-serif text-lg font-semibold leading-none">{s.value}</span>
            <span className="font-display text-[11px]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Leave balance card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sick Leave',    balance: 12, used: requests.filter(r => r.type === 'sick'    && r.status === 'approved').reduce((s, r) => s + r.days, 0) },
          { label: 'Casual Leave',  balance: 12, used: requests.filter(r => r.type === 'casual'  && r.status === 'approved').reduce((s, r) => s + r.days, 0) },
          { label: 'Earned Leave',  balance: 15, used: requests.filter(r => r.type === 'earned'  && r.status === 'approved').reduce((s, r) => s + r.days, 0) },
          { label: 'Unpaid Leave',  balance: 30, used: requests.filter(r => r.type === 'unpaid'  && r.status === 'approved').reduce((s, r) => s + r.days, 0) },
        ].map(({ label, balance, used }) => {
          const pct = Math.min(100, (used / balance) * 100);
          return (
            <div key={label} className="card-premium p-4">
              <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide mb-2">{label}</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="font-serif text-xl text-espresso">{balance - used}</span>
                <span className="font-sans text-xs text-ink-3 mb-0.5">/ {balance} left</span>
              </div>
              <div className="h-1.5 bg-beige/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${pct > 75 ? 'bg-red-400' : pct > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {loading
        ? <FoodGridSkeleton count={4} />
        : <LeaveRequestTable requests={requests} onView={setViewing} onUpdate={load} />
      }

      {/* Approval modal */}
      <LeaveApprovalModal
        request={viewing}
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        onSuccess={() => { setViewing(null); load(); }}
      />

      {/* New request modal */}
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Submit Leave Request" size="sm">
        <div className="space-y-4">
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Employee *</label>
            <select value={newForm.employee} onChange={e => setNewForm(f => ({ ...f, employee: e.target.value }))}
              className="input-base w-full text-sm">
              <option value="">Select employee…</option>
              {employees.filter(e => e.status === 'active').map(e => (
                <option key={e._id} value={e._id}>{e.name} ({e.employeeId})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Leave Type *</label>
            <select value={newForm.type} onChange={e => setNewForm(f => ({ ...f, type: e.target.value }))}
              className="input-base w-full text-sm capitalize">
              {LEAVE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">From *</label>
              <input type="date" value={newForm.startDate} onChange={e => setNewForm(f => ({ ...f, startDate: e.target.value }))}
                className="input-base w-full text-sm" />
            </div>
            <div>
              <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">To *</label>
              <input type="date" value={newForm.endDate} min={newForm.startDate}
                onChange={e => setNewForm(f => ({ ...f, endDate: e.target.value }))}
                className="input-base w-full text-sm" />
            </div>
          </div>
          {newForm.startDate && newForm.endDate && (
            <p className="font-display text-sm text-espresso">
              Duration: <strong>{calcDays(newForm.startDate, newForm.endDate)} day(s)</strong>
            </p>
          )}
          <Input label="Reason *" placeholder="Explain the reason for leave…"
            value={newForm.reason} onChange={e => setNewForm(f => ({ ...f, reason: e.target.value }))} />
          <div className="flex gap-3">
            <button onClick={() => setShowNew(false)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
            <MotionButton onClick={submitNew} disabled={saving} className="btn-primary flex-1 justify-center text-sm">
              {saving ? 'Submitting…' : 'Submit Request'}
            </MotionButton>
          </div>
        </div>
      </Modal>

      <ExcelExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} type="leaves" data={requests} label="Leave Requests" />
    </div>
  );
}
