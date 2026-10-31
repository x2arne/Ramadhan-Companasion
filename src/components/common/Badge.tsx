import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'violet' | 'blue' | 'emerald' | 'gold' | 'slate' | 'rose';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'violet',
  size = 'md',
  dot = false,
  ...props
}) => {
  const variantStyles = {
    violet: 'bg-accent-400/15 text-accent-700 border-accent-400/30',
    blue: 'bg-accent-400/15 text-accent-700 border-accent-400/30',
    emerald: 'bg-accent-500/15 text-accent-700 border-accent-500/30',
    gold: 'bg-accent-500/15 text-accent-700 border-accent-500/30',
    slate: 'bg-ink-700/40 text-ink-300 border-ink-600/40',
    rose: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
  };

  const dotColors = {
    violet: 'bg-accent-400',
    blue: 'bg-accent-400',
    emerald: 'bg-accent-400',
    gold: 'bg-accent-400',
    slate: 'bg-ink-400',
    rose: 'bg-rose-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
