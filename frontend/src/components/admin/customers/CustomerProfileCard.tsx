import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ShoppingBag, Star, Calendar, Ban, CheckCircle, Shield, Edit3 } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import { LoyaltyCard } from './LoyaltyCard';
import { loyaltyService } from '@/services/loyaltyService';
import { auditLogService } from '@/services/auditLogService';
import toast from 'react-hot-toast';
import type { CustomerProfile } from '@/types/crm';

interface Props { customer: CustomerProfile; onUpdate: () => void; }

export const CustomerProfileCard = ({ customer, onUpdate }: Props) => {
  const toggleBlock = async () => {
    try {
      await loyaltyService.blockCustomer(customer._id, !customer.isBlocked);
      toast.success(customer.isBlocked ? 'Customer unblocked' : 'Customer blocked');
      auditLogService.record({
        action: customer.isBlocked ? 'unblock' : 'block',
        module: 'customers',
        target: customer.name,
        performedBy: 'admin',
      });
      onUpdate();
    } catch { toast.error('Action failed'); }
  };

  const stats = [
    { label: 'Total Orders',   value: customer.totalOrders,              icon: <ShoppingBag size={13} /> },
    { label: 'Total Spent',    value: formatPrice(customer.totalSpent),   icon: <Star size={13} />       },
    { label: 'Avg Order',      value: formatPrice(customer.avgOrderValue),icon: <ShoppingBag size={13} />},
    { label: 'Referrals',      value: customer.referralCount,             icon: <Star size={13} />       },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Identity */}
      <div className="card-premium p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-espresso/10 flex items-center justify-center flex-shrink-0 text-2xl">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-lg text-espresso">{customer.name}</h2>
              {customer.isBlocked    && <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-display text-[9px]">Blocked</span>}
              {!customer.isVerified  && <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-display text-[9px]">Unverified</span>}
              {customer.isVerified && !customer.isBlocked && <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-display text-[9px]">Active</span>}
            </div>
            <p className="font-sans text-xs text-ink-3 capitalize">{customer.role}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-ink-2"><Mail size={12} className="text-ink-3 flex-shrink-0" />{customer.email}</div>
          {customer.phone && <div className="flex items-center gap-2 text-ink-2"><Phone size={12} className="text-ink-3 flex-shrink-0" />{customer.phone}</div>}
          <div className="flex items-center gap-2 text-ink-2"><Calendar size={12} className="text-ink-3 flex-shrink-0" />Joined {new Date(customer.joinedAt).toLocaleDateString('en-IN')}</div>
          {customer.addresses[0] && <div className="flex items-center gap-2 text-ink-2"><MapPin size={12} className="text-ink-3 flex-shrink-0" />{customer.addresses[0].city}</div>}
          {customer.lastActive && <div className="flex items-center gap-2 text-ink-2"><Shield size={12} className="text-ink-3 flex-shrink-0" />Last active {new Date(customer.lastActive).toLocaleDateString('en-IN')}</div>}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button onClick={toggleBlock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display text-xs border transition-all flex-1 justify-center ${
              customer.isBlocked
                ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                : 'border-red-300 text-red-600 hover:bg-red-50'
            }`}>
            {customer.isBlocked ? <CheckCircle size={12} /> : <Ban size={12} />}
            {customer.isBlocked ? 'Unblock' : 'Block'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display text-xs border border-beige/60 text-ink-2 hover:border-gold/40 flex-1 justify-center">
            <Edit3 size={12} /> Edit
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="card-premium p-3 text-center">
            <p className="font-serif text-base text-espresso">{s.value}</p>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Loyalty card */}
      <LoyaltyCard customer={customer} />

      {/* Favorites */}
      {customer.favoriteItems.length > 0 && (
        <div className="card-premium p-4">
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest mb-3">Favourites</p>
          <div className="space-y-2">
            {customer.favoriteItems.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-sans text-xs text-espresso">{item.name}</span>
                <span className="font-display text-xs text-gold">{item.orderCount}×</span>
              </div>
            ))}
          </div>
          <p className="font-sans text-[11px] text-ink-3 mt-2">Top category: <strong className="text-espresso">{customer.favoriteCategory}</strong></p>
        </div>
      )}
    </motion.div>
  );
};
