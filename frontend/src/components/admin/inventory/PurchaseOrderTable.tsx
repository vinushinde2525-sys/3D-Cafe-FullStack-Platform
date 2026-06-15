import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, CheckCircle, XCircle, Send } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import { purchaseOrderService } from '@/services/inventoryERPService';
import { MOCK_SUPPLIERS } from '@/services/mockInventory';
import toast from 'react-hot-toast';
import type { PurchaseOrder, POStatus } from '@/types/inventory';

const STATUS_STYLE: Record<POStatus, { cls: string; label: string }> = {
  draft:     { cls: 'bg-slate-100 text-slate-600',   label: 'Draft'     },
  sent:      { cls: 'bg-blue-100 text-blue-700',     label: 'Sent'      },
  partial:   { cls: 'bg-amber-100 text-amber-700',   label: 'Partial'   },
  received:  { cls: 'bg-emerald-100 text-emerald-700', label: 'Received' },
  cancelled: { cls: 'bg-red-100 text-red-700',       label: 'Cancelled' },
};

function supplierName(po: PurchaseOrder): string {
  if (typeof po.supplier === 'object') return (po.supplier as any).name;
  return MOCK_SUPPLIERS.find(s => s._id === po.supplier)?.name ?? po.supplier;
}

interface Props { orders: PurchaseOrder[]; onView: (po: PurchaseOrder) => void; onUpdate: () => void; }

export const PurchaseOrderTable = ({ orders, onView, onUpdate }: Props) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [acting, setActing] = useState<string | null>(null);

  const filtered = useMemo(() =>
    orders.filter(o =>
      (status === 'all' || o.status === status) &&
      (!search || o.poNumber.toLowerCase().includes(search.toLowerCase()) || supplierName(o).toLowerCase().includes(search.toLowerCase()))
    ), [orders, search, status]);

  const changeStatus = async (po: PurchaseOrder, newStatus: POStatus) => {
    setActing(po._id);
    try {
      await purchaseOrderService.updateStatus(po._id, newStatus);
      toast.success(`PO ${po.poNumber} marked as ${newStatus}`);
      onUpdate();
    } catch { toast.error('Status update failed'); }
    finally { setActing(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search PO#, supplier…" className="input-base pl-9 h-9 w-full text-sm" />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none">
          <option value="all">All Status</option>
          {Object.entries(STATUS_STYLE).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-beige/40">
        <table className="w-full text-sm">
          <thead className="bg-canvas-2 border-b border-beige/40 sticky top-0">
            <tr>
              {['PO #','Supplier','Items','Subtotal','Tax','Total','Expected','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence initial={false}>
              {filtered.map((po, i) => {
                const st = STATUS_STYLE[po.status];
                return (
                  <motion.tr key={po._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }} className="hover:bg-canvas-2/50 transition-colors">
                    <td className="px-4 py-3 font-display text-xs text-espresso font-semibold">{po.poNumber}</td>
                    <td className="px-4 py-3 font-sans text-xs text-espresso">{supplierName(po)}</td>
                    <td className="px-4 py-3 font-sans text-xs text-ink-2">{po.items.length} item{po.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 font-display text-xs text-espresso">{formatPrice(po.subtotal)}</td>
                    <td className="px-4 py-3 font-display text-xs text-ink-2">{formatPrice(po.tax)}</td>
                    <td className="px-4 py-3 font-display text-xs text-espresso font-semibold">{formatPrice(po.total)}</td>
                    <td className="px-4 py-3 font-sans text-xs text-ink-3 whitespace-nowrap">
                      {new Date(po.expectedDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-display text-[10px] ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => onView(po)} title="View" className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center">
                          <Eye size={12} />
                        </button>
                        {po.status === 'draft' && (
                          <button onClick={() => changeStatus(po, 'sent')} disabled={acting === po._id} title="Send PO"
                            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center">
                            <Send size={12} />
                          </button>
                        )}
                        {po.status === 'sent' && (
                          <button onClick={() => changeStatus(po, 'received')} disabled={acting === po._id} title="Mark Received"
                            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center">
                            <CheckCircle size={12} />
                          </button>
                        )}
                        {(po.status === 'draft' || po.status === 'sent') && (
                          <button onClick={() => changeStatus(po, 'cancelled')} disabled={acting === po._id} title="Cancel"
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                            <XCircle size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center"><p className="font-sans text-sm text-ink-3">No purchase orders found</p></div>
        )}
      </div>
    </div>
  );
};
