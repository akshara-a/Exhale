import React from 'react';
import { Trophy, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface CompletionRewardBannerProps {
  onClaimReward: () => void;
  completedCount: number;
  totalSteps: number;
}

// 20 deterministic confetti particles for festive ambient celebration
const PARTICLES = [
  { id: 1, left: '6%', delay: '0.1s', duration: '2.4s', color: '#10b981', size: '8px', shape: 'rounded-full' },
  { id: 2, left: '14%', delay: '0.3s', duration: '2.8s', color: '#f59e0b', size: '6px', shape: 'rounded-sm' },
  { id: 3, left: '22%', delay: '0.6s', duration: '2.2s', color: '#38bdf8', size: '7px', shape: 'rotate-45' },
  { id: 4, left: '31%', delay: '0.2s', duration: '2.6s', color: '#a855f7', size: '9px', shape: 'rounded-full' },
  { id: 5, left: '42%', delay: '0.5s', duration: '2.3s', color: '#34d399', size: '6px', shape: 'rounded-sm' },
  { id: 6, left: '50%', delay: '0.1s', duration: '2.7s', color: '#fbbf24', size: '8px', shape: 'rotate-12' },
  { id: 7, left: '59%', delay: '0.4s', duration: '2.1s', color: '#10b981', size: '7px', shape: 'rounded-full' },
  { id: 8, left: '68%', delay: '0.7s', duration: '2.9s', color: '#38bdf8', size: '8px', shape: 'rounded-sm' },
  { id: 9, left: '76%', delay: '0.2s', duration: '2.4s', color: '#f59e0b', size: '6px', shape: 'rotate-45' },
  { id: 10, left: '85%', delay: '0.5s', duration: '2.5s', color: '#34d399', size: '9px', shape: 'rounded-full' },
  { id: 11, left: '92%', delay: '0.3s', duration: '2.2s', color: '#a855f7', size: '7px', shape: 'rounded-sm' },
  { id: 12, left: '10%', delay: '0.8s', duration: '2.6s', color: '#fbbf24', size: '7px', shape: 'rotate-12' },
  { id: 13, left: '28%', delay: '0.9s', duration: '2.3s', color: '#10b981', size: '8px', shape: 'rounded-full' },
  { id: 14, left: '46%', delay: '0.4s', duration: '2.8s', color: '#38bdf8', size: '6px', shape: 'rounded-sm' },
  { id: 15, left: '64%', delay: '0.6s', duration: '2.5s', color: '#f59e0b', size: '9px', shape: 'rotate-45' },
  { id: 16, left: '82%', delay: '0.8s', duration: '2.7s', color: '#34d399', size: '7px', shape: 'rounded-full' },
];

export const CompletionRewardBanner: React.FC<CompletionRewardBannerProps> = ({
  onClaimReward,
  completedCount,
  totalSteps,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-[#111624] to-amber-950/30 shadow-2xl glow-gold-emerald animate-reward-pop text-left space-y-5">
      {/* Confetti Ambient Particle Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            style={{
              left: p.left,
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
            className={`absolute bottom-0 opacity-80 ${p.shape}`}
          >
            <span 
              className="block w-full h-full"
              style={{
                animation: `confettiFloat ${p.duration} infinite ease-out`,
                animationDelay: p.delay,
              }}
            />
          </span>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase tracking-wider font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>ALL {totalSteps} SENSORY DIRECTIVES SATISFIED</span>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{completedCount}/{totalSteps} Completed</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl sm:text-3xl font-light text-white font-sans tracking-tight">
            Nervous system re-regulated.{' '}
            <span className="font-serif italic text-emerald-300 font-normal">
              Claim your completion blessing.
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed max-w-xl">
            You physically touched the living world and broke the screen's gravity. You are now entitled to claim your cryptographic attestation certificate and personalized blessing.
          </p>
        </div>

        {/* Claim Reward Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={onClaimReward}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-neutral-950 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-2xl glow-gold-emerald flex items-center justify-center space-x-2.5 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
          >
            <Award className="w-4 h-4 text-neutral-950 group-hover:scale-110 transition-transform" />
            <span>CLAIM ATTESTATION & RECEIVE CLOSING BLESSING</span>
            <Sparkles className="w-3.5 h-3.5 text-neutral-950 animate-pulse" />
          </button>

          <span className="text-[11px] font-mono text-neutral-400 text-center sm:text-left">
            Or silence your screen for deep presence below ↓
          </span>
        </div>
      </div>
    </div>
  );
};
