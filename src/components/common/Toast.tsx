import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../../types';
import { cn } from '../../utils/cn';

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-accent-700 shrink-0" />,
    info: <Info className="w-5 h-5 text-accent-700 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-accent-700 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />,
  };

  const borderMap = {
    success: 'border-accent-500/30',
    info: 'border-accent-500/30',
    warning: 'border-accent-500/30',
    error: 'border-rose-500/30',
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-lg glass-panel',
              borderMap[toast.type]
            )}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-ink-100">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-ink-300 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-ink-400 hover:text-ink-200 p-1 rounded-md transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
