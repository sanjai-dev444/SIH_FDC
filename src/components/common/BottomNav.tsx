import React from 'react';
import { 
  LayoutDashboard, 
  ScanLine, 
  FileText, 
  Map, 
  Cpu, 
  Menu, 
  Heart, 
  AlertOctagon, 
  HelpCircle, 
  Layers, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { AppMode, OfficerTab, CivilianTab } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface BottomNavProps {
  mode: AppMode;
  officerTab: OfficerTab;
  civilianTab: CivilianTab;
  onSelectOfficerTab: (tab: OfficerTab) => void;
  onSelectCivilianTab: (tab: CivilianTab) => void;
  onOpenOfficerDrawer: () => void;
  onOpenCivilianDrawer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  mode,
  officerTab,
  civilianTab,
  onSelectOfficerTab,
  onSelectCivilianTab,
  onOpenOfficerDrawer,
  onOpenCivilianDrawer,
}) => {
  const isOfficer = mode === 'officer';

  if (isOfficer) {
    return (
      <nav className="flex-shrink-0 bg-tactical-950 border-t border-slate-800/80 px-2 pb-safe pt-2 select-none z-30">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Dashboard */}
          <button
            onClick={() => {
              triggerHapticTap();
              onSelectOfficerTab('dashboard');
            }}
            className={`flex flex-col items-center justify-center w-16 py-1 text-xs transition-all ${
              officerTab === 'dashboard'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 mb-1 ${officerTab === 'dashboard' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">Dashboard</span>
          </button>

          {/* Multi-Signal Results */}
          <button
            onClick={() => {
              triggerHapticTap();
              onSelectOfficerTab('results');
            }}
            className={`flex flex-col items-center justify-center w-16 py-1 text-xs transition-all ${
              officerTab === 'results'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className={`w-5 h-5 mb-1 ${officerTab === 'results' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">Results</span>
          </button>

          {/* Center Scan Button */}
          <button
            onClick={() => {
              triggerHapticTap();
              onSelectOfficerTab('screening');
            }}
            className="flex flex-col items-center justify-center -mt-5"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              officerTab === 'screening'
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-tactical-950 glow-cyan ring-4 ring-cyan-500/30'
                : 'bg-gradient-to-tr from-cyan-600 to-blue-700 text-tactical-950 glow-cyan'
            }`}>
              <ScanLine className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-cyan-300 mt-1">NEW SCAN</span>
          </button>

          {/* Cases */}
          <button
            onClick={() => {
              triggerHapticTap();
              onSelectOfficerTab('cases');
            }}
            className={`flex flex-col items-center justify-center w-16 py-1 text-xs transition-all ${
              officerTab === 'cases'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className={`w-5 h-5 mb-1 ${officerTab === 'cases' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">Cases</span>
          </button>

          {/* Tactical Menu Drawer */}
          <button
            onClick={() => {
              triggerHapticTap();
              onOpenOfficerDrawer();
            }}
            className="flex flex-col items-center justify-center w-16 py-1 text-xs text-slate-400 hover:text-slate-200 transition-all"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Tactical</span>
          </button>
        </div>
      </nav>
    );
  }

  // Civilian Bottom Navigation
  return (
    <nav className="flex-shrink-0 bg-slate-950 border-t border-slate-800/80 px-2 pb-safe pt-2 select-none z-30">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Civilian Home */}
        <button
          onClick={() => {
            triggerHapticTap();
            onSelectCivilianTab('home');
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 text-xs transition-all ${
            civilianTab === 'home'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className={`w-5 h-5 mb-1 ${civilianTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Harm Red.</span>
        </button>

        {/* Self-Check */}
        <button
          onClick={() => {
            triggerHapticTap();
            onSelectCivilianTab('selfcheck');
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 text-xs transition-all ${
            civilianTab === 'selfcheck'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 mb-1 ${civilianTab === 'selfcheck' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Self-Check</span>
        </button>

        {/* Central SOS Button */}
        <button
          onClick={() => {
            triggerHapticTap();
            onSelectCivilianTab('sos');
          }}
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg glow-rose animate-pulse ring-4 ring-rose-500/40 active:scale-95 transition-transform">
            <AlertOctagon className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black text-rose-400 mt-1 tracking-wider">🆘 SOS</span>
        </button>

        {/* Safety Map */}
        <button
          onClick={() => {
            triggerHapticTap();
            onSelectCivilianTab('safetymap');
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 text-xs transition-all ${
            civilianTab === 'safetymap'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className={`w-5 h-5 mb-1 ${civilianTab === 'safetymap' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Safety Map</span>
        </button>

        {/* More / Menu Drawer */}
        <button
          onClick={() => {
            triggerHapticTap();
            onOpenCivilianDrawer();
          }}
          className="flex flex-col items-center justify-center w-16 py-1 text-xs text-slate-400 hover:text-slate-200 transition-all"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Options</span>
        </button>
      </div>
    </nav>
  );
};
