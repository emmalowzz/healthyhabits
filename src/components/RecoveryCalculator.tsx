import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Meal, DispenseTemperature, PodLocation } from '../types';
import { MEALS_DATA } from '../data/mockData';

interface RecoveryCalculatorProps {
  onSelectMealDetail: (meal: Meal) => void;
  onInstantReserve: (meal: Meal, temp: DispenseTemperature) => void;
  selectedPod: PodLocation;
}

export const RecoveryCalculator: React.FC<RecoveryCalculatorProps> = ({
  onSelectMealDetail,
  onInstantReserve,
  selectedPod
}) => {
  const [sport, setSport] = useState<string>('Hyrox / Functional Strength');
  const [durationMins, setDurationMins] = useState<number>(60);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [goal, setGoal] = useState<'rebuild' | 'lean' | 'endurance'>('rebuild');
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const sportsList = [
    'Hyrox / Functional Strength',
    'Distance Running (10k/Half)',
    'CrossFit / High Intensity',
    'Swimming / Tri-training',
    'Badminton / Squash / Padel',
    'Weightlifting / Power'
  ];

  // Dynamic calculations based on sports science equations
  const proteinMultiplier = goal === 'rebuild' ? 0.55 : goal === 'lean' ? 0.6 : 0.45;
  const carbMultiplier = goal === 'endurance' ? 1.0 : goal === 'rebuild' ? 0.75 : 0.35;

  const targetPostWorkoutProtein = Math.round(weightKg * proteinMultiplier);
  const targetPostWorkoutCarbs = Math.round(weightKg * carbMultiplier);
  const targetCalories = Math.round((targetPostWorkoutProtein * 4) + (targetPostWorkoutCarbs * 4) + (14 * 9));

  // Matched meal
  const primaryMatchMeal = goal === 'rebuild'
    ? MEALS_DATA.find((m) => m.id === 'meal-sirloin-mash') || MEALS_DATA[1]
    : goal === 'lean'
    ? MEALS_DATA.find((m) => m.id === 'meal-barramundi-cauli') || MEALS_DATA[4]
    : MEALS_DATA.find((m) => m.id === 'meal-miso-chicken') || MEALS_DATA[2];

  const handlePreBookPlan = () => {
    setScheduledSuccess(true);
    setTimeout(() => setScheduledSuccess(false), 3000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4 text-orange-600" />
          Clinical Precision Protocol
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Personalized Sports Recovery Calculator
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Enter your training parameters. The engine calculates your exact post-session nutrient targets and schedules hot or cold smart locker pickups synchronized to your gym sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Training Input Parameters */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            1. Training Session Inputs
          </h3>

          {/* Sport Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Sport or Workout Discipline:
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {sportsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Session Duration:</span>
              <span className="text-[#006948] font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                {durationMins} minutes
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              step="15"
              value={durationMins}
              onChange={(e) => setDurationMins(Number(e.target.value))}
              className="w-full accent-[#006948] cursor-pointer"
            />
          </div>

          {/* Body Weight Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Athlete Body Weight:</span>
              <span className="text-slate-900 font-extrabold">{weightKg} kg</span>
            </div>
            <input
              type="range"
              min="45"
              max="115"
              step="1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-slate-700 cursor-pointer"
            />
          </div>

          {/* Athletic Primary Goal */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Primary Metabolic Objective:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGoal('rebuild')}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  goal === 'rebuild'
                    ? 'bg-[#006948] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Hypertrophy & Repair
              </button>
              <button
                type="button"
                onClick={() => setGoal('endurance')}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  goal === 'endurance'
                    ? 'bg-[#006948] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Glycogen Refuel
              </button>
              <button
                type="button"
                onClick={() => setGoal('lean')}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  goal === 'lean'
                    ? 'bg-[#006948] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Lean Cutting
              </button>
            </div>
          </div>

          {/* Sync court booking note */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl text-[11px] text-blue-900 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong>ActiveSG Sync:</strong> Pre-set meal dispensing at locker bays right when your court or gym slot ends.
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Target & Matched Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  OPTIMAL 45-MINUTE RECOVERY WINDOW
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Calculated Target Nutrition
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {sport}
              </span>
            </div>

            {/* Target Numbers */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#faf8ff] p-4 rounded-2xl border border-slate-100">
                <div className="text-2xl font-extrabold text-orange-600">
                  {targetPostWorkoutProtein}g
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Target Protein</div>
                <span className="text-[10px] text-slate-400">Bioavailable EAA</span>
              </div>

              <div className="bg-[#faf8ff] p-4 rounded-2xl border border-slate-100">
                <div className="text-2xl font-extrabold text-amber-600">
                  {targetPostWorkoutCarbs}g
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Complex Carbs</div>
                <span className="text-[10px] text-slate-400">Low-GI Refuel</span>
              </div>

              <div className="bg-[#faf8ff] p-4 rounded-2xl border border-slate-100">
                <div className="text-2xl font-extrabold text-[#006948]">
                  {targetCalories}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Window KCAL</div>
                <span className="text-[10px] text-slate-400">Zero seed oils</span>
              </div>
            </div>
          </div>

          {/* Matched Meal Proposal */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Clinically Matched Recovery Dish
              </span>
              <span className="text-slate-400 font-mono">
                Ready at {selectedPod.name}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <img
                src={primaryMatchMeal.imageUrl}
                alt={primaryMatchMeal.name}
                className="w-full sm:w-28 h-28 rounded-2xl object-cover shrink-0 border border-slate-700"
              />
              <div className="space-y-1 text-center sm:text-left flex-1">
                <h4 className="text-lg font-bold text-white">
                  {primaryMatchMeal.name}
                </h4>
                <p className="text-xs text-slate-300 leading-snug">
                  {primaryMatchMeal.tagline}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-emerald-300">
                  <span>{primaryMatchMeal.protein}g Protein</span>
                  <span>·</span>
                  <span>{primaryMatchMeal.carbs}g Carbs</span>
                  <span>·</span>
                  <span>{primaryMatchMeal.calories} KCAL</span>
                  <span>·</span>
                  <span className="text-white font-bold">S${primaryMatchMeal.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onSelectMealDetail(primaryMatchMeal)}
                className="w-full sm:w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Inspect Micronutrients
              </button>

              <button
                onClick={() => onInstantReserve(primaryMatchMeal, 'hot')}
                className="w-full sm:w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Reserve in {selectedPod.name.split(' ')[1]} Pod</span>
              </button>
            </div>
          </div>

          {/* 5-Day Weekly Pre-Set Plan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Weekly Automated Locker Plan
                </h4>
                <p className="text-xs text-slate-500">
                  Reserve 5 workouts in advance. Chamber unlocks with your pass.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                S$68.00 / wk (Save 15%)
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="font-bold text-slate-800">Mon: Upper Body Strength</span>
                <span className="text-slate-600">Grass-Fed Sirloin Mash (52g P)</span>
                <span className="text-orange-600 font-bold">Hot 65°C</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-bold text-slate-800">Wed: ActiveSG Delta Hyrox</span>
                <span className="text-slate-600">Wild Salmon Quinoa (42g P)</span>
                <span className="text-orange-600 font-bold">Hot 65°C</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="font-bold text-slate-800">Fri: Sprint Intervals / 10K</span>
                <span className="text-slate-600">Kyoto Miso Chicken Soba (44g P)</span>
                <span className="text-sky-600 font-bold">Chill Take-Home</span>
              </div>
            </div>

            <button
              onClick={handlePreBookPlan}
              disabled={scheduledSuccess}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                scheduledSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {scheduledSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>5-Day Locker Schedule Activated!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Activate 5-Day Weekly Auto-Locker Schedule</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
