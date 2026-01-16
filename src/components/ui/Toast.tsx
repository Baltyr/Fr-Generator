import React from 'react';
import { useToastStore, Toast as ToastType } from '@/stores/toastStore';

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToastStore();

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const colors = {
    success: 'bg-accent-green/20 border-accent-green text-accent-green',
    error: 'bg-accent-red/20 border-accent-red text-accent-red',
    warning: 'bg-accent-yellow/20 border-accent-yellow text-accent-yellow',
    info: 'bg-accent-purple/20 border-accent-purple text-accent-purple',
  };

  return (
    <div
      className={`
        min-w-[300px] max-w-md p-4 rounded-lg border-2 shadow-lg
        ${colors[toast.type]}
        animate-slide-in-right
        backdrop-blur-sm
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icons[toast.type]}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text-primary mb-1">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm text-text-secondary">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
          aria-label="Cerrar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
