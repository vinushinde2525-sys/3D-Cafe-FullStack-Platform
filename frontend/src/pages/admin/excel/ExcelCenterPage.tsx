import { useState, useEffect, useCallback } from 'react';
import { Upload, Download, FileSpreadsheet, History, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { MotionButton } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { ExcelImportModal } from '@/components/admin/excel/ExcelImportModal';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { TEMPLATE_CONFIGS } from '@/services/excel/excelTemplates';
import { excelHistoryService } from '@/services/excelHistoryService';
import { formatDate } from '@/utils/format';
import toast from 'react-hot-toast';
import type { ExcelHistoryEntry, ExcelEntity } from '@/types/excel';

type Tab = 'import' | 'export' | 'templates' | 'history';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'import',    label: 'Import',    icon: <Upload size={14} /> },
  { key: 'export',    label: 'Export',    icon: <Download size={14} /> },
  { key: 'templates', label: 'Templates', icon: <FileSpreadsheet size={14} /> },
  { key: 'history',   label: 'History',   icon: <History size={14} /> },
];

const IMPORT_ENTITIES: { value: ExcelEntity; label: string }[] = [
  { value: 'products',  label: 'Products' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'coupons',   label: 'Coupons' },
  { value: 'customers', label: 'Customers' },
];

const EXPORT_ENTITIES: { value: 'orders' | 'revenue' | 'inventory' | 'customers'; label: string }[] = [
  { value: 'orders',    label: 'Orders' },
  { value: 'revenue',   label: 'Revenue' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'customers', label: 'Customers' },
];

export default function ExcelCenterPage() {
  const [tab, setTab] = useState<Tab>('import');
  const [history, setHistory] = useState<ExcelHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [importType, setImportType] = useState<ExcelEntity>('products');
  const [importOpen, setImportOpen] = useState(false);
  const [exportType, setExportType] = useState<'orders' | 'revenue' | 'inventory' | 'customers'>('orders');
  const [exportOpen, setExportOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try { setHistory(await excelHistoryService.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const clearHistory = async () => {
    if (!confirm('Clear all Excel history?')) return;
    await excelHistoryService.clear();
    toast.success('History cleared');
    fetchHistory();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-espresso">Excel Center</h1>

      <div className="flex gap-1 border-b border-beige/40 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-display text-xs whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key ? 'border-espresso text-espresso' : 'border-transparent text-ink-3 hover:text-ink-2'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'import' && (
        <div className="card-premium p-6 space-y-4">
          <p className="font-sans text-sm text-ink-2">Bring data into the system from an Excel or CSV file. Pick what you want to import:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {IMPORT_ENTITIES.map(e => (
              <button key={e.value} onClick={() => { setImportType(e.value); setImportOpen(true); }}
                className="card-premium p-4 text-center hover:border-gold/40 border border-transparent transition-all">
                <FileSpreadsheet size={20} className="mx-auto mb-2 text-espresso/60" />
                <p className="font-display text-xs text-espresso">{e.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'export' && (
        <div className="card-premium p-6 space-y-4">
          <p className="font-sans text-sm text-ink-2">Export current data as Excel or PDF:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EXPORT_ENTITIES.map(e => (
              <button key={e.value} onClick={() => { setExportType(e.value); setExportOpen(true); }}
                className="card-premium p-4 text-center hover:border-gold/40 border border-transparent transition-all">
                <Download size={20} className="mx-auto mb-2 text-espresso/60" />
                <p className="font-display text-xs text-espresso">{e.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'templates' && (
        <div className="card-premium p-6">
          <p className="font-sans text-sm text-ink-2 mb-4">Download a starter template for any import type:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEMPLATE_CONFIGS.map(t => (
              <div key={t.label} className="flex items-center justify-between p-4 rounded-xl border border-beige/40">
                <div>
                  <p className="font-display text-sm text-espresso">{t.label}</p>
                  <p className="font-sans text-xs text-ink-3">{t.description}</p>
                </div>
                <MotionButton onClick={t.download} className="btn-secondary text-xs gap-1.5 h-8 px-3">
                  <Download size={12} /> Download
                </MotionButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card-premium overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-beige/40">
            <p className="font-display text-xs text-ink-3 uppercase tracking-wide">{history.length} actions logged</p>
            {history.length > 0 && (
              <button onClick={clearHistory} className="font-display text-xs text-red-600 hover:text-red-800 flex items-center gap-1">
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>
          {loading ? <div className="p-6"><DashboardSkeleton /></div> : history.length === 0 ? (
            <div className="py-12 text-center"><p className="font-sans text-sm text-ink-3">No import/export activity yet.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-canvas-2 border-b border-beige/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">Action</th>
                    <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">Entity</th>
                    <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">File</th>
                    <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">Rows</th>
                    <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">Status</th>
                    <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/20">
                  {history.map(h => (
                    <tr key={h._id} className="hover:bg-canvas-2/50">
                      <td className="px-4 py-3 font-display text-xs text-espresso capitalize">{h.action}</td>
                      <td className="px-4 py-3 font-sans text-xs text-ink-2 capitalize">{h.entity}</td>
                      <td className="px-4 py-3 font-sans text-xs text-ink-2">{h.fileName}</td>
                      <td className="px-4 py-3 font-sans text-xs text-ink-2">{h.rowCount}</td>
                      <td className="px-4 py-3">
                        {h.errorCount > 0 ? (
                          <span className="flex items-center gap-1 font-display text-[10px] text-amber-700"><XCircle size={11} /> {h.errorCount} errors</span>
                        ) : (
                          <span className="flex items-center gap-1 font-display text-[10px] text-emerald-700"><CheckCircle size={11} /> Clean</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-ink-3 whitespace-nowrap">{formatDate(h.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <ExcelImportModal isOpen={importOpen} onClose={() => { setImportOpen(false); fetchHistory(); }} type={importType as any} />
      <ExcelExportModal isOpen={exportOpen} onClose={() => { setExportOpen(false); fetchHistory(); }} type={exportType} label={EXPORT_ENTITIES.find(e => e.value === exportType)?.label} />
    </div>
  );
}
