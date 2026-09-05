import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Barcode, 
  Bot, 
  Radio, 
  Activity,
  Check,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { ScreeningRecord, RehabCase } from '../../types';
import { getCurrentPosition, LocationCoordinates, TN_CITIES } from '../../services/native/locationService';
import { evaluateSensorInput, SENSOR_THRESHOLDS } from '../../services/hardwareSensor';
import { generateCustodyHash } from '../../services/screeningEngine';
import { triggerHapticTap, triggerHapticSuccess, triggerHapticCritical } from '../../services/native/hapticsService';
import { RehabDiversionModal, RehabDiversionData } from '../../components/officer/RehabDiversionModal';

interface NewScreeningPageProps {
  onCompleteScreening: (newRecord: ScreeningRecord) => void;
  onCancel: () => void;
  onOpenAIAssistant?: () => void;
  onMoveToRehab?: (
    screening: ScreeningRecord,
    facility: string,
    pathway: RehabCase['programType'],
    counselor: string,
    requestAmbulance: boolean
  ) => void;
}

export const NewScreeningPage: React.FC<NewScreeningPageProps> = ({
  onCompleteScreening,
  onCancel,
  onOpenAIAssistant,
  onMoveToRehab,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Location & Context
  const [selectedCity, setSelectedCity] = useState('Coimbatore');
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [subjectRef, setSubjectRef] = useState(`SUBJ-CBE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [officerNotes, setOfficerNotes] = useState('');

  // Step 2: Hardware Colorimetry / Electrical Input State
  const [isReadingSensor, setIsReadingSensor] = useState(false);
  const [sensorVoltage, setSensorVoltage] = useState(3.42); // Default simulated voltage
  const [opticalOD, setOpticalOD] = useState(0.85); // Optical Absorbance
  const [sampleType, setSampleType] = useState<'Narcotic Opioid' | 'Synthetic Drug' | 'Stimulant'>('Narcotic Opioid');
  const [sensorEvaluated, setSensorEvaluated] = useState(false);

  // Step 3: Evidence Bag & Sealing
  const [bagNumber, setBagNumber] = useState(`TN-EV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [officerName, setOfficerName] = useState('SI K. Murugan (Badge #TN-4812)');
  const [isRehabModalOpen, setIsRehabModalOpen] = useState(false);
  const [dispositionMode, setDispositionMode] = useState<'CRIMINAL_CUSTODY' | 'REHAB_DIVERSION'>('REHAB_DIVERSION');

  // Auto-detect location on load
  useEffect(() => {
    refreshLocation(selectedCity);
  }, [selectedCity]);

  const refreshLocation = async (city?: string) => {
    setLocLoading(true);
    const pos = await getCurrentPosition(city);
    setLocation(pos);
    setSelectedCity(pos.city);
    setLocLoading(false);
  };

  // Simulate reading electrical input from colorimeter hardware
  const handleReadHardwareSensor = () => {
    triggerHapticTap();
    setIsReadingSensor(true);

    setTimeout(() => {
      // Simulate electrical signal from colorimetry device
      // 80% chance of positive detection for demonstration, or toggle
      const measuredVoltage = Number((2.8 + Math.random() * 1.4).toFixed(2));
      const measuredOD = Number((0.72 + Math.random() * 0.35).toFixed(2));

      setSensorVoltage(measuredVoltage);
      setOpticalOD(measuredOD);
      setSensorEvaluated(true);
      setIsReadingSensor(false);

      if (measuredVoltage >= SENSOR_THRESHOLDS.narcoticCutoffVoltage) {
        triggerHapticCritical();
      } else {
        triggerHapticSuccess();
      }
    }, 1200);
  };

  const currentResult = evaluateSensorInput(sensorVoltage, opticalOD, sampleType);

  const handleDiversionConfirm = (data: RehabDiversionData) => {
    triggerHapticSuccess();

    const newRecord: ScreeningRecord = {
      id: `SCR-${selectedCity.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      officerBadge: 'TN-4812',
      officerName,
      location: {
        lat: location?.latitude || 11.0168,
        lng: location?.longitude || 76.9672,
        address: location?.address || `${selectedCity} Central Sector`
      },
      subjectRef,
      substanceClass: sampleType,
      primarySubstance: `${sampleType} (Field Positive ${sensorVoltage}V - Diverted to Rehab)`,
      confidence: 98.4,
      adulterants: [{ name: 'Chemical Reaction Cut', percentage: 24, risk: 'HIGH' }],
      pupillometry: {
        diameterMm: 1.9,
        responseTimeMs: 550,
        constrictionScore: 'Miosis Observed',
        nystagmus: false
      },
      lateralFlow: {
        fentanylStrip: 'POSITIVE',
        xylazineStrip: 'NEGATIVE',
        methStrip: 'NEGATIVE'
      },
      spectroscopy: {
        matchScore: 98.4,
        libraryMatch: `Colorimeter Signal ${sensorVoltage}V (${sampleType})`,
        peakWavelength: 540,
        waveformType: 'Colorimetry Voltage'
      },
      riskLevel: 'HIGH',
      chainOfCustody: {
        evidenceBagNumber: bagNumber,
        sealedBy: officerName,
        sealedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'FIELD_SEALED',
        signatureHash: generateCustodyHash(bagNumber),
        notes: `Subject diverted to ${data.facility} under ${data.pathway}. 108 Ambulance: ${data.requestAmbulance ? 'DISPATCHED' : 'NOT_REQUIRED'}. Counselor: ${data.counselor}.`
      },
      notes: `${officerNotes ? officerNotes + ' • ' : ''}Transferred to ${data.facility}. ${data.notes}`
    };

    if (onMoveToRehab) {
      onMoveToRehab(newRecord, data.facility, data.pathway, data.counselor, data.requestAmbulance);
    } else {
      onCompleteScreening(newRecord);
    }
  };

  const handleFinishAndSeal = () => {
    triggerHapticCritical();

    const isPos = currentResult.result === 'POSITIVE';
    const newRecord: ScreeningRecord = {
      id: `SCR-${selectedCity.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      officerBadge: 'TN-4812',
      officerName,
      location: {
        lat: location?.latitude || 11.0168,
        lng: location?.longitude || 76.9672,
        address: location?.address || `${selectedCity} Central Sector`
      },
      subjectRef,
      substanceClass: sampleType,
      primarySubstance: isPos ? `${sampleType} (Contraband Confirmed)` : 'Negative / No Narcotics Detected',
      confidence: isPos ? 98.2 : 99.4,
      adulterants: isPos ? [{ name: 'Chemical Reaction Cut', percentage: 24, risk: 'HIGH' }] : [],
      pupillometry: {
        diameterMm: isPos ? 1.9 : 4.0,
        responseTimeMs: isPos ? 550 : 250,
        constrictionScore: isPos ? 'Miosis Observed' : 'Normal',
        nystagmus: false
      },
      lateralFlow: {
        fentanylStrip: isPos ? 'POSITIVE' : 'NEGATIVE',
        xylazineStrip: 'NEGATIVE',
        methStrip: 'NEGATIVE'
      },
      spectroscopy: {
        matchScore: isPos ? 98.2 : 12.0,
        libraryMatch: `Colorimeter Signal ${sensorVoltage}V (${sampleType})`,
        peakWavelength: 540,
        waveformType: 'Colorimetry Voltage'
      },
      riskLevel: isPos ? 'CRITICAL' : 'LOW',
      chainOfCustody: {
        evidenceBagNumber: bagNumber,
        sealedBy: officerName,
        sealedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'FIELD_SEALED',
        signatureHash: generateCustodyHash(bagNumber),
        notes: `Electrical sensor input: ${sensorVoltage}V. Result: ${currentResult.result}. Location: ${location?.address}.`
      },
      notes: officerNotes || `Colorimetry reading completed in ${selectedCity}.`
    };

    onCompleteScreening(newRecord);
  };

  return (
    <div className="space-y-4 pb-16 animate-fade-in">
      {/* Step Indicator */}
      <div className="bg-tactical-900 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
          <span className="text-cyan-400 font-bold">STEP {step} OF 3</span>
          <span className="text-slate-400">
            {step === 1 && 'Location & Suspect'}
            {step === 2 && 'Hardware Colorimeter Signal'}
            {step === 3 && 'Result & NDPS Evidence Seal'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${step >= 1 ? 'bg-cyan-400' : 'bg-transparent'}`} />
          <div className={`h-full rounded-full transition-all ${step >= 2 ? 'bg-cyan-400' : 'bg-transparent'}`} />
          <div className={`h-full rounded-full transition-all ${step >= 3 ? 'bg-cyan-400' : 'bg-transparent'}`} />
        </div>
      </div>

      {/* STEP 1: LOCATION & CONTEXT */}
      {step === 1 && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="bg-tactical-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Location & Jurisdiction</span>
            </h3>

            {/* Tamil Nadu City Quick Selector */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Detected City / District (Tamil Nadu)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Coimbatore', 'Chennai', 'Madurai', 'Salem', 'Tiruchirappalli', 'Erode'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      triggerHapticTap();
                      setSelectedCity(city);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono text-center transition-all ${
                      selectedCity === city
                        ? 'bg-cyan-500 text-tactical-950 font-bold shadow glow-cyan'
                        : 'bg-tactical-950 text-slate-300 border border-slate-700/70 hover:border-slate-500'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Display */}
            <div className="bg-tactical-950 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono text-cyan-400 block">CURRENT GPS FIX</span>
                <span className="text-xs text-white font-mono truncate block">
                  {location ? location.address : 'Acquiring GPS fix...'}
                </span>
              </div>
              <button
                onClick={() => refreshLocation(selectedCity)}
                className="p-2 bg-slate-800 rounded-lg text-cyan-400 hover:text-cyan-300"
                title="Refresh GPS"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Suspect Ref */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Subject Reference Code (Anonymized)
              </label>
              <input
                type="text"
                value={subjectRef}
                onChange={(e) => setSubjectRef(e.target.value)}
                className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                triggerHapticTap();
                setStep(2);
              }}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-tactical-950 font-bold py-2.5 rounded-xl text-xs font-mono flex items-center justify-center space-x-1.5 glow-cyan transition-colors"
            >
              <span>CONNECT SENSOR HARDWARE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: HARDWARE SENSOR INPUT (COLORIMETRY / ELECTRICAL) */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-tactical-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Colorimetry & Electrical Sensor</h3>
                  <p className="text-[10px] font-mono text-slate-400">BLE / USB-OTG Direct Hardware Reader</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DEVICE READY</span>
              </div>
            </div>

            {/* Test Sample Target */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Target Drug Test Assay
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Narcotic Opioid', 'Synthetic Drug', 'Stimulant'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      triggerHapticTap();
                      setSampleType(type);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-mono text-center transition-all ${
                      sampleType === type
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold'
                        : 'bg-tactical-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Trigger Action */}
            <div className="bg-tactical-950 border border-slate-800 rounded-xl p-4 text-center space-y-3">
              <p className="text-xs text-slate-300">
                Insert reaction cuvette/strip into optical chamber and trigger electrical readout:
              </p>

              <button
                onClick={handleReadHardwareSensor}
                disabled={isReadingSensor}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-tactical-950 font-black text-xs font-mono flex items-center justify-center space-x-2 shadow-lg glow-amber active:scale-95 transition-all"
              >
                <Activity className={`w-4 h-4 ${isReadingSensor ? 'animate-spin' : ''}`} />
                <span>{isReadingSensor ? 'MEASURING VOLTAGE & ABSORBANCE...' : 'READ HARDWARE SENSOR SIGNAL'}</span>
              </button>
            </div>

            {/* Live Electrical & Colorimetric Readout */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-tactical-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">ELECTRICAL VOLTAGE</span>
                <div className="text-xl font-black text-cyan-400">{sensorVoltage.toFixed(2)} V</div>
                <div className="text-[10px] text-slate-400">Cutoff: {SENSOR_THRESHOLDS.narcoticCutoffVoltage} V</div>
              </div>

              <div className="bg-tactical-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">OPTICAL ABSORBANCE</span>
                <div className="text-xl font-black text-amber-400">{opticalOD.toFixed(2)} OD</div>
                <div className="text-[10px] text-slate-400">Cutoff: {SENSOR_THRESHOLDS.opticalCutoffOD} OD</div>
              </div>
            </div>

            {/* Direct Result Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              currentResult.result === 'POSITIVE'
                ? 'bg-rose-950/80 border-rose-600 text-rose-100 glow-rose'
                : 'bg-emerald-950/80 border-emerald-600 text-emerald-100 glow-emerald'
            }`}>
              <div className="flex items-center space-x-3">
                {currentResult.result === 'POSITIVE' ? (
                  <AlertOctagon className="w-8 h-8 text-rose-400 animate-pulse flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                )}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black block">
                    HARDWARE SENSOR VERDICT
                  </span>
                  <div className="text-xl font-black tracking-tight">
                    {currentResult.result === 'POSITIVE' ? 'POSITIVE (DRUG DETECTED)' : 'NEGATIVE (SAMPLE CLEAR)'}
                  </div>
                  <div className="text-[11px] font-mono mt-0.5 text-slate-300">
                    {currentResult.notes}
                  </div>
                </div>
              </div>
            </div>

            {/* If POSITIVE: Option to Move to Rehabilitation Center */}
            {currentResult.result === 'POSITIVE' && (
              <div className="bg-gradient-to-br from-emerald-950/90 via-slate-900 to-tactical-950 border-2 border-emerald-500/70 rounded-2xl p-4 space-y-3 shadow-xl glow-emerald animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <HeartHandshake className="w-5 h-5" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider">
                      REHABILITATION DIVERSION (SEC 64A NDPS)
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-bold">
                    RECOMMENDED
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-snug">
                  Narcotic contraband detected ({sensorVoltage}V). Under Tamil Nadu Police LEAD policy & NDPS Section 64A, you can immediately divert this individual to an approved de-addiction hospital with 108 Emergency medical transport.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    triggerHapticSuccess();
                    setIsRehabModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-tactical-950 font-black text-xs font-mono flex items-center justify-center space-x-2 shadow-lg glow-emerald transition-all active:scale-95"
                >
                  <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
                  <span>MOVE SUBJECT TO REHABILITATION CENTER (1-TAP)</span>
                </button>
              </div>
            )}

            {/* AI Assistant Quick Consult */}
            {onOpenAIAssistant && (
              <button
                onClick={() => {
                  triggerHapticTap();
                  onOpenAIAssistant();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono flex items-center justify-center space-x-2 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span>CONSULT TN POLICE AI ADVISOR ON THIS READING</span>
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                triggerHapticTap();
                setStep(1);
              }}
              className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-mono flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                triggerHapticSuccess();
                setStep(3);
              }}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-tactical-950 font-bold py-2.5 rounded-xl text-xs font-mono flex items-center justify-center space-x-1.5 glow-cyan transition-colors"
            >
              <span>PROCEED TO EVIDENCE SEAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EVIDENCE SEAL & LOGGING */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-tactical-900 border border-slate-800 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center space-x-2 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">NDPS Section 52A Evidence Sealing</h3>
            </div>

            {/* Summary Tag */}
            <div className="bg-tactical-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">JURISDICTION:</span>
                <span className="text-cyan-300 font-bold">{selectedCity}, Tamil Nadu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SENSOR RESULT:</span>
                <span className={currentResult.result === 'POSITIVE' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {currentResult.result} ({sensorVoltage}V)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ASSAY TYPE:</span>
                <span className="text-white">{sampleType}</span>
              </div>
            </div>

            {/* Evidence Bag Number */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Evidence Bag Serial Tag
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={bagNumber}
                  onChange={(e) => setBagNumber(e.target.value)}
                  className="flex-1 bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white"
                />
                <button
                  onClick={() => setBagNumber(`TN-EV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)}
                  className="px-3 py-2 bg-slate-800 rounded-lg text-slate-300"
                >
                  <Barcode className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Officer Name */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Investigating Officer Credential
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white"
              />
            </div>

            {/* If POSITIVE: Disposition Selector */}
            {currentResult.result === 'POSITIVE' && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                  Subject Legal Disposition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticTap();
                      setDispositionMode('REHAB_DIVERSION');
                    }}
                    className={`p-2.5 rounded-xl border text-left font-mono transition-all ${
                      dispositionMode === 'REHAB_DIVERSION'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200 glow-emerald'
                        : 'bg-tactical-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Rehab Transfer</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">LEAD / NDPS Sec 64A</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticTap();
                      setDispositionMode('CRIMINAL_CUSTODY');
                    }}
                    className={`p-2.5 rounded-xl border text-left font-mono transition-all ${
                      dispositionMode === 'CRIMINAL_CUSTODY'
                        ? 'bg-rose-950 border-rose-500 text-rose-200'
                        : 'bg-tactical-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                      <span>Judicial Custody</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Criminal Charge Sheet</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                triggerHapticTap();
                setStep(2);
              }}
              className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-mono flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (currentResult.result === 'POSITIVE' && dispositionMode === 'REHAB_DIVERSION') {
                  triggerHapticSuccess();
                  setIsRehabModalOpen(true);
                } else {
                  handleFinishAndSeal();
                }
              }}
              className={`flex-1 font-black py-3 rounded-xl text-xs font-mono flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all ${
                currentResult.result === 'POSITIVE' && dispositionMode === 'REHAB_DIVERSION'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-tactical-950 glow-emerald'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-tactical-950 glow-emerald'
              }`}
            >
              {currentResult.result === 'POSITIVE' && dispositionMode === 'REHAB_DIVERSION' ? (
                <>
                  <HeartHandshake className="w-5 h-5 stroke-[2.5]" />
                  <span>SEAL & DISPATCH TO REHAB CENTER</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>COMMIT SEAL & LOG EVIDENCE</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Rehabilitation Diversion Modal */}
      <RehabDiversionModal
        isOpen={isRehabModalOpen}
        onClose={() => setIsRehabModalOpen(false)}
        subjectRef={subjectRef}
        substanceName={`${sampleType} (Contraband Confirmed)`}
        currentCity={selectedCity}
        voltageReading={sensorVoltage}
        onConfirmDiversion={handleDiversionConfirm}
      />
    </div>
  );
};
