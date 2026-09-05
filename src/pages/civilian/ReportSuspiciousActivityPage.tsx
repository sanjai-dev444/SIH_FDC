import React, { useState } from 'react';
import { 
  FileEdit, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Lock
} from 'lucide-react';
import { CivilianTip } from '../../types';
import { CameraViewfinder } from '../../components/common/CameraViewfinder';
import { getCurrentPosition } from '../../services/native/locationService';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface ReportSuspiciousActivityPageProps {
  onSubmitTip: (tip: CivilianTip) => void;
}

export const ReportSuspiciousActivityPage: React.FC<ReportSuspiciousActivityPageProps> = ({
  onSubmitTip,
}) => {
  const [incidentType, setIncidentType] = useState('Contaminated Street Batch Alert (Tranq / Synthetic)');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('CMBT Koyambedu / Chennai Sector');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please provide a brief description of the safety hazard.');
      return;
    }

    triggerHapticTap();
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const tip: CivilianTip = {
      id: `TIP-TN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      incidentType,
      description,
      location: {
        lat: 13.0694,
        lng: 80.1948,
        address: address || 'Chennai Central District',
      },
      hasPhoto: !!photoUrl,
      status: 'SUBMITTED',
      anonymousPin: pin,
    };

    onSubmitTip(tip);
    setGeneratedPin(pin);
    setIsSubmitted(true);
    triggerHapticSuccess();
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-6 text-center space-y-4 animate-fade-in my-8">
        <div className="w-14 h-14 bg-teal-950 border border-teal-500 rounded-full flex items-center justify-center text-teal-400 mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">ANONYMOUS REPORT TRANSMITTED</h3>
          <p className="text-xs text-slate-300 mt-1">
            Your tip was routed to the local Tamil Nadu harm reduction & 10581 anti-drug alert network. No personal identifiers were stored.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">YOUR ANONYMOUS TRACKING PIN:</span>
          <div className="text-2xl font-black font-mono text-teal-400 tracking-wider">
            {generatedPin}
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">
            Save this PIN if you wish to check review status in "My Reports".
          </span>
        </div>

        <button
          onClick={() => {
            setIsSubmitted(false);
            setDescription('');
            setPhotoUrl(null);
          }}
          className="w-full py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs font-mono transition-colors"
        >
          SUBMIT ANOTHER SAFETY ALERT
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileEdit className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Report Contamination / Safety Tip</h2>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-800">
          <Lock className="w-3 h-3" />
          <span>ZERO LOGS</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
        <p className="leading-relaxed">
          Report adulterated substances, spurious prescription drugs, or open drug hotspots across Tamil Nadu. Helps community health teams dispatch outreach and 108 emergency supplies.
        </p>
      </div>

      {/* Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
        <div>
          <label className="text-[11px] font-mono text-slate-400 block mb-1">Incident Category</label>
          <select
            value={incidentType}
            onChange={(e) => setIncidentType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
          >
            <option value="Contaminated Street Batch Alert (Tranq / Synthetic)">Contaminated Batch Alert (Tranq / Synthetic Opioids)</option>
            <option value="Lethal Spurious / Counterfeit Pharmaceutical Pills">Spurious / Counterfeit Prescription Tablets</option>
            <option value="Public Overdose Cluster / Transit Station Hotspot">High Overdose Cluster in Public / Transit Area</option>
            <option value="Abandoned Syringes / Biomedical Hazard">Discarded Syringes / Hazardous Paraphernalia</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 block mb-1">Tamil Nadu Location / Sector</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. CMBT Bus Stand platform 3 or Gandhipuram..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 block mb-1">
            Hazard Details / What was observed?
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Several people collapsed after consuming brown powder in paper sachet with unusual chemical odor..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Photo Attachment */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 block">
            Optional Photo (EXIF GPS & phone metadata stripped)
          </label>
          <CameraViewfinder
            onCapture={(url) => setPhotoUrl(url)}
            label="Capture packaging or sample marking"
            overlayType="substance"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors active:scale-95 glow-amber"
        >
          TRANSMIT 100% ANONYMOUS REPORT
        </button>
      </div>
    </div>
  );
};
