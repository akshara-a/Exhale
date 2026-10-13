import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 left-4 sm:left-auto sm:w-96 z-50 flex flex-col space-y-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start space-x-3 transition-all animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100 glow-emerald-subtle'
              : toast.type === 'warning'
              ? 'bg-red-950/95 border-red-500/60 text-red-100 glow-red'
              : 'bg-neutral-900/95 border-white/[0.12] text-neutral-100'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs min-w-0">
            {toast.title && (
              <p className="font-mono font-semibold tracking-wide uppercase text-[11px] truncate">
                {toast.title}
              </p>
            )}
            <p className="mt-0.5 font-sans leading-relaxed text-neutral-200 break-words">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white transition p-1 shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
