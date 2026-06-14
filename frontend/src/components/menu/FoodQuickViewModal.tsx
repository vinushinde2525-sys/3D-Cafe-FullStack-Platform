import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Clock, ChefHat, Leaf, Flame, Star, X, Plus, Minus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge, VegBadge, RatingBadge } from '@/components/ui/Badge';
import { resolveItemImage } from '@/utils/foodImage';
import { MotionButton } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { FoodItem } from '@/types';

interface Props { item: FoodItem | null; onClose: () => void; }

export const FoodQuickViewModal = ({ item, onClose }: Props) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!item) return null;

  const effectivePrice = item.discountPrice ?? item.price;
  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
  const primaryImage = resolveItemImage(item.images?.[0]?.url, item.name, item.category);
  const images = item.images?.length
    ? item.images
    : [{ url: primaryImage, publicId: '' }];

  const handleAdd = () => {
    addToCart(item, qty);
    onClose();
  };

  return (
    <Modal isOpen={!!item} onClose={onClose} size="xl" showClose={false} className="p-0 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        {/* Left — image gallery */}
        <div className="relative bg-canvas-2 flex flex-col">
          <button onClick={onClose} className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center text-ink-2 hover:text-espresso shadow-warm-sm transition-colors">
            <X size={16} />
          </button>
          <button onClick={() => setLiked(v => !v)} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center shadow-warm-sm transition-colors">
            <Heart size={16} className={cn(liked ? 'fill-red-500 text-red-500' : 'text-ink-3')} />
          </button>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center p-8 min-h-[280px]">
            <motion.img
              key={activeImg}
              src={images[activeImg]?.url}
              alt={item.name}
              className="max-w-full max-h-[280px] object-contain drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 justify-center pb-5 px-5">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={cn('w-14 h-14 rounded-xl overflow-hidden border-2 transition-all', i === activeImg ? 'border-gold shadow-gold' : 'border-transparent opacity-60 hover:opacity-100')}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — details */}
        <div className="p-7 flex flex-col overflow-y-auto">
          {/* Category */}
          <span className="eyebrow mb-2">{item.category}</span>

          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-serif text-2xl text-espresso leading-tight">{item.name}</h2>
            <VegBadge isVegan={item.isVegan} />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            {item.rating > 0 && <RatingBadge rating={item.rating} />}
            {item.reviewCount > 0 && <span className="text-xs text-ink-3 font-sans">{item.reviewCount} reviews</span>}
            <div className="flex items-center gap-1 text-xs text-ink-3 font-sans">
              <Clock size={12} className="text-gold" />
              <span>{item.preparationTime} min</span>
            </div>
            {item.isSpecial && <Badge variant="espresso" size="sm">✦ Special</Badge>}
          </div>

          <p className="font-sans text-sm text-ink-2 leading-relaxed mb-5">{item.description}</p>

          {/* Dietary flags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {item.isVegetarian && <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-display"><Leaf size={11} /> Vegetarian</div>}
            {item.isVegan && <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-display"><Leaf size={11} /> Vegan</div>}
            {item.isGlutenFree && <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-display"><ChefHat size={11} /> Gluten Free</div>}
            {item.isSpicy && <div className="flex items-center gap-1 text-xs text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full font-display"><Flame size={11} /> Spicy</div>}
          </div>

          {/* Nutrition snapshot */}
          {item.nutrition?.calories && (
            <div className="grid grid-cols-4 gap-2 p-3 bg-canvas-2 rounded-2xl mb-5">
              {[
                { label: 'Cal', value: item.nutrition.calories, unit: 'kcal' },
                { label: 'Protein', value: item.nutrition.protein, unit: 'g' },
                { label: 'Carbs', value: item.nutrition.carbs, unit: 'g' },
                { label: 'Fat', value: item.nutrition.fat, unit: 'g' },
              ].map(({ label, value, unit }) => value !== undefined && (
                <div key={label} className="text-center">
                  <p className="font-serif text-base text-espresso">{value}</p>
                  <p className="font-display text-[10px] text-ink-3 uppercase tracking-wide">{unit}</p>
                  <p className="font-display text-[9px] text-ink-3">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Price + qty */}
          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-espresso">{formatPrice(effectivePrice * qty)}</span>
                {hasDiscount && qty === 1 && <span className="font-sans text-sm text-ink-3 line-through">{formatPrice(item.price)}</span>}
              </div>
              {/* Quantity control */}
              <div className="flex items-center gap-3 bg-canvas-2 rounded-full px-2 py-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-2 hover:text-espresso hover:bg-mist transition-colors shadow-warm-sm">
                  <Minus size={14} />
                </button>
                <span className="font-display text-base font-semibold text-espresso w-5 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 rounded-full bg-espresso flex items-center justify-center text-cream hover:bg-gold transition-colors shadow-warm-sm">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <MotionButton
              onClick={handleAdd}
              disabled={!item.isAvailable}
              variant="espresso"
              fullWidth
              size="lg"
              pill
              leftIcon={<ShoppingCart size={16} />}
            >
              {item.isAvailable ? `Add ${qty} to Cart` : 'Currently Unavailable'}
            </MotionButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FoodQuickViewModal;
