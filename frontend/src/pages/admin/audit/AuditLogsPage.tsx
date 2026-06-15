import { useState, useEffect, useCallback } from 'react';
import { Trash2, ShieldCheck } from 'lucide-react';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { auditLogService } from '@/services/auditLogService';
import { formatDate } from '@/utils/format';
import toast from 'react-hot-toast';
import type { AuditLogEntry } from '@/services/auditLogService';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700', update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700', block: 'bg-red-100 text-red-700',
  unblock: 'bg-emerald-100 text-emerald-700', export: 'bg-amber-100 text-amber-700',
  import: 'bg-amber-100 text-amber-700', login: 'bg-slate-100 text-slate-700',
  status_change: 'bg-violet-100 text-violet-700',
};

export default function AuditLogsPage() {
  const [logs, setLogs]       = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<string>('all');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try { setLogs(await auditLogService.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const clear = async () => {
    if (!confirm('Clear the entire audit log?')) return;
    await auditLogService.clear();
    toast.success('Audit log cleared');
    fetchLogs();
  };

  const modules = ['all', ...Array.from(new Set(logs.map(l => l.module)))];
  const filtered = filter === 'all' ? logs : logs.filter(l => l.module === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso flex items-center gap-2">
          <ShieldCheck size={22} className="text-espresso/70" /> Audit Logs
        </h1>
        {logs.length > 0 && (
          <button onClick={clear} className="font-display text-xs text-red-600 hover:text-red-800 flex items-center gap-1">
            <Trash2 size={12} /> Clear Log
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {modules.map(m => (
          <button key={m} onClick={() => setFilter(m)}
            className={`px-3 py-1.5 rounded-full font-display text-xs capitalize transition-all ${
              filter === m ? 'bg-espresso text-cream' : 'bg-cream border border-beige/60 text-ink-2 hover:border-gold/40'
            }`}>
            {m.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="card-premium overflow-hidden">
        {loading ? <div className="p-6"><DashboardSkeleton /></div> : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-sans text-sm text-ink-3">No actions logged yet. Admin actions like blocking customers, deleting inventory items, and Excel imports/exports will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-canvas-2 border-b border-beige/40">
              <tr>
                <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">Action</th>
                <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">Module</th>
                <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">Target</th>
                <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">By</th>
                <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20">
              {filtered.map(l => (
                <tr key={l._id} className="hover:bg-canvas-2/50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${ACTION_COLORS[l.action] ?? 'bg-slate-100 text-slate-700'}`}>
                      {l.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-2 capitalize">{l.module.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-sans text-xs text-espresso">{l.target}</td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-3 capitalize">{l.performedBy}</td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-3 whitespace-nowrap">{formatDate(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
