import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, Users, Tag, Package, BarChart2, Download } from 'lucide-react';

const ACTIONS = [
  { label: 'Add Item',      icon: <Plus size={16} />,       to: '/admin/menu',      color: 'bg-gold/10 text-gold hover:bg-gold/20'             },
  { label: 'Orders',        icon: <ShoppingBag size={16} />, to: '/admin/orders',    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'         },
  { label: 'Customers',     icon: <Users size={16} />,       to: '/admin/users',     color: 'bg-violet-50 text-violet-600 hover:bg-violet-100'   },
  { label: 'Coupons',       icon: <Tag size={16} />,         to: '/admin/coupons',   color: 'bg-pink-50 text-pink-600 hover:bg-pink-100'         },
  { label: 'Inventory',     icon: <Package size={16} />,     to: '/admin/inventory', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100'      },
  { label: 'Analytics',     icon: <BarChart2 size={16} />,   to: '/admin/analytics', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  { label: 'Export',        icon: <Download size={16} />,    to: '#',                color: 'bg-slate-50 text-slate-600 hover:bg-slate-100',
    onClick: () => alert('Export feature coming soon') },
];

export const QuickActions = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.25 }}
    className="card-premium p-6"
  >
    <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest mb-4">Quick Actions</p>
    <div className="grid grid-cols-2 gap-2">
      {ACTIONS.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.04 }}
        >
          <Link
            to={a.to}
            onClick={a.onClick}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-display text-xs font-medium transition-all ${a.color}`}
          >
            {a.icon}
            {a.label}
          </Link>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
