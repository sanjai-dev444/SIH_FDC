import React from 'react';
import { Eye, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { PupillometryData } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface PupillometryScannerProps {
  data: PupillometryData;
  onChange: (data: PupillometryData) => void;
}

export const PupillometryScanner: React.FC<PupillometryScannerProps> = ({
  data,
  onChange,
}) => {
  const isMiosis = data.diameterMm <= 2.5;
  const isMydriasis = data.diameterMm >= 5.5;

  const handleDiameterChange = (newDiameter: number) => {
    triggerHapticTap();
    let score = 'Normal Light Reflex (3.5 - 4.5 mm)';
    if (newDiameter <= 2.2) {
      score = 'Severe Pinpoint Miosis / Sluggish (Opioid Indicator)';
    } else if (newDiameter <= 2.9) {
      score = 'Mild Miosis / Constricted';
    } else if (newDiameter >= 6.0) {
      score = 'Severe Mydriasis / Dilated (Stimulant / Sympathomimetic)';
    } else if (newDiameter >= 5.0) {
      score = 'Elevated Dilation';
    }

    onChange({
      ...data,
      diameterMm: newDiameter,
      constrictionScore: score,
    });
  };

  const toggleNystagmus = () => {
    triggerHapticTap();
    onChange({
      ...data,
      nystagmus: !data.nystagmus,
    });
  };

  // Convert mm diameter (1.5mm to 8.0mm) into SVG pupil radius
  const pupilRadius = Math.round((data.diameterMm / 8.0) * 36 + 6);

  return (
    <div className="bg-tactical-950 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">OPTICAL PUPILLOMETRY ASSESSMENT</span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
          isMiosis 
            ? 'bg-rose-950 text-rose-300 border border-rose-800/60' 
            : isMydriasis 
              ? 'bg-amber-950 text-amber-300 border border-amber-800/60' 
              : 'bg-slate-800 text-slate-300'
        }`}>
          {isMiosis ? 'MIOSIS (PINPOINT)' : isMydriasis ? 'MYDRIASIS (DILATED)' : 'NORMAL'}
        </span>
      </div>

      {/* Visual Eye Graphic */}
      <div className="flex flex-col items-center justify-center p-3 bg-tactical-900/90 rounded-lg border border-slate-800">
        <svg width="180" height="90" viewBox="0 0 180 90" className="overflow-visible">
          <defs>
            <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>
          {/* Sclera (Eye Outline) */}
          <path
            d="M 10 45 Q 90 -10 170 45 Q 90 100 10 45 Z"
            fill="#f8fafc"
            stroke="#64748b"
            strokeWidth="2"
          />
          {/* Iris */}
          <circle cx="90" cy="45" r="32" fill="url(#irisGrad)" stroke="#0e7490" strokeWidth="2" />
          
          {/* Pupil (Dynamic Radius) */}
          <circle
            cx="90"
            cy="45"
            r={pupilRadius}
            fill="#020617"
            className="transition-all duration-300"
          />
          {/* Light Reflection */}
          <circle cx="83" cy="38" r="3" fill="#ffffff" opacity="0.8" />
        </svg>

        <div className="mt-2 text-center">
          <div className="text-lg font-black font-mono text-cyan-400 tracking-tight">
            {data.diameterMm.toFixed(1)} <span className="text-xs text-slate-400">mm</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">{data.constrictionScore}</p>
        </div>
      </div>

      {/* Interactive Sliders & Controls */}
      <div className="space-y-3 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 font-mono mb-1">
            <span>Measured Pupil Diameter</span>
            <span className="font-bold text-cyan-400">{data.diameterMm.toFixed(1)} mm</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="8.0"
            step="0.1"
            value={data.diameterMm}
            onChange={(e) => handleDiameterChange(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
            <span>1.5mm (Pinpoint)</span>
            <span>4.0mm</span>
            <span>8.0mm (Dilated)</span>
          </div>
        </div>

        {/* Reaction Latency */}
        <div>
          <div className="flex justify-between text-slate-300 font-mono mb-1">
            <span>Constriction Reaction Latency</span>
            <span className="font-bold text-slate-200">{data.responseTimeMs} ms</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[220, 480, 680].map((ms) => (
              <button
                key={ms}
                onClick={() => {
                  triggerHapticTap();
                  onChange({ ...data, responseTimeMs: ms });
                }}
                className={`py-1.5 px-2 rounded font-mono text-center transition-all ${
                  data.responseTimeMs === ms
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                }`}
              >
                {ms === 220 ? 'Brisk (220ms)' : ms === 480 ? 'Delayed (480ms)' : 'Sluggish (680ms)'}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Gaze Nystagmus (HGN) Check */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div>
            <div className="font-mono text-slate-200 font-semibold">Horizontal Gaze Nystagmus (HGN)</div>
            <div className="text-[10px] text-slate-400">Involuntary eye jerking at maximum deviation</div>
          </div>
          <button
            onClick={toggleNystagmus}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
              data.nystagmus
                ? 'bg-rose-900/80 text-rose-200 border border-rose-600'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {data.nystagmus ? 'PRESENT (POS)' : 'ABSENT (NEG)'}
          </button>
        </div>
      </div>
    </div>
  );
};
