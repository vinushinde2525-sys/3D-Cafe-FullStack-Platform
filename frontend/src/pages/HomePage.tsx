import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Truck } from 'lucide-react';
import { MotionButton, LinkButton} from '@/components/ui/Button';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-warm-gradient" />
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/grilli/hero-slider-1.jpg')" }}
        />
        <div className="absolute inset-0 grain-overlay" />

        {/* Floating decorative shapes */}
        <motion.img
          src="/images/grilli/shape-1.png" alt=""
          className="absolute top-24 right-[8%] w-16 opacity-30"
          animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          src="/images/grilli/shape-3.png" alt=""
          className="absolute bottom-32 left-[6%] w-12 opacity-20"
          animate={{ y: [6, -6, 6], rotate: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">
              <motion.div variants={fadeUp}>
                <span className="eyebrow">✦ Artisan · Premium · Crafted</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-serif text-hero text-espresso text-balance">
                Crafted Slowly.<br />
                <span className="text-gold italic">Served</span> Beautifully.
              </motion.h1>

              <motion.p variants={fadeUp} className="font-sans text-lg text-ink-2 max-w-md leading-relaxed">
                Every cup, every bite — made with intention. From single-origin espresso to handcrafted pastries, 3D Café is where ritual meets pleasure.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <LinkButton to="/menu" variant="espresso" size="lg" pill rightIcon={<ArrowRight size={16} />}>
                  Order Now
                </LinkButton>
                <LinkButton to="/menu" variant="outline" size="lg" pill>
                  Explore Menu
                </LinkButton>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 pt-2">
                {[
                  { icon: <Star size={14} className="fill-gold text-gold" />, text: '4.9 Rating' },
                  { icon: <Clock size={14} className="text-gold" />, text: '25 min delivery' },
                  { icon: <Truck size={14} className="text-gold" />, text: 'Free above ₹500' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    {icon}
                    <span className="font-display text-sm text-ink-2">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="relative w-[480px] h-[480px]">
                {/* Glow ring */}
                <div className="absolute inset-12 rounded-full bg-gold/15 blur-3xl" />
                {/* Main image */}
                <motion.img
                  src="/images/foodie/hero-banner.png"
                  alt="Artisan coffee"
                  className="relative w-full h-full object-contain drop-shadow-2xl"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Floating food items */}
                <motion.img
                  src="/images/grilli/menu-1.png" alt=""
                  className="absolute -top-4 -left-4 w-24 h-24 object-contain drop-shadow-lg"
                  animate={{ y: [-6, 6, -6], rotate: [-3, 3, -3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.img
                  src="/images/grilli/menu-3.png" alt=""
                  className="absolute -bottom-2 -right-6 w-20 h-20 object-contain drop-shadow-lg"
                  animate={{ y: [6, -6, 6], rotate: [3, -3, 3] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                {/* Steam effect */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
                  {[0,1,2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 h-6 rounded-full bg-gold-light/60"
                      animate={{ opacity: [0, 0.6, 0], y: [0, -20], scaleX: [1, 1.5] }}
                      transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-gold/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-gold" />
          </div>
          <span className="font-display text-[10px] tracking-widest uppercase text-ink-3">Scroll</span>
        </motion.div>
      </section>

      {/* ── Features strip ───────────────────────────────────────────── */}
      <section className="bg-espresso py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { img: '/images/grilli/features-icon-1.png', label: 'Specialty Roasts' },
              { img: '/images/grilli/features-icon-2.png', label: 'Freshly Baked' },
              { img: '/images/grilli/features-icon-3.png', label: 'Fast Delivery' },
              { img: '/images/grilli/features-icon-4.png', label: 'Pure Ingredients' },
            ].map(({ img, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                className="flex items-center gap-4"
              >
                <img src={img} alt={label} className="w-10 h-10 object-contain opacity-80" />
                <span className="font-display text-sm font-medium text-cream/80">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Menu Preview ─────────────────────────────────────── */}
      <section className="py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">Today's picks</span>
            <div className="divider-gold" />
            <h2 className="font-serif text-display text-espresso mt-2">
              Crafted with Intention
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: n * 0.07 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              >
                <Link to="/menu" className="block card-premium overflow-hidden group">
                  <div className="aspect-square overflow-hidden bg-canvas-2">
                    <img
                      src={`/images/grilli/menu-${n}.png`}
                      alt={`Menu item ${n}`}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <LinkButton to="/menu" variant="cream" size="lg" pill rightIcon={<ArrowRight size={16} />}>
              View Full Menu
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── About banner ─────────────────────────────────────────────── */}
      <section className="py-20 bg-canvas-2">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/grilli/about-banner.jpg"
                alt="Café interior"
                className="rounded-3xl object-cover w-full aspect-[4/3] shadow-warm-lg"
              />
              <div className="absolute -bottom-6 -right-6 hidden md:block">
                <img
                  src="/images/grilli/badge-2.png"
                  alt="Quality badge"
                  className="w-28 h-28 animate-float-slow"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="eyebrow">Our Story</span>
              <div className="divider-gold mx-0" />
              <h2 className="font-serif text-display text-espresso">
                Where Every Sip<br />Tells a Story
              </h2>
              <p className="font-sans text-ink-2 leading-relaxed">
                Founded on the belief that great coffee is a craft, 3D Café began with a single espresso machine and an obsession with quality. Today, we roast in-house, bake daily, and serve with the same love that started it all.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[['12+', 'Years of craft'], ['50k+', 'Cups served'], ['25+', 'Blends available']].map(([v, l]) => (
                  <div key={l} className="p-4 bg-cream rounded-2xl border border-beige/40">
                    <p className="font-serif text-2xl text-espresso">{v}</p>
                    <p className="font-sans text-xs text-ink-3 mt-1">{l}</p>
                  </div>
                ))}
              </div>
              <LinkButton to="/about" variant="espresso" pill size="lg">
                Our Story
              </LinkButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/grilli/testimonial-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-espresso/75" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <span className="eyebrow text-gold">What Our Guests Say</span>
          <div className="divider-gold" />
          <h2 className="font-serif text-display text-cream mb-12">Stories from Our Café</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', text: 'The Caramel Cloud Latte is unlike anything I\'ve had. I visit twice a week just for it.', avatar: '1' },
              { name: 'Rohan M.', text: 'Premium ingredients, incredible atmosphere. This is what coffee culture should feel like.', avatar: '2' },
              { name: 'Ananya K.', text: 'The Tiramisu is perfection. Pairs beautifully with their single-origin espresso.', avatar: '3' },
            ].map(({ name, text, avatar }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-cream/10 backdrop-blur-sm border border-cream/15 rounded-3xl text-left"
              >
                <p className="font-serif text-lg text-cream/90 italic leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={`/images/foodie/avatar-${avatar}.jpg`}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gold/30"
                  />
                  <div>
                    <p className="font-display text-sm font-semibold text-cream">{name}</p>
                    <p className="text-[11px] text-cream/50 font-sans">★★★★★</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
