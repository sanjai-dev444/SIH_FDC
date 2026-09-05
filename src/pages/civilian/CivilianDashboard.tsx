import React from 'react';
import { 
  Heart, 
  AlertOctagon, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  FileEdit, 
  ArrowUpRight, 
  AlertTriangle,
  Compass,
  LifeBuoy
} from 'lucide-react';
import { CivilianTab, SafetyResource } from '../../types';
import { triggerHapticCritical, triggerHapticTap } from '../../services/native/hapticsService';

interface CivilianDashboardProps {
  onNavigate: (tab: CivilianTab) => void;
  resources: SafetyResource[];
}

export const CivilianDashboard: React.FC<CivilianDashboardProps> = ({
  onNavigate,
  resources,
}) => {
  const nearbyNaloxone = resources.filter(r => r.type === 'NARCAN_BOX')[0];

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* High-Visibility Emergency 108 SOS Banner */}
      <div 
        onClick={() => {
          triggerHapticCritical();
          onNavigate('sos');
        }}
        className="bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-2xl p-4 shadow-xl glow-rose cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full bg-white text-rose-600 flex items-center justify-center font-black flex-shrink-0 animate-pulse">
            <AlertOctagon className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-rose-200 font-black">
              EMERGENCY OVERDOSE BEACON
            </div>
            <div className="text-lg font-black tracking-tight">🆘 108 AMBULANCE OVERDOSE SOS</div>
            <p className="text-xs text-rose-100">1-Tap 108 • Tamil Nadu Naloxone Locator • First Aid</p>
          </div>
        </div>
        <ArrowUpRight className="w-6 h-6 text-rose-200" />
      </div>

      {/* Tamil Nadu Public Health Safety Alert */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-3.5 flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-amber-950 text-amber-400 mt-0.5 flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase">
              TAMIL NADU HEALTH ADVISORY
            </span>
            <span className="text-[10px] font-mono bg-amber-600 text-black font-black px-1.5 py-0.2 rounded">
              ALERT
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
            Potent adulterated synthetic mixtures detected around transit corridors. In case of suspected overdose or unconsciousness, dial <strong className="text-amber-300">108</strong> immediately. Good Samaritan protections apply.
          </p>
        </div>
      </div>

      {/* 4 Core Harm Reduction Services */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            CONFIDENTIAL CARE SERVICES
          </span>
          <span className="text-[10px] font-mono text-teal-400">100% PRIVATE</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Test Strip Scanner */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('selfcheck');
            }}
            className="flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-teal-500/60 p-3.5 rounded-xl text-left active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center font-bold border border-teal-800/60 mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">TEST STRIP GUIDE</div>
              <div className="text-[10px] text-teal-300 font-mono">Fentanyl & Tranq Check</div>
            </div>
          </button>

          {/* Card 2: Safety Map & Narcan */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('safetymap');
            }}
            className="flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-teal-500/60 p-3.5 rounded-xl text-left active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center font-bold border border-slate-700 mb-2">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">SAFETY MAP</div>
              <div className="text-[10px] text-slate-400 font-mono">108 Kiosks & Clinics</div>
            </div>
          </button>

          {/* Card 3: Anonymous Tip Line */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('report');
            }}
            className="flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-teal-500/60 p-3.5 rounded-xl text-left active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold border border-slate-700 mb-2">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">REPORT CONTAMINATION</div>
              <div className="text-[10px] text-slate-400 font-mono">Zero-Trace Local Tip</div>
            </div>
          </button>

          {/* Card 4: 24/7 Helpline Directory */}
          <button
            onClick={() => {
              triggerHapticTap();
              onNavigate('directory');
            }}
            className="flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-teal-500/60 p-3.5 rounded-xl text-left active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-purple-400 flex items-center justify-center font-bold border border-slate-700 mb-2">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">TN HELPLINES</div>
              <div className="text-[10px] text-purple-300 font-mono">10581 • 14446 • 108</div>
            </div>
          </button>
        </div>
      </div>

      {/* Nearest Free Naloxone / 108 Post Card */}
      {nearbyNaloxone && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-teal-400 font-bold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>NEAREST EMERGENCY POINT</span>
            </span>
            <span className="text-slate-400 font-bold">{nearbyNaloxone.distanceMiles} miles away</span>
          </div>

          <div>
            <div className="text-sm font-bold text-white">{nearbyNaloxone.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{nearbyNaloxone.address}</div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs font-mono">
            <span className="text-emerald-400 font-semibold">Available: 24/7 Ambulance Post</span>
            <button
              onClick={() => {
                triggerHapticTap();
                onNavigate('safetymap');
              }}
              className="text-teal-400 hover:text-teal-300 flex items-center space-x-1"
            >
              <span>Get Directions</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
