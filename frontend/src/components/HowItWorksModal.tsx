import React from 'react';
import { X, Sparkles, Compass, Lock, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-elevated rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative border border-white/[0.1]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>User Guide & Overview</span>
            </div>
            <h3 id="how-it-works-title" className="text-2xl sm:text-3xl font-light text-white mt-1.5">
              How Exhale Works
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-0.5">
              An acute emotional circuit breaker engineered to disconnect you from digital strain and return you to reality.
            </p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Steps Explanation Cards */}
        <div className="space-y-3 font-sans text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold flex-shrink-0">
              01
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-sm flex items-center space-x-1.5">
                <span>Express Your Burden</span>
              </h4>
              <p className="text-neutral-400 leading-relaxed text-xs sm:text-sm">
                Type or speak aloud what is causing acute friction—an elusive bug, Slack ping overload, or deadline tension. Select an ancestral nature lineage or let Auto-Detect match your mood.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold flex-shrink-0">
              02
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-sm flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Receive Your 5-Step Protocol</span>
              </h4>
              <p className="text-neutral-400 leading-relaxed text-xs sm:text-sm">
                Exhale blends hyper-local atmospheric conditions (sun, wind, temperature) with millennia-old nature traditions (Shinrin-yoku, Pancha Mahabhuta, Polyvagal science) into 5 tactile outdoor tasks.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold flex-shrink-0">
              03
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-sm flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cross the Threshold & Disconnect</span>
              </h4>
              <p className="text-neutral-400 leading-relaxed text-xs sm:text-sm">
                Your screen is silenced for 10 minutes. If you switch tabs or lose focus, the circuit breaker triggers a gentle restart. Use the visual box breathing pacer or pocket audio narration while outside.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold flex-shrink-0">
              04
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-sm flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Return Re-Regulated & Receive Attestation</span>
              </h4>
              <p className="text-neutral-400 leading-relaxed text-xs sm:text-sm">
                Optionally capture a photo of a leaf or tree bark to attest nature contact. Receive your cryptographic RAM-purge field log receipt to save or share.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Zero Data Stored: 100% ephemeral in-memory execution.</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Demo Mode Available: Use "10s TEST" in top bar to test quickly.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition glow-emerald flex items-center justify-center space-x-2"
          >
            <span>Understood // Enter Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
