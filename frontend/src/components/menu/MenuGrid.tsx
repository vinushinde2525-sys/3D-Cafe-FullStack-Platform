import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { MenuCard } from './MenuCard';
import { FoodQuickViewModal } from './FoodQuickViewModal';
import { FoodGridSkeleton } from '@/components/common/Skeletons';
import { cn } from '@/utils/cn';
import type { FoodItem } from '@/types';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface Props {
  items: FoodItem[];
  isLoading?: boolean;
  total?: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular',    label: 'Most Popular'      },
  { value: 'rating',     label: 'Top Rated'         },
  { value: 'newest',     label: 'Newest'            },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

// Stagger container: children animate in sequence
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
  exit:   { opacity: 0, transition: { duration: 0.15 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 22, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

export const MenuGrid = ({ items, isLoading, total }: Props) => {
  const [layout, setLayout]   = useState<'grid' | 'list'>('grid');
  const [sort, setSort]       = useState<SortOption>('popular');
  const [quickView, setQuickView] = useState<FoodItem | null>(null);

  const sorted = [...items].sort((a, b) => {
    if (sort === 'price_asc')  return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
    if (sort === 'price_desc') return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
    if (sort === 'rating')     return b.rating - a.rating;
    if (sort === 'popular')    return b.orderCount - a.orderCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <p className="font-sans text-sm text-ink-3">
          {isLoading
            ? 'Loading…'
            : <><span className="text-espresso font-medium">{total ?? items.length}</span> items</>
          }
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-ink-3" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-9 bg-cream border border-beige/60 rounded-xl px-3 text-sm font-display text-ink-2 outline-none focus:border-gold/50 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-canvas-2 rounded-xl p-1">
            {([
              { icon: <Grid3X3 size={14} />, value: 'grid' },
              { icon: <List      size={14} />, value: 'list' },
            ] as const).map(({ icon, value }) => (
              <button
                key={value}
                onClick={() => setLayout(value)}
                className={cn(
                  'w-8 h-7 rounded-lg flex items-center justify-center transition-all',
                  layout === value ? 'bg-cream text-espresso shadow-warm-sm' : 'text-ink-3 hover:text-espresso'
                )}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid / List */}
      {isLoading ? (
        <FoodGridSkeleton count={layout === 'grid' ? 9 : 6} />
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 text-center"
        >
          <div className="text-6xl mb-4">☕</div>
          <h3 className="font-serif text-2xl text-espresso mb-2">Nothing here yet</h3>
          <p className="font-sans text-sm text-ink-3">Try adjusting your filters or search term.</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${layout}-${sorted[0]?._id ?? 'empty'}`}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={layout === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }
          >
            {sorted.map((item, i) => (
              <motion.div key={item._id} variants={cardVariants} style={{ position: 'relative' }}>
                <MenuCard item={item} index={i} layout={layout} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <FoodQuickViewModal item={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
};

export default MenuGrid;
