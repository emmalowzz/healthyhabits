import React from 'react';
import { 
  X, 
  Flame, 
  Snowflake, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Award, 
  Zap, 
  Plus,
  HeartPulse,
  ChefHat
} from 'lucide-react';
import { Meal, DispenseTemperature } from '../types';

interface MealDetailModalProps {
  meal: Meal | null;
  onClose: () => void;
  onAddToCart: (meal: Meal, temp: DispenseTemperature) => void;
  onInstantReserve: (meal: Meal, temp: DispenseTemperature) => void;
  globalTemp: DispenseTemperature;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  onClose,
  onAddToCart,
  onInstantReserve,
  globalTemp
}) => {
  if (!meal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72">
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              <span>{meal.category.replace('-', ' ')}</span>
              <span>·</span>
              <span>{meal.recoveryWindow}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
              {meal.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              {meal.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Price & Fast Overview */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-2xl font-extrabold text-slate-900">
                S${meal.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 ml-2">Per recovery meal</span>
            </div>

            <div className="flex items-center gap-2">
              {meal.hpbCertified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  HPB Healthier Choice
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                SFA Grade A Kitchen
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Formulation & Culinary Profile
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {meal.description}
            </p>
          </div>

          {/* Macro Hexad Grid */}
          <div className="bg-[#faf8ff] p-4 rounded-2xl border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Verified Laboratory Macronutrients</span>
              <span className="text-emerald-700 font-bold">100% Bioavailable</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <div className="text-xl font-extrabold text-orange-600">{meal.protein}g</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Protein (Amino)</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <div className="text-xl font-extrabold text-amber-600">{meal.carbs}g</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Net Carbs</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <div className="text-xl font-extrabold text-blue-600">{meal.fat}g</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Healthy Fats</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <div className="text-xl font-extrabold text-[#006948]">{meal.calories}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Total KCAL</div>
              </div>
            </div>
          </div>

          {/* Micronutrient Recovery Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              Micronutrient & Peptide Recovery Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {meal.micronutrients.map((micro, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{micro.name}</span>
                    <span className="text-[#006948] font-extrabold">{micro.amount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {micro.benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutritionist Endorsement */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <ChefHat className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-emerald-950 italic">
                "{meal.nutritionistQuote}"
              </p>
              <div className="text-[11px] font-bold text-emerald-800 mt-1">
                — {meal.nutritionistName}
              </div>
            </div>
          </div>

          {/* Clean Ingredients & Allergens */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-700 shrink-0">Clean Ingredients:</span>
              <span className="text-slate-600">{meal.ingredients.join(', ')}</span>
            </div>
            {meal.allergens.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-700 shrink-0">Allergens:</span>
                <span className="text-slate-600">{meal.allergens.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Footer CTAs */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onAddToCart(meal, globalTemp);
                onClose();
              }}
              className="w-full sm:w-1/2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#006948] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart ({globalTemp === 'hot' ? 'Hot' : 'Cold'})</span>
            </button>

            <button
              onClick={() => {
                onInstantReserve(meal, globalTemp);
                onClose();
              }}
              className="w-full sm:w-1/2 py-3 px-4 bg-[#006948] hover:bg-[#005137] text-white font-extrabold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Instant Locker Unlock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
