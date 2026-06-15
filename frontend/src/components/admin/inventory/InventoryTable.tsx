import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, Plus, Minus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import toast from 'react-hot-toast';
import type { InventoryItem, StockCategory } from '@/types/inventory';

type SortKey = 'name' | 'currentStock' | 'costPerUnit' | 'totalValue' | 'daysRemaining';
type SortDir = 'asc' | 'desc';

const CATEGORIES: StockCategory[] = ['Raw Material','Dairy','Bakery','Beverage','Packaging','Cleaning','Other'];

function stockStatus(item: InventoryItem): { label: string; cls: string } {
  if (item.currentStock === 0)                       return { label: 'Out of Stock',  cls: 'bg-red-100 text-red-700'    };
  if (item.currentStock <= item.minimumStock)        return { label: 'Low Stock',     cls: 'bg-amber-100 text-amber-700' };
  if (item.currentStock >= item.maximumStock * 0.9)  return { label: 'Overstocked',   cls: 'bg-blue-100 text-blue-700'  };
  return { label: 'In Stock', cls: 'bg-emerald-100 text-emerald-700' };
}

interface Props {
  items:     InventoryItem[];
  onEdit:    (item: InventoryItem) => void;
  onDelete:  (id: string) => void;
  onAdjust:  (item: InventoryItem, type: 'restock' | 'usage') => void;
  onBulk?:   (ids: string[], action: string) => void;
}

export const InventoryTable = ({ items, onEdit, onDelete, onAdjust, onBulk }: Props) => {
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState<string>('all');
  const [statusFil, setStatusFil] = useState<string>('all');
  const [sortKey,   setSortKey]   = useState<SortKey>('name');
  const [sortDir,   setSortDir]   = useState<SortDir>('asc');
  const [selected,  setSelected]  = useState<Set<string>>(new Set());
  const [page,      setPage]      = useState(1);
  const PER_PAGE = 10;

  const sorted = useMemo(() => {
    let list = [...items];
    if (search)            list = list.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku?.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'all') list = list.filter(i => i.category === category);
    if (statusFil === 'low')  list = list.filter(i => i.currentStock <= i.minimumStock && i.currentStock > 0);
    if (statusFil === 'out')  list = list.filter(i => i.currentStock === 0);
    if (statusFil === 'exp')  list = list.filter(i => (i.daysRemaining ?? 999) <= 7);
    list.sort((a, b) => {
      let av: string | number = a[sortKey] ?? 0;
      let bv: string | number = b[sortKey] ?? 0;
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
    return list;
  }, [items, search, category, statusFil, sortKey, sortDir]);

  const pages = Math.ceil(sorted.length / PER_PAGE);
  const visible = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <ChevronsUpDown size={11} className="opacity-30" /> :
    sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;

  const toggleAll = () => {
    if (selected.size === visible.length) setSelected(new Set());
    else setSelected(new Set(visible.map(i => i._id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search items, SKU…"
            className="input-base pl-9 h-9 w-full text-sm"
          />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none focus:border-gold/50">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFil} onChange={e => { setStatusFil(e.target.value); setPage(1); }}
          className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none focus:border-gold/50">
          <option value="all">All Status</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="exp">Expiring ≤7d</option>
        </select>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-espresso/5 rounded-xl">
            <span className="font-display text-xs text-espresso">{selected.size} selected</span>
            <button onClick={() => onBulk?.([...selected], 'delete')} className="font-display text-xs text-red-600 hover:text-red-800">Delete</button>
            <button onClick={() => { toast.success('Exported selected items'); }} className="font-display text-xs text-espresso hover:text-gold">Export</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-beige/40">
        <table className="w-full text-sm">
          <thead className="bg-canvas-2 border-b border-beige/40 sticky top-0">
            <tr>
              <th className="px-4 py-3 w-8">
                <input type="checkbox" checked={selected.size === visible.length && visible.length > 0}
                  onChange={toggleAll} className="rounded" />
              </th>
              {([
                ['name',         'Item'],
                ['category',     'Category', false],
                ['currentStock', 'Stock'],
                ['costPerUnit',  'Cost/Unit'],
                ['totalValue',   'Value'],
                ['daysRemaining','Expires'],
              ] as [SortKey | null, string, boolean?][]).map(([key, label]) => (
                <th key={label}
                  className={`px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap ${key ? 'cursor-pointer select-none hover:text-espresso' : ''}`}
                  onClick={() => key && toggleSort(key as SortKey)}>
                  <span className="flex items-center gap-1">
                    {label} {key && <SortIcon k={key as SortKey} />}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence initial={false}>
              {visible.map((item, i) => {
                const st = stockStatus(item);
                return (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`hover:bg-canvas-2/60 transition-colors ${selected.has(item._id) ? 'bg-gold/5' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(item._id)} onChange={() => toggleOne(item._id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-display text-xs text-espresso font-medium">{item.name}</p>
                        {item.sku && <p className="font-sans text-[10px] text-ink-3">{item.sku}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-display text-xs text-ink-2">{item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className={`font-serif text-base ${item.currentStock <= item.minimumStock ? 'text-red-600' : 'text-espresso'}`}>
                          {item.currentStock}
                        </span>
                        <span className="font-sans text-[10px] text-ink-3">/{item.maximumStock} {item.unit}</span>
                      </div>
                      {/* Mini stock bar */}
                      <div className="w-16 h-1 bg-beige/40 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.currentStock === 0 ? 'bg-red-500' : item.currentStock <= item.minimumStock ? 'bg-amber-400' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (item.currentStock / item.maximumStock) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-display text-xs text-ink-2">{formatPrice(item.costPerUnit)}<span className="text-ink-3">/{item.unit}</span></td>
                    <td className="px-4 py-3 font-display text-xs text-espresso font-medium">{formatPrice(item.totalValue)}</td>
                    <td className="px-4 py-3">
                      {item.daysRemaining !== undefined ? (
                        <span className={`font-display text-xs ${item.daysRemaining <= 3 ? 'text-red-600 font-semibold' : item.daysRemaining <= 7 ? 'text-amber-600' : 'text-ink-2'}`}>
                          {item.daysRemaining === 0 ? 'Today' : `${item.daysRemaining}d`}
                        </span>
                      ) : <span className="text-ink-3 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-display text-[10px] font-medium ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => onAdjust(item, 'restock')} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors" title="Restock"><Plus size={12} /></button>
                        <button onClick={() => onAdjust(item, 'usage')}   className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors" title="Use"><Minus size={12} /></button>
                        <button onClick={() => onEdit(item)}              className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center transition-colors" title="Edit"><Edit2 size={12} /></button>
                        <button onClick={() => onDelete(item._id)}        className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors" title="Delete"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {visible.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-sans text-sm text-ink-3">No items match your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs text-ink-3">{sorted.length} items · page {page} of {pages}</p>
          <div className="flex gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg font-display text-xs transition-colors ${p === page ? 'bg-espresso text-cream' : 'bg-canvas-2 text-ink-2 hover:bg-beige/40'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
