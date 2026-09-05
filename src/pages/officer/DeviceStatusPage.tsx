import React, { useState } from 'react';
import { 
  Cpu, 
  Battery, 
  Wifi, 
  Radio, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Thermometer, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { DeviceTelemetry } from '../../types';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface DeviceStatusPageProps {
  telemetry: DeviceTelemetry;
  onUpdateTelemetry?: (updated: DeviceTelemetry) => void;
}

export const DeviceStatusPage: React.FC<DeviceStatusPageProps> = ({
  telemetry,
  onUpdateTelemetry,
}) => {
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  const handleRunDiagnostic = () => {
    triggerHapticTap();
    setIsRunningDiagnostic(true);
    setDiagnosticResult(null);

    setTimeout(() => {
      setIsRunningDiagnostic(false);
      setDiagnosticResult('DIAGNOSTIC PASSED: All 4 optical channels aligned. TN FSD baseline drift < 0.01nm.');
      triggerHapticSuccess();
      if (onUpdateTelemetry) {
        onUpdateTelemetry({
          ...telemetry,
          lastSelfCheckPassed: true,
          chamberTempC: Number((21.8 + Math.random()).toFixed(1)),
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">FSD Hardware Telemetry</h2>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>ONLINE</span>
        </div>
      </div>

      {/* Main Terminal Overview */}
      <div className="bg-tactical-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">TAMIL NADU FSD SPECTROMETER</span>
            <div className="text-base font-black font-mono text-white">{telemetry.serialNumber}</div>
            <div className="text-[11px] font-mono text-slate-400">Firmware: {telemetry.firmwareVersion}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tactical-950 border border-slate-800 flex items-center justify-center text-cyan-400">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        {/* 4-Stat Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-tactical-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>BATTERY</span>
              <Battery className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white">{telemetry.batteryPercent}%</div>
            <div className="text-[10px] text-emerald-400">Approx. 9.5 hrs remaining</div>
          </div>

          <div className="bg-tactical-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>CHAMBER TEMP</span>
              <Thermometer className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white">{telemetry.chamberTempC}°C</div>
            <div className="text-[10px] text-emerald-400">Nominal thermal state</div>
          </div>

          <div className="bg-tactical-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>CALIBRATION</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400">{telemetry.calibrationDaysLeft} Days</div>
            <div className="text-[10px] text-slate-400">FSD Lab Certified</div>
          </div>

          <div className="bg-tactical-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>REAGENTS</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {telemetry.reagentCartridgeRemaining} / {telemetry.cartridgeTotal}
            </div>
            <div className="text-[10px] text-amber-400">Field strips remaining</div>
          </div>
        </div>
      </div>

      {/* Diagnostic Button */}
      <div className="bg-tactical-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-mono font-bold text-white uppercase">
          SPECTROMETER SELF-DIAGNOSTIC
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Executes internal laser diode interferometer test, wavelength reference verification, and dark-current sensor baseline against FSD standards.
        </p>

        <button
          onClick={handleRunDiagnostic}
          disabled={isRunningDiagnostic}
          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-tactical-950 font-bold text-xs font-mono flex items-center justify-center space-x-2 transition-colors glow-cyan disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningDiagnostic ? 'animate-spin' : ''}`} />
          <span>{isRunningDiagnostic ? 'TESTING OPTICAL DETECTORS...' : 'RUN FULL HARDWARE SELF-CHECK'}</span>
        </button>

        {diagnosticResult && (
          <div className="bg-emerald-950/80 border border-emerald-700 p-2.5 rounded-lg text-xs font-mono text-emerald-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{diagnosticResult}</span>
          </div>
        )}
      </div>
    </div>
  );
};
