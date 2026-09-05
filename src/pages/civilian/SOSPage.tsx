import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  MapPin, 
  HeartHandshake, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldAlert,
  Shield
} from 'lucide-react';
import { getCurrentPosition, LocationCoordinates } from '../../services/native/locationService';
import { triggerHapticCritical, triggerHapticTap } from '../../services/native/hapticsService';

export const SOSPage: React.FC = () => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    triggerHapticCritical();
    getCurrentPosition().then(setLocation);
  }, []);

  const handleCopyLocation = () => {
    if (!location) return;
    triggerHapticTap();
    navigator.clipboard.writeText(
      `OVERDOSE MEDICAL EMERGENCY: ${location.address} (Tamil Nadu GPS: ${location.latitude}° N, ${location.longitude}° E)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-16 animate-fade-in">
      {/* Massive Call 108 Trigger */}
      <div className="bg-gradient-to-b from-rose-700 via-rose-800 to-red-900 rounded-3xl p-6 text-white text-center shadow-2xl glow-rose space-y-4 border-2 border-rose-500">
        <div className="w-16 h-16 rounded-full bg-white text-rose-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
          <AlertOctagon className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-rose-200 font-black">
            TAMIL NADU EMERGENCY RESPONSE
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">108 OVERDOSE SOS</h1>
          <p className="text-xs text-rose-100 max-w-xs mx-auto mt-1">
            Good Samaritan Law: You cannot be detained, harassed, or charged when calling for medical help during an overdose.
          </p>
        </div>

        {/* Dual 1-Tap Emergency Dials for India */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* 108 Ambulance */}
          <a
            href="tel:108"
            onClick={() => triggerHapticCritical()}
            className="flex items-center justify-center space-x-2.5 py-4 px-4 rounded-2xl bg-white text-rose-700 font-black text-base shadow-xl active:scale-95 transition-transform"
          >
            <PhoneCall className="w-5 h-5 stroke-[3]" />
            <span>CALL 108 AMBULANCE</span>
          </a>

          {/* 100 / 112 Police */}
          <a
            href="tel:100"
            onClick={() => triggerHapticCritical()}
            className="flex items-center justify-center space-x-2.5 py-4 px-4 rounded-2xl bg-rose-950/80 border border-rose-400/60 text-white font-bold text-sm shadow active:scale-95 transition-transform"
          >
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>CALL 100 / 112 POLICE</span>
          </a>
        </div>
      </div>

      {/* Tell 108 Dispatcher Your GPS Coordinates */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold">
            <MapPin className="w-4 h-4" />
            <span>READ YOUR EXACT LOCATION TO 108 DISPATCHER:</span>
          </div>
          <button
            onClick={handleCopyLocation}
            className="text-[11px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded flex items-center space-x-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-sm text-white font-bold">
          {location ? location.address : 'Locating Tamil Nadu coordinates for 108 dispatch...'}
        </div>

        {location && (
          <div className="text-[11px] font-mono text-slate-400">
            Coordinates: {location.latitude}° N, {location.longitude}° E (Accuracy ~{location.accuracy}m)
          </div>
        )}
      </div>

      {/* Step-by-Step Naloxone / Overdose Protocol */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-teal-400 font-bold font-mono text-xs">
          <HeartHandshake className="w-4 h-4" />
          <span>OVERDOSE FIRST AID (WHAT TO DO RIGHT NOW)</span>
        </div>

        <div className="space-y-2.5 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">1</span>
            <div>
              <strong className="text-white block">Check Responsiveness & Breathing</strong>
              <span className="text-slate-400">Rub your knuckles firmly on their center breastbone (sternal rub). Call out their name loudly.</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">2</span>
            <div>
              <strong className="text-white block">Dial 108 Emergency Ambulance Immediately</strong>
              <span className="text-slate-400">Request urgent BLS/ALS ambulance with oxygen and resuscitation support.</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">3</span>
            <div>
              <strong className="text-white block">Administer Naloxone (Narcan) if available</strong>
              <span className="text-slate-400">Insert nasal applicator into nostril and press plunger firmly. Deliver 1 breath every 5 seconds if not breathing.</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start space-x-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">4</span>
            <div>
              <strong className="text-white block">Turn into Recovery Position</strong>
              <span className="text-slate-400">Roll the person onto their side with top knee bent forward to prevent airway obstruction or choking.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
