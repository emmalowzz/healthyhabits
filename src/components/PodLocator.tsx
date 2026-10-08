import React, { useState } from 'react';
import { 
  MapPin, 
  Flame, 
  Snowflake, 
  Check, 
  Clock, 
  Zap, 
  Navigation, 
  ShieldCheck, 
  Radio, 
  Layers,
  Building2,
  Train
} from 'lucide-react';
import { PodLocation } from '../types';

interface PodLocatorProps {
  pods: PodLocation[];
  selectedPod: PodLocation;
  onSelectPod: (pod: PodLocation) => void;
  onTestPodLocker: (pod: PodLocation) => void;
}

export const PodLocator: React.FC<PodLocatorProps> = ({
  pods,
  selectedPod,
  onSelectPod,
  onTestPodLocker
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const zones = ['All', 'Central', 'West', 'East', 'South'];

  const filteredPods = pods.filter(
    (p) => selectedZone === 'All' || p.zone === selectedZone
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title & Network Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            ActiveSG Sports Singapore Telemetry Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Singapore Smart Locker Pod Fleet
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Automated climate-controlled locker pods placed directly at ActiveSG gym turnstiles, swimming hubs, and major MRT links.
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedZone === zone
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visual Simulator Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              GEOLOCATION RADAR · ONEMAP SG INTEGRATED
            </span>
            <h3 className="text-lg font-bold text-white">Live Pod Chamber Status</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1 text-orange-400">
              <Flame className="w-3.5 h-3.5" /> Hot Chambers: 65°C
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <Snowflake className="w-3.5 h-3.5" /> Chilled Bays: 3°C
            </span>
          </div>
        </div>

        {/* Visual Map Representation */}
        <div className="relative h-64 sm:h-72 bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden flex items-center justify-center">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

          {/* Map Nodes */}
          <div className="relative z-10 w-full h-full max-w-2xl">
            {filteredPods.map((pod, i) => {
              const isSelected = selectedPod.id === pod.id;
              // Approximate layout positions on abstract island map
              const leftPercent = 15 + ((pod.lng - 103.7) / 0.28) * 75;
              const topPercent = 20 + (1 - (pod.lat - 1.25) / 0.15) * 60;

              return (
                <div
                  key={pod.id}
                  style={{
                    left: `${Math.min(90, Math.max(10, leftPercent))}%`,
                    top: `${Math.min(85, Math.max(15, topPercent))}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onClick={() => onSelectPod(pod)}
                >
                  <div className={`p-2 rounded-xl flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-lg scale-110 ring-4 ring-emerald-500/30 font-extrabold'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs'
                  }`}>
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                    <span className="text-[11px] whitespace-nowrap font-bold">
                      {pod.name.split(' ')[1] || pod.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom telemetry overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] font-mono text-slate-300">
            Selected: <strong className="text-white">{selectedPod.name}</strong> · {selectedPod.distanceMinutesWalk}m walk
          </div>
        </div>
      </div>

      {/* Pod Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPods.map((pod) => {
          const isSelected = selectedPod.id === pod.id;

          return (
            <div
              key={pod.id}
              className={`bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-lg'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {pod.type} · {pod.zone}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
                      {pod.name}
                    </h3>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
                    <Navigation className="w-3 h-3" />
                    {pod.distanceMinutesWalk} min walk
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {pod.address}
                </p>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-[#faf8ff] p-3 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">HOT DISPENSER</div>
                    <div className="text-orange-600 font-extrabold flex items-center gap-1 mt-0.5">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{pod.hotStockTotal} Meals · {pod.chamberTempHot}°C</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">COLD CHILL BAYS</div>
                    <div className="text-sky-600 font-extrabold flex items-center gap-1 mt-0.5">
                      <Snowflake className="w-3.5 h-3.5" />
                      <span>{pod.chillStockTotal} Meals · {pod.chamberTempChill}°C</span>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-slate-700">
                      {pod.lockersAvailable} Lockers Active
                    </span>
                  </div>
                  {pod.status === 'low-stock' && (
                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      Restock in {pod.restockInMins}m
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
                <button
                  onClick={() => onSelectPod(pod)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Current Active Pod</span>
                    </>
                  ) : (
                    <span>Set As My Pod</span>
                  )}
                </button>

                <button
                  onClick={() => onTestPodLocker(pod)}
                  className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Simulate unlocking chamber door at this pod"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Test Unlock</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
