import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { supplierService } from '@/services/inventoryERPService';
import toast from 'react-hot-toast';
import type { Supplier, StockCategory, SupplierStatus } from '@/types/inventory';

const CATEGORIES: StockCategory[] = ['Raw Material','Dairy','Bakery','Beverage','Packaging','Cleaning','Other'];
const PAYMENT_TERMS = ['Net 7','Net 15','Net 30','Net 45','Net 60','Advance','COD'];

interface Props { supplier?: Supplier | null; isOpen: boolean; onClose: () => void; onSuccess: () => void; }

const BLANK = {
  name: '', contactName: '', email: '', phone: '', address: '', city: '',
  gstin: '', paymentTerms: 'Net 30', leadTimeDays: 3, rating: 4.0,
  status: 'active' as SupplierStatus, categories: [] as StockCategory[], notes: '',
};

export const SupplierEditor = ({ supplier, isOpen, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const isEdit = !!supplier;

  useEffect(() => {
    if (supplier) setForm({ ...BLANK, ...supplier, categories: supplier.categories ?? [] });
    else setForm(BLANK);
  }, [supplier, isOpen]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleCat = (cat: StockCategory) =>
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat],
    }));

  const submit = async () => {
    if (!form.name || !form.email || !form.phone) { toast.error('Name, email, and phone are required'); return; }
    setSaving(true);
    try {
      if (isEdit && supplier) {
        await supplierService.update(supplier._id, form);
        toast.success('Supplier updated');
      } else {
        await supplierService.create(form);
        toast.success('Supplier created');
      }
      onSuccess(); onClose();
    } catch { toast.error('Failed to save supplier'); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? `Edit — ${supplier?.name}` : 'Add Supplier'} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Company Name *" placeholder="Farm Fresh Dairy" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <Input label="Contact Name *" placeholder="Priya Menon" value={form.contactName} onChange={e => set('contactName', e.target.value)} />
          <Input label="Phone *" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
          <Input label="Email *" type="email" placeholder="contact@supplier.in" value={form.email} onChange={e => set('email', e.target.value)} />
          <Input label="City" placeholder="Mumbai" value={form.city} onChange={e => set('city', e.target.value)} />
          <div className="col-span-2">
            <Input label="Address" placeholder="Street, area…" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
          <Input label="GSTIN (optional)" placeholder="29AAPFB1234C1ZV" value={form.gstin} onChange={e => set('gstin', e.target.value)} />
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Payment Terms</label>
            <select value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)} className="input-base w-full text-sm">
              {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Lead Time (days)</label>
            <input type="number" min="1" max="60" value={form.leadTimeDays} onChange={e => set('leadTimeDays', parseInt(e.target.value))}
              className="input-base w-full text-sm" />
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="input-base w-full text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-2">Categories Supplied</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => toggleCat(c)}
                className={`px-3 py-1.5 rounded-full font-display text-xs border transition-all ${
                  form.categories.includes(c)
                    ? 'bg-espresso text-cream border-espresso'
                    : 'border-beige/60 text-ink-2 hover:border-gold/40'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <Input label="Notes (optional)" placeholder="Delivery schedule, special instructions…" value={form.notes}
          onChange={e => set('notes', e.target.value)} />

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
          <MotionButton onClick={submit} disabled={saving} className="btn-primary flex-1 justify-center text-sm">
            {saving ? 'Saving…' : isEdit ? 'Update Supplier' : 'Add Supplier'}
          </MotionButton>
        </div>
      </div>
    </Modal>
  );
};
