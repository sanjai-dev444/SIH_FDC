import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  UserCheck, 
  Fingerprint, 
  HeartHandshake, 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AppMode } from '../../types';
import { triggerHapticCritical, triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface SplashLoginScreenProps {
  onSelectMode: (mode: AppMode) => void;
}

export const SplashLoginScreen: React.FC<SplashLoginScreenProps> = ({ onSelectMode }) => {
  const [badgeId, setBadgeId] = useState('TN-4812');
  const [pin, setPin] = useState('8821');
  const [loginError, setLoginError] = useState('');

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticTap();
    if (badgeId.trim() && pin.trim()) {
      triggerHapticSuccess();
      onSelectMode('officer');
    } else {
      setLoginError('Enter valid TN Police Badge ID and PIN.');
    }
  };

  const handleQuickDemo = () => {
    triggerHapticSuccess();
    onSelectMode('officer');
  };

  const handleCivilianEntry = () => {
    triggerHapticTap();
    onSelectMode('civilian');
  };

  return (
    <div className="min-h-full w-full bg-tactical-950 text-slate-100 flex flex-col justify-between p-6 pt-safe pb-safe select-none overflow-y-auto custom-scrollbar">
      {/* Brand Header */}
      <div className="text-center space-y-3 pt-4 animate-fade-in">
        <div className="relative w-20 h-20 mx-auto">
          {/* Glowing ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-500 blur-md opacity-70 animate-pulse"></div>
          <div className="relative w-full h-full bg-tactical-900 border border-cyan-500/50 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl">
            <Shield className="w-11 h-11 stroke-[2.5]" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-black tracking-wider text-white uppercase">
            DIGITAL FIELD DRUG SCREENING COMPANION
          </h1>
          <p className="text-xs font-mono tracking-wide text-cyan-400 font-bold mt-1">
            போதைப்பொருள் களத் தடுப்பு மற்றும் பரிசோதனைத் தளம்
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 leading-tight">
            Tamil Nadu Law Enforcement Multi-Signal Triage & Community Harm Reduction Portal
          </p>
        </div>
      </div>

      {/* Main Dual Entry Container */}
      <div className="max-w-sm mx-auto w-full space-y-4 my-6 animate-fade-in">
        {/* Officer Login Form */}
        <div className="bg-tactical-900/90 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                OFFICER ACCESS PORTAL
              </span>
            </div>
            <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">
              TN POLICE • NDPS
            </span>
          </div>

          <form onSubmit={handleOfficerLogin} className="space-y-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Badge / General Number (e.g. TN-4812)
              </label>
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                placeholder="e.g. TN-4812"
                className="w-full bg-tactical-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Security PIN / Passcode
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-tactical-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {loginError && (
              <p className="text-[11px] text-rose-400 font-mono">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-tactical-950 font-black text-xs font-mono flex items-center justify-center space-x-2 shadow-lg glow-cyan transition-all active:scale-95"
            >
              <Fingerprint className="w-4 h-4" />
              <span>AUTHENTICATE & ENTER TN HUD</span>
            </button>
          </form>

          {/* Quick Demo Button */}
          <button
            onClick={handleQuickDemo}
            className="w-full py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Demo Officer Login (1-Tap)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-3 text-slate-600 font-mono text-[11px]">
          <div className="flex-1 h-[1px] bg-slate-800" />
          <span>OR</span>
          <div className="flex-1 h-[1px] bg-slate-800" />
        </div>

        {/* Civilian Mode Entry Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-teal-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500 text-teal-400 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">
                CIVILIAN HARM REDUCTION MODE
              </h2>
              <p className="text-[10px] text-teal-300 font-mono">100% Anonymous • 108 Emergency Access</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-snug">
            Free public access to test-strip guides, 108 Ambulance emergency overdose beacon, anonymous batch alerts, and Tamil Nadu de-addiction helplines.
          </p>

          <button
            onClick={handleCivilianEntry}
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs font-mono flex items-center justify-center space-x-2 transition-all active:scale-95 shadow"
          >
            <span>ENTER CIVILIAN CARE MODE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] font-mono text-slate-600 space-y-1">
        <div>TAMIL NADU FIELD MOBILE RUNTIME // 108 & 100 EMERGENCY INTEGRATED</div>
        <div>NDPS Act 1985 Section 52A Protocols & Good Samaritan Life Protections</div>
      </div>
    </div>
  );
};
