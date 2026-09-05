import React, { useState } from 'react';
import { HeartHandshake, UserCheck, AlertCircle, Plus, CheckCircle, Clock } from 'lucide-react';
import { RehabCase } from '../../types';
import { Modal } from '../../components/common/Modal';
import { triggerHapticTap, triggerHapticSuccess } from '../../services/native/hapticsService';

interface RehabTrackingPageProps {
  rehabCases: RehabCase[];
  onAddRehabCase?: (newCase: RehabCase) => void;
}

export const RehabTrackingPage: React.FC<RehabTrackingPageProps> = ({
  rehabCases,
  onAddRehabCase,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectInitials, setSubjectInitials] = useState('K. B. (Case #TN-0896)');
  const [programType, setProgramType] = useState<RehabCase['programType']>('LEAD_DIVERSION');
  const [assignedCounselor, setAssignedCounselor] = useState('Dr. S. Kanimozhi, MSW (RGGGH Chennai)');
  const [substanceType, setSubstanceType] = useState('Synthetic Opioids');

  const handleCreateReferral = () => {
    triggerHapticTap();
    const newCase: RehabCase = {
      id: `REHAB-TN-${Math.floor(300 + Math.random() * 700)}`,
      subjectInitials,
      programType,
      status: 'ACTIVE_COMPLIANT',
      compliancePercent: 100,
      assignedCounselor,
      lastContact: 'Just now (Intake Registered)',
      substanceType,
    };
    if (onAddRehabCase) onAddRehabCase(newCase);
    setIsModalOpen(false);
    triggerHapticSuccess();
  };

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white tracking-wide">De-Addiction & NDPS Sec 39 Diversion</h2>
        </div>
        <button
          onClick={() => {
            triggerHapticTap();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-400 text-tactical-950 font-bold px-3 py-1.5 rounded-lg text-xs font-mono transition-colors glow-emerald"
        >
          <Plus className="w-4 h-4" />
          <span>New Referral</span>
        </button>
      </div>

      <div className="bg-tactical-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono">
        Pre-trial diversion under Section 39 / 64A of NDPS Act (1985) & Tamil Nadu Drug-Free Initiative.
      </div>

      {/* Referral Cases List */}
      <div className="space-y-2.5">
        {rehabCases.map((rc) => {
          const isCompliant = rc.status === 'ACTIVE_COMPLIANT' || rc.status === 'COMPLETED';

          return (
            <div
              key={rc.id}
              className="bg-tactical-900 border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{rc.id}</span>
                  <span className="text-sm font-bold text-white ml-2">{rc.subjectInitials}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isCompliant
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {rc.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Compliance Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Treatment Plan Compliance</span>
                  <span className="text-white font-bold">{rc.compliancePercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${rc.compliancePercent}%` }} 
                    className={`h-full rounded-full transition-all ${
                      rc.compliancePercent >= 80 ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Pathway:</span>
                  <span className="text-slate-200">{rc.programType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>De-Addiction Counselor:</span>
                  <span className="text-slate-200">{rc.assignedCounselor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Check-In:</span>
                  <span className="text-slate-200">{rc.lastContact}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Referral Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="De-Addiction Diversion Referral"
        subtitle="Divert first-time / dependent subject to medical care"
      >
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Subject Anonymized Identifier</label>
            <input
              type="text"
              value={subjectInitials}
              onChange={(e) => setSubjectInitials(e.target.value)}
              className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">De-Addiction Pathway</label>
            <select
              value={programType}
              onChange={(e) => setProgramType(e.target.value as RehabCase['programType'])}
              className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
            >
              <option value="LEAD_DIVERSION">Tamil Nadu Police De-Addiction Diversion</option>
              <option value="COUNTY_DRUG_COURT">Special NDPS Court Section 39 Treatment Order</option>
              <option value="HARM_REDUCTION_DETOX">RGGGH / Govt Medical College Voluntary Detox</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Substance Identified</label>
            <input
              type="text"
              value={substanceType}
              onChange={(e) => setSubstanceType(e.target.value)}
              className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <button
            onClick={handleCreateReferral}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-tactical-950 font-bold text-xs font-mono transition-colors glow-emerald mt-2"
          >
            DISPATCH REFERRAL TO TAMIL NADU DE-ADDICTION UNIT
          </button>
        </div>
      </Modal>
    </div>
  );
};
