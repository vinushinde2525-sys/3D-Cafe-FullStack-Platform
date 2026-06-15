import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { formatPrice } from '@/utils/format';
import { foodAPI } from '@/api/services';
import { isBackendOnline } from '@/services/backendStatus';
import type { FoodItem, FoodCategory } from '@/types';

const CATEGORIES: FoodCategory[] = ['Coffee','Tea','Burgers','Pizza','Sandwiches','Desserts','Beverages','Breakfast','Pasta','Salads'];

export default function CategoriesPage() {
  const [items, setItems]     = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (isBackendOnline()) {
          const { data } = await foodAPI.getAll({ limit: 500 });
          setItems(data.data.items ?? []);
        } else {
          const { MOCK_FOOD_ITEMS } = await import('@/services/mockData');
          setItems(MOCK_FOOD_ITEMS);
        }
      } catch {
        const { MOCK_FOOD_ITEMS } = await import('@/services/mockData');
        setItems(MOCK_FOOD_ITEMS);
      } finally { setLoading(false); }
    })();
  }, []);

  const stats = CATEGORIES.map(cat => {
    const inCat = items.filter(i => i.category === cat);
    return {
      category: cat,
      count: inCat.length,
      avgPrice: inCat.length ? inCat.reduce((s, i) => s + i.price, 0) / inCat.length : 0,
      live: inCat.filter(i => i.isAvailable).length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-espresso">Menu Categories</h1>
        <p className="font-sans text-sm text-ink-3 mt-1">
          Categories are fixed menu groupings. To change items within a category, edit them from Menu Management.
        </p>
      </div>

      {loading ? <DashboardSkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map(s => (
            <Link key={s.category} to={`/admin/menu?category=${encodeURIComponent(s.category)}`}
              className="card-premium p-5 hover:border-gold/40 border border-transparent transition-all group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-espresso">{s.category}</h3>
                <ArrowRight size={14} className="text-ink-3 group-hover:text-gold transition-colors" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-display text-base text-espresso">{s.count}</p>
                  <p className="font-display text-[9px] text-ink-3 uppercase">Items</p>
                </div>
                <div>
                  <p className="font-display text-base text-emerald-600">{s.live}</p>
                  <p className="font-display text-[9px] text-ink-3 uppercase">Live</p>
                </div>
                <div>
                  <p className="font-display text-base text-espresso">{formatPrice(s.avgPrice)}</p>
                  <p className="font-display text-[9px] text-ink-3 uppercase">Avg Price</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
