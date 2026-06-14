import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { NotificationCenter } from '@/components/realtime/NotificationCenter';
import { useLenis } from '@/hooks/useLenis';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const MainLayout = () => {
  const location = useLocation();
  useLenis();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      {/* relative positioning required by Framer Motion for correct scroll offset calculation */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-full"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />

      {/*
        CartDrawer and NotificationCenter use useNavigate() and other router
        hooks — they MUST be rendered inside the router tree (inside a layout),
        NOT alongside RouterProvider in App.tsx.
      */}
      <CartDrawer />
      <NotificationCenter />
    </div>
  );
};

export default MainLayout;
