import React from 'react';
import { CloudSun, Wind, Sun, X } from 'lucide-react';
import { WeatherTelemetry } from '../types';

interface WeatherPopoverProps {
  weather: WeatherTelemetry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WeatherPopover: React.FC<WeatherPopoverProps> = ({ weather, isOpen, onClose }) => {
  if (!isOpen || !weather) return null;

  return (
    <div 
      className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:top-14 sm:right-10 bg-black/60 sm:bg-transparent flex items-center justify-center p-4 sm:p-0"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel-elevated rounded-2xl p-5 w-full max-w-xs shadow-2xl border border-white/[0.1] space-y-3.5 font-mono text-xs text-neutral-300"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span>Hyper-Local Atmosphere</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/[0.05] text-neutral-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Condition:</span>
            <span className="text-white font-medium">{weather.condition}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Temperature:</span>
            <span className="text-emerald-400 font-semibold">{weather.temperature_c.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Wind Velocity:</span>
            <span className="text-white">{weather.wind_speed_kmh.toFixed(0)} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Solar Elevation:</span>
            <span className="text-amber-300 flex items-center space-x-1">
              <Sun className="w-3 h-3" />
              <span>{weather.solar_status}</span>
            </span>
          </div>
          {weather.circadian_lux_est !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Circadian Lux:</span>
              <span className="text-white">~{weather.circadian_lux_est.toLocaleString()} Lux</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-white/[0.06] text-[11px] text-neutral-400 font-sans leading-relaxed flex items-start space-x-1.5">
          <Wind className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            Exhale anchors sensory grounding tasks to your actual atmospheric conditions (wind, sunlight, humidity) for authentic somatic reset.
          </span>
        </div>
      </div>
    </div>
  );
};
