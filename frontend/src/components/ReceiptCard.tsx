import React, { useState } from 'react';
import { 
  Copy, 
  Download, 
  FileImage, 
  Share2, 
  Check, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Flame,
  LayoutGrid
} from 'lucide-react';
import { GroundingMission, ProofOfTouchResponse } from '../types';
import { CULTURAL_TAXONOMY } from '../culturalLore';

interface ReceiptCardProps {
  mission: GroundingMission;
  stepCount: number;
  tabSwitches: number;
  proofOfTouch: ProofOfTouchResponse | null;
  demoFastMode: boolean;
  rawReceiptText: string;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onDownloadPng: () => void;
  onShare: () => void;
  copied: boolean;
  isGeneratingPng: boolean;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  mission,
  stepCount,
  tabSwitches,
  proofOfTouch,
  demoFastMode,
  rawReceiptText,
  onCopy,
  onDownloadTxt,
  onDownloadPng,
  onShare,
  copied,
  isGeneratingPng,
}) => {
  const [viewMode, setViewMode] = useState<'CARD' | 'RAW'>('CARD');

  const matchingTradition = CULTURAL_TAXONOMY.find((t) =>
    t.id === mission.cultural_framework ||
    (mission.cultural_framework && t.name.toLowerCase().includes(mission.cultural_framework.toLowerCase().split(' ')[0]))
  );

  const quote = matchingTradition 
    ? matchingTradition.ancestralQuote 
    : '"The code will still be there. You took back your reality."';

  const hash = mission.ephemeral_purge_hash || 'e3b0c44298fc1c149afbf4c8';

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-3xl space-y-5 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        {/* View Switcher Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('CARD')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              viewMode === 'CARD'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Attestation Card</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('RAW')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              viewMode === 'RAW'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Raw Monospace</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            type="button"
            onClick={onCopy}
            className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
            title="Copy ASCII Receipt to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED!' : 'COPY'}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPng}
            disabled={isGeneratingPng}
            className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-300 hover:text-white flex items-center space-x-1.5 transition glow-emerald-subtle disabled:opacity-50"
            title="Download high-resolution verification PNG card"
          >
            <FileImage className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isGeneratingPng ? 'RENDERING...' : 'SAVE PNG'}</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
            title="Share attestation"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>

          <button
            type="button"
            onClick={onDownloadTxt}
            className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
            title="Download plain text receipt file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'CARD' ? (
        <div className="space-y-6 pt-2 font-mono">
          {/* Certificate Header Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-black/40 to-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold">
                  OFFICIAL EPHEMERAL ATTESTATION
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-light text-white font-sans">
                Living World Grounding Certificate
              </h3>
              <p className="text-[11px] text-neutral-400">
                Issued for {demoFastMode ? '10-Second Speedrun Evaluation' : '10-Minute Deep Autonomic Re-regulation'}
              </p>
            </div>

            <div className="flex items-center space-x-2 sm:self-center">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                <ShieldCheck className="w-4 h-4 mx-auto mb-0.5 text-emerald-400" />
                <span>0 BYTES STORED</span>
              </div>
            </div>
          </div>

          {/* Key Attestation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">SOMATIC DIAGNOSIS</div>
              <div className="text-white font-medium flex items-center space-x-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{mission.detected_emotion.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">ANCESTRAL LINEAGE</div>
              <div className="text-emerald-300 font-medium truncate flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{mission.cultural_framework || 'Japanese Shinrin-yoku'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">ATMOSPHERIC ANCHOR</div>
              <div className="text-neutral-200 truncate">
                {mission.weather_context || 'Ambient Outdoor Air'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">PHYSICAL TOUCH WITNESS</div>
              <div className={`font-medium ${proofOfTouch?.verified ? 'text-emerald-400' : 'text-neutral-400'}`}>
                {proofOfTouch?.verified 
                  ? `Authenticated (${proofOfTouch.detected_element.toUpperCase()}) ✓` 
                  : 'Self-Attested'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">STEPS PACED AWAY FROM SCREEN</div>
              <div className="text-white font-medium">
                {stepCount} Registered Steps
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">CIRCUIT DISCIPLINE</div>
              <div className={tabSwitches === 0 ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                {tabSwitches === 0 ? '0 Tab Relapses (Flawless Immersion)' : `${tabSwitches} Reset Triggers`}
              </div>
            </div>
          </div>

          {/* Ancestral Wisdom Quote Callout */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] text-center space-y-1.5">
            {matchingTradition && (
              <div className="text-xs text-emerald-400 font-serif italic">
                {matchingTradition.nativeScript}
              </div>
            )}
            <p className="text-sm font-serif italic text-emerald-100/90 leading-relaxed max-w-lg mx-auto">
              {quote}
            </p>
          </div>

          {/* Cryptographic Proof Strip */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 border-t border-white/[0.04] gap-2">
            <span className="truncate max-w-xs font-mono">
              PURGE SHA-256: <strong className="text-neutral-300 font-normal">{hash.slice(0, 16)}...</strong>
            </span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Volatile Memory Zeroed</span>
            </span>
          </div>
        </div>
      ) : (
        /* Raw Monospace View */
        <div className="space-y-3">
          <pre className="font-mono text-xs text-neutral-300 bg-black/60 p-5 rounded-2xl border border-white/[0.08] overflow-x-auto leading-relaxed select-all">
            {rawReceiptText}
          </pre>
          <p className="text-[11px] font-mono text-neutral-500 text-right">
            Click inside or use the Copy button above to copy exact ASCII text.
          </p>
        </div>
      )}
    </div>
  );
};
