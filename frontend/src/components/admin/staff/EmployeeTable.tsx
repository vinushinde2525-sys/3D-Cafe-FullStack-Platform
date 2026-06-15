import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Employee, EmployeeRole, EmployeeStatus } from '@/types/staff';

const ROLE_COLORS: Record<EmployeeRole, string> = {
  barista:  'bg-amber-100 text-amber-700',
  chef:     'bg-red-100 text-red-700',
  cashier:  'bg-blue-100 text-blue-700',
  delivery: 'bg-violet-100 text-violet-700',
  manager:  'bg-espresso/10 text-espresso',
  cleaner:  'bg-slate-100 text-slate-600',
  waiter:   'bg-teal-100 text-teal-700',
};
const STATUS_COLORS: Record<EmployeeStatus, string> = {
  active:     'bg-emerald-100 text-emerald-700',
  on_leave:   'bg-amber-100 text-amber-700',
  inactive:   'bg-slate-100 text-slate-500',
  terminated: 'bg-red-100 text-red-700',
};
const SHIFT_LABEL: Record<string, string> = {
  morning: '☀️ Morning', afternoon: '🌤 Afternoon', evening: '🌙 Evening', night: '🌃 Night', split: '⚡ Split',
};

type SortKey = 'name' | 'role' | 'salary' | 'joinDate';

interface Props { employees: Employee[]; onEdit: (e: Employee) => void; onDelete: (id: string) => void; }

export const EmployeeTable = ({ employees, onEdit, onDelete }: Props) => {
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('all');
  const [status,  setStatus]  = useState('all');
  const [shift,   setShift]   = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [selected,setSelected]= useState<Set<string>>(new Set());
  const [page,    setPage]    = useState(1);
  const PER = 8;

  const sorted = useMemo(() => {
    let list = [...employees];
    if (search)         list = list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));
    if (role !== 'all') list = list.filter(e => e.role === role);
    if (status !== 'all') list = list.filter(e => e.status === status);
    if (shift !== 'all')  list = list.filter(e => e.shift === shift);
    list.sort((a, b) => {
      let av: any = a[sortKey], bv: any = b[sortKey];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv as string).toLowerCase(); }
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
    return list;
  }, [employees, search, role, status, shift, sortKey, sortDir]);

  const pages = Math.ceil(sorted.length / PER);
  const visible = sorted.slice((page - 1) * PER, page * PER);

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <ChevronsUpDown size={11} className="opacity-30" /> :
    sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Name, ID, email…" className="input-base pl-9 h-9 w-full text-sm" />
        </div>
        {[
          { val: role,   set: setRole,   opts: [['all','All Roles'],['barista','Barista'],['chef','Chef'],['cashier','Cashier'],['delivery','Delivery'],['manager','Manager'],['waiter','Waiter'],['cleaner','Cleaner']] },
          { val: status, set: setStatus, opts: [['all','All Status'],['active','Active'],['on_leave','On Leave'],['inactive','Inactive'],['terminated','Terminated']] },
          { val: shift,  set: setShift,  opts: [['all','All Shifts'],['morning','Morning'],['afternoon','Afternoon'],['evening','Evening'],['night','Night']] },
        ].map(({ val, set, opts }, fi) => (
          <select key={fi} value={val} onChange={e => { set(e.target.value); setPage(1); }}
            className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none">
            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-espresso/5 rounded-xl">
            <span className="font-display text-xs text-espresso">{selected.size} selected</span>
            <button className="font-display text-xs text-espresso hover:text-gold">Export</button>
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
                  onChange={() => setSelected(selected.size === visible.length ? new Set() : new Set(visible.map(e => e._id)))}
                  className="rounded" />
              </th>
              {([['name','Employee'],['role','Role'],['shift','Shift'],['salary','Salary'],['joinDate','Joined'],[null,'Status'],[null,'']] as [SortKey|null,string][]).map(([k, l]) => (
                <th key={l} onClick={() => k && toggleSort(k)}
                  className={`px-4 py-3 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide whitespace-nowrap ${k ? 'cursor-pointer hover:text-espresso' : ''}`}>
                  <span className="flex items-center gap-1">{l} {k && <SortIcon k={k} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            <AnimatePresence initial={false}>
              {visible.map((emp, i) => (
                <motion.tr key={emp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className={`hover:bg-canvas-2/50 transition-colors ${selected.has(emp._id) ? 'bg-gold/5' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(emp._id)} className="rounded"
                      onChange={() => { const n = new Set(selected); n.has(emp._id) ? n.delete(emp._id) : n.add(emp._id); setSelected(n); }} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-espresso/10 flex items-center justify-center flex-shrink-0 font-display text-xs text-espresso font-semibold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display text-xs text-espresso font-semibold">{emp.name}</p>
                        <p className="font-sans text-[10px] text-ink-3">{emp.employeeId} · {emp.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${ROLE_COLORS[emp.role]}`}>{emp.role}</span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-2">{SHIFT_LABEL[emp.shift] ?? emp.shift}</td>
                  <td className="px-4 py-3 font-display text-xs text-espresso">₹{(emp.salary / 1000).toFixed(0)}k/mo</td>
                  <td className="px-4 py-3 font-sans text-xs text-ink-3 whitespace-nowrap">
                    {new Date(emp.joinDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-display text-[10px] capitalize ${STATUS_COLORS[emp.status]}`}>
                      {emp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <Link to={`/admin/staff/employees/${emp._id}`}
                        className="w-7 h-7 rounded-lg bg-canvas-2 text-ink-2 hover:bg-beige/40 flex items-center justify-center transition-colors">
                        <Eye size={12} />
                      </Link>
                      <button onClick={() => onEdit(emp)}
                        className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => onDelete(emp._id)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="py-12 text-center"><p className="font-sans text-sm text-ink-3">No employees match your filters</p></div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs text-ink-3">{sorted.length} employees · page {page} of {pages}</p>
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
