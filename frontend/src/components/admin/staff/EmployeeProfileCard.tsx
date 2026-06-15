import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Edit3, Award } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { Employee } from '@/types/staff';

const ROLE_COLORS: Record<string, string> = {
  barista: 'bg-amber-100 text-amber-700', chef: 'bg-red-100 text-red-700',
  cashier: 'bg-blue-100 text-blue-700',   delivery: 'bg-violet-100 text-violet-700',
  manager: 'bg-espresso/10 text-espresso',cleaner: 'bg-slate-100 text-slate-600',
  waiter:  'bg-teal-100 text-teal-700',
};
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700', on_leave: 'bg-amber-100 text-amber-700',
  inactive: 'bg-slate-100 text-slate-500',   terminated: 'bg-red-100 text-red-700',
};
const SHIFT_ICON: Record<string, string> = {
  morning: '☀️', afternoon: '🌤', evening: '🌙', night: '🌃', split: '⚡',
};

interface Props { employee: Employee; onEdit?: () => void; }

export const EmployeeProfileCard = ({ employee: e, onEdit }: Props) => {
  const tenureDays = Math.floor((Date.now() - new Date(e.joinDate).getTime()) / 86400000);
  const tenureYears = (tenureDays / 365).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* Identity card */}
      <div className="card-premium p-6">
        {/* Avatar + name */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-espresso/10 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-2xl text-espresso">{e.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-serif text-lg text-espresso leading-tight">{e.name}</h2>
                <p className="font-display text-[10px] text-ink-3 mt-0.5">{e.employeeId} · {e.department}</p>
              </div>
              {onEdit && (
                <button onClick={onEdit} className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center flex-shrink-0">
                  <Edit3 size={12} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${ROLE_COLORS[e.role]}`}>{e.role}</span>
              <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${STATUS_COLORS[e.status]}`}>{e.status.replace('_', ' ')}</span>
              <span className="px-2 py-0.5 rounded-full font-display text-[10px] bg-canvas-2 text-ink-2">{SHIFT_ICON[e.shift]} {e.shift} shift</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2 mb-4">
          {[
            { icon: <Mail size={12} />,     text: e.email },
            { icon: <Phone size={12} />,    text: e.phone },
            { icon: <MapPin size={12} />,   text: e.address },
            { icon: <Calendar size={12} />, text: `Joined ${new Date(e.joinDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}` },
          ].map(({ icon, text }, i) => text && (
            <div key={i} className="flex items-center gap-2 text-xs text-ink-2">
              <span className="text-ink-3 flex-shrink-0">{icon}</span>
              <span className="truncate">{text}</span>
            </div>
          ))}
        </div>

        {/* Tenure badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gold/8 rounded-xl">
          <Award size={14} className="text-gold" />
          <span className="font-display text-xs text-espresso">{tenureYears} years with Café 3D</span>
        </div>
      </div>

      {/* Compensation */}
      <div className="card-premium p-5">
        <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest mb-3">Compensation</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-canvas-2 rounded-xl">
            <p className="font-serif text-lg text-espresso">{formatPrice(e.salary)}</p>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Monthly</p>
          </div>
          <div className="text-center p-3 bg-canvas-2 rounded-xl">
            <p className="font-serif text-lg text-espresso">{formatPrice(e.hourlyRate)}</p>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Per Hour</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      {e.skills?.length > 0 && (
        <div className="card-premium p-5">
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest mb-3">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {e.skills.map(s => (
              <span key={s} className="px-2 py-1 rounded-lg bg-canvas-2 font-display text-xs text-ink-2">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Emergency contact */}
      <div className="card-premium p-5">
        <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest mb-3">Emergency Contact</p>
        <div className="space-y-1">
          <p className="font-display text-xs text-espresso">{e.emergencyContact?.name}</p>
          <p className="font-sans text-[11px] text-ink-3">{e.emergencyContact?.relation}</p>
          <p className="font-sans text-[11px] text-ink-2">{e.emergencyContact?.phone}</p>
        </div>
      </div>
    </motion.div>
  );
};
