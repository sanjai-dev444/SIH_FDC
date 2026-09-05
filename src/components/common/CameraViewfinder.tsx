import React, { useState } from 'react';
import { Camera, Image as ImageIcon, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import { takePhoto, PhotoResult } from '../../services/native/cameraService';
import { triggerHapticSuccess, triggerHapticTap } from '../../services/native/hapticsService';

interface CameraViewfinderProps {
  onCapture: (dataUrl: string) => void;
  label?: string;
  overlayType?: 'strip' | 'pupil' | 'substance';
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  onCapture,
  label = 'Align Lateral Flow Strip inside bracket',
  overlayType = 'strip',
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = async () => {
    triggerHapticTap();
    setIsScanning(true);
    const result: PhotoResult = await takePhoto();
    setIsScanning(false);

    if (result.dataUrl) {
      setPreview(result.dataUrl);
      triggerHapticSuccess();
      onCapture(result.dataUrl);
    }
  };

  const handleRetake = () => {
    triggerHapticTap();
    setPreview(null);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-tactical-950 border border-slate-700/80 aspect-[4/3] flex flex-col items-center justify-center">
      {preview ? (
        <div className="relative w-full h-full">
          <img 
            src={preview} 
            alt="Field Capture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-600/50 self-start">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>IMAGE LOCKED & VERIFIED</span>
            </div>
            <button
              onClick={handleRetake}
              className="flex items-center justify-center space-x-1.5 bg-slate-800/90 text-slate-200 text-xs py-2 px-3 rounded-lg border border-slate-600 self-center hover:bg-slate-700 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Image</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
          {/* Viewfinder Reticle */}
          <div className="absolute inset-4 border-2 border-dashed border-cyan-500/40 rounded-lg pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

            {/* Scanline animation */}
            <div className="w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-scanline opacity-75" />
          </div>

          {/* Overlay Guide Icon */}
          <div className="text-center z-10 space-y-2 mb-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 glow-cyan">
              {overlayType === 'pupil' ? <Eye className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
            </div>
            <p className="text-xs text-slate-300 font-mono max-w-[220px] leading-tight">
              {label}
            </p>
          </div>

          {/* Action trigger button */}
          <button
            onClick={handleCapture}
            disabled={isScanning}
            className="z-10 flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-tactical-950 font-bold px-4 py-2.5 rounded-full shadow-lg active:scale-95 transition-transform text-xs"
          >
            <Camera className="w-4 h-4" />
            <span>{isScanning ? 'SCANNING SENSOR...' : 'CAPTURE OPTICAL DATA'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
