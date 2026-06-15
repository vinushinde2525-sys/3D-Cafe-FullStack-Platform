import { AlertTriangle, X } from 'lucide-react';
import type { ImportError } from '@/services/excel/excelImport';

interface Props { errors: ImportError[]; onDismiss?: (i: number) => void; }

export const ImportErrors = ({ errors, onDismiss }: Props) => {
  if (errors.length === 0) return null;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100 border-b border-red-200">
        <AlertTriangle size={14} className="text-red-600 flex-shrink-0" />
        <p className="font-display text-xs text-red-700 font-semibold">{errors.length} validation error{errors.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {errors.map((e, i) => (
          <div key={i} className="flex items-start justify-between gap-3 px-4 py-2.5 border-b border-red-100 last:border-0">
            <div className="flex items-start gap-2 min-w-0">
              <span className="font-display text-[11px] text-red-500 font-semibold flex-shrink-0 mt-0.5">Row {e.row}</span>
              <div className="min-w-0">
                <p className="font-sans text-xs text-red-700 truncate">
                  <span className="font-medium">{e.column}:</span> {e.message}
                </p>
                {e.value !== null && e.value !== undefined && (
                  <p className="font-sans text-[10px] text-red-400 truncate">Value: "{String(e.value)}"</p>
                )}
              </div>
            </div>
            {onDismiss && (
              <button onClick={() => onDismiss(i)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
