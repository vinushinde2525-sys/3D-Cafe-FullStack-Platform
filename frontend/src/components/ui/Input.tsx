import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label, error, hint, leftAddon, rightAddon, containerClassName, className, id, ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block font-display text-sm font-medium text-ink-2">
          {label}
          {props.required && <span className="text-gold ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-ink-3">
            {leftAddon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 bg-cream border rounded-xl font-sans text-sm text-ink',
            'placeholder:text-ink-3/60 outline-none transition-all duration-200',
            'focus:border-gold focus:ring-2 focus:ring-gold/15',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200/40'
              : 'border-beige/70 hover:border-sand',
            leftAddon ? 'pl-10' : 'pl-4',
            rightAddon ? 'pr-10' : 'pr-4',
            className
          )}
          {...props}
        />
        {rightAddon && (
          <div className="absolute right-3.5 flex items-center text-ink-3">
            {rightAddon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-sans">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-3 font-sans">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, {
  label?: string; error?: string; hint?: string; containerClassName?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, hint, containerClassName, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block font-display text-sm font-medium text-ink-2">
            {label}{props.required && <span className="text-gold ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-cream border rounded-xl font-sans text-sm text-ink px-4 py-3',
            'placeholder:text-ink-3/60 outline-none transition-all duration-200 resize-none',
            'focus:border-gold focus:ring-2 focus:ring-gold/15',
            error ? 'border-red-400' : 'border-beige/70 hover:border-sand',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-sans">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-3 font-sans">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Input;
