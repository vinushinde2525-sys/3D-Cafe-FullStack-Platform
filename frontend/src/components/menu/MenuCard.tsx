import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingCart, Heart, Star, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Badge, VegBadge, RatingBadge } from '@/components/ui/Badge';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';
import { resolveItemImage } from '@/utils/foodImage';
import type { FoodItem } from '@/types';

interface Props {
  item: FoodItem;
  index?: number;
  layout?: 'grid' | 'list';
}

export const MenuCard = ({ item, index = 0, layout = 'grid' }: Props) => {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(item, 1, [], (e.currentTarget as HTMLElement).getBoundingClientRect());
    setTimeout(() => setAdding(false), 700);
  };

  const imageUrl = resolveItemImage(item.images?.[0]?.url, item.name, item.category);
  const effectivePrice = item.discountPrice ?? item.price;
  const hasDiscount = item.discountPrice && item.discountPrice < item.price;

  if (layout === 'list') {
    return (
      <div className="card-premium flex gap-5 p-4 overflow-hidden group">
        <Link to={`/menu/${item._id}`} className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden bg-canvas-2">
          <img src={imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1">
              <Link to={`/menu/${item._id}`}>
                <h3 className="font-serif text-lg text-espresso leading-tight hover:text-gold transition-colors line-clamp-1">{item.name}</h3>
              </Link>
              <VegBadge isVegan={item.isVegan} />
            </div>
            <p className="font-sans text-sm text-ink-3 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl text-espresso">{formatPrice(effectivePrice)}</span>
                {hasDiscount && <span className="font-sans text-xs text-ink-3 line-through">{formatPrice(item.price)}</span>}
              </div>
              {item.rating > 0 && <RatingBadge rating={item.rating} />}
            </div>
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              disabled={!item.isAvailable || adding}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full font-display text-sm font-medium transition-all',
                item.isAvailable
                  ? 'bg-espresso text-cream hover:bg-gold shadow-warm-sm'
                  : 'bg-canvas-2 text-ink-3 cursor-not-allowed'
              )}
            >
              {adding ? <Zap size={14} className="animate-pulse" /> : <ShoppingCart size={14} />}
              {adding ? 'Added!' : item.isAvailable ? 'Add' : 'Sold out'}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000, position: 'relative' }}
      className="group"
    >
      <div className="card-premium overflow-hidden h-full flex flex-col bg-cream">
        {/* Image container */}
        <Link to={`/menu/${item._id}`} className="relative block overflow-hidden bg-canvas-2 aspect-[4/3]">
          <motion.img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {item.isFeatured && <Badge variant="gold" size="sm">⭐ Featured</Badge>}
            {item.isSpecial && <Badge variant="espresso" size="sm">✦ Special</Badge>}
            {hasDiscount && (
              <Badge variant="error" size="sm">
                -{Math.round(((item.price - effectivePrice) / item.price) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Like button */}
          <motion.button
            onClick={(e) => { e.preventDefault(); setLiked((v) => !v); }}
            whileTap={{ scale: 0.8 }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-warm-sm"
          >
            <Heart size={14} className={cn('transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-ink-3')} />
          </motion.button>

          {/* Prep time */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-espresso/80 backdrop-blur-sm text-cream px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Clock size={10} />
            <span className="font-display text-[10px] font-medium">{item.preparationTime}m</span>
          </div>

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-espresso/50 backdrop-blur-sm flex items-center justify-center">
              <span className="font-display text-sm font-semibold text-cream bg-espresso/80 px-3 py-1 rounded-full">Sold Out</span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <Link to={`/menu/${item._id}`}>
              <h3 className="font-serif text-lg text-espresso leading-tight hover:text-gold transition-colors line-clamp-2">{item.name}</h3>
            </Link>
            <VegBadge isVegan={item.isVegan} />
          </div>

          <p className="font-sans text-sm text-ink-3 line-clamp-2 leading-relaxed mb-3 flex-1">{item.description}</p>

          {/* Meta row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {item.rating > 0 && <RatingBadge rating={item.rating} />}
            {item.reviewCount > 0 && <span className="text-xs text-ink-3 font-sans">({item.reviewCount})</span>}
            {item.isSpicy && <Badge variant="warning" size="sm">🌶 Spicy</Badge>}
            {item.isGlutenFree && <Badge variant="success" size="sm">GF</Badge>}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-3 mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl text-espresso leading-none">{formatPrice(effectivePrice)}</span>
              {hasDiscount && <span className="font-sans text-xs text-ink-3 line-through">{formatPrice(item.price)}</span>}
            </div>

            <motion.button
              onClick={handleAddToCart}
              disabled={!item.isAvailable || adding}
              whileHover={item.isAvailable ? { scale: 1.04 } : undefined}
              whileTap={item.isAvailable ? { scale: 0.94 } : undefined}
              className={cn(
                'relative flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm font-medium transition-all overflow-hidden',
                item.isAvailable
                  ? 'bg-espresso text-cream hover:bg-gold shadow-warm-sm'
                  : 'bg-canvas-2 text-ink-3 cursor-not-allowed'
              )}
            >
              {adding ? (
                <>
                  <Zap size={14} className="animate-pulse" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>{item.isAvailable ? 'Add' : 'Unavailable'}</span>
                </>
              )}
              {/* Ripple on add */}
              {adding && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gold/30"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
