import React from 'react';
import { 
  X, 
  Heart, 
  ShieldCheck, 
  AlertOctagon, 
  Compass, 
  LifeBuoy, 
  FileText, 
  Lock, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { CivilianTab } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface CivilianDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: CivilianTab;
  onSelectTab: (tab: CivilianTab) => void;
  onReturnToSplash: () => void;
}

export const CivilianDrawer: React.FC<CivilianDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onReturnToSplash,
}) => {
  if (!isOpen) return null;

  const items: { tab: CivilianTab; label: string; icon: React.ElementType; tag?: string; accent?: string }[] = [
    { tab: 'home', label: 'Harm Reduction Hub', icon: Heart },
    { tab: 'selfcheck', label: 'Personal Self-Check & Strips', icon: ShieldCheck },
    { tab: 'report', label: 'Report Suspicious Activity', icon: FileText },
    { tab: 'sos', label: '🆘 SOS Overdose Beacon', icon: AlertOctagon, tag: 'EMERGENCY', accent: 'text-rose-400' },
    { tab: 'safetymap', label: 'Local Safety Map & Narcan', icon: Compass },
    { tab: 'directory', label: 'Rehab / Helpline Directory', icon: LifeBuoy },
    { tab: 'myreports', label: 'My Anonymous Reports', icon: FileText },
    { tab: 'privacy', label: 'Privacy & Stealth Settings', icon: Lock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden z-10 animate-slide-up">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
            COMMUNITY SAFETY MENU
          </span>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                onClick={() => {
                  triggerHapticTap();
                  onSelectTab(item.tab);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors font-mono text-xs ${
                  isActive
                    ? 'bg-teal-950 text-teal-300 border border-teal-700 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${item.accent || (isActive ? 'text-teal-400' : 'text-slate-400')}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.tag && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-600 text-white font-black">
                      {item.tag}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => {
              triggerHapticTap();
              onReturnToSplash();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>SWITCH TO OFFICER LOGIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
