import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Zap, 
  RefreshCw,
  Search
} from 'lucide-react';
import { MealAnalysisResult, Meal, DispenseTemperature } from '../types';
import { PRESET_SAMPLE_MEALS, MEALS_DATA } from '../data/mockData';
import { analyzeMealImageOrDescription } from '../services/geminiService';

interface MealScannerProps {
  onSelectMealDetail: (meal: Meal) => void;
  onInstantReserve: (meal: Meal, temp: DispenseTemperature) => void;
}

export const MealScanner: React.FC<MealScannerProps> = ({
  onSelectMealDetail,
  onInstantReserve
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MealAnalysisResult | null>(() => ({
    foodName: PRESET_SAMPLE_MEALS[0].title,
    estimatedCalories: PRESET_SAMPLE_MEALS[0].calories,
    proteinGrams: PRESET_SAMPLE_MEALS[0].protein,
    carbsGrams: PRESET_SAMPLE_MEALS[0].carbs,
    fatGrams: PRESET_SAMPLE_MEALS[0].fat,
    sodiumMg: PRESET_SAMPLE_MEALS[0].sodiumMg,
    recoveryScore: PRESET_SAMPLE_MEALS[0].recoveryScore,
    critique: PRESET_SAMPLE_MEALS[0].critique,
    missingNutrients: ['Omega-3 EPA/DHA', 'Anti-Inflammatory Turmeric', 'Digestive Plant Enzymes'],
    suggestedKineticMealId: PRESET_SAMPLE_MEALS[0].suggestedId,
    reason: PRESET_SAMPLE_MEALS[0].reason
  }));

  const handleSelectPreset = async (index: number) => {
    setSelectedPresetIndex(index);
    const preset = PRESET_SAMPLE_MEALS[index];
    setIsAnalyzing(true);
    const result = await analyzeMealImageOrDescription(preset.title + ': ' + preset.desc);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleCustomAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeMealImageOrDescription(inputText);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const suggestedMeal = analysisResult
    ? MEALS_DATA.find((m) => m.id === analysisResult.suggestedKineticMealId) || MEALS_DATA[0]
    : MEALS_DATA[0];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
          <Camera className="w-4 h-4 text-emerald-600" />
          ActiveSG Meal Recovery Scanner
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Meal Photo & Recovery Gap Analyzer
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Snap your food to diagnose why ordinary hawker or homemade meals stall muscle synthesis. Discover the exact nutrient-engineered Kinetic Fuel dish to balance your recovery.
        </p>
      </div>

      {/* Preset Selectors & Custom Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Selection */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Choose a Singapore Meal or Enter Yours
            </div>

            {/* Presets */}
            <div className="space-y-2">
              {PRESET_SAMPLE_MEALS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'border-[#006948] bg-emerald-50/60 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {preset.desc}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-slate-700 block">
                      {preset.protein}g P
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {preset.calories} KCAL
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleCustomAnalyze} className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Or describe any meal you ate:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 2 roti prata with mutton curry, iced Milo"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !inputText.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Analyze
                </button>
              </div>
            </form>
          </div>

          {/* Clinical Tip */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Biochemical Fact: The Leucine Threshold</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              To trigger the mTOR pathway for muscle repair, your post-workout meal must contain at least <strong>3.0g of pure bioavailable leucine</strong>. Typical hawker meals only provide 1.2g–1.6g.
            </p>
          </div>
        </div>

        {/* Right: Diagnosis & Recovery Upgrade Solution */}
        <div className="lg:col-span-7 space-y-5">
          {isAnalyzing ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
              <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Running Sports Biochemical Breakdown...
                </h4>
                <p className="text-xs text-slate-500">
                  Evaluating amino acid profiles, glycemic index, and inflammatory sodium markers.
                </p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-5">
              {/* Diagnosis Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      MEAL DIAGNOSIS
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {analysisResult.foodName}
                    </h3>
                  </div>

                  {/* Athletic Recovery Score Ring */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 block">Recovery Score</span>
                      <span className="text-[11px] text-slate-400">Out of 100</span>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base ${
                      analysisResult.recoveryScore >= 70
                        ? 'bg-emerald-100 text-[#006948]'
                        : analysisResult.recoveryScore >= 50
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {analysisResult.recoveryScore}
                    </div>
                  </div>
                </div>

                {/* Macro Audit */}
                <div className="grid grid-cols-4 gap-2 bg-[#faf8ff] p-3 rounded-2xl border border-slate-100 text-center text-xs">
                  <div>
                    <div className="font-extrabold text-orange-600 text-sm">
                      {analysisResult.proteinGrams}g
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Protein</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-amber-600 text-sm">
                      {analysisResult.carbsGrams}g
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Carbs</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-blue-600 text-sm">
                      {analysisResult.fatGrams}g
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Fats</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-[#006948] text-sm">
                      {analysisResult.estimatedCalories}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">KCAL</div>
                  </div>
                </div>

                {/* Critique */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Clinical Nutritionist Review:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    {analysisResult.critique}
                  </p>
                </div>

                {/* Missing Recovery Nutrients */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-700">Missing Recovery Co-Factors:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingNutrients.map((nutr, i) => (
                      <span
                        key={i}
                        className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold text-[11px]"
                      >
                        ✕ {nutr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recovery Upgrade Pairing Card */}
              <div className="bg-gradient-to-br from-emerald-900 to-[#006948] text-white rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-200 bg-emerald-800/60 px-2.5 py-1 rounded-full">
                    Recommended Kinetic Fuel Swap
                  </span>
                  <span className="text-xs font-bold text-emerald-100 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> Hot Locker Ready
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={suggestedMeal.imageUrl}
                    alt={suggestedMeal.name}
                    className="w-full sm:w-28 h-28 rounded-2xl object-cover shrink-0 border-2 border-emerald-400/40"
                  />
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-lg font-extrabold text-white">
                      {suggestedMeal.name}
                    </h4>
                    <p className="text-xs text-emerald-100 leading-snug">
                      {analysisResult.reason}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs font-semibold text-emerald-200">
                      <span>{suggestedMeal.protein}g Pure Protein</span>
                      <span>·</span>
                      <span>{suggestedMeal.calories} KCAL</span>
                      <span>·</span>
                      <span>S${suggestedMeal.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onSelectMealDetail(suggestedMeal)}
                    className="w-full sm:w-1/2 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    View Nutrition Matrix
                  </button>

                  <button
                    onClick={() => onInstantReserve(suggestedMeal, 'hot')}
                    className="w-full sm:w-1/2 py-2.5 bg-white text-[#006948] hover:bg-emerald-50 font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Reserve in Nearest Pod</span>
                  </button>
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
