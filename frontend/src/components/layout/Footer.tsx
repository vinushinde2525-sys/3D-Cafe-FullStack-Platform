import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LINKS = {
  explore: [
    { label: 'Menu', to: '/menu' },
    { label: 'Special Offers', to: '/offers' },
    { label: 'About Us', to: '/about' },
    { label: 'Events', to: '/events' },
    { label: 'Blog', to: '/blog' },
  ],
  account: [
    { label: 'My Account', to: '/profile' },
    { label: 'Order History', to: '/orders' },
    { label: 'Track Order', to: '/orders' },
    { label: 'Loyalty Points', to: '/profile' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Refund Policy', to: '/refund' },
  ],
};

const SOCIALS = [
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Twitter, label: 'Twitter', href: '#' },
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: Youtube, label: 'YouTube', href: '#' },
];

export const Footer = () => (
  <footer className="relative overflow-hidden bg-espresso text-cream/80">
    {/* Background image */}
    <div
      className="absolute inset-0 opacity-10 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/grilli/footer-bg.jpg')" }}
    />
    {/* Grain overlay */}
    <div className="absolute inset-0 grain-overlay" />

    <div className="relative max-w-7xl mx-auto px-5 md:px-8">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16 border-b border-cream/10">

        {/* Brand column */}
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-espresso text-lg font-serif font-semibold">3D</span>
            </div>
            <span className="font-serif text-2xl text-cream tracking-tight">3D Café</span>
          </Link>

          <p className="font-sans text-sm text-cream/60 leading-relaxed max-w-xs">
            Every cup is a moment of craft. We source, roast, and serve with intention — because great coffee deserves great attention.
          </p>

          {/* Newsletter */}
          <div>
            <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-3">Stay in the loop</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-10 bg-cream/10 border border-cream/15 rounded-xl px-4 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold/50 transition-colors font-sans"
              />
              <button className="h-10 w-10 rounded-xl bg-gold hover:bg-gold-light transition-colors flex items-center justify-center flex-shrink-0">
                <ArrowRight size={16} className="text-espresso" />
              </button>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold/40 transition-colors">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-5">Explore</h4>
          <ul className="space-y-3">
            {LINKS.explore.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="font-sans text-sm text-cream/60 hover:text-gold transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-5">Account</h4>
          <ul className="space-y-3">
            {LINKS.account.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="font-sans text-sm text-cream/60 hover:text-gold transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-5">Visit Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-gold mt-0.5 flex-shrink-0" />
              <span className="font-sans text-sm text-cream/60">12 Artisan Lane, Koregaon Park, Pune 411001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-gold flex-shrink-0" />
              <a href="tel:+919999999999" className="font-sans text-sm text-cream/60 hover:text-gold transition-colors">+91 99999 99999</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-gold flex-shrink-0" />
              <a href="mailto:hello@cafe3d.com" className="font-sans text-sm text-cream/60 hover:text-gold transition-colors">hello@cafe3d.com</a>
            </li>
          </ul>
          <div className="mt-5 p-3 rounded-xl border border-cream/10 bg-cream/5">
            <p className="font-display text-xs font-medium text-cream/50 mb-1">Opening hours</p>
            <p className="font-sans text-sm text-cream/80">Mon – Fri: 7am – 10pm</p>
            <p className="font-sans text-sm text-cream/80">Sat – Sun: 8am – 11pm</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-cream/30">
          © {new Date().getFullYear()} 3D Café. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          {LINKS.legal.map(({ label, to }) => (
            <Link key={label} to={to} className="font-sans text-xs text-cream/30 hover:text-cream/60 transition-colors">{label}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
