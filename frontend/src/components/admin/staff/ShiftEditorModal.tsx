import { useState, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MotionButton } from '@/components/ui/Button';
import { shiftService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { Shift, Employee, ShiftType } from '@/types/staff';

const SHIFT_TYPES: ShiftType[] = ['morning','afternoon','evening','night','split'];
const SHIFT_PRESETS: Record<ShiftType, { start: string; end: string }> = {
  morning:   { start: '06:30', end: '14:30' },
  afternoon: { start: '13:00', end: '21:00' },
  evening:   { start: '17:00', end: '23:30' },
  night:     { start: '22:00', end: '06:00' },
  split:     { start: '07:00', end: '12:00' },
};

const BLANK = { name: '', type: 'morning' as ShiftType, startTime: '06:30', endTime: '14:30', breakMins: 30, employees: [] as string[], isRecurring: false };

interface Props {
  shift?:     Shift | null;
  date?:      string;
  employees:  Employee[];
  isOpen:     boolean;
  onClose:    () => void;
  onSuccess:  () => void;
  onDelete?:  (id: string) => void;
}

export const ShiftEditorModal = ({ shift, date, employees, isOpen, onClose, onSuccess, onDelete }: Props) => {
  const [form,   setForm]   = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const isEdit = !!shift;

  useEffect(() => {
    if (shift) {
      setForm({
        name: shift.name, type: shift.type, startTime: shift.startTime,
        endTime: shift.endTime, breakMins: shift.breakMins,
        employees: shift.employees, isRecurring: shift.isRecurring,
      });
    } else {
      const preset = SHIFT_PRESETS['morning'];
      setForm({ ...BLANK, startTime: preset.start, endTime: preset.end });
    }
  }, [shift, isOpen]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const applyPreset = (type: ShiftType) => {
    const p = SHIFT_PRESETS[type];
    setForm(f => ({ ...f, type, startTime: p.start, endTime: p.end, name: type.charAt(0).toUpperCase() + type.slice(1) + ' Shift' }));
  };

  const toggleEmployee = (id: string) => {
    setForm(f => ({
      ...f,
      employees: f.employees.includes(id) ? f.employees.filter(e => e !== id) : [...f.employees, id],
    }));
  };

  const save = async () => {
    if (!form.name || !form.startTime || !form.endTime) { toast.error('Fill all required fields'); return; }
    if (form.employees.length === 0) { toast.error('Assign at least one employee'); return; }
    setSaving(true);
    try {
      const payload = { ...form, date: shift?.date ?? date ?? new Date().toISOString().split('T')[0] };
      if (isEdit && shift) { await shiftService.update(shift._id, payload); toast.success('Shift updated'); }
      else                 { await shiftService.create(payload); toast.success('Shift created'); }
      onSuccess(); onClose();
    } catch { toast.error('Failed to save shift'); }
    finally { setSaving(false); }
  };

  const totalHours = (() => {
    try {
      const [sh, sm] = form.startTime.split(':').map(Number);
      const [eh, em] = form.endTime.split(':').map(Number);
      const mins = ((eh * 60 + em) - (sh * 60 + sm) + 1440) % 1440 - form.breakMins;
      return (mins / 60).toFixed(1);
    } catch { return '—'; }
  })();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? `Edit Shift — ${shift?.name}` : `New Shift${date ? ` · ${date}` : ''}`} size="lg">
      <div className="space-y-5">
        {/* Shift type presets */}
        <div>
          <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-2">Shift Type</label>
          <div className="grid grid-cols-5 gap-2">
            {SHIFT_TYPES.map(t => (
              <button key={t} onClick={() => applyPreset(t)}
                className={`py-2 rounded-xl font-display text-[11px] border capitalize transition-all ${form.type === t ? 'bg-espresso text-cream border-espresso' : 'border-beige/60 text-ink-2 hover:border-gold/40'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <Input label="Shift Name *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Morning Brew" />

        {/* Time */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Start Time</label>
            <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
              className="input-base w-full text-sm" />
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">End Time</label>
            <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
              className="input-base w-full text-sm" />
          </div>
          <div>
            <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-1.5">Break (min)</label>
            <input type="number" min="0" max="120" value={form.breakMins} onChange={e => set('breakMins', parseInt(e.target.value) || 0)}
              className="input-base w-full text-sm" />
          </div>
        </div>

        {/* Hours preview */}
        <div className="flex items-center gap-2 px-4 py-3 bg-canvas-2 rounded-xl">
          <Clock size={14} className="text-ink-3" />
          <span className="font-display text-sm text-espresso">{totalHours} hours</span>
          <span className="font-sans text-xs text-ink-3">(after {form.breakMins}min break)</span>
        </div>

        {/* Employee assignment */}
        <div>
          <label className="font-display text-xs text-ink-3 uppercase tracking-wide block mb-2">
            Assign Employees ({form.employees.length} selected)
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
            {employees.filter(e => e.status === 'active').map(emp => (
              <button key={emp._id} onClick={() => toggleEmployee(emp._id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${
                  form.employees.includes(emp._id)
                    ? 'border-espresso bg-espresso/5'
                    : 'border-beige/40 hover:border-gold/40'
                }`}>
                <div className="w-6 h-6 rounded-full bg-espresso/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-[10px] text-espresso">{emp.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs text-espresso truncate">{emp.name}</p>
                  <p className="font-sans text-[10px] text-ink-3 capitalize">{emp.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {isEdit && shift && onDelete && (
            <button onClick={() => onDelete(shift._id)} className="w-11 h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center flex-shrink-0" title="Delete shift">
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
          <MotionButton onClick={save} disabled={saving} className="btn-primary flex-1 justify-center text-sm">
            {saving ? 'Saving…' : isEdit ? 'Update Shift' : 'Create Shift'}
          </MotionButton>
        </div>
      </div>
    </Modal>
  );
};
