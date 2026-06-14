import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MenuCard } from '@/components/menu/MenuCard';
import { MotionButton, LinkButton} from '@/components/ui/Button';
import type { FoodItem } from '@/types';

// Static seed items using extracted images
const SEED_ITEMS: FoodItem[] = [
  { _id: 's1', name: 'Espresso Royale',        description: 'Rich, bold espresso with a golden crema from Ethiopian single-origin beans.',     price: 180, category: 'Coffee',   images: [{ url: '/images/menu/espresso-royale.webp',         publicId: '' }], isVegetarian: true,  isVegan: false, isGlutenFree: false, isSpicy: false, isAvailable: true, isFeatured: true,  isSpecial: false, rating: 4.8, reviewCount: 124, orderCount: 890, preparationTime: 5,  tags: ['bestseller'], createdAt: '' },
  { _id: 's2', name: 'Caramel Cloud Latte',     description: 'Velvety oat milk layered over espresso with housemade caramel and fleur de sel.', price: 320, discountPrice: 280, category: 'Coffee',   images: [{ url: '/images/menu/caramel-cloud-latte.webp',     publicId: '' }], isVegetarian: true,  isVegan: false, isGlutenFree: false, isSpicy: false, isAvailable: true, isFeatured: true,  isSpecial: false, rating: 4.9, reviewCount: 230, orderCount: 1200, preparationTime: 8, tags: ['popular'],    createdAt: '' },
  { _id: 's3', name: 'Wagyu Smash Burger',      description: 'Double wagyu smash patties, aged cheddar, truffle aioli on a brioche bun.',     price: 680, category: 'Burgers',  images: [{ url: '/images/menu/wagyu-smash-burger.png',       publicId: '' }], isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false, isAvailable: true, isFeatured: true,  isSpecial: true,  rating: 4.7, reviewCount: 87,  orderCount: 560,  preparationTime: 18, tags: ['premium'],    createdAt: '' },
  { _id: 's4', name: 'Truffle Margherita',      description: 'San Marzano tomatoes, buffalo mozzarella, black truffle oil on sourdough crust.', price: 820, category: 'Pizza',    images: [{ url: '/images/menu/truffle-margherita.png',       publicId: '' }], isVegetarian: true,  isVegan: false, isGlutenFree: false, isSpicy: false, isAvailable: true, isFeatured: true,  isSpecial: false, rating: 4.6, reviewCount: 63,  orderCount: 340,  preparationTime: 22, tags: ['vegetarian'], createdAt: '' },
  { _id: 's5', name: 'Tiramisu Classico',       description: 'Authentic Italian tiramisu, mascarpone, espresso-soaked savoiardi, fine cocoa.',  price: 380, category: 'Desserts', images: [{ url: '/images/menu/tiramisu-classico.webp',       publicId: '' }], isVegetarian: true,  isVegan: false, isGlutenFree: false, isSpicy: false, isAvailable: true, isFeatured: true,  isSpecial: false, rating: 4.9, reviewCount: 156, orderCount: 720,  preparationTime: 5,  tags: ['classic'],    createdAt: '' },
  { _id: 's6', name: 'Burnt Basque Cheesecake', description: 'Creamy custardy centre with a deeply caramelised top and fresh berries.',         price: 340, category: 'Desserts', images: [{ url: '/images/menu/burnt-basque-cheesecake.png',  publicId: '' }], isVegetarian: true,  isVegan: false, isGlutenFree: false, isSpicy: false, isAvailable: true, isFeatured: false, isSpecial: true,  rating: 4.8, reviewCount: 108, orderCount: 590,  preparationTime: 5,  tags: ['trending'],   createdAt: '' },
];

interface Props { items?: FoodItem[]; isLoading?: boolean; }

export const FeaturedMenuSection = ({ items = SEED_ITEMS }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative py-24 bg-canvas overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">Hand-picked for you</span>
            <div className="divider-gold mx-0 mt-2 mb-3" />
            <h2 className="font-serif text-display text-espresso">
              Today's Finest
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-2"
          >
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-beige/60 flex items-center justify-center text-ink-2 hover:border-gold/50 hover:text-espresso transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-espresso text-cream flex items-center justify-center hover:bg-gold transition-all">
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, i) => (
            <MenuCard key={item._id} item={item} index={i} />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div
          ref={scrollRef}
          className="md:hidden flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-5 px-5"
        >
          {items.slice(0, 6).map((item, i) => (
            <div key={item._id} className="flex-shrink-0 w-[75vw] max-w-xs">
              <MenuCard item={item} index={i} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <LinkButton to="/menu" variant="cream" size="lg" pill rightIcon={<ArrowRight size={16} />}>
            Browse Full Menu
          </LinkButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenuSection;
