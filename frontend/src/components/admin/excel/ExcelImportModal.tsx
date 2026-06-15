import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MotionButton } from '@/components/ui/Button';
import { ImportPreview } from './ImportPreview';
import { ImportErrors } from './ImportErrors';
import { parseFile, validateProductRows, detectDuplicates } from '@/services/excel/excelImport';
import { TEMPLATE_CONFIGS } from '@/services/excel/excelTemplates';
import { excelHistoryService } from '@/services/excelHistoryService';
import { MOCK_FOOD_ITEMS } from '@/services/mockData';
import toast from 'react-hot-toast';
import type { ImportRow, ImportResult } from '@/services/excel/excelImport';

type ImportType = 'products' | 'inventory' | 'coupons' | 'customers';
type Stage = 'upload' | 'preview' | 'importing' | 'done' | 'error';

interface Props { isOpen: boolean; onClose: () => void; type?: ImportType; }

export const ExcelImportModal = ({ isOpen, onClose, type = 'products' }: Props) => {
  const [stage,   setStage]   = useState<Stage>('upload');
  const [result,  setResult]  = useState<ImportResult | null>(null);
  const [dupes,   setDupes]   = useState<string[]>([]);
  const [valid,   setValid]   = useState<ImportRow[]>([]);
  const [errors,  setErrors]  = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStage('upload'); setResult(null); setDupes([]); setValid([]); setErrors([]); setProgress(0);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Please upload an Excel (.xlsx/.xls) or CSV file');
      return;
    }
    try {
      const parsed = await parseFile(file);
      if (type === 'products') {
        const { valid: v, errors: e } = validateProductRows(parsed.rows);
        const existingNames = MOCK_FOOD_ITEMS.map(i => i.name);
        const { dupes: d, unique } = detectDuplicates(v, existingNames);
        setValid(unique); setDupes(d); setErrors(e);
        setResult({ ...parsed, valid: unique.length, rows: unique });
      } else {
        setValid(parsed.rows); setResult(parsed);
      }
      setStage('preview');
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, [type]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const doImport = async () => {
    setStage('importing'); setProgress(0);
    // Simulate progress (real import would use API)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 80));
      setProgress(i);
    }
    setStage('done');
    toast.success(`${valid.length} ${type} imported successfully (demo mode)`);
    excelHistoryService.helper.logImport(type, `${type}_import.xlsx`, valid.length, errors.length);
  };

  const templateCfg = TEMPLATE_CONFIGS.find(c => c.label.toLowerCase() === type) ?? TEMPLATE_CONFIGS[0];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" title={`Import ${templateCfg.label}`}>
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {/* ── Stage: upload ── */}
          {stage === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Template download */}
              <div className="flex items-center justify-between mb-4 p-3 bg-canvas-2 rounded-xl border border-beige/40">
                <div>
                  <p className="font-display text-xs text-espresso font-medium">Need a template?</p>
                  <p className="font-sans text-[11px] text-ink-3">{templateCfg.description}</p>
                </div>
                <MotionButton onClick={templateCfg.download} className="btn-secondary text-xs gap-1.5 h-8 px-3">
                  <Download size={12} /> Template
                </MotionButton>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-beige/60 rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-gold/50 hover:bg-canvas-2 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-espresso/5 flex items-center justify-center">
                  <FileSpreadsheet size={26} className="text-espresso/60" />
                </div>
                <div className="text-center">
                  <p className="font-display text-sm text-espresso font-medium">Drop your file here</p>
                  <p className="font-sans text-xs text-ink-3 mt-0.5">or click to browse · .xlsx, .xls, .csv</p>
                </div>
                <input
                  ref={fileRef} type="file" accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            </motion.div>
          )}

          {/* ── Stage: preview ── */}
          {stage === 'preview' && result && (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Rows',  value: result.total,  color: 'text-espresso' },
                  { label: 'Valid',       value: valid.length,  color: 'text-emerald-600' },
                  { label: 'Errors',      value: errors.length, color: errors.length ? 'text-red-600' : 'text-emerald-600' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 bg-canvas-2 rounded-xl">
                    <p className={`font-serif text-xl ${s.color}`}>{s.value}</p>
                    <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Duplicate warning */}
              {dupes.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="font-sans text-xs text-amber-700">
                    <strong>{dupes.length} duplicate{dupes.length !== 1 ? 's' : ''} skipped:</strong> {dupes.slice(0, 3).join(', ')}{dupes.length > 3 ? ` +${dupes.length - 3} more` : ''}
                  </p>
                </div>
              )}

              <ImportPreview headers={result.headers} rows={valid} dupes={dupes} />
              {errors.length > 0 && <ImportErrors errors={errors} />}

              <div className="flex gap-3 pt-2">
                <button onClick={reset} className="btn-secondary flex-1 justify-center text-sm">
                  ← Back
                </button>
                <MotionButton
                  onClick={doImport}
                  disabled={valid.length === 0}
                  className="btn-primary flex-1 justify-center gap-2 text-sm"
                >
                  <Upload size={14} /> Import {valid.length} row{valid.length !== 1 ? 's' : ''}
                </MotionButton>
              </div>
            </motion.div>
          )}

          {/* ── Stage: importing ── */}
          {stage === 'importing' && (
            <motion.div key="importing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-espresso/5 flex items-center justify-center mx-auto">
                <Upload size={24} className="text-espresso animate-bounce" />
              </div>
              <p className="font-display text-sm text-espresso">Importing {valid.length} rows…</p>
              <div className="w-full bg-beige/40 rounded-full h-2">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                  className="h-2 bg-espresso rounded-full"
                />
              </div>
              <p className="font-sans text-xs text-ink-3">{progress}%</p>
            </motion.div>
          )}

          {/* ── Stage: done ── */}
          {stage === 'done' && (
            <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-serif text-xl text-espresso">Import Complete</p>
                <p className="font-sans text-sm text-ink-3 mt-1">{valid.length} {type} imported successfully</p>
              </div>
              <MotionButton onClick={handleClose} className="btn-primary mx-auto">Done</MotionButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
