import { motion } from 'framer-motion';
import { MotionButton, LinkButton} from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-8 pt-24">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <img src="/images/grilli/badge-2.png" alt="" className="w-32 h-32 mx-auto opacity-60 animate-float" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="eyebrow mb-4">404 — Page not found</p>
          <h1 className="font-serif text-5xl md:text-6xl text-espresso mb-4 leading-tight">
            Looks like this cup<br />is empty
          </h1>
          <p className="font-sans text-ink-3 text-base mb-10 max-w-sm mx-auto leading-relaxed">
            The page you're looking for has either moved, or never existed. Let's get you back on track.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <LinkButton
              to="/"
              variant="espresso"
              pill
              leftIcon={<Home size={16} />}
            >
              Back to Home
            </LinkButton>
            <MotionButton
              variant="outline"
              pill
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => window.history.back()}
            >
              Go Back
            </MotionButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
