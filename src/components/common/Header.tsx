import React from 'react';
import { Shield, Bot, MapPin, Phone } from 'lucide-react';
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
  onOpenAIAssistant,
  currentCity = 'Coimbatore',
}) => {
  const isOfficer = mode === 'officer';

  return (
    <header className={`flex-shrink-0 pt-safe px-4 pb-3 select-none ${isOfficer ? 'bg-tactical-950' : 'bg-slate-950'}`}>
      <div className="flex items-center justify-between min-h-11">
        <div className="flex items-center min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isOfficer ? 'bg-cyan-500 text-tactical-950' : 'bg-teal-500 text-slate-950'
          }`}>
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="ml-2.5 min-w-0">
            <div className="text-sm font-black tracking-wide text-white leading-tight">
              {isOfficer ? 'TN POLICE' : 'COMMUNITY CARE'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 leading-tight mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{currentCity} · {isOfficer ? 'Field Screening' : 'Safety & Helplines'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
          {onOpenAIAssistant && (
            <button
              onClick={() => {
                triggerHapticTap();
                onOpenAIAssistant();
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                isOfficer
                  ? 'bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900'
                  : 'bg-teal-950/60 border-teal-800 text-teal-300 hover:bg-teal-900'
              }`}
              title="Open AI Assistant"
              aria-label="Open AI Assistant"
            >
              <Bot className="w-4.5 h-4.5" />
            </button>
          )}

          {!isOfficer && (
            <a
              href="tel:108"
              onClick={() => triggerHapticTap()}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-950/70 border border-rose-800 text-rose-300"
              title="Call 108 emergency ambulance"
              aria-label="Call 108 emergency ambulance"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
