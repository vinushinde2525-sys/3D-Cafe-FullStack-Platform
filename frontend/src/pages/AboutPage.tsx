import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Star, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MotionButton, LinkButton} from '@/components/ui/Button';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';

const VALUES = [
  { icon: <Leaf size={22} />, title: 'Sustainably Sourced', text: 'Our coffee beans are ethically sourced directly from small-hold farms in Ethiopia, Colombia, and Kerala — traceable from crop to cup.' },
  { icon: <Star size={22} />, title: 'Uncompromising Quality', text: 'Every recipe is tested dozens of times before it reaches your table. We use organic produce, artisan breads, and premium dairy.' },
  { icon: <Heart size={22} />, title: 'Community First', text: 'We partner with local bakeries, support regional farmers, and donate a portion of profits to food literacy programmes.' },
  { icon: <Award size={22} />, title: 'Craftsmanship', text: 'Our baristas train for six months before serving their first espresso. Excellence is not an accident.' },
];

const TEAM = [
  { name: 'Arjun Nair',       role: 'Head Barista & Co-founder', img: '/images/grilli/service-1.jpg' },
  { name: 'Meera Kapoor',     role: 'Executive Chef',            img: '/images/grilli/service-2.jpg' },
  { name: 'Dev Raghunathan',  role: 'Roastmaster',               img: '/images/grilli/service-3.jpg' },
];

const MILESTONES = [
  { year: '2012', event: 'Founded with a single espresso machine and a dream in Koregaon Park.' },
  { year: '2015', event: 'Launched our in-house roastery, sourcing directly from Ethiopian cooperatives.' },
  { year: '2018', event: 'Opened our second location, expanded the kitchen, and introduced the full food menu.' },
  { year: '2021', event: 'Won Pune\'s Best Independent Café Award for the third consecutive year.' },
  { year: '2024', event: 'Launched 3D Café digital platform — bringing our experience to your doorstep.' },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <div className="min-h-screen bg-canvas pt-20">
      {/* Hero with parallax */}
      <div ref={heroRef} className="relative h-[70vh] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img src="/images/grilli/about-banner.jpg" alt="3D Café interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent" />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pb-16 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="eyebrow text-gold">Our Story</span>
            <h1 className="font-serif text-display text-cream mt-2 mb-4">
              A Café Born from<br />Pure Obsession
            </h1>
            <p className="font-sans text-cream/70 text-lg max-w-xl leading-relaxed">
              We didn't open to sell coffee. We opened because we believed the world deserved better coffee — and we were willing to dedicate our lives to proving it.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-espresso py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[['12+', 'Years of craft'], ['50k+', 'Cups served monthly'], ['4.9★', 'Average rating'], ['100%', 'Ethically sourced']].map(([v, l]) => (
              <motion.div key={l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="font-serif text-3xl text-gold mb-1">{v}</p>
                <p className="font-sans text-sm text-cream/50">{l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story section */}
      <section className="py-24 max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img src="/images/grilli/about-abs-image.jpg" alt="Coffee craft" className="rounded-3xl object-cover w-full aspect-[3/4] shadow-warm-lg" />
            <div className="absolute -bottom-8 -right-8 hidden lg:block">
              <motion.img
                src="/images/grilli/badge-1.png" alt=""
                className="w-32 h-32"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="eyebrow">The Origin</span>
            <div className="divider-gold mx-0" />
            <h2 className="font-serif text-display text-espresso">Where It All Began</h2>
            <div className="space-y-4 font-sans text-ink-2 text-base leading-relaxed">
              <p>3D Café started in a 200 sq ft space with secondhand furniture, a vintage espresso machine, and an unshakeable belief that Pune deserved world-class coffee.</p>
              <p>Founder Arjun Nair spent three years training in specialty cafés across Milan, Melbourne, and Seoul before returning home with one mission: to craft the perfect cup, every single time.</p>
              <p>Today, we source directly from farms we've personally visited, roast in small batches every two days, and train every team member with the same rigour Arjun learnt abroad.</p>
            </div>
            <LinkButton to="/menu" variant="espresso" pill size="lg" rightIcon={<ArrowRight size={16} />}>
              Explore Our Menu
            </LinkButton>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-canvas-2">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <span className="eyebrow">What We Stand For</span>
            <div className="divider-gold" />
            <h2 className="font-serif text-3xl text-espresso">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-premium p-7 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                  {v.icon}
                </div>
                <h3 className="font-serif text-lg text-espresso">{v.title}</h3>
                <p className="font-sans text-sm text-ink-3 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 max-w-4xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <span className="eyebrow">Our Journey</span>
          <div className="divider-gold" />
          <h2 className="font-serif text-3xl text-espresso">Milestones</h2>
        </div>
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-beige/60 -translate-x-1/2" />
          <div className="space-y-10">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="hidden md:block flex-1" />
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-espresso border-4 border-canvas flex items-center justify-center shadow-warm-sm">
                    <span className="font-display text-[10px] font-bold text-gold">{m.year}</span>
                  </div>
                </div>
                <div className="flex-1 card-premium p-5">
                  <p className="font-display text-sm font-semibold text-gold mb-1">{m.year}</p>
                  <p className="font-sans text-sm text-ink-2 leading-relaxed">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-canvas-2">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <span className="eyebrow">Meet the Team</span>
            <div className="divider-gold" />
            <h2 className="font-serif text-3xl text-espresso">The Artisans Behind the Cup</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-cream shadow-warm mb-4">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-serif text-xl text-espresso">{member.name}</h4>
                <p className="font-sans text-sm text-ink-3 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSection />
      <NewsletterSection />
    </div>
  );
}
