import { motion, AnimatePresence } from 'framer-motion';
import { Star, Gift, ShoppingBag, RefreshCw, Users, TrendingDown } from 'lucide-react';
import type { LoyaltyPoint, PointEventType } from '@/types/crm';

const EVENT_CONFIG: Record<PointEventType, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  order_earned:   { icon: <ShoppingBag size={13} />, label: 'Order',      color: 'text-emerald-600', bg: 'bg-emerald-50' },
  order_redeemed: { icon: <Star size={13} />,        label: 'Redeemed',   color: 'text-amber-600',   bg: 'bg-amber-50'   },
  referral:       { icon: <Users size={13} />,       label: 'Referral',   color: 'text-blue-600',    bg: 'bg-blue-50'    },
  birthday:       { icon: <Gift size={13} />,        label: 'Birthday',   color: 'text-pink-600',    bg: 'bg-pink-50'    },
  signup:         { icon: <Star size={13} />,        label: 'Welcome',    color: 'text-violet-600',  bg: 'bg-violet-50'  },
  adjustment:     { icon: <RefreshCw size={13} />,   label: 'Adjustment', color: 'text-blue-600',    bg: 'bg-blue-50'    },
  expired:        { icon: <TrendingDown size={13} />,label: 'Expired',    color: 'text-slate-500',   bg: 'bg-slate-50'   },
  coupon:         { icon: <Gift size={13} />,        label: 'Coupon',     color: 'text-teal-600',    bg: 'bg-teal-50'    },
};

interface Props { events: LoyaltyPoint[]; }

export const CustomerRewardHistory = ({ events }: Props) => {
  const totalEarned  = events.filter(e => e.points > 0).reduce((s, e) => s + e.points, 0);
  const totalSpent   = Math.abs(events.filter(e => e.points < 0).reduce((s, e) => s + e.points, 0));
  const currentBal   = events[0]?.balance ?? 0;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Earned',  value: totalEarned,  color: 'text-emerald-600' },
          { label: 'Spent',   value: totalSpent,   color: 'text-amber-600'   },
          { label: 'Balance', value: currentBal,   color: 'text-espresso'    },
        ].map(s => (
          <div key={s.label} className="card-premium p-3 text-center">
            <p className={`font-serif text-lg ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">{s.label} pts</p>
          </div>
        ))}
      </div>

      {/* Events */}
      <div className="card-premium overflow-hidden">
        <div className="px-5 py-3 border-b border-beige/40 bg-canvas-2">
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Point History</p>
        </div>
        <div className="divide-y divide-beige/20">
          <AnimatePresence initial={false}>
            {events.map((ev, i) => {
              const cfg = EVENT_CONFIG[ev.type];
              return (
                <motion.div key={ev._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-canvas-2/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <span className={cfg.color}>{cfg.icon}</span>
                    </div>
                    <div>
                      <p className="font-display text-xs text-espresso">{ev.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded-full font-display text-[9px] ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                        <span className="font-sans text-[10px] text-ink-3">{new Date(ev.createdAt).toLocaleDateString('en-IN')}</span>
                        {ev.reference && <span className="font-sans text-[10px] text-ink-3">· {ev.reference}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-display text-sm font-semibold ${ev.points > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {ev.points > 0 ? '+' : ''}{ev.points.toLocaleString()}
                    </p>
                    <p className="font-sans text-[10px] text-ink-3">bal: {ev.balance.toLocaleString()}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {events.length === 0 && (
            <div className="py-10 text-center"><p className="font-sans text-sm text-ink-3">No point history</p></div>
          )}
        </div>
      </div>
    </div>
  );
};
