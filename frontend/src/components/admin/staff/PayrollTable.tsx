import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Printer } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import { payrollService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { PayrollRecord } from '@/types/staff';

const STATUS_STYLE = {
  draft:     'bg-slate-100 text-slate-600',
  processed: 'bg-blue-100 text-blue-700',
  paid:      'bg-emerald-100 text-emerald-700',
};

interface Props { records: PayrollRecord[]; onUpdate: () => void; }

export const PayrollTable = ({ records, onUpdate }: Props) => {
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('all');
  const [acting,  setActing]  = useState<string | null>(null);

  const filtered = useMemo(() =>
    records.filter(r =>
      (status === 'all' || r.status === status) &&
      (!search || r.employeeName.toLowerCase().includes(search.toLowerCase()))
    ), [records, search, status]);

  const markPaid = async (r: PayrollRecord) => {
    setActing(r._id);
    try {
      await payrollService.markPaid(r._id);
      toast.success(`${r.employeeName} marked as paid`);
      onUpdate();
    } catch { toast.error('Action failed'); }
    finally { setActing(null); }
  };

  const printSlip = (r: PayrollRecord) => {
    // In a real implementation this would call pdfExport
    toast.success(`Payslip for ${r.employeeName} — PDF ready (demo)`);
  };

  const totals = {
    base: filtered.reduce((s, r) => s + r.baseSalary, 0),
    net:  filtered.reduce((s, r) => s + r.netSalary, 0),
    ot:   filtered.reduce((s, r) => s + r.overtime, 0),
    tax:  filtered.reduce((s, r) => s + r.tax, 0),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search employee…" className="input-base pl-9 h-9 w-full text-sm" />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="processed">Processed</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-beige/40">
        <table className="w-full text-sm">
          <thead className="bg-canvas-2 border-b border-beige/40 sticky top-0">
            <tr>
              {['Employee','Base','Allowances','OT','Deductions','Tax','Net','Days','Status',''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence initial={false}>
              {filtered.map((r, i) => (
                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-canvas-2/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-espresso/10 flex items-center justify-center font-display text-[11px] text-espresso">
                        {r.employeeName.charAt(0)}
                      </div>
                      <span className="font-display text-xs text-espresso">{r.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-display text-xs text-ink-2">{formatPrice(r.baseSalary)}</td>
                  <td className="px-4 py-3 font-display text-xs text-emerald-600">+{formatPrice(r.allowances)}</td>
                  <td className="px-4 py-3 font-display text-xs text-blue-600">+{formatPrice(r.overtime)}</td>
                  <td className="px-4 py-3 font-display text-xs text-red-500">-{formatPrice(r.deductions)}</td>
                  <td className="px-4 py-3 font-display text-xs text-red-500">-{formatPrice(r.tax)}</td>
                  <td className="px-4 py-3 font-display text-xs text-espresso font-semibold">{formatPrice(r.netSalary)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 font-sans text-[11px] text-ink-2">
                      <span className="text-emerald-600">{r.daysPresent}✓</span>
                      {r.daysAbsent > 0 && <span className="text-red-500">{r.daysAbsent}✗</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => printSlip(r)} title="Print Payslip"
                        className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center">
                        <Printer size={12} />
                      </button>
                      {r.status !== 'paid' && (
                        <button onClick={() => markPaid(r)} disabled={acting === r._id}
                          title="Mark Paid"
                          className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center disabled:opacity-50">
                          <CheckCircle size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          {/* Totals row */}
          {filtered.length > 0 && (
            <tfoot className="border-t-2 border-beige/60 bg-canvas-2">
              <tr>
                <td className="px-4 py-3 font-display text-xs text-espresso font-semibold">
                  Total ({filtered.length})
                </td>
                <td className="px-4 py-3 font-display text-xs text-ink-2 font-semibold">{formatPrice(totals.base)}</td>
                <td className="px-4 py-3" /><td className="px-4 py-3" /><td className="px-4 py-3" />
                <td className="px-4 py-3 font-display text-xs text-red-500 font-semibold">-{formatPrice(totals.tax)}</td>
                <td className="px-4 py-3 font-display text-sm text-espresso font-bold">{formatPrice(totals.net)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          )}
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center"><p className="font-sans text-sm text-ink-3">No payroll records found</p></div>
        )}
      </div>
    </div>
  );
};
