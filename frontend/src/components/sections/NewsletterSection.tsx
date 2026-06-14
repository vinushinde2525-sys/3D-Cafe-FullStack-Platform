import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, ArrowRight } from 'lucide-react';
import { MotionButton } from '@/components/ui/Button';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative py-20 overflow-hidden bg-canvas-2">
      {/* Decorative shapes */}
      <img src="/images/grilli/shape-7.png" alt="" className="absolute top-8 left-8 w-20 opacity-10 animate-float-slow" />
      <img src="/images/grilli/shape-9.png" alt="" className="absolute bottom-8 right-8 w-16 opacity-10 animate-float" />

      <div className="relative max-w-2xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-espresso/10 mb-2">
            <Send size={24} className="text-gold" />
          </div>
          <span className="eyebrow block">Stay connected</span>
          <h2 className="font-serif text-3xl md:text-4xl text-espresso">
            First to Know.<br />First to Taste.
          </h2>
          <p className="font-sans text-base text-ink-3 leading-relaxed">
            Get early access to new menu items, seasonal specials, exclusive offers, and brewing tips straight to your inbox.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 py-8"
            >
              <CheckCircle size={48} className="text-green-500" />
              <h3 className="font-serif text-2xl text-espresso">You're on the list!</h3>
              <p className="font-sans text-sm text-ink-3">Watch for our next drop — something special is brewing.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 h-12 bg-cream border border-beige/60 rounded-full px-5 text-sm font-sans text-ink placeholder:text-ink-3/50 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all shadow-warm-sm"
              />
              <MotionButton
                type="submit"
                variant="espresso"
                pill
                size="md"
                isLoading={loading}
                rightIcon={!loading ? <ArrowRight size={16} /> : undefined}
              >
                Subscribe
              </MotionButton>
            </form>
          )}

          <p className="font-sans text-xs text-ink-3 mt-4">
            No spam, ever. Unsubscribe anytime. We respect your inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
