import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  EyeOff, 
  Lock, 
  Fingerprint, 
  LogOut, 
  RotateCcw,
  Smartphone,
  ShieldAlert
} from 'lucide-react';
import { AppMode } from '../../types';
import { clearAllStorage } from '../../services/native/storageService';
import { triggerHapticCritical, triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface PrivacySettingsPageProps {
  onSwitchMode: (mode: AppMode) => void;
  onActivateStealth: () => void;
}

export const PrivacySettingsPage: React.FC<PrivacySettingsPageProps> = ({
  onSwitchMode,
  onActivateStealth,
}) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleWipeData = async () => {
    triggerHapticTap();
    if (confirm('Permanently purge all local temporary data, tips, and preferences from this device?')) {
      await clearAllStorage();
      triggerHapticCritical();
      alert('Local storage completely erased.');
    }
  };

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="w-5 h-5 text-teal-400" />
        <h2 className="text-base font-bold text-white tracking-wide">Privacy & Stealth Controls</h2>
      </div>

      {/* Stealth Mode / Panic Disguise */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-teal-400 font-mono text-xs font-bold">
          <EyeOff className="w-4 h-4" />
          <span>RAPID PANIC STEALTH DISGUISE</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Instantly replaces the harm reduction interface with a harmless, functional standard calculator. Use if you need to conceal the app immediately.
        </p>

        <button
          onClick={() => {
            triggerHapticTap();
            onActivateStealth();
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 transition-colors"
        >
          <Smartphone className="w-4 h-4" />
          <span>ACTIVATE CALCULATOR DISGUISE</span>
        </button>
      </div>

      {/* Local Storage Wipe */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold">
          <Trash2 className="w-4 h-4" />
          <span>ZERO-TRACE DATA SANITIZATION</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Erase all locally stored cached test results, tip logs, and application preferences from this device's memory.
        </p>

        <button
          onClick={handleWipeData}
          className="w-full py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>PURGE ALL LOCAL DEVICE CACHE</span>
        </button>
      </div>

      {/* Biometric Lock */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white">Biometric Fingerprint / Face Lock</div>
          <div className="text-[10px] text-slate-400 font-mono">Require auth when reopening from background</div>
        </div>
        <button
          onClick={() => {
            triggerHapticTap();
            setBiometricsEnabled(!biometricsEnabled);
          }}
          className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
            biometricsEnabled ? 'bg-teal-500' : 'bg-slate-700'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
            biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Switch to Officer Mode */}
      <div className="pt-2">
        <button
          onClick={() => {
            triggerHapticTap();
            onSwitchMode('splash');
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center space-x-2 border border-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Return to Portal Selection / Officer Login</span>
        </button>
      </div>
    </div>
  );
};
