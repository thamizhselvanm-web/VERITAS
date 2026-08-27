import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertOctagon, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  addToast: (title: string, message?: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message };
    
    setToasts((prev) => [...prev.slice(-4), newToast]); // Limit to max 5 visible toasts

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = 
              toast.type === 'success' ? CheckCircle2 :
              toast.type === 'error' ? AlertOctagon :
              toast.type === 'warning' ? AlertTriangle : Info;

            const borderClass = 
              toast.type === 'success' ? 'border-[#52B788]/40 bg-[#1C1816]/95 text-[#52B788]' :
              toast.type === 'error' ? 'border-[#F07151]/40 bg-[#1C1816]/95 text-[#F07151]' :
              toast.type === 'warning' ? 'border-[#F4A261]/40 bg-[#1C1816]/95 text-[#F4A261]' :
              'border-[#E07A5F]/40 bg-[#1C1816]/95 text-[#E07A5F]';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 font-sans text-xs ${borderClass}`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-[#F7F4F1] leading-tight">{toast.title}</strong>
                    {toast.message && (
                      <p className="text-[11px] text-[#D8C7B8] mt-0.5 leading-relaxed">{toast.message}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-[#9E8C7C] hover:text-[#F7F4F1] p-0.5 rounded transition-colors"
                  aria-label="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
