import React, { useState } from 'react';
import { ShieldCheck, Barcode, Hash, Copy, Check, Lock } from 'lucide-react';
import { Modal } from '../common/Modal';
import { ChainOfCustody } from '../../types';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface ChainOfCustodyModalProps {
  isOpen: boolean;
  onClose: () => void;
  custody: ChainOfCustody;
  caseNumber?: string;
}

export const ChainOfCustodyModal: React.FC<ChainOfCustodyModalProps> = ({
  isOpen,
  onClose,
  custody,
  caseNumber = 'TN-PEW-2026-CR-0891',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    triggerHapticTap();
    navigator.clipboard.writeText(custody.signatureHash);
    setCopied(true);
    triggerHapticSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chain of Custody Verification"
      subtitle={`Tamper-evident evidence certificate for ${caseNumber}`}
    >
      <div className="space-y-4">
        {/* Physical Evidence Bag Badge */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              NDPS SEC 52A EVIDENCE SLEEVE
            </span>
            <div className="text-base font-black font-mono text-cyan-400">{custody.evidenceBagNumber}</div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Tamper-Indicator Tape Intact (TN Police Seal)</span>
            </div>
          </div>
          <div className="text-right">
            <Barcode className="w-16 h-10 text-slate-300 ml-auto" />
            <span className="text-[9px] font-mono text-slate-500">NDPS-ACT-1985</span>
          </div>
        </div>

        {/* Seal metadata */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-tactical-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">SEALING INVESTIGATING OFFICER</span>
            <span className="text-slate-200 font-bold">{custody.sealedBy}</span>
          </div>
          <div className="bg-tactical-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">TIMESTAMP (IST)</span>
            <span className="text-slate-200 font-bold">{custody.sealedAt}</span>
          </div>
        </div>

        {/* Cryptographic SHA-256 Hash */}
        <div className="bg-tactical-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
              <Hash className="w-3.5 h-3.5" />
              <span>SHA-256 DIGITAL INTEGRITY HASH</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="flex items-center space-x-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-tactical-900 p-2.5 rounded font-mono text-[11px] text-slate-300 break-all border border-slate-800/80 select-all">
            {custody.signatureHash}
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Immutable hash logged to Forensic Sciences Department (FSD) Tamil Nadu registry. Admissible before Special NDPS Courts.
          </p>
        </div>

        {/* Notes */}
        {custody.notes && (
          <div className="text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-slate-300">
            <span className="text-slate-500 font-mono text-[10px] block mb-1">FIELD HANDLING REMARKS:</span>
            {custody.notes}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-tactical-950 font-bold py-2.5 rounded-xl text-xs font-mono transition-colors"
        >
          CONFIRM & CLOSE AUDIT WINDOW
        </button>
      </div>
    </Modal>
  );
};
