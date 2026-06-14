import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma',    role: 'Regular Customer',  avatar: '/images/foodie/avatar-1.jpg', rating: 5, text: 'The Caramel Cloud Latte is unlike anything I\'ve had anywhere. The oat milk is so velvety, and the housemade caramel just elevates it. I visit twice a week.' },
  { id: 2, name: 'Rohan Mehta',     role: 'Food Blogger',      avatar: '/images/foodie/avatar-2.jpg', rating: 5, text: 'Premium ingredients, incredible atmosphere, and a team that genuinely cares. The Wagyu burger is the best I\'ve had in Pune. 3D Café sets the standard.' },
  { id: 3, name: 'Ananya Krishnan', role: 'Café Enthusiast',   avatar: '/images/foodie/avatar-3.jpg', rating: 5, text: 'The Tiramisu is perfection — rich without being heavy, perfectly portioned. Pairs beautifully with the single-origin espresso. A ritual I look forward to every week.' },
  { id: 4, name: 'Vikram Patel',    role: 'Verified Customer', avatar: '/images/grilli/testi-avatar.jpg', rating: 5, text: 'Service is exceptional and the delivery was faster than promised. Everything arrived piping hot. The packaging reflects the premium quality of the brand.' },
];

export const TestimonialSection = () => {
  const [active, setActive] = useState(0);
  const item = TESTIMONIALS[active];

  return (
    <section
      className="relative py-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/grilli/testimonial-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-espresso/85" />
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="eyebrow text-gold">Guest Stories</span>
          <div className="divider-gold" />
          <h2 className="font-serif text-display text-cream mb-12">What Our Guests Say</h2>
        </motion.div>

        {/* Quote card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative mb-10"
          >
            <Quote size={48} className="text-gold/20 mx-auto mb-6" />
            <p className="font-serif text-xl md:text-2xl text-cream/90 italic leading-relaxed max-w-2xl mx-auto mb-8">
              "{item.text}"
            </p>
            <div className="flex items-center justify-center gap-4">
              <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover border-2 border-gold/40" />
              <div className="text-left">
                <p className="font-display font-semibold text-cream">{item.name}</p>
                <p className="font-sans text-xs text-cream/50">{item.role}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setActive((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="w-10 h-10 rounded-full border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 flex items-center justify-center transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="transition-all duration-300"
              >
                <motion.div
                  animate={{ width: i === active ? 24 : 8 }}
                  className="h-2 rounded-full bg-gold"
                  style={{ opacity: i === active ? 1 : 0.3 }}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => setActive((v) => (v + 1) % TESTIMONIALS.length)}
            className="w-10 h-10 rounded-full border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 flex items-center justify-center transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
