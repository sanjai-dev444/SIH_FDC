import React, { useState } from 'react';
import { CheckCircle, Search, ShieldCheck, Download, FileText, ChevronRight } from 'lucide-react';
import { CaseRecord } from '../../types';
import { triggerHapticTap, triggerHapticSuccess } from '../../services/native/hapticsService';

interface ConfirmedCasesPageProps {
  cases: CaseRecord[];
}

export const ConfirmedCasesPage: React.FC<ConfirmedCasesPageProps> = ({ cases }) => {
  const [search, setSearch] = useState('');
  const confirmedList = cases.filter(c => c.status === 'CLOSED_ADJUDICATED' || c.status === 'DIVERTED_TO_REHAB');

  const filtered = confirmedList.filter(c => 
    c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.primaryDrug.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Confirmed NDPS Archive</h2>
        </div>
        <span className="text-xs font-mono text-emerald-400">{filtered.length} Certified</span>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Filter certified NDPS case files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-tactical-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      <div className="space-y-2.5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-tactical-900 border border-slate-800 rounded-xl p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold">{c.caseNumber}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {c.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-white">{c.incidentType}</div>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                Certified: <span className="text-rose-400 font-semibold">{c.primaryDrug}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span className="truncate max-w-[200px]">{c.location}</span>
              <button
                onClick={() => {
                  triggerHapticSuccess();
                  alert(`Exporting official Special NDPS Court evidentiary packet for ${c.caseNumber}`);
                }}
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Court Packet</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
