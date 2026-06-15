import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, User, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MotionButton } from '@/components/ui/Button';
import { leaveService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { LeaveRequest } from '@/types/staff';

const TYPE_COLORS: Record<string, string> = {
  sick:'text-red-600 bg-red-50', casual:'text-blue-600 bg-blue-50',
  earned:'text-emerald-600 bg-emerald-50', maternity:'text-pink-600 bg-pink-50',
  paternity:'text-violet-600 bg-violet-50', unpaid:'text-slate-600 bg-slate-50',
};

interface Props { request: LeaveRequest | null; isOpen: boolean; onClose: () => void; onSuccess: () => void; }

export const LeaveApprovalModal = ({ request: r, isOpen, onClose, onSuccess }: Props) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [acting, setActing] = useState<'approve'|'reject'|null>(null);

  if (!r) return null;

  const durationLabel = r.days === 1
    ? new Date(r.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    : `${new Date(r.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})} – ${new Date(r.endDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`;

  const approve = async () => {
    setActing('approve');
    try {
      await leaveService.approve(r._id);
      toast.success(`Leave approved for ${r.employeeName}`);
      onSuccess(); onClose();
    } catch { toast.error('Approval failed'); }
    finally { setActing(null); }
  };

  const reject = async () => {
    if (!rejectionReason.trim()) { toast.error('Provide a rejection reason'); return; }
    setActing('reject');
    try {
      await leaveService.reject(r._id, rejectionReason);
      toast.success(`Leave rejected for ${r.employeeName}`);
      onSuccess(); onClose();
    } catch { toast.error('Rejection failed'); }
    finally { setActing(null); }
  };

  const isPending = r.status === 'pending';
  const typeCls = TYPE_COLORS[r.type] ?? 'text-ink-2 bg-canvas-2';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Request Details" size="sm">
      <div className="space-y-5">
        {/* Employee */}
        <div className="flex items-center gap-4 p-4 bg-canvas-2 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-espresso/10 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-xl text-espresso">{r.employeeName.charAt(0)}</span>
          </div>
          <div>
            <p className="font-display text-sm text-espresso font-semibold">{r.employeeName}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${typeCls}`}>
              {r.type} leave
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Calendar size={13}/>, label: 'Period',   value: durationLabel },
            { icon: <User size={13}/>,     label: 'Duration', value: `${r.days} day${r.days !== 1 ? 's' : ''}` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="p-3 bg-canvas-2 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-ink-3">{icon}</span>
                <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">{label}</p>
              </div>
              <p className="font-display text-xs text-espresso">{value}</p>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div className="p-4 bg-canvas-2 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText size={13} className="text-ink-3" />
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Reason</p>
          </div>
          <p className="font-sans text-sm text-espresso">{r.reason}</p>
        </div>

        {/* Status / history */}
        {!isPending && (
          <div className={`p-4 rounded-xl border ${r.status === 'approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`font-display text-xs font-semibold capitalize ${r.status === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>
              {r.status} {r.approvedBy ? `by ${r.approvedBy}` : ''}
            </p>
            {r.rejectionReason && <p className="font-sans text-xs text-red-600 mt-1">{r.rejectionReason}</p>}
            {r.approvedAt && (
              <p className="font-sans text-[10px] text-ink-3 mt-1">
                {new Date(r.approvedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
            )}
          </div>
        )}

        {/* Actions — only if pending */}
        {isPending && (
          <>
            <div>
              <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">
                Rejection Reason <span className="normal-case text-ink-3">(required to reject)</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Operational requirements, peak period, etc."
                rows={3}
                className="input-base w-full text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MotionButton
                onClick={reject}
                disabled={!!acting}
                className="flex items-center justify-center gap-2 bg-red-500 text-white rounded-xl h-10 font-display text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <XCircle size={14} />
                {acting === 'reject' ? 'Rejecting…' : 'Reject'}
              </MotionButton>
              <MotionButton
                onClick={approve}
                disabled={!!acting}
                className="btn-primary justify-center gap-2"
              >
                <CheckCircle size={14} />
                {acting === 'approve' ? 'Approving…' : 'Approve'}
              </MotionButton>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
