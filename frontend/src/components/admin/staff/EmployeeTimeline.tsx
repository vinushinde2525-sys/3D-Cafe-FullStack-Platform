import { motion } from 'framer-motion';
import { CheckCircle, Clock, Calendar, DollarSign, Star, UserPlus } from 'lucide-react';

export interface TimelineEvent {
  _id:         string;
  type:        'attendance' | 'leave' | 'payroll' | 'performance' | 'hired' | 'shift';
  title:       string;
  description: string;
  date:        string;
  status?:     'positive' | 'negative' | 'neutral';
}

const TYPE_CONFIG: Record<TimelineEvent['type'], { icon: React.ReactNode; bg: string; color: string }> = {
  attendance:  { icon: <CheckCircle size={13} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  leave:       { icon: <Calendar size={13} />,    bg: 'bg-amber-50',   color: 'text-amber-600'   },
  payroll:     { icon: <DollarSign size={13} />,  bg: 'bg-gold/10',    color: 'text-gold'        },
  performance: { icon: <Star size={13} />,        bg: 'bg-violet-50',  color: 'text-violet-600'  },
  hired:       { icon: <UserPlus size={13} />,    bg: 'bg-blue-50',    color: 'text-blue-600'    },
  shift:       { icon: <Clock size={13} />,       bg: 'bg-teal-50',    color: 'text-teal-600'    },
};

function timeAgo(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 30)  return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

interface Props { events: TimelineEvent[]; }

export const EmployeeTimeline = ({ events }: Props) => {
  if (events.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-sans text-sm text-ink-3">No activity recorded yet</p>
      </div>
    );
  }

  return (
    <div className="relative pl-10">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-beige/60" />

      <div className="space-y-4">
        {events.map((ev, i) => {
          const cfg = TYPE_CONFIG[ev.type];
          const statusColor = ev.status === 'positive' ? 'text-emerald-600' : ev.status === 'negative' ? 'text-red-500' : 'text-ink-3';

          return (
            <motion.div
              key={ev._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="relative flex items-start gap-3"
            >
              {/* Icon dot */}
              <div className={`absolute -left-10 w-[38px] h-[38px] rounded-full flex items-center justify-center border-2 border-cream z-10 ${cfg.bg}`}>
                <span className={cfg.color}>{cfg.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 card-premium p-4 hover:shadow-warm-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-xs text-espresso font-semibold">{ev.title}</p>
                    <p className={`font-sans text-[11px] mt-0.5 ${statusColor}`}>{ev.description}</p>
                  </div>
                  <span className="font-sans text-[10px] text-ink-3 flex-shrink-0">{timeAgo(ev.date)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
