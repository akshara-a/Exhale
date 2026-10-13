import React from 'react';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';

interface EmergencyExitModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirmExit: () => void;
}

export const EmergencyExitModal: React.FC<EmergencyExitModalProps> = ({
  isOpen,
  onCancel,
  onConfirmExit,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-exit-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-left"
    >
      <div className="glass-panel-elevated rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-white/[0.1]">
        <div className="flex items-center space-x-3 text-amber-400">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 id="emergency-exit-title" className="text-lg font-medium text-white">
            End Grounding Session Early?
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
          Taking even a few moments away from compiler logs and Slack pings allows your autonomic nervous system to down-regulate.
        </p>

        <p className="text-xs text-neutral-400 font-sans">
          Are you sure you want to return to your screen now, or would you like to stay outside and take 3 deep breaths?
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition glow-emerald flex items-center justify-center space-x-2"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Stay Outside (Breathe)</span>
          </button>
          <button
            type="button"
            onClick={onConfirmExit}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-red-500/10 hover:text-red-300 border border-white/[0.08] text-neutral-400 font-mono text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
