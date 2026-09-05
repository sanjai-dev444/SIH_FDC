import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Wifi, 
  Radio, 
  Lock, 
  Clock, 
  LogOut, 
  Check, 
  Smartphone,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';
import { AppMode } from '../../types';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface OfficerProfilePageProps {
  onLogout: () => void;
  onSwitchMode: (mode: AppMode) => void;
}

export const OfficerProfilePage: React.FC<OfficerProfilePageProps> = ({
  onLogout,
  onSwitchMode,
}) => {
  const [offlineSync, setOfflineSync] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(30);

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center space-x-2">
        <User className="w-5 h-5 text-cyan-400" />
        <h2 className="text-base font-bold text-white tracking-wide">Officer Profile & Tamil Nadu CCTNS</h2>
      </div>

      {/* Officer Credential Card */}
      <div className="bg-tactical-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-tactical-950 font-black text-lg glow-cyan">
            KM
          </div>
          <div>
            <div className="text-base font-bold text-white">SI K. Murugan</div>
            <div className="text-xs font-mono text-cyan-400 font-bold">GENERAL NO: #TN-4812</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Prohibition & Enforcement Wing (PEW), Greater Chennai Police
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
          <div className="bg-tactical-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">CCTNS / NDPS CLEARANCE</span>
            <span className="text-emerald-400 font-bold">AUTHORIZED IO LEVEL-2</span>
          </div>
          <div className="bg-tactical-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">SPECTROMETER LINK</span>
            <span className="text-cyan-400 font-bold">FSD-SPEC-7749-TN</span>
          </div>
        </div>
      </div>

      {/* Security & Sync Preferences */}
      <div className="bg-tactical-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">
          SECURITY SETTINGS & OFFLINE VAULT
        </h3>

        {/* Offline Sync */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Offline Evidence Vault</div>
            <div className="text-[10px] text-slate-400 font-mono">Store records locally when cell network is unreachable</div>
          </div>
          <button
            onClick={() => {
              triggerHapticTap();
              setOfflineSync(!offlineSync);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
              offlineSync ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-tactical-950 transition-transform ${
              offlineSync ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Auto Lock Timeout */}
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-xs font-bold text-white">Inactivity Security Lock</div>
            <div className="text-[10px] text-slate-400 font-mono">Require PIN / Biometric re-authentication</div>
          </div>
          <select
            value={timeoutMinutes}
            onChange={(e) => {
              triggerHapticTap();
              setTimeoutMinutes(Number(e.target.value));
            }}
            className="bg-tactical-950 border border-slate-700 text-xs font-mono text-cyan-300 rounded px-2 py-1"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </select>
        </div>
      </div>

      {/* Switch Mode & Logout */}
      <div className="space-y-2">
        <button
          onClick={() => {
            triggerHapticTap();
            onSwitchMode('civilian');
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center space-x-2 border border-slate-700 transition-colors"
        >
          <HeartHandshake className="w-4 h-4 text-teal-400" />
          <span>Switch to Civilian Harm Reduction Mode</span>
        </button>

        <button
          onClick={() => {
            triggerHapticSuccess();
            onLogout();
          }}
          className="w-full py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>SECURE LOGOUT & CLOSE SESSION</span>
        </button>
      </div>
    </div>
  );
};
