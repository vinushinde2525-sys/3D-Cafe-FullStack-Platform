import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'flat' | 'bordered';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, glow = false, variant = 'default', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-cream rounded-2xl',
        variant === 'default' && 'shadow-card border border-beige/30',
        variant === 'flat' && 'bg-canvas-2',
        variant === 'bordered' && 'border-2 border-beige',
        hover && 'card-premium cursor-pointer',
        glow && 'hover:shadow-gold transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const MotionCard = forwardRef<HTMLDivElement, CardProps & Omit<HTMLMotionProps<'div'>, keyof CardProps>>(
  ({ hover = true, glow = false, variant = 'default', className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -4, boxShadow: '0 16px 48px rgba(58,36,21,0.18)' } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'bg-cream rounded-2xl border border-beige/30 shadow-card',
        variant === 'flat' && 'bg-canvas-2 border-0 shadow-none',
        glow && 'hover:border-gold/30',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
MotionCard.displayName = 'MotionCard';

export const StatCard = ({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between mb-3">
      <p className="font-display text-xs font-medium text-ink-3 uppercase tracking-widest">{label}</p>
      {icon && <div className="text-gold opacity-70">{icon}</div>}
    </div>
    <p className="font-serif text-3xl text-espresso font-semibold">{value}</p>
    {sub && <p className="mt-1 text-xs text-ink-3 font-sans">{sub}</p>}
  </Card>
);

export default Card;
