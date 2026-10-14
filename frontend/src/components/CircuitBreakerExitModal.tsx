import React from 'react';
import { Compass, Edit3, Eye, Play, Pause, X } from 'lucide-react';

interface CircuitBreakerExitModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onResume: () => void;
  onReturnToMission: () => void;
  onReturnToInput: () => void;
  onPeekSteps: () => void;
  formattedTimeLeft?: string;
}

export const CircuitBreakerExitModal: React.FC<CircuitBreakerExitModalProps> = ({
  isOpen,
  onCancel,
  onResume,
  onReturnToMission,
  onReturnToInput,
  onPeekSteps,
  formattedTimeLeft,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="circuit-breaker-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-left"
      onClick={onCancel}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-elevated rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-white/[0.1] relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3.5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
              <Pause className="w-3 h-3 text-amber-400 fill-current" />
              <span>Session Paused {formattedTimeLeft ? `• ${formattedTimeLeft} Left` : ''}</span>
            </div>
            <h3 id="circuit-breaker-modal-title" className="text-xl sm:text-2xl font-light text-white font-sans">
              Choose Where to Go
            </h3>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Your timer is paused — nothing has been reset. Choose how you would like to proceed:
            </p>
          </div>
          <button 
            type="button"
            onClick={onCancel}
            className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options to go back */}
        <div className="space-y-2.5 font-mono">
          {/* Option 1: Back to Protocol Steps */}
          <button
            type="button"
            onClick={onReturnToMission}
            className="w-full p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-emerald-500/40 transition text-left flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-xs sm:text-sm group-hover:text-emerald-300 transition-colors">
                  Pause & Return to Grounding Steps
                </span>
                <span className="text-[10px] text-neutral-500 group-hover:text-emerald-400 transition-colors shrink-0">
                  Step 2 →
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-relaxed">
                Go back to your 5 sensory outdoor actions to re-read instructions or listen to audio guidance. You can resume your session anytime.
              </p>
            </div>
          </button>

          {/* Option 2: Back to Input / Edit Burden */}
          <button
            type="button"
            onClick={onReturnToInput}
            className="w-full p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-blue-500/40 transition text-left flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Edit3 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors">
                  Pause & Return to Edit Burden
                </span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-400 transition-colors shrink-0">
                  Step 1 →
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-relaxed">
                Re-express your acute stress or choose a different ancestral nature lineage. Your written text and timer are preserved.
              </p>
            </div>
          </button>

          {/* Option 3: Peek at Steps without ending session */}
          <button
            type="button"
            onClick={onPeekSteps}
            className="w-full p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-purple-500/40 transition text-left flex items-start space-x-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-xs sm:text-sm group-hover:text-purple-300 transition-colors">
                  Peek at Steps (Keep In Lock Screen)
                </span>
                <span className="text-[10px] text-neutral-500 group-hover:text-purple-400 transition-colors shrink-0">
                  Quick View →
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-relaxed">
                Glance at your 5 steps right now in a quick popover without leaving the screen.
              </p>
            </div>
          </button>
        </div>

        {/* Primary Action: Continue session */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            Take a deep breath
          </span>
          <button
            type="button"
            onClick={onResume}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition glow-emerald flex items-center justify-center space-x-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>▶ Continue Grounding Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
