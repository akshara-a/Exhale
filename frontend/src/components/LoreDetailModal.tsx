import React from 'react';
import { X, Compass, Activity, Check } from 'lucide-react';
import { CulturalTradition } from '../culturalLore';

interface LoreDetailModalProps {
  tradition: CulturalTradition | null;
  onClose: () => void;
  onApply: (traditionId: string) => void;
  isApplied: boolean;
}

export const LoreDetailModal: React.FC<LoreDetailModalProps> = ({
  tradition,
  onClose,
  onApply,
  isApplied,
}) => {
  if (!tradition) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="lore-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-elevated rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative border border-white/[0.1]"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tradition.region}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                {tradition.historicalPeriod}
              </span>
            </div>
            <h3 id="lore-modal-title" className="text-2xl sm:text-3xl font-light text-white mt-1.5">
              {tradition.name}
            </h3>
            <div className="text-emerald-400 font-serif italic text-lg tracking-wide mt-0.5">
              {tradition.nativeScript}
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close lineage details"
            className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Philosophical Core */}
        <div className="space-y-1.5">
          <h4 className="font-mono text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Indigenous Lineage & Philosophy:</span>
          </h4>
          <p className="text-sm text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] font-sans">
            {tradition.philosophicalCore}
          </p>
        </div>

        {/* Clinical Neurobiology & Evidence */}
        <div className="space-y-1.5">
          <h4 className="font-mono text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical Trials & Modern Neurobiology:</span>
          </h4>
          <p className="text-sm text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] border-l-2 border-l-emerald-500 font-sans">
            {tradition.clinicalEvidence}
          </p>
        </div>

        {/* Ancestral Quote */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] italic text-emerald-200/90 text-sm font-serif">
          "{tradition.ancestralQuote}"
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              onApply(tradition.id);
              onClose();
            }}
            className={`px-5 py-2.5 rounded-full font-mono font-semibold text-xs uppercase tracking-wider transition flex items-center space-x-1.5 ${
              isApplied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 glow-emerald'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Lineage Applied</span>
              </>
            ) : (
              <span>Apply This Lineage</span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 font-mono text-xs uppercase tracking-wider transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
