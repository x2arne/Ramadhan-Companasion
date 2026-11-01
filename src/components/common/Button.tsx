import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.97] touch-manipulation cursor-pointer';

    const variantStyles = {
      primary:
        'bg-accent-400 hover:bg-accent-500 text-on-accent font-semibold border border-accent-300/40',
      secondary:
        'bg-surface-elevated hover:bg-surface-elevated/80 text-ink-100 border border-ink-700/50 hover:border-ink-600/70',
      outline:
        'bg-transparent hover:bg-ink-800/40 text-ink-200 border border-ink-700 hover:border-ink-500',
      ghost:
        'bg-transparent hover:bg-ink-800/40 text-ink-300 hover:text-ink-50',
      danger:
        'bg-rose-600/20 hover:bg-rose-600/30 text-rose-700 border border-rose-500/30 hover:border-rose-500/50',
    };

    const sizeStyles = {
      sm: 'text-xs min-h-[38px] sm:min-h-[36px] px-3.5 py-1.5 rounded-lg gap-2',
      md: 'text-sm min-h-[44px] px-4 py-2 rounded-lg gap-2.5',
      lg: 'text-base min-h-[48px] px-6 py-2.5 rounded-lg gap-2.5 font-semibold',
      icon: 'min-h-[44px] min-w-[44px] h-11 w-11 p-2 rounded-lg justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
