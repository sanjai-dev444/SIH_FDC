import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  ScanLine, 
  Layers, 
  FileText, 
  FlaskConical, 
  CheckCircle, 
  Map, 
  HeartHandshake, 
  Cpu, 
  FileCheck, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { OfficerTab } from '../../types';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface OfficerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: OfficerTab;
  onSelectTab: (tab: OfficerTab) => void;
  onLogout: () => void;
}

export const OfficerDrawer: React.FC<OfficerDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onLogout,
}) => {
  if (!isOpen) return null;

  const items: { tab: OfficerTab; label: string; icon: React.ElementType; tag?: string }[] = [
    { tab: 'dashboard', label: 'Tactical Dashboard', icon: LayoutDashboard },
    { tab: 'screening', label: 'New Field Screening', icon: ScanLine, tag: 'LIVE' },
    { tab: 'results', label: 'Multi-Signal Results', icon: Layers },
    { tab: 'cases', label: 'Case Management', icon: FileText },
    { tab: 'confirmatory', label: 'Confirmatory Lab Testing', icon: FlaskConical },
    { tab: 'confirmed', label: 'Confirmed Cases Archive', icon: CheckCircle },
    { tab: 'heatmap', label: 'Tactical Drug Heatmap', icon: Map },
    { tab: 'rehab', label: 'Rehab & LEAD Diversion', icon: HeartHandshake },
    { tab: 'device', label: 'Spectrometer Hardware Status', icon: Cpu },
    { tab: 'reports', label: 'Audit Logs & CJIS Reports', icon: FileCheck },
    { tab: 'profile', label: 'Officer Profile & Security', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-tactical-900 border-t sm:border border-slate-700/80 rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden z-10 animate-slide-up">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            OFFICER TACTICAL NAVIGATION
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
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.tag && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500 text-tactical-950 font-black">
                      {item.tag}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => {
              triggerHapticTap();
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT OFFICER HUD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
