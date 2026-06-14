import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'right' | 'left' | 'bottom';
  width?: string;
  footer?: ReactNode;
}

const slideVariants = {
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
};

export const Drawer = ({ isOpen, onClose, title, children, side = 'right', width = 'w-full max-w-md', footer }: DrawerProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const variants = slideVariants[side];
  const positionClass = side === 'right' ? 'right-0 top-0 bottom-0' :
                        side === 'left'  ? 'left-0 top-0 bottom-0' :
                                           'bottom-0 left-0 right-0';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 bg-espresso/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            className={cn(
              'fixed z-50 bg-cream flex flex-col shadow-warm-xl',
              positionClass,
              side !== 'bottom' ? width : 'h-[85vh] rounded-t-3xl',
              side !== 'bottom' && 'rounded-l-3xl'
            )}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-beige/40 flex-shrink-0">
              {title && <h2 className="font-serif text-xl text-espresso">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-full text-ink-3 hover:text-espresso hover:bg-canvas-2 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex-shrink-0 border-t border-beige/40 p-5 bg-mist">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
