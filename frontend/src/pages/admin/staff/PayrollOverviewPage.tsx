import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, Play } from 'lucide-react';
import { PayrollSummaryCard } from '@/components/admin/staff/PayrollSummaryCard';
import { PayrollTable } from '@/components/admin/staff/PayrollTable';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { FoodGridSkeleton } from '@/components/common/Skeletons';
import { payrollService } from '@/services/staffService';
import { MotionButton } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { PayrollRecord } from '@/types/staff';

export default function PayrollOverviewPage() {
  const curMonth = new Date().toISOString().slice(0, 7);
  const [month,    setMonth]    = useState(curMonth);
  const [records,  setRecords]  = useState<PayrollRecord[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [processing, setProcessing] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRecords(await payrollService.getAll({ month })); }
    catch { toast.error('Failed to load payroll'); }
    finally { setLoading(false); }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const processPayroll = async () => {
    if (!confirm(`Process payroll for ${month}? This will calculate all salaries.`)) return;
    setProcessing(true);
    try {
      await payrollService.process(month);
      toast.success(`Payroll processed for ${month}`);
      load();
    } catch { toast.error('Processing failed'); }
    finally { setProcessing(false); }
  };

  const monthLabel = new Date(month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const allPaid    = records.length > 0 && records.every(r => r.status === 'paid');
  const paidCount  = records.filter(r => r.status === 'paid').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Payroll</h1>
          <p className="font-sans text-sm text-ink-3">{monthLabel} · {paidCount}/{records.length} paid</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm outline-none" />
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={load} className="btn-secondary h-9 px-3">
            <RefreshCw size={13} />
          </motion.button>
          <MotionButton onClick={() => setExportOpen(true)} className="btn-secondary h-9 px-4 text-sm gap-2">
            <Download size={13} /> Export
          </MotionButton>
          {!allPaid && (
            <MotionButton onClick={processPayroll} disabled={processing} className="btn-primary h-9 px-4 text-sm gap-2">
              <Play size={13} /> {processing ? 'Processing…' : 'Process Payroll'}
            </MotionButton>
          )}
        </div>
      </div>

      {/* Status bar */}
      {records.length > 0 && (
        <div className="h-2 bg-beige/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(paidCount / records.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-emerald-400 rounded-full"
          />
        </div>
      )}

      {loading ? (
        <FoodGridSkeleton count={4} />
      ) : records.length === 0 ? (
        <div className="card-premium py-16 text-center">
          <p className="font-sans text-sm text-ink-3">No payroll records for {monthLabel}</p>
          <MotionButton onClick={processPayroll} disabled={processing} className="btn-primary mt-4 mx-auto gap-2">
            <Play size={14} /> Generate Payroll
          </MotionButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Summary card */}
          <div>
            <PayrollSummaryCard records={records} month={month} />
          </div>
          {/* Full table */}
          <div className="xl:col-span-2">
            <PayrollTable records={records} onUpdate={load} />
          </div>
        </div>
      )}

      <ExcelExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} type="payroll" data={records} label="Payroll" />
    </div>
  );
}
