import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MotionButton } from '@/components/ui/Button';
import { ExportProgress } from './ExportProgress';
import { excelHistoryService } from '@/services/excelHistoryService';
import { exportOrders, exportRevenue, exportInventory, exportStockInventory, exportEmployees, exportAttendance, exportPayroll, exportPerformance, exportShifts, exportLeaves, exportCustomers } from '@/services/excel/excelExport';
import { exportOrdersPDF, exportInventoryPDF, exportRevenuePDF } from '@/services/excel/pdfExport';
import toast from 'react-hot-toast';
import type { ExcelJobProgress } from '@/types/excel';

type ExportType = 'orders' | 'revenue' | 'inventory' | 'stock' | 'customers' | 'staff' | 'attendance' | 'payroll' | 'performance' | 'shifts' | 'leaves';
type ExportFormat = 'xlsx' | 'pdf';

interface Props {
  isOpen:    boolean;
  onClose:   () => void;
  type:      ExportType;
  data?:     any[];
  salesData?: any[];
  label?:    string;
}

const TYPE_META: Record<ExportType, { icon: string; label: string; pdfSupport: boolean }> = {
  orders:      { icon: '📦', label: 'Orders',    pdfSupport: true  },
  revenue:     { icon: '💰', label: 'Revenue',   pdfSupport: true  },
  inventory:   { icon: '📋', label: 'Inventory', pdfSupport: true  },
  stock:       { icon: '📦', label: 'Stock Inventory', pdfSupport: false },
  customers:   { icon: '👥', label: 'Customers', pdfSupport: false },
  staff:       { icon: '👤', label: 'Staff',     pdfSupport: false },
  attendance:  { icon: '🗓️', label: 'Attendance', pdfSupport: false },
  payroll:     { icon: '💵', label: 'Payroll',    pdfSupport: false },
  performance: { icon: '⭐', label: 'Performance', pdfSupport: false },
  shifts:      { icon: '🕐', label: 'Shift Schedule', pdfSupport: false },
  leaves:      { icon: '📝', label: 'Leave Requests', pdfSupport: false },
};

export const ExcelExportModal = ({ isOpen, onClose, type, data, salesData, label }: Props) => {
  const [format, setFormat]   = useState<ExportFormat>('xlsx');
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [progress, setProgress] = useState<ExcelJobProgress>({ status: 'idle', percent: 0 });
  const meta = TYPE_META[type];

  const doExport = async () => {
    setLoading(true);
    setProgress({ status: 'processing', percent: 30, message: `Generating ${format.toUpperCase()}…` });
    try {
      await new Promise(r => setTimeout(r, 400)); // brief UX pause
      setProgress({ status: 'processing', percent: 70, message: 'Writing file…' });
      if (format === 'xlsx') {
        if (type === 'orders')    exportOrders(data);
        if (type === 'revenue')   exportRevenue(salesData ?? []);
        if (type === 'inventory') exportInventory(data);
        if (type === 'stock')      exportStockInventory(data ?? []);
        if (type === 'customers')  exportCustomers(data ?? []);
        if (type === 'staff')      exportEmployees(data ?? []);
        if (type === 'attendance')  exportAttendance(data ?? []);
        if (type === 'payroll')     exportPayroll(data ?? []);
        if (type === 'performance') exportPerformance(data ?? []);
        if (type === 'shifts')      exportShifts(data ?? []);
        if (type === 'leaves')      exportLeaves(data ?? []);
      } else {
        if (type === 'orders')    exportOrdersPDF(data);
        if (type === 'revenue')   exportRevenuePDF(salesData ?? []);
        if (type === 'inventory') exportInventoryPDF();
      }
      setProgress({ status: 'done', percent: 100, message: 'Download ready' });
      setDone(true);
      toast.success(`${meta.label} exported as .${format}`);
      excelHistoryService.helper.logExport(
        type === 'staff' ? 'employees' : type === 'stock' ? 'inventory' : type,
        format,
        `${type}_export.${format}`,
        data?.length ?? salesData?.length ?? 0
      );
      setTimeout(() => { setDone(false); setProgress({ status: 'idle', percent: 0 }); onClose(); }, 1500);
    } catch (e) {
      setProgress({ status: 'error', percent: 0 });
      toast.error('Export failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={`Export ${label ?? meta.label}`}>
      <div className="space-y-5">
        {/* Format picker */}
        <div>
          <p className="font-display text-xs text-ink-3 uppercase tracking-widest mb-3">Format</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'xlsx', icon: <FileSpreadsheet size={18} />, label: 'Excel (.xlsx)', color: 'text-emerald-600 bg-emerald-50', disabled: false },
              { value: 'pdf',  icon: <FileText size={18} />,        label: 'PDF (.pdf)',    color: 'text-red-600 bg-red-50',
                disabled: !meta.pdfSupport },
            ] as const).map(f => (
              <button
                key={f.value}
                disabled={f.disabled}
                onClick={() => setFormat(f.value as ExportFormat)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  f.disabled ? 'opacity-40 cursor-not-allowed border-beige/30' :
                  format === f.value
                    ? 'border-espresso bg-canvas-2'
                    : 'border-beige/40 hover:border-gold/40'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${f.color}`}>{f.icon}</div>
                <span className="font-display text-xs text-espresso">{f.label}</span>
                {f.disabled && <span className="font-sans text-[10px] text-ink-3">Excel only</span>}
              </button>
            ))}
          </div>
        </div>

        {(loading || done) && <ExportProgress progress={progress} />}

        <MotionButton
          onClick={doExport}
          disabled={loading}
          className="btn-primary w-full justify-center gap-2"
        >
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <CheckCircle size={16} /> Exported!
              </motion.span>
            ) : loading ? (
              <motion.span key="loading" className="flex items-center gap-2">
                <Download size={16} className="animate-bounce" /> Exporting…
              </motion.span>
            ) : (
              <motion.span key="idle" className="flex items-center gap-2">
                <Download size={16} /> Export {meta.label}
              </motion.span>
            )}
          </AnimatePresence>
        </MotionButton>
      </div>
    </Modal>
  );
};
