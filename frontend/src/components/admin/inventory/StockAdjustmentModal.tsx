import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, RefreshCw, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';
import { inventoryERP } from '@/services/inventoryERPService';
import toast from 'react-hot-toast';
import type { InventoryItem } from '@/types/inventory';

type AdjType = 'restock' | 'usage' | 'adjustment' | 'waste';

interface Props {
  item:      InventoryItem | null;
  type?:     AdjType;
  isOpen:    boolean;
  onClose:   () => void;
  onSuccess: () => void;
}

const TYPE_META: Record<AdjType, { label: string; icon: React.ReactNode; color: string; dir: 1 | -1 }> = {
  restock:    { label: 'Restock',    icon: <ArrowUp   size={16} />, color: 'text-emerald-600', dir:  1 },
  usage:      { label: 'Usage',      icon: <ArrowDown size={16} />, color: 'text-amber-600',   dir: -1 },
  adjustment: { label: 'Adjustment', icon: <RefreshCw size={16} />, color: 'text-blue-600',    dir:  1 },
  waste:      { label: 'Waste',      icon: <Trash2    size={16} />, color: 'text-red-500',     dir: -1 },
};

export const StockAdjustmentModal = ({ item, type = 'restock', isOpen, onClose, onSuccess }: Props) => {
  const [adjType, setAdjType] = useState<AdjType>(type);
  const [qty,     setQty]     = useState('');
  const [note,    setNote]    = useState('');
  const [saving,  setSaving]  = useState(false);

  if (!item) return null;
  const meta = TYPE_META[adjType];

  const newStock = item.currentStock + (parseFloat(qty) || 0) * meta.dir;
  const valid    = parseFloat(qty) > 0 && (adjType !== 'usage' && adjType !== 'waste' || newStock >= 0);

  const submit = async () => {
    if (!valid) { toast.error('Enter a valid quantity'); return; }
    setSaving(true);
    try {
      await inventoryERP.adjustStock(item._id, Math.abs(parseFloat(qty)), adjType, note || `Manual ${adjType}`);
      toast.success(`Stock ${adjType === 'restock' ? 'added' : adjType === 'usage' ? 'reduced' : 'adjusted'}: ${qty} ${item.unit}`);
      onSuccess(); onClose();
      setQty(''); setNote('');
    } catch { toast.error('Adjustment failed'); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust Stock — ${item.name}`} size="sm">
      <div className="space-y-5">
        {/* Type tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-canvas-2 rounded-xl p-1">
          {(Object.keys(TYPE_META) as AdjType[]).map(t => (
            <button key={t} onClick={() => setAdjType(t)}
              className={`py-1.5 rounded-lg font-display text-[11px] font-medium transition-all capitalize ${adjType === t ? 'bg-cream shadow-warm-sm text-espresso' : 'text-ink-3 hover:text-espresso'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Current stock info */}
        <div className="flex items-center justify-between px-4 py-3 bg-canvas-2 rounded-xl">
          <div>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Current Stock</p>
            <p className="font-serif text-lg text-espresso">{item.currentStock} <span className="text-sm text-ink-3">{item.unit}</span></p>
          </div>
          <div className="text-right">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Unit Value</p>
            <p className="font-display text-sm text-espresso">{formatPrice(item.costPerUnit)}/{item.unit}</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="font-display text-xs text-ink-3 uppercase tracking-wide">
            Quantity ({item.unit})
          </label>
          <input
            type="number" min="0" step="0.1"
            value={qty} onChange={e => setQty(e.target.value)}
            placeholder={`Enter ${adjType === 'adjustment' ? 'new total' : 'quantity'}`}
            className="input-base w-full text-lg font-serif text-center h-12"
          />
        </div>

        {/* Preview */}
        {qty && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
              newStock < 0 ? 'bg-red-50 border-red-200' :
              newStock <= item.minimumStock ? 'bg-amber-50 border-amber-200' :
              'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div>
              <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">New Stock</p>
              <p className={`font-serif text-lg ${newStock < 0 ? 'text-red-600' : newStock <= item.minimumStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                {Math.max(0, newStock).toFixed(1)} {item.unit}
              </p>
            </div>
            {item.costPerUnit > 0 && (
              <div className="text-right">
                <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">
                  {adjType === 'restock' ? 'Cost' : 'Value'}
                </p>
                <p className="font-display text-sm text-espresso">
                  {formatPrice((parseFloat(qty) || 0) * item.costPerUnit)}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Note */}
        <Input label="Note (optional)" placeholder={`Reason for ${adjType}…`} value={note}
          onChange={e => setNote(e.target.value)} />

        <MotionButton onClick={submit} disabled={!valid || saving} className={`btn-primary w-full justify-center gap-2 ${!valid ? 'opacity-50' : ''}`}>
          <span className={meta.color}>{meta.icon}</span>
          {saving ? 'Saving…' : `${meta.label} ${qty ? `${qty} ${item.unit}` : ''}`}
        </MotionButton>
      </div>
    </Modal>
  );
};
