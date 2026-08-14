import React, { createContext, useCallback, useContext, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  emoji?: string;
}

interface ToastContextValue {
  showToast: (message: string, emoji?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, emoji?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, emoji }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 inset-x-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="bg-ink-800 dark:bg-sand-100 text-sand-50 dark:text-ink-900 rounded-xl px-4 py-3 shadow-card text-sm font-medium flex items-center gap-2 animate-[fadeIn_0.2s_ease-out] max-w-sm"
          >
            {t.emoji && <span>{t.emoji}</span>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
