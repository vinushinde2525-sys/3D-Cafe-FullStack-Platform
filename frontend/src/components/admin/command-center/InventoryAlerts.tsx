import { motion } from 'framer-motion';
import { AlertTriangle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InventoryItem } from '@/types/inventory';

interface Props { items: InventoryItem[]; }
export const InventoryAlerts = ({ items }: Props) => {
  const critical = items.filter(i => i.currentStock === 0);
  const low      = items.filter(i => i.currentStock > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }} className={`card-premium p-5 ${items.length > 0 ? 'ring-1 ring-red-200' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Inventory</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${items.length > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
          {items.length > 0
            ? <AlertTriangle size={15} className="text-red-500" />
            : <Package       size={15} className="text-emerald-600" />}
        </div>
      </div>
      {items.length === 0 ? (
        <p className="font-serif text-2xl text-emerald-600">All OK</p>
      ) : (
        <>
          <p className="font-serif text-2xl text-red-600">{items.length} alerts</p>
          <div className="space-y-1 mt-2 max-h-20 overflow-hidden">
            {critical.slice(0, 2).map(i => (
              <p key={i._id} className="font-sans text-[10px] text-red-600 truncate">⚠ {i.name} — OUT</p>
            ))}
            {low.slice(0, 2).map(i => (
              <p key={i._id} className="font-sans text-[10px] text-amber-600 truncate">↓ {i.name} low</p>
            ))}
          </div>
          <Link to="/admin/inventory" className="font-display text-[10px] text-espresso hover:text-gold mt-2 block">
            View inventory →
          </Link>
        </>
      )}
    </motion.div>
  );
};
