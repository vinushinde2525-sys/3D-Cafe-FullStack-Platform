import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { CategorySlider, CATEGORIES } from '@/components/sections/CategorySlider';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { PromotionalBanner } from '@/components/sections/PromotionalBanner';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { MOCK_FOOD_ITEMS, filterMockItems } from '@/services/mockData';
import type { FoodItem } from '@/types';

const DIETARY_FILTERS = [
  { key: 'isVegetarian', label: '🥦 Vegetarian' },
  { key: 'isVegan',      label: '🌱 Vegan'       },
  { key: 'isGlutenFree', label: '🌾 Gluten Free'  },
  { key: 'isSpicy',      label: '🌶 Spicy'        },
];
const PRICE_FILTERS = [
  { key: '0-200',  label: 'Under ₹200'  },
  { key: '200-500',label: '₹200 – ₹500' },
  { key: '500-999',label: 'Above ₹500'  },
];

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems]   = useState<FoodItem[]>(MOCK_FOOD_ITEMS);
  const [total, setTotal]   = useState(MOCK_FOOD_ITEMS.length);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState(params.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(params.get('category') || 'all');
  const [dietary, setDietary]     = useState<Record<string, boolean>>({});
  const [priceRange, setPriceRange] = useState('');

  // ── Apply all filters (frontend-first, API if available) ──────────────────
  const applyFilters = useCallback(async () => {
    setLoading(true);

    const [minPrice, maxPrice] = priceRange
      ? priceRange.split('-').map(Number)
      : [undefined, undefined];

    const frontendFilters = {
      category:     activeCategory !== 'all' ? activeCategory : undefined,
      search:       search || undefined,
      isVegetarian: dietary.isVegetarian || undefined,
      isVegan:      dietary.isVegan || undefined,
      isGlutenFree: dietary.isGlutenFree || undefined,
      isSpicy:      dietary.isSpicy || undefined,
      minPrice,
      maxPrice:     maxPrice === 999 ? undefined : maxPrice,
    };

    // Always use mock data — backend is not running in demo mode.
    // To enable real API: set VITE_API_ENABLED=true in .env
    const filtered = filterMockItems(frontendFilters);
    setItems(filtered);
    setTotal(filtered.length);
    setLoading(false);
  }, [activeCategory, search, dietary, priceRange]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleCategory = (id: string) => {
    setActiveCategory(id);
    setParams(id !== 'all' ? { category: id } : {});
  };

  const toggleDietary = (key: string) =>
    setDietary(prev => ({ ...prev, [key]: !prev[key] }));

  const clearFilters = () => {
    setDietary({});
    setPriceRange('');
    setSearch('');
    setActiveCategory('all');
    setParams({});
  };

  const hasActiveFilters =
    Object.values(dietary).some(Boolean) || priceRange || search;

  return (
    <div className="min-h-screen bg-canvas pt-20">
      <PromotionalBanner
        variant="strip"
        title="Free delivery above ₹500"
        subtitle="Use WELCOME20 for 20% off your first order."
        code="WELCOME20"
      />

      {/* Page header */}
      <div className="bg-warm-gradient border-b border-beige/30 py-16 text-center relative overflow-hidden">
        {/* Decorative bg circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-espresso/5 blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="eyebrow">Our Menu</span>
          <div className="divider-gold" />
          <h1 className="font-serif text-display text-espresso mb-3">Explore Every Flavour</h1>
          <p className="font-sans text-ink-3 text-base max-w-md mx-auto leading-relaxed">
            From first-light espresso to late-night desserts — everything crafted with intention.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm font-display text-ink-3">
            <span className="flex items-center gap-1.5">🌿 Fresh daily</span>
            <span className="w-1 h-1 rounded-full bg-beige" />
            <span className="flex items-center gap-1.5">🚚 Free delivery ₹500+</span>
            <span className="w-1 h-1 rounded-full bg-beige" />
            <span className="flex items-center gap-1.5">⭐ Premium quality</span>
          </div>
        </motion.div>
      </div>

      {/* Sticky category bar */}
      <div className="sticky top-[60px] z-20 bg-cream/90 backdrop-blur-md border-b border-beige/30 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3">
          <CategorySlider active={activeCategory} onChange={handleCategory} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-36 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-espresso">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs font-display text-gold hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search menu…"
                  className="w-full h-10 bg-cream border border-beige/60 rounded-xl pl-9 pr-9 text-sm font-sans text-ink outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-espresso">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Dietary */}
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-widest text-ink-3 mb-3">Dietary</p>
                <div className="space-y-2.5">
                  {DIETARY_FILTERS.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${dietary[key] ? 'bg-gold border-gold' : 'border-beige group-hover:border-gold/50'}`}>
                        {dietary[key] && <div className="w-2 h-2 rounded-sm bg-cream" />}
                      </div>
                      <input type="checkbox" className="sr-only" checked={!!dietary[key]} onChange={() => toggleDietary(key)} />
                      <span className="font-sans text-sm text-ink-2">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-widest text-ink-3 mb-3">Price Range</p>
                <div className="space-y-2.5">
                  {PRICE_FILTERS.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${priceRange === key ? 'bg-gold border-gold' : 'border-beige group-hover:border-gold/50'}`}>
                        {priceRange === key && <div className="w-2 h-2 rounded-full bg-cream" />}
                      </div>
                      <input type="radio" className="sr-only" checked={priceRange === key} onChange={() => setPriceRange(priceRange === key ? '' : key)} />
                      <span className="font-sans text-sm text-ink-2">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter row */}
            <div className="flex lg:hidden items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search menu…"
                  className="w-full h-10 bg-cream border border-beige/60 rounded-xl pl-9 text-sm font-sans text-ink outline-none focus:border-gold/50"
                />
              </div>
              <button
                onClick={clearFilters}
                className="h-10 px-4 flex items-center gap-2 rounded-xl border border-beige/60 font-display text-sm text-ink-2 hover:border-gold/40 transition-colors"
              >
                <SlidersHorizontal size={14} />
                {hasActiveFilters ? 'Reset' : 'Filters'}
              </button>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {search && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold-dark border border-gold/25 rounded-full text-xs font-display">
                    "{search}"
                    <button onClick={() => setSearch('')}><X size={10} /></button>
                  </span>
                )}
                {Object.entries(dietary).filter(([, v]) => v).map(([k]) => (
                  <span key={k} className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold-dark border border-gold/25 rounded-full text-xs font-display">
                    {DIETARY_FILTERS.find(f => f.key === k)?.label}
                    <button onClick={() => toggleDietary(k)}><X size={10} /></button>
                  </span>
                ))}
                {priceRange && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold-dark border border-gold/25 rounded-full text-xs font-display">
                    {PRICE_FILTERS.find(f => f.key === priceRange)?.label}
                    <button onClick={() => setPriceRange('')}><X size={10} /></button>
                  </span>
                )}
              </div>
            )}

            <MenuGrid items={items} isLoading={loading} total={total} />
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
