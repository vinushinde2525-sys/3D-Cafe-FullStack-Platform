import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Percent, Gift } from 'lucide-react';
import { MotionButton, LinkButton} from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface BannerProps {
  variant?: 'hero' | 'strip' | 'card';
  title?: string;
  subtitle?: string;
  cta?: string;
  ctaLink?: string;
  code?: string;
  image?: string;
  className?: string;
}

export const PromotionalBanner = ({
  variant = 'hero',
  title = 'First Order 20% Off',
  subtitle = 'Use code WELCOME20 at checkout. Minimum order ₹300.',
  cta = 'Order Now',
  ctaLink = '/menu',
  code = 'WELCOME20',
  image = '/images/foodie/cta-banner.png',
  className,
}: BannerProps) => {
  if (variant === 'strip') {
    return (
      <div className={cn('bg-espresso py-3', className)}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-center gap-4 flex-wrap text-center">
          <span className="text-gold text-sm font-display font-medium">🎉 {title}</span>
          <span className="text-cream/60 text-sm font-sans hidden sm:block">—</span>
          <span className="text-cream/70 text-sm font-sans">{subtitle}</span>
          {code && (
            <span className="bg-gold/20 text-gold border border-gold/30 px-3 py-0.5 rounded-full text-xs font-display font-semibold tracking-wide">
              {code}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn('card-premium overflow-hidden relative', className)}
      >
        <div className="absolute inset-0 bg-espresso-gradient opacity-95" />
        <div className="relative p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <span className="eyebrow text-gold mb-3 block">Limited Time Offer</span>
            <h3 className="font-serif text-2xl text-cream mb-2">{title}</h3>
            <p className="font-sans text-sm text-cream/60 mb-4">{subtitle}</p>
            {code && (
              <div className="inline-flex items-center gap-2 bg-cream/10 border border-cream/20 rounded-full px-4 py-2 mb-5">
                <Tag size={13} className="text-gold" />
                <span className="font-display text-sm font-semibold text-cream tracking-widest">{code}</span>
              </div>
            )}
            <LinkButton to={ctaLink} variant="gold" pill size="md" rightIcon={<ArrowRight size={14} />}>
              {cta}
            </LinkButton>
          </div>
          <img src={image} alt="" className="w-32 h-32 object-contain opacity-80 flex-shrink-0" />
        </div>
      </motion.div>
    );
  }

  // hero variant
  return (
    <section className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/foodie/delivery-banner-bg.png')` }}
      />
      <div className="absolute inset-0 bg-espresso/80" />
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="eyebrow text-gold">Special Offer</span>
            <h2 className="font-serif text-display text-cream leading-tight">{title}</h2>
            <p className="font-sans text-base text-cream/70 leading-relaxed">{subtitle}</p>

            <div className="flex flex-wrap gap-4 items-center">
              {code && (
                <div className="flex items-center gap-2 bg-cream/10 border border-gold/30 rounded-full px-5 py-2.5">
                  <Percent size={15} className="text-gold" />
                  <span className="font-display text-base font-semibold text-cream tracking-widest">{code}</span>
                </div>
              )}
              <LinkButton to={ctaLink} variant="gold" size="lg" pill rightIcon={<ArrowRight size={16} />}>
                {cta}
              </LinkButton>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: <Gift size={14} />, text: 'Free on first order' },
                { icon: <Tag size={14} />, text: 'No minimum' },
                { icon: <Percent size={14} />, text: '20% savings' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-cream/60 text-sm font-sans">
                  <span className="text-gold">{icon}</span>{text}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl" />
              <motion.img
                src={image}
                alt="Promotional"
                className="relative w-full h-full object-contain drop-shadow-2xl"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const PromoCardRow = () => (
  <section className="py-16 bg-canvas-2">
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { img: '/images/foodie/promo-1.png', icon: '/images/foodie/promo-icon-1.svg', title: 'Free Delivery',    sub: 'On orders above ₹500' },
          { img: '/images/foodie/promo-2.png', icon: '/images/foodie/promo-icon-2.svg', title: 'Earn Rewards',     sub: '1 point per ₹10 spent'  },
          { img: '/images/foodie/promo-3.png', icon: '/images/foodie/promo-icon-3.svg', title: 'Daily Specials',   sub: 'Chef\'s picks every day'  },
        ].map(({ img, title, sub }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-6 flex items-center gap-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-canvas-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={img} alt={title} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-espresso mb-1">{title}</h4>
              <p className="font-sans text-sm text-ink-3">{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PromotionalBanner;
