import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

interface ToastContextType {
  addToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const TOAST_DURATION = 4000;

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; bg: string; border: string; text: string; progress: string }> = {
  success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', progress: 'bg-emerald-500' },
  error: { icon: AlertCircle, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', progress: 'bg-rose-500' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', progress: 'bg-blue-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', progress: 'bg-amber-500' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    // Exit animatsiya
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, TOAST_DURATION);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast konteyner */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;
          
          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg relative overflow-hidden
                ${config.bg} ${config.border} ${config.text}
                ${toast.exiting
                  ? 'animate-toast-exit'
                  : 'animate-toast-enter'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                <div
                  className={`h-full ${config.progress} rounded-full`}
                  style={{
                    animation: toast.exiting ? 'none' : `toast-progress ${TOAST_DURATION}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
