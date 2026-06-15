import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { purchaseOrderService } from '@/services/inventoryERPService';
import { MOCK_SUPPLIERS } from '@/services/mockInventory';
import { formatPrice } from '@/utils/format';
import toast from 'react-hot-toast';
import type { InventoryItem, PurchaseOrderItem } from '@/types/inventory';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inventoryItems: InventoryItem[];
}

interface LineDraft { inventoryItem: string; name: string; unit: string; quantity: number; unitPrice: number; }

const BLANK_LINE: LineDraft = { inventoryItem: '', name: '', unit: '', quantity: 1, unitPrice: 0 };

export const PurchaseOrderEditor = ({ isOpen, onClose, onSuccess, inventoryItems }: Props) => {
  const [supplier, setSupplier] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<LineDraft[]>([{ ...BLANK_LINE }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSupplier(MOCK_SUPPLIERS[0]?._id ?? '');
      setExpectedDate(new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
      setShippingCost(0);
      setNotes('');
      setLines([{ ...BLANK_LINE }]);
    }
  }, [isOpen]);

  const updateLine = (i: number, patch: Partial<LineDraft>) => {
    setLines(ls => ls.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  };

  const pickItem = (i: number, itemId: string) => {
    const item = inventoryItems.find(it => it._id === itemId);
    updateLine(i, {
      inventoryItem: itemId,
      name: item?.name ?? '',
      unit: item?.unit ?? '',
      unitPrice: item?.costPerUnit ?? 0,
    });
  };

  const addLine = () => setLines(ls => [...ls, { ...BLANK_LINE }]);
  const removeLine = (i: number) => setLines(ls => ls.filter((_, idx) => idx !== i));

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + tax + Number(shippingCost || 0);

  const submit = async () => {
    if (!supplier) { toast.error('Select a supplier'); return; }
    const validLines = lines.filter(l => l.inventoryItem && l.quantity > 0);
    if (validLines.length === 0) { toast.error('Add at least one item'); return; }

    setSaving(true);
    try {
      const items: PurchaseOrderItem[] = validLines.map(l => ({
        inventoryItem: l.inventoryItem,
        name: l.name,
        unit: l.unit as any,
        quantity: l.quantity,
        receivedQty: 0,
        unitPrice: l.unitPrice,
        totalPrice: l.quantity * l.unitPrice,
      }));
      await purchaseOrderService.create({
        supplier,
        items,
        subtotal,
        tax,
        shippingCost: Number(shippingCost || 0),
        total,
        expectedDate: new Date(expectedDate).toISOString(),
        notes,
        createdBy: 'admin',
      });
      toast.success('Purchase order created');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to create purchase order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Purchase Order" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Supplier</label>
            <select value={supplier} onChange={e => setSupplier(e.target.value)} className="input-base w-full text-sm">
              {MOCK_SUPPLIERS.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <Input label="Expected Delivery" type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide">Items</label>
            <button onClick={addLine} className="font-display text-xs text-espresso hover:text-gold flex items-center gap-1">
              <Plus size={12} /> Add line
            </button>
          </div>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <select value={l.inventoryItem} onChange={e => pickItem(i, e.target.value)}
                  className="input-base flex-1 text-sm">
                  <option value="">Select item…</option>
                  {inventoryItems.map(it => <option key={it._id} value={it._id}>{it.name}</option>)}
                </select>
                <input type="number" min={1} value={l.quantity}
                  onChange={e => updateLine(i, { quantity: Number(e.target.value) })}
                  className="input-base w-20 text-sm" placeholder="Qty" />
                <input type="number" min={0} step="0.01" value={l.unitPrice}
                  onChange={e => updateLine(i, { unitPrice: Number(e.target.value) })}
                  className="input-base w-28 text-sm" placeholder="Unit ₹" />
                <span className="font-display text-xs text-ink-3 w-20 text-right">{formatPrice(l.quantity * l.unitPrice)}</span>
                <button onClick={() => removeLine(i)} disabled={lines.length === 1}
                  className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-30 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Shipping Cost (₹)" type="number" min={0} step="0.01" value={shippingCost}
            onChange={e => setShippingCost(Number(e.target.value))} />
          <Input label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <div className="rounded-xl bg-canvas-2 p-4 space-y-1">
          <div className="flex justify-between font-sans text-xs text-ink-3"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between font-sans text-xs text-ink-3"><span>Tax (5%)</span><span>{formatPrice(tax)}</span></div>
          <div className="flex justify-between font-sans text-xs text-ink-3"><span>Shipping</span><span>{formatPrice(Number(shippingCost || 0))}</span></div>
          <div className="flex justify-between font-display text-sm text-espresso font-semibold pt-1 border-t border-beige/40"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
          <MotionButton onClick={submit} disabled={saving} className="btn-primary flex-1 justify-center text-sm">
            {saving ? 'Creating…' : 'Create Purchase Order'}
          </MotionButton>
        </div>
      </div>
    </Modal>
  );
};
