import { motion } from 'framer-motion';
import { AlertTriangle, Package, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LowStockItem { _id: string; name: string; currentStock: number; minStock: number; unit: string; }
interface Props { items: LowStockItem[]; totalItems: number; }

export const InventoryCard = ({ items, totalItems }: Props) => {
  const critical = items.filter(i => i.currentStock === 0);
  const low      = items.filter(i => i.currentStock > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest">Inventory</p>
          <p className="font-serif text-2xl text-espresso mt-1">{totalItems} items</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${items.length > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
          {items.length > 0
            ? <AlertTriangle size={18} className="text-red-500" />
            : <CheckCircle  size={18} className="text-emerald-600" />
          }
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-2 py-4 text-emerald-600">
          <CheckCircle size={16} />
          <span className="font-sans text-sm">All stock levels healthy</span>
        </div>
      ) : (
        <div className="space-y-2">
          {critical.length > 0 && (
            <p className="font-display text-[10px] uppercase tracking-widest text-red-500 mb-1">Out of stock</p>
          )}
          {critical.map(item => (
            <div key={item._id} className="flex items-center justify-between py-1.5 border-b border-red-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="font-sans text-xs text-espresso truncate max-w-[120px]">{item.name}</span>
              </div>
              <span className="font-display text-xs text-red-600 font-semibold">0 {item.unit}</span>
            </div>
          ))}
          {low.length > 0 && (
            <p className="font-display text-[10px] uppercase tracking-widest text-amber-600 mt-2 mb-1">Low stock</p>
          )}
          {low.slice(0, 4).map(item => (
            <div key={item._id} className="flex items-center justify-between py-1.5 border-b border-beige/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="font-sans text-xs text-espresso truncate max-w-[120px]">{item.name}</span>
              </div>
              <span className="font-display text-xs text-amber-600 font-semibold">
                {item.currentStock} / {item.minStock} {item.unit}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/admin/inventory"
        className="mt-4 flex items-center gap-1.5 font-display text-xs text-espresso hover:text-gold transition-colors"
      >
        <Package size={12} /> View full inventory
      </Link>
    </motion.div>
  );
};
