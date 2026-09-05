import React from 'react';
import { FileText, ShieldCheck, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { CivilianTip } from '../../types';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface MyReportsPageProps {
  tips: CivilianTip[];
  onClearTips?: () => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({ tips, onClearTips }) => {
  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-bold text-white tracking-wide">My Anonymous Reports</h2>
        </div>
        {tips.length > 0 && onClearTips && (
          <button
            onClick={() => {
              triggerHapticTap();
              if (confirm('Delete local tip history from this phone?')) {
                onClearTips();
                triggerHapticSuccess();
              }
            }}
            className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge</span>
          </button>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 font-mono">
        These records exist only on this device. You can verify whether a reported contamination alert was actioned by street outreach teams.
      </div>

      {tips.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-mono text-xs space-y-2">
          <ShieldCheck className="w-8 h-8 mx-auto text-slate-600" />
          <p>No submitted reports found on this device.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-teal-400 font-bold">{tip.id}</span>
                <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold text-[10px]">
                  {tip.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{tip.incidentType}</h4>
                <p className="text-xs text-slate-300 mt-1">{tip.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                <span>PIN: <strong className="text-white">{tip.anonymousPin}</strong></span>
                <span>{tip.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
