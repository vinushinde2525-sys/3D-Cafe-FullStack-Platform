import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { MotionButton, LinkButton} from '@/components/ui/Button';
import { Home, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-8">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-6">{is404 ? '☕' : '⚠️'}</div>
        <p className="eyebrow mb-4">{is404 ? '404 Error' : 'Unexpected Error'}</p>
        <h1 className="font-serif text-4xl text-espresso mb-4">
          {is404 ? 'Page not found' : 'Something went wrong'}
        </h1>
        <p className="font-sans text-ink-3 mb-10 text-base leading-relaxed">
          {is404
            ? "We couldn't find what you were looking for. Let's start fresh."
            : "An unexpected error occurred. Our team has been notified."}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <LinkButton to="/" variant="espresso" pill leftIcon={<Home size={16} />}>
            Home
          </LinkButton>
          <MotionButton variant="outline" pill leftIcon={<RefreshCw size={16} />} onClick={() => window.location.reload()}>
            Reload
          </MotionButton>
        </div>
      </motion.div>
    </div>
  );
}
