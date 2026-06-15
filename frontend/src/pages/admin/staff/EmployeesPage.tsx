import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { EmployeeTable } from '@/components/admin/staff/EmployeeTable';
import { FoodGridSkeleton } from '@/components/common/Skeletons';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { staffService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { Employee } from '@/types/staff';

const ROLES    = ['barista','chef','cashier','delivery','manager','cleaner','waiter'];
const SHIFTS   = ['morning','afternoon','evening','night','split'];
const DEPTS    = ['Front of House','Kitchen','Delivery','Management','Housekeeping'];

const BLANK_EMP: Partial<Employee> = {
  name:'', email:'', phone:'', role:'barista', department:'Front of House',
  status:'active', salary:0, hourlyRate:0, shift:'morning', address:'',
  emergencyContact:{ name:'', phone:'', relation:'' }, documents:[], skills:[],
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState<Employee | null>(null);
  const [form,      setForm]      = useState<Partial<Employee>>(BLANK_EMP);
  const [saving,    setSaving]    = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setEmployees(await staffService.getAll()); }
    catch { toast.error('Failed to load employees'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(BLANK_EMP); setShowForm(true); };
  const openEdit = (e: Employee) => { setEditing(e); setForm(e); setShowForm(true); };

  const save = async () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      if (editing) { await staffService.update(editing._id, form); toast.success('Employee updated'); }
      else         { await staffService.create(form); toast.success('Employee added'); }
      setShowForm(false); load();
    } catch { toast.error('Failed to save employee'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Remove this employee?')) return;
    try { await staffService.delete(id); toast.success('Employee removed'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Employees</h1>
          <p className="font-sans text-sm text-ink-3">{employees.length} team members</p>
        </div>
        <div className="flex gap-2">
          <MotionButton onClick={() => setExportOpen(true)} className="btn-secondary h-9 px-4 text-sm gap-2">
            <Download size={13} /> Export
          </MotionButton>
          <MotionButton onClick={openAdd} className="btn-primary h-9 px-4 text-sm gap-2">
            <Plus size={13} /> Add Employee
          </MotionButton>
        </div>
      </div>

      {loading
        ? <FoodGridSkeleton count={6} />
        : <EmployeeTable employees={employees} onEdit={openEdit} onDelete={del} />
      }

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}
        title={editing ? `Edit — ${editing.name}` : 'Add New Employee'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Full Name *" value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="Arjun Singh" />
            </div>
            <Input label="Email *" type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} placeholder="arjun@cafe3d.com" />
            <Input label="Phone *" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 11111" />

            {[
              { label: 'Role *',       key: 'role',       opts: ROLES    },
              { label: 'Department',   key: 'department', opts: DEPTS    },
              { label: 'Shift',        key: 'shift',      opts: SHIFTS   },
              { label: 'Status',       key: 'status',     opts: ['active','on_leave','inactive'] },
            ].map(({ label, key, opts }) => (
              <div key={key}>
                <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">{label}</label>
                <select value={(form as any)[key] ?? ''} onChange={e => set(key, e.target.value)}
                  className="input-base w-full text-sm capitalize">
                  {opts.map(o => <option key={o} value={o} className="capitalize">{o.replace('_', ' ')}</option>)}
                </select>
              </div>
            ))}

            <Input label="Monthly Salary (₹)" type="number" value={form.salary ?? ''} onChange={e => set('salary', parseInt(e.target.value) || 0)} placeholder="28000" />
            <Input label="Hourly Rate (₹)" type="number" value={form.hourlyRate ?? ''} onChange={e => set('hourlyRate', parseInt(e.target.value) || 0)} placeholder="160" />

            <div className="col-span-2">
              <Input label="Address" value={form.address ?? ''} onChange={e => set('address', e.target.value)} placeholder="Street, City" />
            </div>
          </div>

          {/* Emergency contact */}
          <div>
            <p className="font-display text-xs text-ink-3 uppercase tracking-widest mb-2">Emergency Contact</p>
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Name" value={form.emergencyContact?.name ?? ''}
                onChange={e => set('emergencyContact', { ...form.emergencyContact, name: e.target.value })} />
              <Input placeholder="+91 …" value={form.emergencyContact?.phone ?? ''}
                onChange={e => set('emergencyContact', { ...form.emergencyContact, phone: e.target.value })} />
              <Input placeholder="Relation" value={form.emergencyContact?.relation ?? ''}
                onChange={e => set('emergencyContact', { ...form.emergencyContact, relation: e.target.value })} />
            </div>
          </div>

          {/* Skills */}
          <Input label="Skills (comma-separated)" placeholder="Espresso, Latte Art, POS"
            value={Array.isArray(form.skills) ? form.skills.join(', ') : ''}
            onChange={e => set('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
            <MotionButton onClick={save} disabled={saving} className="btn-primary flex-1 justify-center text-sm">
              {saving ? 'Saving…' : editing ? 'Update Employee' : 'Add Employee'}
            </MotionButton>
          </div>
        </div>
      </Modal>

      <ExcelExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} type="staff" data={employees} label="Employees" />
    </div>
  );
}
