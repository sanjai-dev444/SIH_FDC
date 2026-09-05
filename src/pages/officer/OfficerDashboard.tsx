import React from 'react';
import { 
  ShieldAlert, 
  ScanLine, 
  Layers, 
  MapPin, 
  FileText, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  ArrowUpRight,
  Radio,
  CheckCircle
} from 'lucide-react';
import { ScreeningRecord, CaseRecord, OfficerTab } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface OfficerDashboardProps {
  onNavigate: (tab: OfficerTab) => void;
  screenings: ScreeningRecord[];
  cases: CaseRecord[];
  onSelectScreening: (screening: ScreeningRecord) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  onNavigate,
  screenings,
  cases,
  onSelectScreening,
}) => {
  const criticalCount = screenings.filter(s => s.riskLevel === 'CRITICAL').length;
  const pendingLabCount = cases.filter(c => c.status === 'PENDING_LAB_CONFIRM').length;

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-rose-950/80 via-tactical-900 to-amber-950/60 border border-rose-600/40 rounded-2xl p-3.5 flex items-start space-x-3 glow-rose">
        <div className="p-2 rounded-lg bg-rose-900/80 text-rose-300 mt-0.5 flex-shrink-0 animate-pulse">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wide">
              TN POLICE TACTICAL ADVISORY
            </span>
            <span className="text-[10px] font-mono bg-rose-600 text-white font-black px-1.5 py-0.2 rounded">
              HIGH DANGER
            </span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5 leading-snug">
            Elevated <span className="text-rose-300 font-bold">Xylazine ("Tranq") & Synthetic Opioid adulteration</span> intercepted at Koyambedu CMBT & Chennai Central. Coordinate with 108 Emergency Ambulance for respiratory support.
          </p>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            RAPID FIELD ACTIONS
          </span>
          <span className="text-[10px] font-mono text-cyan-400">TN FSD FIELD RUNTIME</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Action 1: New Screening */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('screening');
            }}
            className="flex items-center space-x-3 bg-gradient-to-br from-cyan-900/80 to-tactical-900 border border-cyan-500/50 p-3.5 rounded-xl text-left hover:border-cyan-400 active:scale-[0.98] transition-all glow-cyan"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500 text-tactical-950 flex items-center justify-center font-bold shadow">
              <ScanLine className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">NEW SCREENING</div>
              <div className="text-[10px] text-cyan-300 font-mono">Multi-Signal Scan</div>
            </div>
          </button>

          {/* Action 2: Drug Heatmap */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('heatmap');
            }}
            className="flex items-center space-x-3 bg-tactical-900/90 border border-slate-700/80 p-3.5 rounded-xl text-left hover:border-slate-500 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center font-bold border border-slate-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">TN DRUG HEATMAP</div>
              <div className="text-[10px] text-slate-400 font-mono">Tamil Nadu Hotspots</div>
            </div>
          </button>

          {/* Action 3: Case Files */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('cases');
            }}
            className="flex items-center space-x-3 bg-tactical-900/90 border border-slate-700/80 p-3.5 rounded-xl text-left hover:border-slate-500 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold border border-slate-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">NDPS CASE FILES</div>
              <div className="text-[10px] text-slate-400 font-mono">{cases.length} Registered Cases</div>
            </div>
          </button>

          {/* Action 4: Hardware Telemetry */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('device');
            }}
            className="flex items-center space-x-3 bg-tactical-900/90 border border-slate-700/80 p-3.5 rounded-xl text-left hover:border-slate-500 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center font-bold border border-slate-700">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">SPECTROMETER</div>
              <div className="text-[10px] text-emerald-400 font-mono">FSD Laser Online</div>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-tactical-900/80 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Tests Today</div>
          <div className="text-xl font-black font-mono text-cyan-400 mt-0.5">{screenings.length}</div>
          <div className="text-[9px] text-slate-500 font-mono">NDPS Sec 52A Sealed</div>
        </div>

        <div className="bg-tactical-900/80 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Critical Alerts</div>
          <div className="text-xl font-black font-mono text-rose-400 mt-0.5">{criticalCount}</div>
          <div className="text-[9px] text-rose-400/80 font-mono">Opioid / Tranq</div>
        </div>

        <div className="bg-tactical-900/80 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Lab Confirms</div>
          <div className="text-xl font-black font-mono text-amber-400 mt-0.5">{pendingLabCount}</div>
          <div className="text-[9px] text-slate-500 font-mono">FSD Chennai Queued</div>
        </div>
      </div>

      {/* Recent Field Screenings Feed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            RECENT FIELD SCREENINGS
          </span>
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('results');
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {screenings.slice(0, 3).map((sc) => (
            <div
              key={sc.id}
              onClick={() => {
                triggerHapticTap();
                onSelectScreening(sc);
              }}
              className="bg-tactical-900 border border-slate-800 rounded-xl p-3 hover:border-slate-700 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    sc.riskLevel === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : sc.riskLevel === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                  }`}>
                    {sc.riskLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{sc.id}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{sc.timestamp.split(' ')[1]}</span>
                </div>
                <div className="text-sm font-bold text-slate-100 truncate">
                  {sc.primarySubstance}
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center space-x-2 font-mono">
                  <span>Match: {sc.confidence}%</span>
                  <span>•</span>
                  <span>{sc.location.address}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
