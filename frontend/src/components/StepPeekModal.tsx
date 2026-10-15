import React from 'react';
import { X, Hand, Eye, Volume2, Wind, Compass, Check, Trophy, Sparkles } from 'lucide-react';
import { GroundingMission, GroundingStep } from '../types';

interface StepPeekModalProps {
  mission: GroundingMission | null;
  isOpen: boolean;
  onClose: () => void;
  onExitToSteps: () => void;
  reviewedSteps?: Set<number>;
  onToggleStep?: (stepNumber: number) => void;
  onClaimReward?: () => void;
}

export const StepPeekModal: React.FC<StepPeekModalProps> = ({
  mission,
  isOpen,
  onClose,
  onExitToSteps,
  reviewedSteps = new Set(),
  onToggleStep,
  onClaimReward,
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

  const allCompleted = mission.steps.length > 0 && reviewedSteps.size === mission.steps.length;

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
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Quick Step Reference
              </span>
              <span className="text-[11px] font-mono text-emerald-300">
                {reviewedSteps.size} of {mission.steps.length} Completed
              </span>
            </div>
            <h3 id="step-peek-modal-title" className="text-lg sm:text-xl font-light text-white font-sans">
              {mission.mission_title}
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Mark actions as you complete them in the physical world:
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

        {/* All Completed Celebratory Callout */}
        {allCompleted && onClaimReward && (
          <div className="mx-5 sm:mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-amber-950/40 to-emerald-950/60 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-reward-pop">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>All 5 directives completed!</span>
            </div>
            <button
              type="button"
              onClick={onClaimReward}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition glow-gold-emerald flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <span>Claim Reward</span>
              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
            </button>
          </div>
        )}

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {mission.steps.map((step: GroundingStep) => {
            const isDone = reviewedSteps.has(step.step_number);

            return (
              <div 
                key={step.step_number}
                className={`p-3.5 rounded-xl border transition-all space-y-1.5 ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/40' 
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="text-emerald-400 font-bold">0{step.step_number}.</span>
                    <div className="flex items-center space-x-1">
                      {getSensoryIcon(step.sensory_focus)}
                      <span className="text-neutral-300 uppercase text-[10px] tracking-wider">
                        {step.sensory_focus}
                      </span>
                    </div>
                  </div>

                  {onToggleStep && (
                    <button
                      type="button"
                      onClick={() => onToggleStep(step.step_number)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono transition shrink-0 ${
                        isDone 
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold' 
                          : 'bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded border flex items-center justify-center ${isDone ? 'bg-emerald-500 border-emerald-500 text-neutral-950' : 'border-neutral-500'}`}>
                        {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{isDone ? 'Done ✓' : 'Mark Done'}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {step.physical_action}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <button
            type="button"
            onClick={onExitToSteps}
            className="text-neutral-400 hover:text-white transition underline"
          >
            ← Exit Lock & Return to Steps
          </button>
          
          <div className="flex items-center gap-2">
            {allCompleted && onClaimReward ? (
              <button
                type="button"
                onClick={onClaimReward}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-neutral-950 font-bold uppercase tracking-wider transition glow-gold-emerald flex items-center space-x-1.5"
              >
                <span>Claim Reward</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider transition glow-emerald"
              >
                Resume Lock Screen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
