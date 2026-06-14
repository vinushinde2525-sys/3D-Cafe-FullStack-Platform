import { useRef, useEffect, useId } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export type Category = { id: string; label: string; emoji: string; count?: number };

export const CATEGORIES: Category[] = [
  { id: 'all',         label: 'All Items',  emoji: '✦', count: 26 },
  { id: 'Coffee',      label: 'Coffee',     emoji: '☕', count: 6  },
  { id: 'Tea',         label: 'Tea',        emoji: '🍵', count: 3  },
  { id: 'Burgers',     label: 'Burgers',    emoji: '🍔', count: 3  },
  { id: 'Pizza',       label: 'Pizza',      emoji: '🍕', count: 3  },
  { id: 'Sandwiches',  label: 'Sandwiches', emoji: '🥪', count: 2  },
  { id: 'Desserts',    label: 'Desserts',   emoji: '🍰', count: 3  },
  { id: 'Beverages',   label: 'Beverages',  emoji: '🥤', count: 2  },
  { id: 'Breakfast',   label: 'Breakfast',  emoji: '🍳', count: 2  },
  { id: 'Pasta',       label: 'Pasta',      emoji: '🍝', count: 2  },
];

interface Props { active: string; onChange: (id: string) => void; className?: string; }

export const CategorySlider = ({ active, onChange, className }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const layoutId = useId();

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  };

  // Auto-scroll active tab into view
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      const { left: cLeft, right: cRight } = container.getBoundingClientRect();
      const { left: eLeft, right: eRight } = activeEl.getBoundingClientRect();
      if (eLeft < cLeft + 40) container.scrollBy({ left: eLeft - cLeft - 48, behavior: 'smooth' });
      else if (eRight > cRight - 40) container.scrollBy({ left: eRight - cRight + 48, behavior: 'smooth' });
    }
  }, [active]);

  return (
    <div className={cn('relative', className)}>
      {/* Left fade + scroll btn */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none rounded-l-xl" />
      <button
        onClick={() => scroll('left')}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-cream/90 backdrop-blur-sm shadow-warm-sm border border-beige/50 flex items-center justify-center text-ink-3 hover:text-espresso hover:border-gold/40 transition-all"
      >
        <ChevronLeft size={13} />
      </button>

      {/* Tab strip */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-10 py-2"
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              data-active={isActive}
              onClick={() => onChange(cat.id)}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap font-display text-sm font-medium border transition-colors duration-200 flex-shrink-0 select-none',
                isActive
                  ? 'text-cream border-transparent'
                  : 'bg-cream text-ink-2 border-beige/60 hover:border-gold/40 hover:text-espresso hover:bg-mist'
              )}
            >
              {/* Sliding pill background */}
              {isActive && (
                <motion.div
                  layoutId={`cat-pill-${layoutId}`}
                  className="absolute inset-0 rounded-full bg-espresso"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative text-base leading-none">{cat.emoji}</span>
              <span className="relative">{cat.label}</span>
              {cat.count !== undefined && (
                <span className={cn(
                  'relative text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none transition-colors',
                  isActive ? 'bg-white/20 text-cream' : 'bg-canvas-2 text-ink-3'
                )}>
                  {cat.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Right fade + scroll btn */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none rounded-r-xl" />
      <button
        onClick={() => scroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-cream/90 backdrop-blur-sm shadow-warm-sm border border-beige/50 flex items-center justify-center text-ink-3 hover:text-espresso hover:border-gold/40 transition-all"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

export default CategorySlider;
