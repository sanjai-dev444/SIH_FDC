import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldAlert, 
  Eye, 
  TestTube, 
  Activity, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { ScreeningRecord, RiskLevel } from '../../types';
import { SpectralChart } from '../../components/officer/SpectralChart';
import { ChainOfCustodyModal } from '../../components/officer/ChainOfCustodyModal';
import { RehabDiversionModal, RehabDiversionData } from '../../components/officer/RehabDiversionModal';
import { triggerHapticTap, triggerHapticSuccess } from '../../services/native/hapticsService';
import { HeartHandshake } from 'lucide-react';

interface MultiSignalResultsPageProps {
  screenings: ScreeningRecord[];
  onDispatchToLab?: (screening: ScreeningRecord) => void;
  onMoveToRehab?: (
    screening: ScreeningRecord,
    facility: string,
    pathway: 'LEAD_DIVERSION' | 'COUNTY_DRUG_COURT' | 'HARM_REDUCTION_DETOX',
    counselor: string,
    requestAmbulance: boolean
  ) => void;
}

export const MultiSignalResultsPage: React.FC<MultiSignalResultsPageProps> = ({
  screenings,
  onDispatchToLab,
  onMoveToRehab,
}) => {
  const [filterRisk, setFilterRisk] = useState<'ALL' | RiskLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScreening, setSelectedScreening] = useState<ScreeningRecord | null>(null);
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  const [isRehabModalOpen, setIsRehabModalOpen] = useState(false);

  const filtered = screenings.filter((s) => {
    const matchesRisk = filterRisk === 'ALL' || s.riskLevel === filterRisk;
    const matchesQuery = 
      s.primarySubstance.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesQuery;
  });

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      {/* Header & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">Multi-Signal Field Results</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">{filtered.length} Recorded</span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search substance, record ID, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-tactical-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Risk Level Filter Chips */}
        <div className="flex space-x-1.5 overflow-x-auto hide-scrollbar py-1">
          {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                triggerHapticTap();
                setFilterRisk(r);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 ${
                filterRisk === r
                  ? 'bg-cyan-500 text-tactical-950 font-bold glow-cyan'
                  : 'bg-tactical-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Screenings List */}
      <div className="space-y-2.5">
        {filtered.map((sc) => (
          <div
            key={sc.id}
            onClick={() => {
              triggerHapticTap();
              setSelectedScreening(sc);
            }}
            className="bg-tactical-900 border border-slate-800 hover:border-cyan-600/50 rounded-xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black ${
                  sc.riskLevel === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : sc.riskLevel === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300'
                }`}>
                  {sc.riskLevel}
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{sc.id}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{sc.timestamp}</span>
            </div>

            <div>
              <div className="text-sm font-black text-white">{sc.primarySubstance}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Class: {sc.substanceClass} • Fused Confidence: <span className="text-cyan-300 font-bold">{sc.confidence}%</span>
              </div>
            </div>

            {/* Signal Micro Indicators */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono">
              <div className="bg-tactical-950 p-1.5 rounded border border-slate-800 text-slate-300 truncate">
                Pupil: {sc.pupillometry.diameterMm}mm
              </div>
              <div className="bg-tactical-950 p-1.5 rounded border border-slate-800 text-slate-300 truncate">
                Strip: {sc.lateralFlow.fentanylStrip === 'POSITIVE' ? 'Fent+' : 'Fent-'}
              </div>
              <div className="bg-tactical-950 p-1.5 rounded border border-slate-800 text-slate-300 truncate">
                FTIR: {sc.spectroscopy.matchScore}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Inspection Bottom Sheet Modal */}
      {selectedScreening && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-tactical-900 border-t sm:border border-slate-700 rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedScreening.id}</span>
                <h3 className="text-sm font-bold text-white">{selectedScreening.primarySubstance}</h3>
              </div>
              <button
                onClick={() => setSelectedScreening(null)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
              {/* Spectral Chart */}
              <SpectralChart
                matchScore={selectedScreening.confidence}
                substanceName={selectedScreening.primarySubstance}
                peakWavelength={selectedScreening.spectroscopy.peakWavelength}
              />

              {/* Multi-Signal Breakdown */}
              <div className="bg-tactical-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                  SENSOR BREAKDOWN
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Pupillometry:</span>
                    <span className="text-cyan-300">{selectedScreening.pupillometry.constrictionScore}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Fentanyl Strip:</span>
                    <span className={selectedScreening.lateralFlow.fentanylStrip === 'POSITIVE' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {selectedScreening.lateralFlow.fentanylStrip}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Xylazine Strip:</span>
                    <span className={selectedScreening.lateralFlow.xylazineStrip === 'POSITIVE' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {selectedScreening.lateralFlow.xylazineStrip}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Library Match:</span>
                    <span className="text-slate-400 truncate max-w-[200px]">{selectedScreening.spectroscopy.libraryMatch}</span>
                  </div>
                </div>
              </div>

              {/* Chain of custody button */}
              <button
                onClick={() => setShowCustodyModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-colors"
              >
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>VIEW CHAIN OF CUSTODY CERTIFICATE</span>
              </button>

              {/* Move to Rehab Button for Positives */}
              {(selectedScreening.riskLevel === 'CRITICAL' || selectedScreening.riskLevel === 'HIGH' || selectedScreening.primarySubstance.toLowerCase().includes('positive') || selectedScreening.lateralFlow.fentanylStrip === 'POSITIVE') && (
                <button
                  onClick={() => {
                    triggerHapticSuccess();
                    setIsRehabModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-tactical-950 font-mono text-xs font-black flex items-center justify-center space-x-2 transition-colors glow-emerald shadow-lg"
                >
                  <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
                  <span>MOVE SUBJECT TO REHABILITATION CENTER</span>
                </button>
              )}

              {/* Lab Dispatch Button */}
              {onDispatchToLab && (
                <button
                  onClick={() => {
                    onDispatchToLab(selectedScreening);
                    setSelectedScreening(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-tactical-950 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-colors glow-cyan"
                >
                  <span>DISPATCH EVIDENCE FOR GC-MS LAB CONFIRMATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custody Modal */}
      {selectedScreening && (
        <ChainOfCustodyModal
          isOpen={showCustodyModal}
          onClose={() => setShowCustodyModal(false)}
          custody={selectedScreening.chainOfCustody}
          caseNumber={selectedScreening.id}
        />
      )}

      {/* Rehabilitation Diversion Modal */}
      {selectedScreening && (
        <RehabDiversionModal
          isOpen={isRehabModalOpen}
          onClose={() => setIsRehabModalOpen(false)}
          subjectRef={selectedScreening.subjectRef}
          substanceName={selectedScreening.primarySubstance}
          currentCity="Coimbatore"
          voltageReading={3.42}
          onConfirmDiversion={(data: RehabDiversionData) => {
            if (onMoveToRehab && selectedScreening) {
              onMoveToRehab(selectedScreening, data.facility, data.pathway, data.counselor, data.requestAmbulance);
            }
            setSelectedScreening(null);
            setIsRehabModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
