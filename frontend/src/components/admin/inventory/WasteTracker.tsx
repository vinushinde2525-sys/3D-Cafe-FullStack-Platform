import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, TrendingDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MotionButton } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/utils/format';
import { wasteService } from '@/services/inventoryERPService';
import toast from 'react-hot-toast';
import type { WasteRecord, InventoryItem } from '@/types/inventory';

const WASTE_REASONS = [
  { value: 'expired',        label: '⏰ Expired'         },
  { value: 'damaged',        label: '💔 Damaged'         },
  { value: 'spillage',       label: '💧 Spillage'        },
  { value: 'overproduction', label: '📦 Overproduction'  },
  { value: 'theft',          label: '🔒 Theft'           },
  { value: 'other',          label: '📋 Other'           },
] as const;

const REASON_COLORS: Record<string, string> = {
  expired: 'bg-red-100 text-red-700', damaged: 'bg-orange-100 text-orange-700',
  spillage: 'bg-blue-100 text-blue-700', overproduction: 'bg-amber-100 text-amber-700',
  theft: 'bg-rose-100 text-rose-700', other: 'bg-slate-100 text-slate-700',
};

interface Props { records: WasteRecord[]; inventoryItems: InventoryItem[]; onUpdate: () => void; }

export const WasteTracker = ({ records, inventoryItems, onUpdate }: Props) => {
  const [showForm, setShowForm]   = useState(false);
  const [itemId,   setItemId]     = useState('');
  const [qty,      setQty]        = useState('');
  const [reason,   setReason]     = useState<string>('expired');
  const [note,     setNote]       = useState('');
  const [saving,   setSaving]     = useState(false);

  const totalLoss = records.reduce((s, r) => s + r.costLoss, 0);
  const todayLoss = records.filter(r => r.createdAt > new Date(Date.now() - 86400000).toISOString()).reduce((s, r) => s + r.costLoss, 0);

  const selectedItem = inventoryItems.find(i => i._id === itemId);
  const costLoss = selectedItem ? (parseFloat(qty) || 0) * selectedItem.costPerUnit : 0;

  const submit = async () => {
    if (!itemId || !qty || parseFloat(qty) <= 0) { toast.error('Select item and enter quantity'); return; }
    setSaving(true);
    try {
      await wasteService.create({
        inventoryItem: itemId,
        itemName: selectedItem?.name ?? '',
        quantity: parseFloat(qty),
        unit: selectedItem?.unit ?? 'pieces',
        reason: reason as any,
        costLoss,
        note,
        reportedBy: 'demo-admin',
      });
      toast.success('Waste recorded');
      onUpdate(); setShowForm(false);
      setItemId(''); setQty(''); setNote('');
    } catch { toast.error('Failed to record waste'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Waste Cost',  value: formatPrice(totalLoss),  cls: 'text-red-600'  },
          { label: "Today's Loss",      value: formatPrice(todayLoss),  cls: 'text-amber-600'},
          { label: 'Incidents',         value: records.length,          cls: 'text-espresso' },
        ].map(s => (
          <div key={s.label} className="card-premium p-4 text-center">
            <p className={`font-serif text-xl ${s.cls}`}>{s.value}</p>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Log button */}
      <div className="flex justify-between items-center">
        <p className="font-display text-xs text-ink-3 uppercase tracking-widest">Recent Waste</p>
        <MotionButton onClick={() => setShowForm(true)} className="btn-secondary text-xs gap-1.5 h-8 px-3">
          <Plus size={12} /> Log Waste
        </MotionButton>
      </div>

      {/* Records table */}
      <div className="overflow-x-auto rounded-2xl border border-beige/40">
        <table className="w-full text-sm">
          <thead className="bg-canvas-2 border-b border-beige/40">
            <tr>
              {['Date','Item','Qty','Reason','Cost Loss','Reported By','Note'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence>
              {records.map((r, i) => (
                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-canvas-2/40 transition-colors">
                  <td className="px-4 py-3 font-sans text-xs text-ink-3 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-espresso">{r.itemName}</td>
                  <td className="px-4 py-3 font-display text-xs text-espresso">{r.quantity} {r.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${REASON_COLORS[r.reason] ?? 'bg-slate-100 text-slate-700'}`}>
                      {r.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-display text-xs text-red-600 font-semibold">{formatPrice(r.costLoss)}</td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-3">{r.reportedBy}</td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-3 max-w-[140px] truncate">{r.note ?? '—'}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="py-10 text-center"><p className="font-sans text-sm text-ink-3">No waste records yet</p></div>
        )}
      </div>

      {/* Log Waste Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Log Waste" size="sm">
        <div className="space-y-4">
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Item</label>
            <select value={itemId} onChange={e => setItemId(e.target.value)}
              className="input-base w-full text-sm">
              <option value="">Select item…</option>
              {inventoryItems.map(i => <option key={i._id} value={i._id}>{i.name} ({i.currentStock} {i.unit})</option>)}
            </select>
          </div>
          <Input label={`Quantity${selectedItem ? ` (${selectedItem.unit})` : ''}`} type="number" min="0.1" step="0.1"
            placeholder="Enter quantity wasted" value={qty} onChange={e => setQty(e.target.value)} />
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Reason</label>
            <div className="grid grid-cols-3 gap-2">
              {WASTE_REASONS.map(r => (
                <button key={r.value} onClick={() => setReason(r.value)}
                  className={`py-2 px-3 rounded-xl font-display text-xs border transition-all ${reason === r.value ? 'border-espresso bg-espresso/5 text-espresso' : 'border-beige/40 text-ink-2 hover:border-gold/40'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <Input label="Note (optional)" placeholder="What happened?" value={note} onChange={e => setNote(e.target.value)} />
          {costLoss > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
              <TrendingDown size={14} className="text-red-600" />
              <p className="font-display text-sm text-red-700">Cost Loss: <strong>{formatPrice(costLoss)}</strong></p>
            </motion.div>
          )}
          <MotionButton onClick={submit} disabled={saving || !itemId || !qty}
            className="btn-primary w-full justify-center gap-2">
            <Trash2 size={14} /> {saving ? 'Saving…' : 'Log Waste'}
          </MotionButton>
        </div>
      </Modal>
    </div>
  );
};
