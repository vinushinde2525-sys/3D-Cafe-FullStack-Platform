import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle, Download } from 'lucide-react';
import type { ExcelJobProgress } from '@/types/excel';

interface Props { progress: ExcelJobProgress; }

const STATUS_META: Record<ExcelJobProgress['status'], { label: string; icon: React.ReactNode; color: string }> = {
  idle:        { label: 'Ready',       icon: <Download size={14} />,          color: 'text-ink-3' },
  reading:     { label: 'Reading file…', icon: <Loader2 size={14} className="animate-spin" />, color: 'text-blue-600' },
  validating:  { label: 'Validating…',  icon: <Loader2 size={14} className="animate-spin" />, color: 'text-amber-600' },
  processing:  { label: 'Processing…',  icon: <Loader2 size={14} className="animate-spin" />, color: 'text-blue-600' },
  done:        { label: 'Complete',     icon: <CheckCircle size={14} />,       color: 'text-emerald-600' },
  error:       { label: 'Failed',       icon: <AlertCircle size={14} />,       color: 'text-red-600' },
};

export const ExportProgress = ({ progress }: Props) => {
  const meta = STATUS_META[progress.status];
  const barColor =
    progress.status === 'error' ? 'bg-red-500' :
    progress.status === 'done'  ? 'bg-emerald-500' : 'bg-espresso';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 font-display text-xs ${meta.color}`}>
          {meta.icon} {progress.message ?? meta.label}
        </span>
        <span className="font-display text-xs text-ink-3">
          {progress.totalRows !== undefined
            ? `${progress.processedRows ?? 0}/${progress.totalRows} rows`
            : `${Math.round(progress.percent)}%`}
        </span>
      </div>
      <div className="w-full h-2 bg-beige/40 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <AnimatePresence>
        {progress.status === 'error' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-sans text-[11px] text-red-600">
            Something went wrong. Please try again.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
