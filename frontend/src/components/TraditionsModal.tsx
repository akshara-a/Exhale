import React, { useState, useMemo } from 'react';
import { X, Search, Check, BookOpen, Globe2, Sparkles } from 'lucide-react';
import { CULTURAL_TAXONOMY, CulturalTradition } from '../culturalLore';

interface TraditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
  onInspectLore: (tradition: CulturalTradition) => void;
}

const REGION_CATEGORIES = [
  'All',
  'East Asia',
  'South Asia',
  'Europe',
  'Americas & Pacific',
  'Africa & Middle East',
  'Clinical Science'
] as const;

export const TraditionsModal: React.FC<TraditionsModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
  onInspectLore,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Filter traditions based on search and region
  const filteredTraditions = useMemo(() => {
    return CULTURAL_TAXONOMY.filter((t) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nativeScript.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.philosophicalCore.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedRegion === 'All') return true;

      const reg = t.region.toLowerCase();
      if (selectedRegion === 'East Asia') return reg.includes('japan') || reg.includes('china') || reg.includes('korea');
      if (selectedRegion === 'South Asia') return reg.includes('india') || reg.includes('tamil');
      if (selectedRegion === 'Europe') return reg.includes('ireland') || reg.includes('greece') || reg.includes('scandinavia') || reg.includes('central europe');
      if (selectedRegion === 'Americas & Pacific') return reg.includes('north america') || reg.includes('polynesia') || reg.includes('new zealand') || reg.includes('hawaii');
      if (selectedRegion === 'Africa & Middle East') return reg.includes('africa') || reg.includes('middle east');
      if (selectedRegion === 'Clinical Science') return reg.includes('clinical') || reg.includes('science');

      return true;
    });
  }, [searchTerm, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="traditions-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-elevated rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl relative border border-white/[0.1]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Globe2 className="w-3 h-3" />
                <span>15 PLANETARY NATURE TRADITIONS</span>
              </div>
              <h3 id="traditions-modal-title" className="text-xl sm:text-2xl font-light text-white mt-1.5">
                Choose an Ancestral Grounding Lineage
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Select an authentic lineage calibrated to millennia of indigenous wisdom and peer-reviewed autonomic science.
              </p>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close traditions selector"
              className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar & Region Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lineage by name, culture, keyword, or philosophy..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-mono">
              {REGION_CATEGORIES.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition flex-shrink-0 ${
                    selectedRegion === region
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                      : 'bg-white/[0.02] text-neutral-400 border border-white/[0.06] hover:text-neutral-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Traditions Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {/* Quick Option: Auto-Detect */}
          <div
            onClick={() => {
              onSelect('Auto-Detect');
              onClose();
            }}
            className={`p-4 rounded-2xl border text-left transition font-mono text-xs flex items-center justify-between cursor-pointer ${
              selectedId === 'Auto-Detect'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg'
                : 'bg-white/[0.02] border-white/[0.06] text-neutral-300 hover:border-emerald-500/40 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Auto-Detect Lineage</div>
                <div className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Dynamically match your acute somatic expression with the most attuned cultural tradition.
                </div>
              </div>
            </div>
            {selectedId === 'Auto-Detect' && (
              <span className="flex items-center space-x-1 text-emerald-400 font-mono text-xs">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Active</span>
              </span>
            )}
          </div>

          {/* List of matching traditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {filteredTraditions.map((tradition) => {
              const isSelected = selectedId === tradition.id || selectedId.includes(tradition.name.split(' ')[0]);

              return (
                <div
                  key={tradition.id}
                  onClick={() => {
                    onSelect(tradition.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border text-left transition font-mono text-xs flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-white/[0.02] border-white/[0.06] text-neutral-300 hover:border-emerald-500/40 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-emerald-400 border border-white/[0.08]">
                          {tradition.region}
                        </span>
                        <span className="text-[10px] text-neutral-500 truncate max-w-[150px]">
                          {tradition.historicalPeriod}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectLore(tradition);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition"
                        title="Inspect clinical evidence & provenance"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {tradition.name}
                      </div>
                      <div className="text-xs text-emerald-400 font-serif italic mt-0.5">
                        {tradition.nativeScript}
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                      {tradition.philosophicalCore}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 text-[10px] truncate max-w-[180px]">
                      {tradition.sensoryFocus}
                    </span>
                    {isSelected ? (
                      <span className="text-emerald-400 flex items-center space-x-1 font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <span className="text-neutral-500 group-hover:text-emerald-400 transition-colors">
                        Select →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTraditions.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-mono text-neutral-400">No nature traditions match "{searchTerm}".</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('All');
                }}
                className="text-xs font-mono text-emerald-400 hover:underline"
              >
                Clear search and filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] flex items-center justify-between bg-black/40 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              onSelect('Auto-Detect');
              onClose();
            }}
            className="text-emerald-400 hover:underline px-2 py-1"
          >
            Reset to Auto-Detect
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
