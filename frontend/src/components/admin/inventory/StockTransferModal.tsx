import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { inventoryERP } from '@/services/inventoryERPService';
import toast from 'react-hot-toast';
import type { InventoryItem } from '@/types/inventory';

const LOCATIONS = ['Storage A1','Storage A2','Fridge 1','Fridge 2','Freezer A','Dry Store','Bread Rack','Spice Rack','Store Room','Cold Room','Bar Station','Kitchen Line'];

interface Props { item: InventoryItem | null; isOpen: boolean; onClose: () => void; onSuccess: () => void; }

export const StockTransferModal = ({ item, isOpen, onClose, onSuccess }: Props) => {
  const [qty,    setQty]    = useState('');
  const [from,   setFrom]   = useState('');
  const [to,     setTo]     = useState('');
  const [note,   setNote]   = useState('');
  const [saving, setSaving] = useState(false);

  if (!item) return null;

  const valid = parseFloat(qty) > 0 && from && to && from !== to && parseFloat(qty) <= item.currentStock;

  const submit = async () => {
    if (!valid) { toast.error('Check quantity and locations'); return; }
    setSaving(true);
    try {
      await inventoryERP.adjustStock(
        item._id, parseFloat(qty), 'transfer',
        `Transfer: ${from} → ${to}${note ? ` · ${note}` : ''}`
      );
      toast.success(`Transferred ${qty} ${item.unit} of ${item.name}`);
      onSuccess(); onClose();
      setQty(''); setFrom(''); setTo(''); setNote('');
    } catch { toast.error('Transfer failed'); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Transfer Stock — ${item.name}`} size="sm">
      <div className="space-y-4">
        {/* Item info */}
        <div className="flex items-center justify-between px-4 py-3 bg-canvas-2 rounded-xl">
          <div>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Available</p>
            <p className="font-serif text-lg text-espresso">{item.currentStock} <span className="text-sm text-ink-3">{item.unit}</span></p>
          </div>
          <div className="text-right">
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Current Location</p>
            <p className="font-display text-sm text-espresso">{item.location ?? 'Unassigned'}</p>
          </div>
        </div>

        {/* Qty */}
        <Input label={`Quantity (${item.unit})`} type="number" min="0.1" step="0.1" max={item.currentStock}
          placeholder="How much to transfer?" value={qty} onChange={e => setQty(e.target.value)} />

        {/* From / To */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-2">
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="input-base w-full text-sm">
              <option value="">Select location…</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="pb-2 flex items-center justify-center w-8">
            <ArrowLeftRight size={16} className="text-ink-3" />
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">To</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="input-base w-full text-sm">
              <option value="">Select location…</option>
              {LOCATIONS.filter(l => l !== from).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {from && to && from === to && (
          <p className="font-sans text-xs text-red-500">Source and destination must be different</p>
        )}

        <Input label="Note (optional)" placeholder="Reason for transfer…" value={note} onChange={e => setNote(e.target.value)} />

        <MotionButton onClick={submit} disabled={!valid || saving} className={`btn-primary w-full justify-center gap-2 ${!valid ? 'opacity-50' : ''}`}>
          <ArrowLeftRight size={14} /> {saving ? 'Transferring…' : `Transfer ${qty || ''} ${item.unit}`}
        </MotionButton>
      </div>
    </Modal>
  );
};
