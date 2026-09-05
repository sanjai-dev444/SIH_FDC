import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Layers, 
  Bot, 
  RefreshCw 
} from 'lucide-react';
import { DrugHotspot } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface DrugHeatmapPageProps {
  hotspots: DrugHotspot[];
  currentCity?: string;
  onOpenAIAssistant?: () => void;
}

export const DrugHeatmapPage: React.FC<DrugHeatmapPageProps> = ({ 
  hotspots, 
  currentCity = 'Coimbatore',
  onOpenAIAssistant,
}) => {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>(currentCity);
  const [activeHotspot, setActiveHotspot] = useState<DrugHotspot | null>(null);

  // Filter hotspots by selected city
  const cityFiltered = hotspots.filter(h => 
    h.neighborhood.toLowerCase().includes(selectedCityFilter.toLowerCase())
  );

  const displayedHotspots = cityFiltered.length > 0 ? cityFiltered : hotspots;
  const currentActive = activeHotspot || displayedHotspots[0] || null;

  return (
    <div className="space-y-4 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Map className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Tamil Nadu Drug Radar</h2>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>RADAR LIVE</span>
        </div>
      </div>

      {/* City Selector */}
      <div className="flex items-center space-x-2 bg-tactical-900 p-2 rounded-xl border border-slate-800 text-xs font-mono">
        <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span className="text-slate-400">Target Sector:</span>
        <div className="flex space-x-1.5 overflow-x-auto hide-scrollbar flex-1">
          {['Coimbatore', 'Chennai', 'Madurai'].map((c) => (
            <button
              key={c}
              onClick={() => {
                triggerHapticTap();
                setSelectedCityFilter(c);
                setActiveHotspot(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                selectedCityFilter === c
                  ? 'bg-cyan-500 text-tactical-950 font-bold glow-cyan'
                  : 'bg-tactical-950 text-slate-300 border border-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Radar Map Canvas */}
      <div className="relative w-full aspect-[4/3] rounded-2xl bg-tactical-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Radar concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full border border-cyan-500/20" />
          <div className="w-48 h-48 rounded-full border border-cyan-500/20" />
          <div className="w-72 h-72 rounded-full border border-cyan-500/20" />
          <div className="absolute w-full h-[1px] bg-cyan-500/20" />
          <div className="absolute h-full w-[1px] bg-cyan-500/20" />
          <div className="absolute w-72 h-72 rounded-full border-r-2 border-cyan-400/40 animate-radar" />
        </div>

        {/* Hotspot Radar Blips */}
        {displayedHotspots.map((h, i) => {
          const angle = (i * 70 * Math.PI) / 180;
          const radius = 50 + (i % 3) * 35;
          const leftPercent = 50 + Math.cos(angle) * (radius / 3);
          const topPercent = 50 + Math.sin(angle) * (radius / 3);
          const isSelected = currentActive?.id === h.id;

          return (
            <button
              key={h.id}
              onClick={() => {
                triggerHapticTap();
                setActiveHotspot(h);
              }}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform ${
                isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-7 h-7 rounded-full animate-ping opacity-60 ${
                  h.riskLevel === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-lg ${
                  h.riskLevel === 'CRITICAL' 
                    ? 'bg-rose-600 border-white text-white' 
                    : 'bg-amber-500 border-white text-tactical-950'
                }`}>
                  <MapPin className="w-3 h-3 stroke-[2.5]" />
                </div>
              </div>
            </button>
          );
        })}

        <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-tactical-950/80 px-2 py-1 rounded border border-cyan-800/60 pointer-events-none">
          {selectedCityFilter.toUpperCase()} SECTOR // ACTIVE HOTSPOTS: {displayedHotspots.length}
        </div>
      </div>

      {/* Selected Hotspot Detail Card */}
      {currentActive && (
        <div className="bg-tactical-900 border border-slate-700/80 rounded-2xl p-4 space-y-3 glow-cyan animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                {selectedCityFilter.toUpperCase()} HOTSPOT
              </span>
              <h3 className="text-base font-bold text-white">{currentActive.neighborhood}</h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              currentActive.riskLevel === 'CRITICAL'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {currentActive.riskLevel}
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">PRIMARY CONTRABAND:</span>
              <span className="text-rose-400 font-bold">{currentActive.substance}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">RECENT SEIZURES:</span>
              <span className="text-white">{currentActive.incidentCount} Cases Reported</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">LAST DETECTION:</span>
              <span className="text-cyan-300">{currentActive.lastReported}</span>
            </div>
          </div>

          {currentActive.adulterantAlert && (
            <div className="bg-rose-950/80 border border-rose-600/60 rounded-lg p-2.5 flex items-start space-x-2 text-xs text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{currentActive.adulterantAlert}</span>
            </div>
          )}

          {onOpenAIAssistant && (
            <button
              onClick={() => {
                triggerHapticTap();
                onOpenAIAssistant();
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-mono flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Assistant about {selectedCityFilter} Jurisdiction</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
