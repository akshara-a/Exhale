import React from 'react';
import { X, Hand, Eye, Volume2, Wind, Compass } from 'lucide-react';
import { GroundingMission, GroundingStep } from '../types';

interface StepPeekModalProps {
  mission: GroundingMission | null;
  isOpen: boolean;
  onClose: () => void;
  onExitToSteps: () => void;
}

export const StepPeekModal: React.FC<StepPeekModalProps> = ({
  mission,
  isOpen,
  onClose,
  onExitToSteps,
}) => {
  if (!isOpen || !mission) return null;

  const getSensoryIcon = (focus: string) => {
    const lower = focus.toLowerCase();
    if (lower.includes('touch') || lower.includes('tactile')) {
      return <Hand className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (lower.includes('sight') || lower.includes('visual') || lower.includes('eye')) {
      return <Eye className="w-3.5 h-3.5 text-blue-400" />;
    }
    if (lower.includes('sound') || lower.includes('audio') || lower.includes('hear')) {
      return <Volume2 className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (lower.includes('smell') || lower.includes('scent') || lower.includes('inhale')) {
      return <Wind className="w-3.5 h-3.5 text-purple-400" />;
    }
    return <Compass className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="step-peek-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-left"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-elevated rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white/[0.1] relative"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Quick Step Reference
            </span>
            <h3 id="step-peek-modal-title" className="text-lg sm:text-xl font-light text-white font-sans">
              {mission.mission_title}
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Your timer is still running in the background. Review your tactile outdoor tasks below:
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition shrink-0"
            aria-label="Close step peek"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {mission.steps.map((step: GroundingStep) => (
            <div 
              key={step.step_number}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
            >
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-emerald-400 font-bold">0{step.step_number}.</span>
                <div className="flex items-center space-x-1">
                  {getSensoryIcon(step.sensory_focus)}
                  <span className="text-neutral-300 uppercase text-[10px] tracking-wider">
                    {step.sensory_focus}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {step.physical_action}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-between gap-3 text-xs font-mono">
          <button
            type="button"
            onClick={onExitToSteps}
            className="text-neutral-400 hover:text-white transition underline"
          >
            ← Leave Lock Screen & Return to Steps
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider transition glow-emerald"
          >
            Resume Grounding
          </button>
        </div>
      </div>
    </div>
  );
};
