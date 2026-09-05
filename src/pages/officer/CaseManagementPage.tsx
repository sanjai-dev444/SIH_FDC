import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronRight, 
  FolderPlus, 
  ShieldCheck, 
  Clock, 
  Send,
  AlertCircle
} from 'lucide-react';
import { CaseRecord } from '../../types';
import { Modal } from '../../components/common/Modal';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface CaseManagementPageProps {
  cases: CaseRecord[];
  onAddCase?: (newCase: CaseRecord) => void;
  onDispatchCaseToLab?: (caseItem: CaseRecord) => void;
}

export const CaseManagementPage: React.FC<CaseManagementPageProps> = ({
  cases,
  onAddCase,
  onDispatchCaseToLab,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [newNote, setNewNote] = useState('');
  const [caseNotes, setCaseNotes] = useState<Record<string, string[]>>({
    'CASE-2026-0891': ['Suspect intercepted at CMBT Koyambedu parcel counter.', 'Sample sealed under Section 52A NDPS Act by SI K. Murugan.'],
  });

  const filteredCases = cases.filter((c) => {
    const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchQuery = 
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryDrug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.incidentType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCase) return;
    triggerHapticTap();
    setCaseNotes({
      ...caseNotes,
      [selectedCase.id]: [...(caseNotes[selectedCase.id] || []), newNote.trim()]
    });
    setNewNote('');
    triggerHapticSuccess();
  };

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">NDPS Case Management</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">{filteredCases.length} Cases</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search TN case #, drug, or incident type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-tactical-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto hide-scrollbar py-1">
          {[
            { key: 'ALL', label: 'All Cases' },
            { key: 'ACTIVE_INVESTIGATION', label: 'Active' },
            { key: 'PENDING_LAB_CONFIRM', label: 'Pending FSD' },
            { key: 'DIVERTED_TO_REHAB', label: 'De-Addiction' },
            { key: 'CLOSED_ADJUDICATED', label: 'Adjudicated' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                triggerHapticTap();
                setFilterStatus(f.key);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 ${
                filterStatus === f.key
                  ? 'bg-amber-500 text-tactical-950 font-bold glow-amber'
                  : 'bg-tactical-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case Folders List */}
      <div className="space-y-2.5">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              triggerHapticTap();
              setSelectedCase(c);
            }}
            className="bg-tactical-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">{c.caseNumber}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                c.status === 'ACTIVE_INVESTIGATION'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : c.status === 'PENDING_LAB_CONFIRM'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : c.status === 'DIVERTED_TO_REHAB'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-300'
              }`}>
                {c.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-white">{c.incidentType}</div>
              <div className="text-xs text-rose-400 font-mono mt-0.5 font-semibold">
                {c.primaryDrug}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
              <span className="truncate max-w-[200px]">{c.location}</span>
              <span>{c.evidenceCount} Evidence Packets</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Case Modal */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`Case File: ${selectedCase.caseNumber}`}
          subtitle={selectedCase.incidentType}
        >
          <div className="space-y-4">
            <div className="bg-tactical-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">PRIMARY SEIZED SUBSTANCE:</span>
                <span className="text-rose-400 font-bold">{selectedCase.primaryDrug}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">INVESTIGATING OFFICER:</span>
                <span className="text-white">{selectedCase.officerBadge}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">SEIZURE LOCATION:</span>
                <span className="text-slate-200">{selectedCase.location}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">TIMESTAMP:</span>
                <span className="text-slate-200">{selectedCase.date}</span>
              </div>
            </div>

            {/* Notes Thread */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                NDPS CASE DIARY ENTRIES & NOTES
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                {(caseNotes[selectedCase.id] || []).length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono italic">No supplemental case diary notes added yet.</p>
                ) : (
                  (caseNotes[selectedCase.id] || []).map((note, idx) => (
                    <div key={idx} className="bg-tactical-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
                      • {note}
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Input */}
              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add case diary entry / recovery remark..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-tactical-950 font-bold rounded-lg text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Lab Dispatch Action */}
            {onDispatchCaseToLab && (
              <button
                onClick={() => {
                  onDispatchCaseToLab(selectedCase);
                  setSelectedCase(null);
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-tactical-950 font-mono text-xs font-bold transition-colors"
              >
                DISPATCH TO FORENSIC SCIENCES DEPT (FSD) CHENNAI
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
