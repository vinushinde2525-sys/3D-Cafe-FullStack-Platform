import { motion } from 'framer-motion';
import { Star, Gift, TrendingUp } from 'lucide-react';
import { LOYALTY_CONFIG, getTier, pointsToRupees } from '@/services/loyaltyService';
import { formatPrice } from '@/utils/format';
import type { CustomerProfile, MembershipTier } from '@/types/crm';

const TIER_GRADIENT: Record<MembershipTier, string> = {
  bronze:   'from-amber-700 via-amber-600 to-amber-500',
  silver:   'from-slate-600 via-slate-500 to-slate-400',
  gold:     'from-yellow-600 via-yellow-500 to-amber-400',
  platinum: 'from-violet-700 via-purple-600 to-indigo-500',
};

const TIER_ICON: Record<MembershipTier, string> = {
  bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎',
};

interface Props { customer: CustomerProfile; compact?: boolean; }

export const LoyaltyCard = ({ customer, compact = false }: Props) => {
  const tier = getTier(customer.loyaltyPoints);
  const cfg  = LOYALTY_CONFIG.tiers;
  const current = cfg[tier];
  const tiers = Object.entries(cfg) as [MembershipTier, typeof cfg[MembershipTier]][];
  const tierIdx = tiers.findIndex(([t]) => t === tier);
  const nextTier = tiers[tierIdx + 1];
  const progress = nextTier
    ? ((customer.loyaltyPoints - current.minPoints) / (nextTier[1].minPoints - current.minPoints)) * 100
    : 100;
  const rupeeValue = pointsToRupees(customer.loyaltyPoints);

  if (compact) {
    return (
      <div className={`rounded-2xl p-4 bg-gradient-to-r ${TIER_GRADIENT[tier]} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[10px] uppercase tracking-widest opacity-80">Loyalty</p>
            <p className="font-serif text-lg">{customer.loyaltyPoints.toLocaleString()} pts</p>
          </div>
          <span className="text-2xl">{TIER_ICON[tier]}</span>
        </div>
        <p className="font-sans text-[11px] opacity-70 mt-1">≈ {formatPrice(rupeeValue)} redeemable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-3xl p-6 bg-gradient-to-br ${TIER_GRADIENT[tier]} text-white relative overflow-hidden`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.2em] opacity-70">Café 3D</p>
            <p className="font-serif text-xl mt-1">{customer.name}</p>
            <p className="font-sans text-[11px] opacity-60">{customer.email}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl">{TIER_ICON[tier]}</span>
            <p className="font-display text-xs font-semibold capitalize mt-1 opacity-90">{tier} Member</p>
          </div>
        </div>

        {/* Points */}
        <div className="mb-5">
          <div className="flex items-end gap-2">
            <p className="font-serif text-4xl">{customer.loyaltyPoints.toLocaleString()}</p>
            <p className="font-display text-sm opacity-70 mb-1.5">points</p>
          </div>
          <p className="font-sans text-xs opacity-60">≈ {formatPrice(rupeeValue)} redemption value</p>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display text-[10px] opacity-70 uppercase tracking-wide">Progress to {nextTier[0]}</span>
              <span className="font-display text-[10px] opacity-70">{nextTier[1].minPoints - customer.loyaltyPoints} pts to go</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="flex gap-4 text-[11px] opacity-70">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-current" />
            <span>{current.discount}% discount</span>
          </div>
          <div className="flex items-center gap-1">
            <Gift size={11} />
            <span>Birthday bonus</span>
          </div>
          {tierIdx >= 1 && (
            <div className="flex items-center gap-1">
              <TrendingUp size={11} />
              <span>Priority service</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
