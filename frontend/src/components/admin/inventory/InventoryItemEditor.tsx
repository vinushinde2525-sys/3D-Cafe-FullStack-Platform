import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { inventoryERP } from '@/services/inventoryERPService';
import { MOCK_SUPPLIERS } from '@/services/mockInventory';
import toast from 'react-hot-toast';
import type { InventoryItem, StockCategory, StockUnit } from '@/types/inventory';

const CATEGORIES: StockCategory[] = ['Raw Material','Dairy','Bakery','Beverage','Packaging','Cleaning','Other'];
const UNITS: StockUnit[] = ['kg','g','liter','ml','pieces','dozen','packet','box'];

interface Props { item?: InventoryItem | null; isOpen: boolean; onClose: () => void; onSuccess: () => void; }

const BLANK = {
  name: '', category: 'Raw Material' as StockCategory, sku: '', unit: 'kg' as StockUnit,
  currentStock: 0, minimumStock: 0, maximumStock: 0, reorderPoint: 0,
  costPerUnit: 0, supplier: '', expiryDate: '', batchNumber: '', location: '',
};

export const InventoryItemEditor = ({ item, isOpen, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setForm({
        ...BLANK,
        ...item,
        supplier: typeof item.supplier === 'object' ? item.supplier?._id ?? '' : item.supplier ?? '',
        expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : '',
      });
    } else {
      setForm(BLANK);
    }
  }, [item, isOpen]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || form.maximumStock <= 0) { toast.error('Name and a positive maximum stock are required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        totalValue: form.currentStock * form.costPerUnit,
        isActive: true,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
      };
      if (isEdit && item) {
        await inventoryERP.update(item._id, payload);
        toast.success('Item updated');
      } else {
        await inventoryERP.create(payload);
        toast.success('Item added');
      }
      onSuccess(); onClose();
    } catch { toast.error('Failed to save item'); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? `Edit — ${item?.name}` : 'Add Inventory Item'} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Item Name *" placeholder="Arabica Coffee Beans" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="input-base w-full text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Unit</label>
            <select value={form.unit} onChange={e => set('unit', e.target.value)} className="input-base w-full text-sm">
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <Input label="SKU (optional)" placeholder="COF-AR-1KG" value={form.sku} onChange={e => set('sku', e.target.value)} />
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Supplier</label>
            <select value={form.supplier} onChange={e => set('supplier', e.target.value)} className="input-base w-full text-sm">
              <option value="">Unassigned</option>
              {MOCK_SUPPLIERS.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Input label="Current Stock" type="number" min={0} value={form.currentStock} onChange={e => set('currentStock', Number(e.target.value))} />
          <Input label="Minimum Stock" type="number" min={0} value={form.minimumStock} onChange={e => set('minimumStock', Number(e.target.value))} />
          <Input label="Maximum Stock *" type="number" min={1} value={form.maximumStock} onChange={e => set('maximumStock', Number(e.target.value))} />
          <Input label="Reorder Point" type="number" min={0} value={form.reorderPoint} onChange={e => set('reorderPoint', Number(e.target.value))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Cost per Unit (₹)" type="number" min={0} step="0.01" value={form.costPerUnit} onChange={e => set('costPerUnit', Number(e.target.value))} />
          <Input label="Storage Location" placeholder="Cold Room A" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} />
          <Input label="Batch Number (optional)" placeholder="B-2026-0614" value={form.batchNumber} onChange={e => set('batchNumber', e.target.value)} />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
          <MotionButton onClick={submit} disabled={saving} className="btn-primary flex-1 justify-center text-sm">
            {saving ? 'Saving…' : isEdit ? 'Update Item' : 'Add Item'}
          </MotionButton>
        </div>
      </div>
    </Modal>
  );
};
