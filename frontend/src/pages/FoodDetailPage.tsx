import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Minus, ShoppingCart, Clock, Star, Leaf, Flame } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { MotionButton } from '@/components/ui/Button'
import { Badge, RatingBadge } from '@/components/ui/Badge'
import { formatPrice } from '@/utils/format'
import { MOCK_FOOD_ITEMS } from '@/services/mockData'
import { foodAPI } from '@/api/services'
import { resolveItemImage } from '@/utils/foodImage'
import type { FoodItem } from '@/types'

export default function FoodDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [item, setItem] = useState<FoodItem | null>(null)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    // Try API first, fallback to mock
    const load = async () => {
      if (!id) return
      try {
        const { data } = await foodAPI.getById(id)
        if (data.data) { setItem(data.data); return }
      } catch { /* offline */ }
      // Seed fallback
      const found = MOCK_FOOD_ITEMS.find(f => f._id === id)
      setItem(found ?? null)
    }
    load()
  }, [id])

  if (!item) return (
    <div className="min-h-screen bg-canvas pt-28 flex items-center justify-center">
      <div className="text-center">
        <p className="font-sans text-ink-3 mb-4">Item not found.</p>
        <Link to="/menu" className="text-gold font-display text-sm hover:underline">← Back to Menu</Link>
      </div>
    </div>
  )

  const effectivePrice = item.discountPrice ?? item.price
  const hasDiscount = item.discountPrice && item.discountPrice < item.price
  const images = item.images?.length ? item.images : [{ url: resolveItemImage(undefined, item.name, item.category), publicId: '' }]

  const handleAdd = () => {
    addToCart(item, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        {/* Back */}
        <Link to="/menu" className="flex items-center gap-2 text-ink-3 hover:text-espresso font-display text-sm transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Menu
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left — images */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-canvas-2 mb-4"
            >
              <img src={images[activeImg]?.url} alt={item.name} className="w-full h-full object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — details */}
          <div className="space-y-5">
            <span className="eyebrow">{item.category}</span>
            <h1 className="font-serif text-display text-espresso leading-tight">{item.name}</h1>

            {/* Meta */}
            <div className="flex items-center gap-3 flex-wrap">
              {item.rating > 0 && <RatingBadge rating={item.rating} />}
              {item.reviewCount > 0 && <span className="font-sans text-sm text-ink-3">({item.reviewCount} reviews)</span>}
              <div className="flex items-center gap-1 font-sans text-sm text-ink-3">
                <Clock size={13} className="text-gold" />
                {item.preparationTime} min
              </div>
            </div>

            <p className="font-sans text-base text-ink-2 leading-relaxed">{item.description}</p>

            {/* Dietary badges */}
            <div className="flex flex-wrap gap-2">
              {item.isVegetarian  && <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-display text-xs"><Leaf size={11} /> Vegetarian</span>}
              {item.isVegan       && <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-display text-xs"><Leaf size={11} /> Vegan</span>}
              {item.isGlutenFree  && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-display text-xs">Gluten Free</span>}
              {item.isSpicy       && <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full font-display text-xs"><Flame size={11} /> Spicy</span>}
            </div>

            {/* Nutrition */}
            {item.nutrition?.calories && (
              <div className="grid grid-cols-4 gap-2 p-4 bg-canvas-2 rounded-2xl">
                {[
                  { label: 'Cal', value: item.nutrition.calories, unit: 'kcal' },
                  { label: 'Protein', value: item.nutrition.protein, unit: 'g' },
                  { label: 'Carbs', value: item.nutrition.carbs, unit: 'g' },
                  { label: 'Fat', value: item.nutrition.fat, unit: 'g' },
                ].map(n => n.value !== undefined && (
                  <div key={n.label} className="text-center">
                    <p className="font-serif text-lg text-espresso">{n.value}</p>
                    <p className="font-display text-[9px] text-ink-3 uppercase tracking-wide">{n.unit}</p>
                    <p className="font-display text-[9px] text-ink-3">{n.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Price + qty + CTA */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl text-espresso">{formatPrice(effectivePrice * qty)}</span>
                  {hasDiscount && qty === 1 && (
                    <span className="font-sans text-sm text-ink-3 line-through">{formatPrice(item.price)}</span>
                  )}
                </div>
                {/* Quantity */}
                <div className="flex items-center gap-3 bg-canvas-2 rounded-full px-2 py-1">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-2 hover:bg-mist transition-colors shadow-warm-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-display text-base font-semibold text-espresso w-5 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-8 h-8 rounded-full bg-espresso flex items-center justify-center text-cream hover:bg-gold transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <MotionButton
                onClick={handleAdd}
                disabled={!item.isAvailable}
                variant={added ? 'gold' : 'espresso'}
                fullWidth
                size="lg"
                pill
                leftIcon={<ShoppingCart size={16} />}
              >
                {added ? '✓ Added to Cart!' : item.isAvailable ? `Add ${qty} to Cart` : 'Currently Unavailable'}
              </MotionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
