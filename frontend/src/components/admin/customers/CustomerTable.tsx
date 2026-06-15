import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Ban, CheckCircle, ChevronUp, ChevronDown, ChevronsUpDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/format';
import { loyaltyService, getTier } from '@/services/loyaltyService';
import toast from 'react-hot-toast';
import type { CustomerProfile, MembershipTier } from '@/types/crm';

const TIER_STYLE: Record<MembershipTier, string> = {
  bronze:   'bg-amber-100 text-amber-700',
  silver:   'bg-slate-100 text-slate-600',
  gold:     'bg-yellow-100 text-yellow-700',
  platinum: 'bg-violet-100 text-violet-700',
};

type SortKey = 'name' | 'totalOrders' | 'totalSpent' | 'loyaltyPoints' | 'joinedAt';

interface Props { customers: CustomerProfile[]; onUpdate: () => void; }

export const CustomerTable = ({ customers, onUpdate }: Props) => {
  const [search,   setSearch]   = useState('');
  const [tier,     setTier]     = useState('all');
  const [status,   setStatus]   = useState('all');
  const [sortKey,  setSortKey]  = useState<SortKey>('totalSpent');
  const [sortDir,  setSortDir]  = useState<'asc'|'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [acting,   setActing]   = useState<string | null>(null);
  const [page,     setPage]     = useState(1);
  const PER = 10;

  const sorted = useMemo(() => {
    let list = [...customers];
    if (search) list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search));
    if (tier !== 'all') list = list.filter(c => getTier(c.loyaltyPoints) === tier);
    if (status === 'active')   list = list.filter(c => !c.isBlocked);
    if (status === 'blocked')  list = list.filter(c => c.isBlocked);
    if (status === 'unverified') list = list.filter(c => !c.isVerified);
    list.sort((a, b) => {
      let av: any = a[sortKey], bv: any = b[sortKey];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv as string).toLowerCase(); }
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
    return list;
  }, [customers, search, tier, status, sortKey, sortDir]);

  const pages = Math.ceil(sorted.length / PER);
  const visible = sorted.slice((page - 1) * PER, page * PER);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <ChevronsUpDown size={11} className="opacity-30" /> :
    sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;

  const toggleBlock = async (c: CustomerProfile) => {
    setActing(c._id);
    try {
      await loyaltyService.blockCustomer(c._id, !c.isBlocked);
      toast.success(c.isBlocked ? `${c.name} unblocked` : `${c.name} blocked`);
      onUpdate();
    } catch { toast.error('Action failed'); }
    finally { setActing(null); }
  };

  const toggleAll = () => {
    setSelected(selected.size === visible.length ? new Set() : new Set(visible.map(c => c._id)));
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Name, email, phone…" className="input-base pl-9 h-9 w-full text-sm" />
        </div>
        {[
          { value: tier,   set: setTier,   opts: [['all','All Tiers'],['bronze','Bronze'],['silver','Silver'],['gold','Gold'],['platinum','Platinum']] },
          { value: status, set: setStatus, opts: [['all','All Status'],['active','Active'],['blocked','Blocked'],['unverified','Unverified']] },
        ].map(({ value, set, opts }, fi) => (
          <select key={fi} value={value} onChange={e => { set(e.target.value); setPage(1); }}
            className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none">
            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-espresso/5 rounded-xl">
            <span className="font-display text-xs text-espresso">{selected.size} selected</span>
            <button onClick={() => toast.success('Export started (demo)')} className="font-display text-xs text-espresso hover:text-gold">Export</button>
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
                ['name',          'Customer'],
                [null,            'Status'],
                ['totalOrders',   'Orders'],
                ['totalSpent',    'Spent'],
                ['loyaltyPoints', 'Points'],
                [null,            'Tier'],
                ['joinedAt',      'Joined'],
                [null,            ''],
              ] as [SortKey|null, string][]).map(([k, label]) => (
                <th key={label}
                  className={`px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap ${k ? 'cursor-pointer select-none hover:text-espresso' : ''}`}
                  onClick={() => k && toggleSort(k)}>
                  <span className="flex items-center gap-1">{label} {k && <SortIcon k={k} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence initial={false}>
              {visible.map((c, i) => {
                const customerTier = getTier(c.loyaltyPoints);
                return (
                  <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className={`hover:bg-canvas-2/50 transition-colors ${c.isBlocked ? 'opacity-60' : ''} ${selected.has(c._id) ? 'bg-gold/5' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(c._id)} onChange={() => {
                        const next = new Set(selected);
                        next.has(c._id) ? next.delete(c._id) : next.add(c._id);
                        setSelected(next);
                      }} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-espresso/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-display text-xs text-espresso font-semibold">{c.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-xs text-espresso font-semibold truncate">{c.name}</p>
                          <p className="font-sans text-[10px] text-ink-3 truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        {c.isBlocked   && <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-display text-[9px]">Blocked</span>}
                        {!c.isVerified && <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-display text-[9px]">Unverified</span>}
                        {!c.isBlocked && c.isVerified && <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-display text-[9px]">Active</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-display text-xs text-espresso">{c.totalOrders}</td>
                    <td className="px-4 py-3 font-display text-xs text-espresso font-semibold">{formatPrice(c.totalSpent)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-gold fill-gold" />
                        <span className="font-display text-xs text-espresso">{c.loyaltyPoints.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${TIER_STYLE[customerTier]}`}>{customerTier}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-ink-3 whitespace-nowrap">
                      {new Date(c.joinedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Link to={`/admin/customers/${c._id}`}
                          className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center transition-colors">
                          <Eye size={12} />
                        </Link>
                        <button onClick={() => toggleBlock(c)} disabled={acting === c._id}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${c.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                          title={c.isBlocked ? 'Unblock' : 'Block'}>
                          {c.isBlocked ? <CheckCircle size={12} /> : <Ban size={12} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="py-12 text-center"><p className="font-sans text-sm text-ink-3">No customers match your filters</p></div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs text-ink-3">{sorted.length} customers · page {page} of {pages}</p>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
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
