import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'gold' | 'espresso' | 'success' | 'warning' | 'error' | 'info' | 'outline';

interface BadgeProps extends HTMLAttributes<'span'> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:   'bg-canvas-2 text-ink-2 border border-beige/60',
  gold:      'bg-gold/10 text-gold-dark border border-gold/25',
  espresso:  'bg-espresso text-cream border border-espresso',
  success:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning:   'bg-amber-50 text-amber-700 border border-amber-200',
  error:     'bg-red-50 text-red-600 border border-red-200',
  info:      'bg-blue-50 text-blue-700 border border-blue-200',
  outline:   'bg-transparent text-ink border border-beige',
};

export const Badge = ({ variant = 'default', size = 'sm', className, ...props }: BadgeProps & HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 font-display font-medium rounded-full',
      size === 'sm' ? 'text-[0.65rem] px-2.5 py-0.5 tracking-wide' : 'text-xs px-3 py-1',
      badgeVariants[variant],
      className
    )}
    {...props}
  />
);

export const VegBadge = ({ isVegan }: { isVegan?: boolean }) => (
  <span className={cn('inline-flex items-center justify-center w-5 h-5 rounded border-2 text-[8px] font-bold',
    isVegan ? 'border-green-600 text-green-600' : 'border-green-500 text-green-500'
  )}>
    {isVegan ? 'V' : '●'}
  </span>
);

export const RatingBadge = ({ rating }: { rating: number }) => (
  <span className="inline-flex items-center gap-1 bg-gold/10 text-gold-dark border border-gold/20 rounded-full px-2 py-0.5 text-xs font-display font-semibold">
    ★ {rating.toFixed(1)}
  </span>
);

export default Badge;
