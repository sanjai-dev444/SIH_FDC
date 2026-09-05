import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Search, 
  Heart, 
  ArrowUpRight,
  Bot
} from 'lucide-react';
import { SafetyResource } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface LocalSafetyMapPageProps {
  resources: SafetyResource[];
  currentCity?: string;
  onOpenAIAssistant?: () => void;
}

export const LocalSafetyMapPage: React.FC<LocalSafetyMapPageProps> = ({ 
  resources,
  currentCity = 'Coimbatore',
  onOpenAIAssistant,
}) => {
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Filter resources by selected city and category
  const cityFiltered = resources.filter((r) => {
    const matchesCity = r.address.toLowerCase().includes(selectedCity.toLowerCase()) || 
                        r.name.toLowerCase().includes(selectedCity.toLowerCase());
    return matchesCity;
  });

  const activeList = cityFiltered.length > 0 ? cityFiltered : resources;

  const filtered = activeList.filter((r) => {
    const matchType = filterType === 'ALL' || r.type === filterType;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const [selectedResource, setSelectedResource] = useState<SafetyResource | null>(filtered[0] || null);

  return (
    <div className="space-y-4 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Emergency & Care Map</h2>
        </div>
        <span className="text-xs font-mono text-teal-400">{filtered.length} Points in {selectedCity}</span>
      </div>

      {/* City Switcher */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs font-mono">
        <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
        <span className="text-slate-400">Target City:</span>
        <div className="flex space-x-1.5 overflow-x-auto hide-scrollbar flex-1">
          {['Coimbatore', 'Chennai', 'Madurai'].map((c) => (
            <button
              key={c}
              onClick={() => {
                triggerHapticTap();
                setSelectedCity(c);
                setSelectedResource(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                selectedCity === c
                  ? 'bg-teal-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-300 border border-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder={`Search 108 stations, CMCH hospital in ${selectedCity}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
        />
      </div>

      {/* Visual Safety Map Representation */}
      <div className="relative w-full aspect-[16/9] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-3">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 40 L 400 80 M 80 0 L 120 300 M 240 0 L 220 300 M 0 160 L 400 140" stroke="#14b8a6" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Resource Map Pins */}
        {filtered.map((res, i) => {
          const isSelected = selectedResource?.id === res.id;
          const leftPercent = 25 + (i * 20) % 65;
          const topPercent = 30 + (i * 24) % 55;

          return (
            <button
              key={res.id}
              onClick={() => {
                triggerHapticTap();
                setSelectedResource(res);
              }}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
              }`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg ${
                res.type === 'NARCAN_BOX' 
                  ? 'bg-rose-600 border-white text-white' 
                  : 'bg-teal-600 border-white text-white'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
            </button>
          );
        })}

        <div className="absolute bottom-2 left-2 bg-slate-900/90 px-2 py-1 rounded text-[10px] font-mono text-teal-300 border border-slate-800">
          📍 {selectedCity.toUpperCase()} 108 AMBULANCE & CARE HUBS
        </div>
      </div>

      {/* Selected Location Card */}
      {selectedResource && (
        <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-4 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
              {selectedResource.type === 'NARCAN_BOX' ? '108 EMERGENCY POINT' : 'GOVT MEDICAL HOSPITAL'}
            </span>
            <span className="text-xs font-mono text-teal-400 font-bold">
              {selectedResource.distanceMiles} miles away
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">{selectedResource.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{selectedResource.address}</p>
          </div>

          <div className="space-y-1 text-xs font-mono text-slate-300 pt-1 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{selectedResource.hours}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <a href={`tel:${selectedResource.phone}`} className="text-teal-400 hover:underline">
                Emergency: {selectedResource.phone}
              </a>
            </div>
          </div>

          <div className="flex space-x-2">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(selectedResource.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>GOOGLE MAPS</span>
            </a>

            {onOpenAIAssistant && (
              <button
                onClick={() => {
                  triggerHapticTap();
                  onOpenAIAssistant();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono text-xs flex items-center justify-center space-x-1 border border-slate-700"
                title="Ask AI Helpline"
              >
                <Bot className="w-4 h-4" />
                <span>AI Helpline</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
