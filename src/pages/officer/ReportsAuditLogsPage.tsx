import React, { useState } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Download, 
  Hash, 
  Printer, 
  CheckCircle2, 
  Filter, 
  FileCheck 
} from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface ReportsAuditLogsPageProps {
  logs: AuditLogEntry[];
}

export const ReportsAuditLogsPage: React.FC<ReportsAuditLogsPageProps> = ({ logs }) => {
  const [filterClass, setFilterClass] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    if (filterClass === 'ALL') return true;
    return l.cjisClass === filterClass;
  });

  const handleExportCSV = () => {
    triggerHapticTap();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Timestamp,Action,PerformedBy,Details,Hash,Classification\n"
      + filteredLogs.map(e => `"${e.id}","${e.timestamp}","${e.action}","${e.performedBy}","${e.details}","${e.hash}","${e.cjisClass}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TN_POLICE_NDPS_AUDIT_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerHapticSuccess();
  };

  const handlePrintReport = () => {
    triggerHapticTap();
    window.print();
  };

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Audit Trail & NDPS Logs</h2>
        </div>
        <div className="flex space-x-1.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 bg-tactical-900 border border-slate-700 hover:border-slate-500 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-mono"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center space-x-1 bg-cyan-500 hover:bg-cyan-400 text-tactical-950 font-bold px-2.5 py-1.5 rounded-lg text-xs font-mono glow-cyan"
            title="Print Court PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-tactical-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono space-y-1">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>TAMIL NADU POLICE & NDPS ACT SEC 52A CRYPTOGRAPHIC INTEGRITY</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Seizure records are hashed locally and stored with SHA-256 chain verification for production before Judicial Magistrates.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex space-x-1.5 overflow-x-auto hide-scrollbar">
        {[
          { id: 'ALL', label: 'All Logs' },
          { id: 'LAW_ENFORCEMENT_SENSITIVE', label: 'Police Sensitive' },
          { id: 'UNCLASSIFIED_FOUO', label: 'Official Use' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              triggerHapticTap();
              setFilterClass(f.id);
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 ${
              filterClass === f.id
                ? 'bg-cyan-500 text-tactical-950 font-bold glow-cyan'
                : 'bg-tactical-900 text-slate-400 border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="space-y-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-tactical-900 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 font-bold">{log.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {log.action}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">{log.timestamp}</span>
            </div>

            <p className="text-xs text-slate-200 leading-snug">{log.details}</p>

            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="truncate max-w-[180px]">Officer: {log.performedBy}</span>
              <div className="flex items-center space-x-1 text-slate-500">
                <Hash className="w-3 h-3 text-cyan-500" />
                <span className="truncate max-w-[120px]">{log.hash.slice(0, 16)}...</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
