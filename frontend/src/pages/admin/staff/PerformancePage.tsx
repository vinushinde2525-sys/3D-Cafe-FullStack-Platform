import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, Star } from 'lucide-react';
import { PerformanceCards } from '@/components/admin/staff/PerformanceCards';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { FoodGridSkeleton } from '@/components/common/Skeletons';
import { payrollService } from '@/services/staffService';
import { MotionButton } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { PerformanceReview } from '@/types/staff';

const PERIODS = ['2024-Q1','2024-Q2','2024-Q3','2024-Q4','2023-Q4'];

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [period,  setPeriod]  = useState('2024-Q2');
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<'all'|'excellent'|'good'|'average'>('all');
  const [exportOpen, setExportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setReviews(await payrollService.getPerformance({ period })); }
    catch { toast.error('Failed to load performance data'); }
    finally { setLoading(false); }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const filtered = reviews.filter(r => {
    if (filter === 'excellent') return r.overall >= 4.5;
    if (filter === 'good')      return r.overall >= 3.5 && r.overall < 4.5;
    if (filter === 'average')   return r.overall < 3.5;
    return true;
  });

  const avgOverall = reviews.length
    ? (reviews.reduce((s, r) => s + r.overall, 0) / reviews.length).toFixed(2)
    : '—';

  const topPerformer = reviews.length
    ? reviews.reduce((best, r) => r.overall > best.overall ? r : best)
    : null;

  const metricAverages = reviews.length ? {
    punctuality:     reviews.reduce((s, r) => s + r.scores.punctuality, 0) / reviews.length,
    productivity:    reviews.reduce((s, r) => s + r.scores.productivity, 0) / reviews.length,
    teamwork:        reviews.reduce((s, r) => s + r.scores.teamwork, 0) / reviews.length,
    customerService: reviews.reduce((s, r) => s + r.scores.customerService, 0) / reviews.length,
    cleanliness:     reviews.reduce((s, r) => s + r.scores.cleanliness, 0) / reviews.length,
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Performance</h1>
          <p className="font-sans text-sm text-ink-3">{reviews.length} reviews · Period: {period}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none">
            {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={load} className="btn-secondary h-9 px-3">
            <RefreshCw size={13} />
          </motion.button>
          <MotionButton onClick={() => setExportOpen(true)} className="btn-secondary h-9 px-4 text-sm gap-2">
            <Download size={13} /> Export
          </MotionButton>
        </div>
      </div>

      {/* KPI row */}
      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-premium p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={14} className="text-gold fill-gold" />
              <p className="font-serif text-2xl text-espresso">{avgOverall}</p>
            </div>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Team Avg</p>
          </div>
          {topPerformer && (
            <div className="card-premium p-4 text-center col-span-1">
              <p className="font-serif text-base text-espresso truncate">{topPerformer.employeeName.split(' ')[0]}</p>
              <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Top Performer</p>
              <p className="font-display text-xs text-gold font-semibold">{topPerformer.overall.toFixed(1)}/5.0</p>
            </div>
          )}
          <div className="card-premium p-4 text-center">
            <p className="font-serif text-2xl text-emerald-600">{reviews.filter(r => r.overall >= 4.5).length}</p>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Excellent</p>
          </div>
          <div className="card-premium p-4 text-center">
            <p className="font-serif text-2xl text-amber-600">{reviews.filter(r => r.overall < 3.5).length}</p>
            <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">Need Support</p>
          </div>
        </div>
      )}

      {/* Team metric averages */}
      {metricAverages && (
        <div className="card-premium p-6">
          <p className="font-display text-[10px] text-ink-3 uppercase tracking-widest mb-4">Team Score Breakdown</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(metricAverages).map(([key, avg]) => (
              <div key={key} className="text-center">
                <p className="font-serif text-xl text-espresso">{avg.toFixed(1)}</p>
                <div className="h-1.5 bg-beige/40 rounded-full overflow-hidden my-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(avg / 5) * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className={`h-full rounded-full ${avg >= 4.5 ? 'bg-emerald-400' : avg >= 3.5 ? 'bg-blue-400' : 'bg-amber-400'}`}
                  />
                </div>
                <p className="font-sans text-[10px] text-ink-3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-canvas-2 rounded-xl p-1 w-fit">
        {([
          ['all',       `All (${reviews.length})`    ],
          ['excellent', `Excellent (${reviews.filter(r=>r.overall>=4.5).length})`],
          ['good',      `Good (${reviews.filter(r=>r.overall>=3.5&&r.overall<4.5).length})`],
          ['average',   `Needs Work (${reviews.filter(r=>r.overall<3.5).length})`],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg font-display text-xs transition-all ${filter === key ? 'bg-cream text-espresso shadow-warm-sm' : 'text-ink-3 hover:text-espresso'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading
        ? <FoodGridSkeleton count={4} />
        : <PerformanceCards reviews={filtered} />
      }

      <ExcelExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} type="performance" data={filtered} label="Performance" />
    </div>
  );
}
