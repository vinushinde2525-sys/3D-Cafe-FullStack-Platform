import { motion, AnimatePresence } from 'framer-motion';

interface Props { isLoading?: boolean; message?: string; }

export const LoadingScreen = ({ isLoading = true, message = 'Crafting your experience…' }: Props) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        key="loading"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-canvas grain-overlay"
      >
        {/* Coffee cup SVG loader */}
        <div className="relative mb-8">
          <svg width="72" height="80" viewBox="0 0 72 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cup body */}
            <path d="M10 28h52l-6 36H16L10 28Z" fill="#EFE7DA" stroke="#D8C3A5" strokeWidth="1.5"/>
            {/* Handle */}
            <path d="M62 36c6 0 10 4 10 10s-4 10-10 10" stroke="#D8C3A5" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* Saucer */}
            <ellipse cx="36" cy="66" rx="28" ry="6" fill="#EFE7DA" stroke="#D8C3A5" strokeWidth="1.5"/>
            {/* Coffee fill - animated */}
            <motion.path
              d="M14 44h44l-4 20H18L14 44Z"
              fill="#B89052"
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.3 }}
              style={{ transformOrigin: 'bottom' }}
            />
            {/* Rim */}
            <ellipse cx="36" cy="28" rx="26" ry="5" fill="#FFF8F0" stroke="#D8C3A5" strokeWidth="1.5"/>
          </svg>
          {/* Steam lines */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-0 w-0.5 rounded-full bg-gold-light"
              style={{ left: `${28 + i * 10}px`, height: 16 }}
              initial={{ opacity: 0, y: 0, scaleX: 1 }}
              animate={{ opacity: [0, 0.6, 0], y: -22, scaleX: [1, 1.4, 1.6] }}
              transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Brand wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="font-serif text-3xl text-espresso tracking-tight mb-2">3D Café</h1>
          <p className="eyebrow text-gold-light">{message}</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gold"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-gold"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </div>
);

export default LoadingScreen;
