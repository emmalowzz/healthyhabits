import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Snowflake, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  Zap, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  Unlock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Meal, PodLocation, DispenseTemperature } from '../types';

interface LockerSimulatorModalProps {
  meal?: Meal | null;
  pod: PodLocation;
  temperature: DispenseTemperature;
  onClose: () => void;
}

export const LockerSimulatorModal: React.FC<LockerSimulatorModalProps> = ({
  meal,
  pod,
  temperature,
  onClose
}) => {
  const [step, setStep] = useState<'scan' | 'unlocking' | 'dispensed'>('scan');
  const [bayNumber] = useState<string>(() => `BAY-${Math.floor(Math.random() * 4) + 1}0${Math.floor(Math.random() * 3) + 1}`);
  const [pickupCode] = useState<string>(() => Math.floor(100000 + Math.random() * 900000).toString());

  const handleSimulateUnlock = () => {
    setStep('unlocking');
    setTimeout(() => {
      setStep('dispensed');
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // graceful fallback
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <div className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                ActiveSG Smart Pod Telemetry
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                {pod.name}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pod Interactive Screen */}
        <div className="p-6 space-y-6">
          
          {/* Hardware Bay & Temp Display */}
          <div className="grid grid-cols-2 gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">ASSIGNED CHAMBER</span>
              <span className="text-lg font-extrabold text-white tracking-wider flex items-center gap-1.5 mt-0.5">
                {bayNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">CHAMBER TEMPERATURE</span>
              {temperature === 'hot' ? (
                <span className="text-lg font-extrabold text-orange-400 flex items-center justify-end gap-1 mt-0.5">
                  <Flame className="w-4 h-4" />
                  {pod.chamberTempHot}°C HOT
                </span>
              ) : (
                <span className="text-lg font-extrabold text-sky-400 flex items-center justify-end gap-1 mt-0.5">
                  <Snowflake className="w-4 h-4" />
                  {pod.chamberTempChill}°C CHILL
                </span>
              )}
            </div>
          </div>

          {/* Meal Details */}
          {meal && (
            <div className="flex items-center gap-3.5 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/60">
              <img
                src={meal.imageUrl}
                alt={meal.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{meal.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {meal.protein}g Protein · {meal.calories} KCAL
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  HPB Healthier Choice Certified
                </div>
              </div>
            </div>
          )}

          {/* Interactive State Area */}
          {step === 'scan' && (
            <div className="space-y-4 text-center">
              <div className="bg-white p-5 rounded-2xl w-48 mx-auto shadow-lg border border-slate-300">
                <QrCode className="w-36 h-36 mx-auto text-slate-900" />
                <div className="text-slate-900 font-mono font-extrabold text-sm mt-2 tracking-widest">
                  PIN: {pickupCode}
                </div>
              </div>

              <div className="space-y-1 text-slate-300 text-xs">
                <p className="font-semibold">Tap NFC phone against pod reader or scan QR pass.</p>
                <p className="text-slate-400 text-[11px]">Hold camera 10cm from scanner lens.</p>
              </div>

              <button
                onClick={handleSimulateUnlock}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulate Pod Screen Tap / Unlock</span>
              </button>
            </div>
          )}

          {step === 'unlocking' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto animate-pulse">
                <Unlock className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Unlocking Chamber {bayNumber}...</h4>
                <p className="text-xs text-slate-400">
                  {temperature === 'hot' 
                    ? 'Disengaging thermal seal at 65°C' 
                    : 'Disengaging blast-chill seal at 3°C'}
                </p>
              </div>
            </div>
          )}

          {step === 'dispensed' && (
            <div className="space-y-5 text-center py-2 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-white">Chamber Door Open!</h4>
                <p className="text-xs text-emerald-300 font-semibold">
                  Please retrieve your meal from {bayNumber}.
                </p>
              </div>

              {/* Physical Instructions Card */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-left text-xs space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Important Pickup Note</span>
                </div>
                {temperature === 'hot' ? (
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    🔥 <strong>Caution:</strong> Tray is piping hot (65°C). Hold by insulated outer rim. Vacuum-seal vents automatically. Enjoy your post-workout recovery!
                  </p>
                ) : (
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    ❄️ <strong>Cold Take-Home:</strong> Blast-chilled at 3°C. Store in fridge for up to 4 days, or microwave for 2.5–3 minutes at 800W for instant dinner.
                  </p>
                )}
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700 flex items-center justify-between">
                  <span>Eco-Tray Recycling:</span>
                  <span className="text-emerald-400 font-bold">Return tray for S$1 ActiveSG rebate</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setStep('scan')}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Test Again</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#006948] hover:bg-[#005137] text-white font-extrabold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
