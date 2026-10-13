import React from 'react';
import { AppState } from '../types';
import { Check, Edit3, Compass, Lock, Award } from 'lucide-react';

interface StepProgressProps {
  currentStage: AppState;
  onNavigateToInput?: () => void;
}

interface StageInfo {
  key: AppState;
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StageInfo[] = [
  { key: 'INPUT', number: 1, label: 'Express Strain', shortLabel: 'Express', icon: Edit3 },
  { key: 'MISSION', number: 2, label: 'Sensory Protocol', shortLabel: 'Protocol', icon: Compass },
  { key: 'LOCK', number: 3, label: 'Screen Silenced', shortLabel: 'Unplug', icon: Lock },
  { key: 'VALIDATION', number: 4, label: 'Attestation', shortLabel: 'Grounded', icon: Award },
];

export const StepProgress: React.FC<StepProgressProps> = ({ currentStage, onNavigateToInput }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <nav aria-label="Protocol Progress" className="w-full max-w-2xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/[0.06] -translate-y-1/2 z-0" />
        
        {/* Active Progress Fill Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500/50 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isNavigable = isCompleted && stage.key === 'INPUT' && onNavigateToInput;
          const Icon = stage.icon;

          return (
            <div 
              key={stage.key} 
              className="relative z-10 flex flex-col items-center group"
            >
              <button
                type="button"
                disabled={!isNavigable}
                onClick={isNavigable ? onNavigateToInput : undefined}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-500 text-neutral-950 font-bold ring-4 ring-emerald-500/20 shadow-lg glow-emerald'
                    : isCompleted
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-[#11131c] border border-white/[0.08] text-neutral-500'
                } ${isNavigable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                title={isNavigable ? 'Click to edit your input' : stage.label}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-neutral-950' : 'text-neutral-400'}`} />
                )}
              </button>

              <span 
                className={`mt-1.5 text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200 hidden xs:inline sm:inline ${
                  isCurrent
                    ? 'text-emerald-300 font-semibold'
                    : isCompleted
                    ? 'text-neutral-400'
                    : 'text-neutral-600'
                }`}
              >
                <span className="hidden sm:inline">{stage.label}</span>
                <span className="sm:hidden">{stage.shortLabel}</span>
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
