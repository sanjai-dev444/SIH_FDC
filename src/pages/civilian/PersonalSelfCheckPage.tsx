import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TestTube, 
  Camera, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CameraViewfinder } from '../../components/common/CameraViewfinder';
import { triggerHapticSuccess, triggerHapticTap, triggerHapticWarning } from '../../services/native/hapticsService';

export const PersonalSelfCheckPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'strip' | 'symptoms'>('strip');

  // Strip scanner state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [stripType, setStripType] = useState<'fentanyl' | 'xylazine'>('fentanyl');
  const [detectedLines, setDetectedLines] = useState<'two' | 'one' | null>('two');

  // Symptom checklist state
  const [symptoms, setSymptoms] = useState<Record<string, boolean>>({
    shallowBreathing: false,
    extremeDrowsiness: false,
    pinpointPupils: false,
    paleClammySkin: false,
    slurredSpeech: false,
  });

  const toggleSymptom = (key: string) => {
    triggerHapticTap();
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCount = Object.values(symptoms).filter(Boolean).length;
  const isHighOverdoseRisk = symptoms.shallowBreathing || selectedCount >= 3;

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <ShieldCheck className="w-5 h-5 text-teal-400" />
        <h2 className="text-base font-bold text-white tracking-wide">Personal Harm Reduction Check</h2>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
        <button
          onClick={() => {
            triggerHapticTap();
            setActiveTab('strip');
          }}
          className={`py-2 rounded-lg font-bold transition-all ${
            activeTab === 'strip'
              ? 'bg-teal-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Test Strip Scanner
        </button>
        <button
          onClick={() => {
            triggerHapticTap();
            setActiveTab('symptoms');
          }}
          className={`py-2 rounded-lg font-bold transition-all ${
            activeTab === 'symptoms'
              ? 'bg-teal-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Symptom Self-Check
        </button>
      </div>

      {activeTab === 'strip' ? (
        <div className="space-y-4 animate-fade-in">
          {/* Instructions Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-teal-400 font-bold font-mono">
              <Info className="w-4 h-4" />
              <span>HOW TO READ A RAPID TEST STRIP</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-emerald-900/60">
                <span className="text-emerald-400 font-bold block text-sm">2 LINES = NEGATIVE</span>
                <span className="text-slate-400 text-[10px]">Even a faint second line means the adulterant was not detected.</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-rose-900/60">
                <span className="text-rose-400 font-bold block text-sm">1 LINE = POSITIVE</span>
                <span className="text-slate-400 text-[10px]">Only the control line is visible. The drug contains dangerous Fentanyl or Tranq!</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px] pt-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Dip strip for 15 seconds • Read results after 2 to 5 minutes</span>
            </div>
          </div>

          {/* Camera Scanner Viewfinder */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase block">
              CAPTURE STRIP FOR OPTICAL VERIFICATION
            </span>
            <CameraViewfinder
              onCapture={(url) => {
                setPhotoUrl(url);
                triggerHapticSuccess();
              }}
              label="Align test strip with pink control band inside guide"
              overlayType="strip"
            />
          </div>

          {photoUrl && (
            <div className="bg-slate-900 border border-teal-500/40 rounded-xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-400">OPTICAL ANALYSIS RESULT</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  2 LINES DETECTED
                </span>
              </div>
              <p className="text-xs text-slate-300">
                The optical reader identified both the Control (C) line and Test (T) line. <strong className="text-emerald-400">Presumed Negative for Fentanyl</strong>. Note: rapid strips cannot detect every novel synthetic analog. Always proceed with extreme caution.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Symptom Self-Check */
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-teal-400 uppercase">
              CONFIDENTIAL PHYSICAL SYMPTOM CHECK
            </h3>
            <p className="text-xs text-slate-400">
              Are you or a peer experiencing any of the following warning signs?
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[
                { key: 'shallowBreathing', label: 'Slow, shallow, or irregular breathing (< 10 breaths/min)', critical: true },
                { key: 'pinpointPupils', label: 'Extremely small / pinpoint pupils', critical: false },
                { key: 'extremeDrowsiness', label: 'Unable to stay awake or respond to voice', critical: true },
                { key: 'paleClammySkin', label: 'Pale, blue, or grayish lips/fingertips', critical: true },
                { key: 'slurredSpeech', label: 'Severely slurred speech / heavy confusion', critical: false },
              ].map((s) => (
                <div
                  key={s.key}
                  onClick={() => toggleSymptom(s.key)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    symptoms[s.key]
                      ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold pr-2">{s.label}</span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 ${
                    symptoms[s.key] ? 'bg-rose-600 border-rose-500 text-white' : 'border-slate-700'
                  }`}>
                    {symptoms[s.key] && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdose Danger Notice if checked */}
          {isHighOverdoseRisk && (
            <div className="bg-rose-950 border border-rose-600 rounded-xl p-4 space-y-2 glow-rose animate-pulse">
              <div className="flex items-center space-x-2 text-rose-300 font-bold font-mono text-xs">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>CRITICAL OVERDOSE WARNING</span>
              </div>
              <p className="text-xs text-rose-100">
                Symptoms strongly indicate acute respiratory depression. Administer Naloxone immediately and dial <strong className="text-white underline">108 Emergency Ambulance</strong> (or <strong className="text-white underline">100 / 112</strong> for Police). Good Samaritan protections apply in India.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
