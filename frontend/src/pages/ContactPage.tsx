import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { MotionButton } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { NewsletterSection } from '@/components/sections/NewsletterSection';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  const CONTACTS = [
    { icon: <MapPin size={20} />, title: 'Visit Us',    detail: '12 Artisan Lane, Koregaon Park\nPune – 411001, Maharashtra' },
    { icon: <Phone size={20} />,  title: 'Call Us',     detail: '+91 99999 99999\n+91 88888 88888' },
    { icon: <Mail size={20} />,   title: 'Email Us',    detail: 'hello@cafe3d.com\nsupport@cafe3d.com' },
    { icon: <Clock size={20} />,  title: 'Opening Hours', detail: 'Mon–Fri: 7:00am – 10:00pm\nSat–Sun: 8:00am – 11:00pm' },
  ];

  return (
    <div className="min-h-screen bg-canvas pt-20">
      {/* Hero */}
      <div className="relative py-20 bg-warm-gradient text-center overflow-hidden border-b border-beige/30">
        <img src="/images/grilli/shape-4.png" alt="" className="absolute left-12 top-8 w-16 opacity-10 animate-float" />
        <img src="/images/grilli/shape-8.png" alt="" className="absolute right-12 bottom-8 w-14 opacity-10 animate-float-slow" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow">Get In Touch</span>
          <div className="divider-gold" />
          <h1 className="font-serif text-display text-espresso mb-3">We'd Love to Hear From You</h1>
          <p className="font-sans text-ink-3 max-w-md mx-auto text-base">Have a question, feedback, or a large order inquiry? We're here and happy to help.</p>
        </motion.div>
      </div>

      {/* Contact info cards */}
      <section className="py-16 max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {CONTACTS.map(({ icon, title, detail }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4">
                {icon}
              </div>
              <h3 className="font-serif text-lg text-espresso mb-2">{title}</h3>
              {detail.split('\n').map(line => (
                <p key={line} className="font-sans text-sm text-ink-3">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">Send a Message</span>
            <div className="divider-gold mx-0 mt-2 mb-6" />
            <h2 className="font-serif text-2xl text-espresso mb-6">Drop Us a Line</h2>

            {sent ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
                <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-espresso mb-2">Message Sent!</h3>
                <p className="font-sans text-sm text-ink-3">We'll get back to you within 24 hours. Thank you!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Your Name" placeholder="Priya Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  <Input label="Email" type="email" placeholder="priya@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <Input label="Subject" placeholder="Bulk order enquiry" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
                <Textarea label="Message" rows={5} placeholder="Tell us more…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                <MotionButton type="submit" variant="espresso" size="lg" pill isLoading={loading} leftIcon={<Send size={16} />} fullWidth>
                  Send Message
                </MotionButton>
              </form>
            )}
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-warm-lg min-h-[400px] bg-canvas-2 relative"
          >
            <img src="/images/grilli/about-banner.jpg" alt="Location" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-espresso/60 flex items-center justify-center">
              <div className="text-center text-cream">
                <MapPin size={40} className="text-gold mx-auto mb-3" />
                <p className="font-serif text-xl">3D Café</p>
                <p className="font-sans text-sm text-cream/70 mt-1">12 Artisan Lane, Koregaon Park</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gold text-espresso rounded-full font-display text-sm font-medium hover:bg-gold-light transition-colors">
                  Open in Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
