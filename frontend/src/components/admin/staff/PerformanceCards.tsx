import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import type { PerformanceReview } from '@/types/staff';

const SCORE_METRICS = [
  { key: 'punctuality',     label: 'Punctuality'      },
  { key: 'productivity',    label: 'Productivity'      },
  { key: 'teamwork',        label: 'Teamwork'          },
  { key: 'customerService', label: 'Customer Service'  },
  { key: 'cleanliness',     label: 'Cleanliness'       },
] as const;

function scoreColor(s: number): string {
  if (s >= 4.5) return 'text-emerald-600';
  if (s >= 3.5) return 'text-blue-600';
  if (s >= 2.5) return 'text-amber-600';
  return 'text-red-500';
}

function scoreBar(s: number): string {
  if (s >= 4.5) return 'bg-emerald-400';
  if (s >= 3.5) return 'bg-blue-400';
  if (s >= 2.5) return 'bg-amber-400';
  return 'bg-red-400';
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={11}
          className={n <= Math.round(score) ? 'text-gold fill-gold' : 'text-beige fill-beige'}
        />
      ))}
    </div>
  );
}

interface Props { reviews: PerformanceReview[]; }

export const PerformanceCards = ({ reviews }: Props) => {
  if (reviews.length === 0) {
    return (
      <div className="py-16 text-center card-premium">
        <p className="font-sans text-sm text-ink-3">No performance reviews yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {reviews.map((rev, i) => (
        <motion.div
          key={rev._id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="card-premium p-5 hover:shadow-warm-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-espresso/10 flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-lg text-espresso">{rev.employeeName.charAt(0)}</span>
              </div>
              <div>
                <p className="font-display text-xs text-espresso font-semibold">{rev.employeeName}</p>
                <p className="font-sans text-[10px] text-ink-3">{rev.period}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-serif text-xl ${scoreColor(rev.overall)}`}>{rev.overall.toFixed(1)}</p>
              <p className="font-display text-[10px] text-ink-3">/ 5.0</p>
            </div>
          </div>

          {/* Overall stars */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating score={rev.overall} />
            <span className={`font-display text-xs font-semibold ${scoreColor(rev.overall)}`}>
              {rev.overall >= 4.5 ? 'Excellent' : rev.overall >= 3.5 ? 'Good' : rev.overall >= 2.5 ? 'Average' : 'Needs Improvement'}
            </span>
          </div>

          {/* Per-metric bars */}
          <div className="space-y-2.5 mb-4">
            {SCORE_METRICS.map(m => {
              const score = rev.scores[m.key];
              return (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans text-[11px] text-ink-2">{m.label}</span>
                    <span className={`font-display text-[11px] font-semibold ${scoreColor(score)}`}>{score.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 bg-beige/40 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 5) * 100}%` }}
                      transition={{ delay: i * 0.07 + 0.2, duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full ${scoreBar(score)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback */}
          {rev.feedback && (
            <div className="pt-3 border-t border-beige/30">
              <p className="font-sans text-[11px] text-ink-2 italic leading-relaxed line-clamp-2">"{rev.feedback}"</p>
            </div>
          )}

          {/* Reviewer */}
          <div className="flex items-center justify-between mt-3">
            <p className="font-sans text-[10px] text-ink-3">By {rev.reviewedBy}</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp size={11} />
              <span className="font-display text-[10px]">{rev.goals.length} goals</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
