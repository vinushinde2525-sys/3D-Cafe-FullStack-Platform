import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { leaveService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { LeaveRequest, LeaveStatus } from '@/types/staff';

const STATUS_STYLE: Record<LeaveStatus, string> = {
  pending:   'bg-amber-100 text-amber-700',
  approved:  'bg-emerald-100 text-emerald-700',
  rejected:  'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-500',
};
const TYPE_COLORS: Record<string, string> = {
  sick: 'text-red-600', casual: 'text-blue-600', earned: 'text-emerald-600',
  maternity: 'text-pink-600', paternity: 'text-violet-600', unpaid: 'text-slate-600',
};

interface Props {
  requests: LeaveRequest[];
  onView:   (r: LeaveRequest) => void;
  onUpdate: () => void;
}

export const LeaveRequestTable = ({ requests, onView, onUpdate }: Props) => {
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('all');
  const [type,    setType]    = useState('all');
  const [acting,  setActing]  = useState<string | null>(null);

  const filtered = useMemo(() =>
    requests.filter(r =>
      (status === 'all' || r.status === status) &&
      (type   === 'all' || r.type   === type)   &&
      (!search || r.employeeName.toLowerCase().includes(search.toLowerCase()))
    ), [requests, search, status, type]);

  const act = async (r: LeaveRequest, action: 'approve' | 'reject', reason?: string) => {
    setActing(r._id);
    try {
      if (action === 'approve') { await leaveService.approve(r._id); toast.success(`Approved leave for ${r.employeeName}`); }
      else                      { await leaveService.reject(r._id, reason ?? 'Not approved'); toast.success(`Rejected leave for ${r.employeeName}`); }
      onUpdate();
    } catch { toast.error('Action failed'); }
    finally { setActing(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search employee…" className="input-base pl-9 h-9 w-full text-sm" />
        </div>
        {[
          { val: status, set: setStatus, opts: [['all','All Status'],['pending','Pending'],['approved','Approved'],['rejected','Rejected'],['cancelled','Cancelled']] },
          { val: type,   set: setType,   opts: [['all','All Types'],['sick','Sick'],['casual','Casual'],['earned','Earned'],['maternity','Maternity'],['paternity','Paternity'],['unpaid','Unpaid']] },
        ].map(({ val, set, opts }, fi) => (
          <select key={fi} value={val} onChange={e => set(e.target.value)}
            className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none">
            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-beige/40">
        <table className="w-full text-sm">
          <thead className="bg-canvas-2 border-b border-beige/40 sticky top-0">
            <tr>
              {['Employee','Type','Duration','Dates','Reason','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence initial={false}>
              {filtered.map((r, i) => (
                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`hover:bg-canvas-2/50 transition-colors ${r.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-espresso/10 flex items-center justify-center font-display text-[11px] text-espresso">
                        {r.employeeName.charAt(0)}
                      </div>
                      <span className="font-display text-xs text-espresso">{r.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-display text-xs capitalize font-semibold ${TYPE_COLORS[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-3 font-display text-xs text-espresso">{r.days} day{r.days !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-2 whitespace-nowrap">
                    {new Date(r.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    {r.days > 1 ? ` – ${new Date(r.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` : ''}
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <p className="font-sans text-xs text-ink-2 truncate">{r.reason}</p>
                    {r.rejectionReason && <p className="font-sans text-[10px] text-red-500 truncate">↳ {r.rejectionReason}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${STATUS_STYLE[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => onView(r)} className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center">
                        <Eye size={12} />
                      </button>
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => act(r, 'approve')} disabled={acting === r._id}
                            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center">
                            <CheckCircle size={12} />
                          </button>
                          <button onClick={() => act(r, 'reject', 'Operational constraints')} disabled={acting === r._id}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                            <XCircle size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center"><p className="font-sans text-sm text-ink-3">No leave requests found</p></div>
        )}
      </div>
    </div>
  );
};
