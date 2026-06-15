import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, ChevronDown, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch } from '@/store';
import { setSearchOpen } from '@/store/slices/uiSlice';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Offers', to: '/offers' },
  { label: 'About', to: '/about' },
];

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, openCart } = useCart();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-500',
          scrolled
            ? 'glass-nav shadow-warm-sm py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-espresso flex items-center justify-center shadow-warm-sm group-hover:shadow-warm transition-shadow">
              <span className="text-cream text-base font-serif font-semibold">3D</span>
            </div>
            <span className="font-serif text-xl text-espresso tracking-tight hidden sm:block">
              Café
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => cn(
                  'relative px-4 py-2 font-display text-sm font-medium transition-colors duration-200',
                  'rounded-full focus-gold group',
                  isActive ? 'text-espresso' : 'text-ink-2 hover:text-espresso'
                )}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-gold/10 border border-gold/20 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="absolute bottom-0.5 left-4 right-4 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => dispatch(setSearchOpen(true))}
              className="p-2.5 rounded-full text-ink-2 hover:text-espresso hover:bg-canvas-2/80 transition-all focus-gold"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              data-cart-button
              className="relative p-2.5 rounded-full text-ink-2 hover:text-espresso hover:bg-canvas-2/80 transition-all focus-gold"
              aria-label={`Cart (${count} items)`}
            >
              <ShoppingCart size={18} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gold text-cream text-[10px] font-display font-bold flex items-center justify-center px-1 shadow-sm"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Profile / Auth */}
            {isAuthenticated && user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-beige/60 hover:border-gold/40 bg-cream/60 hover:bg-cream transition-all focus-gold"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-espresso text-cream font-display font-semibold text-xs flex items-center justify-center flex-shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block font-display text-sm text-ink-2 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={cn('text-ink-3 transition-transform', profileOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-cream border border-beige/50 rounded-2xl shadow-warm-lg overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-beige/30">
                        <p className="font-display font-semibold text-sm text-espresso truncate">{user.name}</p>
                        <p className="text-xs text-ink-3 font-sans truncate">{user.email}</p>
                      </div>
                      <div className="py-1.5">
                        <DropdownItem icon={<Package size={15} />} to="/orders" label="My Orders" onClick={() => setProfileOpen(false)} />
                        <DropdownItem icon={<User size={15} />} to="/profile" label="Profile" onClick={() => setProfileOpen(false)} />
                        {(user.role === 'admin' || user.role === 'staff') && (
                          <DropdownItem icon={<LayoutDashboard size={15} />} to={user.role === 'admin' ? '/admin' : '/staff'} label="Dashboard" onClick={() => setProfileOpen(false)} />
                        )}
                      </div>
                      <div className="py-1.5 border-t border-beige/30">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-display text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /><span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 font-display text-sm font-medium text-ink-2 hover:text-espresso rounded-full hover:bg-canvas-2/80 transition-all">Sign in</Link>
                <Link to="/register" className="px-4 py-2 font-display text-sm font-medium text-cream bg-espresso rounded-full hover:bg-espresso-2 transition-all shadow-warm-sm">Get started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2.5 rounded-full text-ink-2 hover:bg-canvas-2/80 transition-all"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 top-[60px] z-30 lg:hidden glass-nav border-b border-beige/30 shadow-warm"
          >
            <nav className="flex flex-col px-5 py-4 gap-1">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={label}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    'px-4 py-3 rounded-xl font-display text-sm font-medium transition-colors',
                    isActive ? 'bg-gold/10 text-espresso' : 'text-ink-2 hover:bg-canvas-2'
                  )}
                >
                  {label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 flex gap-3 border-t border-beige/30 mt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center font-display text-sm text-ink-2 border border-beige rounded-xl hover:border-gold/40 transition-colors">Sign in</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center font-display text-sm text-cream bg-espresso rounded-xl">Get started</Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const DropdownItem = ({ icon, to, label, onClick }: { icon: React.ReactNode; to: string; label: string; onClick?: () => void }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-2.5 text-sm font-display text-ink-2 hover:bg-canvas-2 transition-colors">
    <span className="text-gold">{icon}</span>
    {label}
  </Link>
);

export default Navbar;
