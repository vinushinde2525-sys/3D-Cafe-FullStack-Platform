import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout = () => (
  <div className="min-h-screen bg-canvas-2 flex">
    {/* Left panel — brand visual */}
    <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
      <img
        src="/images/grilli/hero-slider-1.jpg"
        alt="Café ambiance"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-espresso/80 via-espresso/50 to-transparent" />
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-12 text-cream">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
            <span className="text-espresso font-serif font-semibold">3D</span>
          </div>
          <span className="font-serif text-xl tracking-tight">3D Café</span>
        </Link>
        <div className="space-y-4 max-w-sm">
          <p className="eyebrow text-gold">Artisan Experience</p>
          <h2 className="font-serif text-5xl leading-tight">
            Crafted Slowly.<br />Served Beautifully.
          </h2>
          <p className="font-sans text-cream/70 text-base leading-relaxed">
            Join thousands of coffee lovers who enjoy premium handcrafted beverages and food, delivered with care.
          </p>
          <div className="flex -space-x-2 pt-2">
            {[1, 2, 3].map((n) => (
              <img
                key={n}
                src={`/images/foodie/avatar-${n}.jpg`}
                alt={`Customer ${n}`}
                className="w-9 h-9 rounded-full border-2 border-cream/30 object-cover"
              />
            ))}
            <div className="w-9 h-9 rounded-full border-2 border-cream/30 bg-gold flex items-center justify-center text-xs font-display font-bold text-espresso">
              +2k
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {[['4.9★', 'App Rating'], ['25k+', 'Happy Customers'], ['50+', 'Menu Items']].map(([v, l]) => (
            <div key={l}>
              <p className="font-serif text-xl text-cream">{v}</p>
              <p className="font-sans text-xs text-cream/50">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right panel — form */}
    <div className="flex-1 flex items-center justify-center p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Mobile logo */}
        <Link to="/" className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-full bg-espresso flex items-center justify-center">
            <span className="text-cream font-serif font-semibold">3D</span>
          </div>
          <span className="font-serif text-xl text-espresso">3D Café</span>
        </Link>
        <Outlet />
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
