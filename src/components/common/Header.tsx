import React from 'react';
import { Shield, Radio, Battery, Wifi, LogOut, Bot, MapPin } from 'lucide-react';
import { AppMode } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface HeaderProps {
  mode: AppMode;
  onLogout: () => void;
  onSwitchMode?: (newMode: AppMode) => void;
  deviceBattery?: number;
  isBleConnected?: boolean;
  onOpenAIAssistant?: () => void;
  currentCity?: string;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onLogout,
  deviceBattery = 88,
  isBleConnected = true,
  onOpenAIAssistant,
  currentCity = 'Coimbatore',
}) => {
  const isOfficer = mode === 'officer';

  return (
    <header className="flex-shrink-0 bg-tactical-900/90 backdrop-blur-md border-b border-slate-800 pt-safe px-4 pb-3 select-none">
      <div className="flex items-center justify-between">
        {/* Left: Emblem & System Title */}
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm ${
            isOfficer 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-700 text-tactical-950 glow-cyan' 
              : 'bg-gradient-to-br from-rose-500 to-amber-600 text-white glow-rose'
          }`}>
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black tracking-wide text-white">
                {isOfficer ? 'TN POLICE' : 'COMMUNITY CARE'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700 flex items-center space-x-0.5">
                <MapPin className="w-2.5 h-2.5 inline text-rose-400" />
                <span>{currentCity}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight">
              {isOfficer ? 'Colorimetric & Electrical Field Screening' : 'Tamil Nadu 108 Safety & Helplines'}
            </p>
          </div>
        </div>

        {/* Right: AI Assistant & Hardware / Emergency Badges */}
        <div className="flex items-center space-x-2">
          {/* AI Helpline / Assistant Trigger Button */}
          {onOpenAIAssistant && (
            <button
              onClick={() => {
                triggerHapticTap();
                onOpenAIAssistant();
              }}
              className={`flex items-center space-x-1 text-[11px] font-mono px-2.5 py-1 rounded-full border shadow transition-all active:scale-95 ${
                isOfficer
                  ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300 hover:bg-cyan-900 glow-cyan'
                  : 'bg-teal-950/80 border-teal-700 text-teal-300 hover:bg-teal-900 shadow'
              }`}
              title="Open AI Assistant"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="font-bold">AI HELP</span>
            </button>
          )}

          {isOfficer ? (
            <>
              {/* Hardware Sensor status badge */}
              <div 
                title="Colorimetry Hardware Connected"
                className="flex items-center space-x-1 text-[11px] font-mono px-2 py-1 rounded-full border bg-emerald-950/70 border-emerald-700/50 text-emerald-400"
              >
                <Radio className="w-3 h-3" />
                <span className="hidden sm:inline">SENSOR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              {/* Battery */}
              <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-300 bg-slate-800/60 px-2 py-1 rounded-full border border-slate-700/50">
                <Battery className="w-3.5 h-3.5 text-cyan-400" />
                <span>{deviceBattery}%</span>
              </div>
            </>
          ) : (
            /* Civilian 108 Emergency shortcut */
            <a
              href="tel:108"
              onClick={() => triggerHapticTap()}
              className="flex items-center space-x-1 text-[11px] font-mono text-rose-300 bg-rose-950/70 border border-rose-700/60 px-2.5 py-1 rounded-full animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping mr-0.5"></span>
              <span className="font-bold">108</span>
            </a>
          )}

          {/* Mode switch or Logout */}
          <button
            onClick={() => {
              triggerHapticTap();
              onLogout();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Exit / Switch Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
