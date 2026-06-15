import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tag, Clock, Percent, Copy, CheckCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { LinkButton} from '@/components/ui/Button';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';

const COUPONS = [
  { code: 'WELCOME20', type: 'percentage', value: 20, minOrder: 300, description: '20% off your first order', expiry: '30 days left', color: 'bg-espresso', accent: 'text-gold', img: '/images/menu/espresso-royale.webp', tag: 'New Users' },
  { code: 'FLAT100',   type: 'fixed',      value: 100, minOrder: 800, description: '₹100 off on orders above ₹800', expiry: '14 days left', color: 'bg-gradient-to-br from-amber-800 to-amber-600', accent: 'text-amber-200', img: '/images/menu/mushroom-swiss-burger.png', tag: 'Hot Deal' },
  { code: 'FREESHIP',  type: 'fixed',      value: 40,  minOrder: 0,   description: 'Free delivery on any order', expiry: '7 days left', color: 'bg-gradient-to-br from-emerald-800 to-emerald-600', accent: 'text-emerald-200', img: '/images/menu/tiramisu-classico.webp', tag: 'Free Delivery' },
  { code: 'WEEKEND25', type: 'percentage', value: 25,  minOrder: 500, description: '25% off every weekend', expiry: 'Weekends only', color: 'bg-gradient-to-br from-purple-900 to-purple-700', accent: 'text-purple-200', img: '/images/menu/caramel-cloud-latte.webp', tag: 'Weekend' },
];

const DEALS = [
  { title: 'Morning Ritual',  sub: 'Any coffee + pastry combo', disc: '15% off before 10am', img: '/images/menu/cappuccino-classico.png' },
  { title: 'Lunch For Two',  sub: 'Two mains + two drinks', disc: 'Save ₹150',              img: '/images/menu/mushroom-swiss-burger.png' },
  { title: 'Sweet Escape',   sub: 'Three desserts bundle',   disc: '20% off',                img: '/images/menu/burnt-basque-cheesecake.png' },
  { title: 'Office Bundle',  sub: 'Orders above ₹2000',      disc: 'Free delivery + 10%',    img: '/images/grilli/event-1.jpg'    },
];

const CouponCard = ({ coupon }: { coupon: typeof COUPONS[0] }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="overflow-hidden rounded-3xl shadow-warm"
    >
      <div className={`${coupon.color} p-6 relative overflow-hidden`}>
        {/* Background image */}
        <div className="absolute right-4 bottom-0 opacity-15">
          <img src={coupon.img} alt="" className="w-28 h-28 object-contain" />
        </div>
        <div className="relative z-10">
          <span className={`font-display text-[10px] font-semibold tracking-widest uppercase ${coupon.accent} border border-current/30 px-2.5 py-1 rounded-full mb-3 inline-block`}>
            {coupon.tag}
          </span>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-sans text-sm text-cream/70 mb-1">{coupon.description}</p>
              <p className="font-serif text-3xl text-cream">
                {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
              </p>
            </div>
            {coupon.type === 'percentage'
              ? <Percent size={28} className={coupon.accent} />
              : <Tag size={28} className={coupon.accent} />}
          </div>
          {coupon.minOrder > 0 && (
            <p className="font-sans text-xs text-cream/50 mb-4">Min. order ₹{coupon.minOrder}</p>
          )}
        </div>
      </div>

      {/* Serrated divider */}
      <div className="h-4 bg-cream flex" style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, var(--canvas) 6px, transparent 6px)`,
        backgroundSize: '20px 100%',
      }} />

      <div className="bg-cream px-6 py-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-espresso tracking-widest">{coupon.code}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock size={11} className="text-ink-3" />
            <span className="font-sans text-xs text-ink-3">{coupon.expiry}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={copy}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-beige font-display text-sm text-ink-2 hover:border-gold/50 hover:text-espresso transition-all"
          >
            {copied ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
          <LinkButton to="/menu" variant="espresso" size="sm" pill>
            Use
          </LinkButton>
        </div>
      </div>
    </motion.div>
  );
};

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-canvas pt-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-espresso py-20 text-center">
        <img src="/images/grilli/shape-1.png" alt="" className="absolute left-12 top-8 w-16 opacity-10 animate-float" />
        <img src="/images/grilli/shape-5.png" alt="" className="absolute right-12 bottom-8 w-14 opacity-10 animate-float-slow" />
        <div className="absolute inset-0 grain-overlay" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="eyebrow text-gold">Exclusive Deals</span>
          <div className="divider-gold" />
          <h1 className="font-serif text-display text-cream mb-3">Offers & Coupons</h1>
          <p className="font-sans text-cream/60 text-base max-w-md mx-auto">
            Hand-picked savings for our most loyal guests. New offers added every week.
          </p>
        </motion.div>
      </div>

      {/* Coupon grid */}
      <section className="py-20 max-w-7xl mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <span className="eyebrow">Active Coupons</span>
          <div className="divider-gold mx-0 mt-2" />
          <h2 className="font-serif text-3xl text-espresso">Your Savings Today</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUPONS.map((c) => <CouponCard key={c.code} coupon={c} />)}
        </div>
      </section>

      {/* Deal cards */}
      <section className="py-16 bg-canvas-2">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow">Combo Deals</span>
            <div className="divider-gold" />
            <h2 className="font-serif text-3xl text-espresso">Curated Combos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEALS.map((deal, i) => (
              <motion.div
                key={deal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to="/menu" className="block card-premium overflow-hidden group h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h4 className="font-serif text-lg text-espresso mb-1">{deal.title}</h4>
                    <p className="font-sans text-sm text-ink-3 mb-3">{deal.sub}</p>
                    <span className="font-display text-sm font-semibold text-gold">{deal.disc}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="py-16 max-w-7xl mx-auto px-5 md:px-8">
        <div className="card-premium overflow-hidden relative p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 bg-espresso">
              <span className="eyebrow text-gold">Loyalty Programme</span>
              <h3 className="font-serif text-3xl text-cream mt-3 mb-4">Earn While You Sip</h3>
              <p className="font-sans text-cream/60 text-sm mb-6 leading-relaxed">
                Every order earns you Café Points. Redeem them for free drinks, exclusive discounts, and priority delivery.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[['1pt', 'per ₹10 spent'], ['50pts', 'free coffee'], ['200pts', 'premium item']].map(([v, l]) => (
                  <div key={l} className="p-3 bg-cream/10 rounded-xl text-center">
                    <p className="font-serif text-xl text-gold">{v}</p>
                    <p className="font-sans text-xs text-cream/50 mt-1">{l}</p>
                  </div>
                ))}
              </div>
              <LinkButton to="/register" variant="gold" pill size="lg" rightIcon={<ArrowRight size={16} />}>
                Join Free
              </LinkButton>
            </div>
            <div className="relative overflow-hidden min-h-[280px]">
              <img src="/images/foodie/cta-banner.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gold/20 backdrop-blur-sm flex items-center justify-center">
                <img src="/images/grilli/badge-2.png" alt="" className="w-40 animate-float-slow drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />
      <NewsletterSection />
    </div>
  );
}
