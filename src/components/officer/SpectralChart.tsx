import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

interface SpectralChartProps {
  matchScore: number;
  substanceName: string;
  peakWavelength?: number;
}

export const SpectralChart: React.FC<SpectralChartProps> = ({
  matchScore,
  substanceName,
  peakWavelength = 1650,
}) => {
  // Generate a realistic FTIR / Raman absorption curve with peaks
  const points: { x: number; y: number }[] = [];
  const baselinePoints: { x: number; y: number }[] = [];

  for (let x = 400; x <= 3600; x += 40) {
    // Simulated spectral curve with characteristic peaks around 1650, 1420, 1050
    let y = 15 + Math.sin(x / 200) * 8;
    // Peak 1: Fingerprint peak
    y += 65 * Math.exp(-Math.pow((x - peakWavelength) / 75, 2));
    // Peak 2: Secondary amine/aromatic
    y += 42 * Math.exp(-Math.pow((x - 1450) / 60, 2));
    // Peak 3: Amide I
    y += 35 * Math.exp(-Math.pow((x - 2950) / 120, 2));

    points.push({ x, y: Math.min(95, Math.max(5, y)) });
    baselinePoints.push({ x, y: 12 + Math.sin(x / 250) * 4 });
  }

  // Transform to SVG viewBox (0 0 320 120)
  const svgPath = points.reduce((acc, pt, index) => {
    const svgX = ((pt.x - 400) / (3600 - 400)) * 320;
    const svgY = 110 - (pt.y / 100) * 95;
    return index === 0 ? `M ${svgX},${svgY}` : `${acc} L ${svgX},${svgY}`;
  }, '');

  const baselineSvgPath = baselinePoints.reduce((acc, pt, index) => {
    const svgX = ((pt.x - 400) / (3600 - 400)) * 320;
    const svgY = 110 - (pt.y / 100) * 95;
    return index === 0 ? `M ${svgX},${svgY}` : `${acc} L ${svgX},${svgY}`;
  }, '');

  return (
    <div className="bg-tactical-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">FTIR / RAMAN SPECTRAL SIGNATURE</span>
        </div>
        <div className="flex items-center space-x-1 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-300">
          <CheckCircle2 className="w-3 h-3" />
          <span>{matchScore}% MATCH</span>
        </div>
      </div>

      {/* SVG Waveform Visualizer */}
      <div className="relative h-28 w-full bg-tactical-900/90 rounded-lg p-1 border border-slate-800/60 overflow-hidden">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-20 pointer-events-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="border-r border-b border-cyan-500" />
          ))}
        </div>

        <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
          {/* Reference baseline in slate */}
          <path
            d={baselineSvgPath}
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Active sample spectrum with glowing cyan line */}
          <path
            d={svgPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            filter="drop-shadow(0 0 4px #06b6d4)"
          />
        </svg>

        {/* Peak indicator */}
        <div className="absolute top-2 right-3 text-[10px] font-mono text-cyan-300 bg-tactical-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
          Primary Peak: {peakWavelength} cm⁻¹
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
        <span>400 cm⁻¹</span>
        <span className="text-slate-300 font-bold truncate max-w-[200px]">{substanceName}</span>
        <span>3600 cm⁻¹</span>
      </div>
    </div>
  );
};
