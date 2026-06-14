import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

type Variant = 'espresso' | 'gold' | 'ghost' | 'outline' | 'cream' | 'destructive';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  pill?: boolean;
}

const variants: Record<Variant, string> = {
  espresso: 'bg-espresso text-cream hover:bg-espresso-2 shadow-warm active:scale-[0.98]',
  gold: 'bg-gold text-cream hover:bg-gold-dark shadow-[0_4px_20px_rgba(184,144,82,0.35)] active:scale-[0.98]',
  ghost: 'bg-transparent text-ink hover:bg-canvas-2 active:bg-beige/30',
  outline: 'border border-gold text-gold bg-transparent hover:bg-gold/8',
  cream: 'bg-cream text-espresso border border-beige/60 hover:border-gold/60 hover:bg-mist shadow-warm-sm active:scale-[0.98]',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  xs: 'h-7 px-3 text-xs gap-1.5',
  sm: 'h-9 px-4 text-sm gap-2',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
  xl: 'h-14 px-8 text-base gap-3',
  icon: 'h-10 w-10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'espresso', size = 'md', isLoading, leftIcon, rightIcon,
  fullWidth, pill, className, children, disabled, ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || isLoading}
    className={cn(
      'inline-flex items-center justify-center font-display font-medium tracking-wide',
      'transition-all duration-200 ease-smooth focus-gold',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      variants[variant],
      sizes[size],
      pill ? 'rounded-full' : 'rounded-xl',
      fullWidth && 'w-full',
      className
    )}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="animate-spin" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
    ) : leftIcon}
    {children && <span>{children}</span>}
    {!isLoading && rightIcon}
  </button>
));

Button.displayName = 'Button';

// ── LinkButton — renders as <Link> with Button styling ────────────────────────
import { Link, type LinkProps } from 'react-router-dom';

type LinkButtonProps = Omit<ButtonProps, 'onClick'> & { to: string; onClick?: () => void };

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps & Omit<LinkProps, 'className'>>(
  ({ variant = 'espresso', size = 'md', isLoading, leftIcon, rightIcon,
     fullWidth, pill, className, children, disabled, to, ...props }, ref) => (
    <Link
      ref={ref}
      to={to}
      aria-disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-display font-medium tracking-wide',
        'transition-all duration-200 ease-smooth focus-gold',
        disabled ? 'opacity-50 pointer-events-none' : '',
        variants[variant],
        sizes[size],
        pill ? 'rounded-full' : 'rounded-xl',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {leftIcon}
      {children && <span>{children}</span>}
      {rightIcon}
    </Link>
  )
);
LinkButton.displayName = 'LinkButton';

// Motion-wrapped variant for animated buttons
export const MotionButton = forwardRef<HTMLButtonElement, ButtonProps & Omit<HTMLMotionProps<'button'>, keyof ButtonProps>>(
  ({ variant = 'espresso', size = 'md', isLoading, leftIcon, rightIcon, fullWidth, pill, className, children, disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-display font-medium tracking-wide',
        'transition-colors duration-200 focus-gold',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        pill ? 'rounded-full' : 'rounded-xl',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={16} /> : leftIcon}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon}
    </motion.button>
  )
);

MotionButton.displayName = 'MotionButton';

export default Button;
