import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, Star, Phone, MapPin } from 'lucide-react';
import type { Supplier } from '@/types/inventory';

const STATUS_STYLE: Record<string, string> = {
  active:      'bg-emerald-100 text-emerald-700',
  inactive:    'bg-slate-100 text-slate-600',
  blacklisted: 'bg-red-100 text-red-700',
};

interface Props { suppliers: Supplier[]; onEdit: (s: Supplier) => void; onDelete: (id: string) => void; }

export const SupplierTable = ({ suppliers, onEdit, onDelete }: Props) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() =>
    suppliers.filter(s =>
      (status === 'all' || s.status === status) &&
      (!search || s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contactName.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()))
    ), [suppliers, search, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search suppliers…" className="input-base pl-9 h-9 w-full text-sm" />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-beige/40">
        <table className="w-full text-sm">
          <thead className="bg-canvas-2 border-b border-beige/40 sticky top-0">
            <tr>
              {['Supplier','Contact','Categories','Rating','Terms','Orders','Spent','Status',''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence initial={false}>
              {filtered.map((s, i) => (
                <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }} className="hover:bg-canvas-2/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-display text-xs text-espresso font-semibold">{s.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={9} className="text-ink-3" />
                        <span className="font-sans text-[10px] text-ink-3">{s.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-sans text-xs text-espresso">{s.contactName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Phone size={9} className="text-ink-3" />
                          <span className="font-sans text-[10px] text-ink-3">{s.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.categories.slice(0, 2).map(c => (
                        <span key={c} className="px-1.5 py-0.5 rounded bg-canvas-2 font-display text-[9px] text-ink-2">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-gold fill-gold" />
                      <span className="font-display text-xs text-espresso">{s.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-2">{s.paymentTerms}</td>
                  <td className="px-4 py-3 font-display text-xs text-espresso">{s.totalOrders}</td>
                  <td className="px-4 py-3 font-display text-xs text-espresso">₹{(s.totalSpent / 1000).toFixed(0)}k</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => onEdit(s)} className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => onDelete(s._id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center"><p className="font-sans text-sm text-ink-3">No suppliers found</p></div>
        )}
      </div>
    </div>
  );
};
