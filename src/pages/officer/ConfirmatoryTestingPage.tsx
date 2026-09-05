import React, { useState } from 'react';
import { 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  Truck, 
  FileCheck, 
  Plus, 
  Barcode, 
  ArrowRight 
} from 'lucide-react';
import { LabDispatch } from '../../types';
import { Modal } from '../../components/common/Modal';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface ConfirmatoryTestingPageProps {
  dispatches: LabDispatch[];
  onAddNewDispatch: (newDispatch: LabDispatch) => void;
}

export const ConfirmatoryTestingPage: React.FC<ConfirmatoryTestingPageProps> = ({
  dispatches,
  onAddNewDispatch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseNumber, setCaseNumber] = useState('TN-PEW-2026-CR-0895');
  const [labName, setLabName] = useState('Forensic Sciences Department (FSD), Mylapore, Chennai');
  const [testType, setTestType] = useState<'GC-MS' | 'LC-MS/MS'>('GC-MS');

  const handleCreateDispatch = () => {
    triggerHapticTap();
    const newDispatch: LabDispatch = {
      id: `LAB-TN-${Math.floor(9000 + Math.random() * 1000)}`,
      caseId: `CASE-${caseNumber}`,
      caseNumber,
      labName,
      testType,
      trackingNo: `TN-FSD-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
      dispatchedDate: new Date().toISOString().split('T')[0],
      estTurnaroundDays: 4,
      status: 'DISPATCHED',
    };
    onAddNewDispatch(newDispatch);
    setIsModalOpen(false);
    triggerHapticSuccess();
  };

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">FSD Confirmatory Lab Testing</h2>
        </div>
        <button
          onClick={() => {
            triggerHapticTap();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-tactical-950 font-bold px-3 py-1.5 rounded-lg text-xs font-mono transition-colors glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Sample</span>
        </button>
      </div>

      <div className="bg-tactical-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono flex items-center space-x-2">
        <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>Court-mandated GC-MS / LC-MS confirmatory tests for Special NDPS Court prosecution.</span>
      </div>

      {/* Dispatches List */}
      <div className="space-y-3">
        {dispatches.map((disp) => {
          const isCertified = disp.status === 'CERTIFIED';
          const isAnalysis = disp.status === 'IN_ANALYSIS';

          return (
            <div
              key={disp.id}
              className="bg-tactical-900 border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{disp.id}</span>
                  <span className="text-xs text-slate-400 ml-2 font-mono">Case: {disp.caseNumber}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black ${
                  isCertified 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                    : isAnalysis 
                      ? 'bg-amber-950 text-amber-300 border border-amber-700' 
                      : 'bg-slate-800 text-slate-300'
                }`}>
                  {disp.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-mono">
                <div className={`p-1 rounded ${disp.status ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-500'}`}>
                  Dispatched
                </div>
                <div className={`p-1 rounded ${['RECEIVED', 'IN_ANALYSIS', 'CERTIFIED'].includes(disp.status) ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-500'}`}>
                  Received
                </div>
                <div className={`p-1 rounded ${['IN_ANALYSIS', 'CERTIFIED'].includes(disp.status) ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-500'}`}>
                  In Analysis
                </div>
                <div className={`p-1 rounded ${isCertified ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-500'}`}>
                  Certified
                </div>
              </div>

              {/* Certified result banner */}
              {isCertified && (
                <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-lg p-2.5 text-xs font-mono space-y-1">
                  <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                    <FileCheck className="w-4 h-4" />
                    <span>FSD FORENSIC TOXICOLOGY CERTIFICATE:</span>
                  </div>
                  <div className="text-white font-bold">{disp.certifiedSubstance}</div>
                  <div className="text-[11px] text-slate-300">Purity: {disp.purityPercent}% • GC-MS retention time validated</div>
                </div>
              )}

              <div className="text-xs font-mono text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Forensic Lab:</span>
                  <span className="text-slate-200">{disp.labName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method / Dispatch No:</span>
                  <span className="text-slate-200">{disp.testType} • {disp.trackingNo}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dispatch Evidence to FSD Lab"
        subtitle="Generate NDPS Form 4 Manifest"
      >
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Target NDPS Case Number</label>
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Tamil Nadu Forensic Lab</label>
            <select
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
            >
              <option value="Forensic Sciences Department (FSD), Mylapore, Chennai">Forensic Sciences Dept (FSD), Chennai</option>
              <option value="Regional Forensic Science Laboratory (RFSL), Coimbatore">RFSL Coimbatore</option>
              <option value="Regional Forensic Science Laboratory (RFSL), Madurai">RFSL Madurai</option>
              <option value="Regional Forensic Science Laboratory (RFSL), Tiruchirappalli">RFSL Tiruchirappalli</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Analytical Technique</label>
            <div className="grid grid-cols-2 gap-2">
              {(['GC-MS', 'LC-MS/MS'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTestType(m)}
                  className={`py-2 rounded-lg font-mono text-xs font-bold border ${
                    testType === m
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                      : 'bg-tactical-950 text-slate-400 border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateDispatch}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-tactical-950 font-bold text-xs font-mono transition-colors glow-cyan mt-2"
          >
            GENERATE FSD DISPATCH MANIFEST & COURIER SEAL
          </button>
        </div>
      </Modal>
    </div>
  );
};
