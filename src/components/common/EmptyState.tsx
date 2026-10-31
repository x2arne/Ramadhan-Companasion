import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-ink-800/80 bg-surface/40',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 mb-4 rounded-xl bg-surface-elevated/60 border border-ink-700/50 flex items-center justify-center text-accent-700">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-ink-200">{title}</h3>
      <p className="text-xs text-ink-400 mt-1 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
