import React, { useState } from 'react';
import { 
  Clock, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Flame, 
  Bed, 
  Dumbbell, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  Quote,
  Star
} from 'lucide-react';
import { COOKING_VS_KINETIC_FACTS, ATHLETE_TESTIMONIALS } from '../data/mockData';

interface CookingComparisonProps {
  onExploreMeals: () => void;
  onApplyVoucher: (code: string) => void;
}

export const CookingComparison: React.FC<CookingComparisonProps> = ({
  onExploreMeals,
  onApplyVoucher
}) => {
  const [mealsPerWeek, setMealsPerWeek] = useState<number>(7);
  const [hourlyValueSgd, setHourlyValueSgd] = useState<number>(40);

  // Calculations
  const cookingMinutesPerMeal = 50; // 15m shopping/planning prorated + 25m prep/cook + 10m clean
  const weeklyHoursLost = ((mealsPerWeek * cookingMinutesPerMeal) / 60);
  const monthlyHoursLost = Math.round(weeklyHoursLost * 4.3);
  
  // Weekly grocery spoilage in SG (veggies turning slimy, sauces expiring)
  const weeklyFoodWasteSgd = Math.round(mealsPerWeek * 4.2);
  const monthlyFoodWasteSgd = Math.round(weeklyFoodWasteSgd * 4.3);

  // Time value saved
  const monthlyTimeValueSaved = Math.round(monthlyHoursLost * hourlyValueSgd);

  // Recovery sleep equivalent (mins per day)
  const extraSleepMinsPerDay = Math.round((monthlyHoursLost * 60) / 30);

  return (
    <div className="py-12 bg-[#faf8ff] text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            The High-Performance Athlete Equation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Why Cooking Your Own Meals Is <br />
            <span className="text-[#006948]">Stealing Your Recovery & Time</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            In modern sports biochemistry, recovery is won or lost in the first 45 minutes post-workout. 
            Spending two hours in the kitchen chopping chicken breasts and scrubbing pans isn't discipline—it's burnout.
          </p>
        </div>

        {/* Interactive Savings & Sleep Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Control */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>How many healthy meals do you eat per week?</span>
                  <span className="text-xl font-extrabold text-[#006948] bg-emerald-50 px-3 py-1 rounded-xl">
                    {mealsPerWeek} meals / wk
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="14"
                  step="1"
                  value={mealsPerWeek}
                  onChange={(e) => setMealsPerWeek(Number(e.target.value))}
                  className="w-full accent-[#006948] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>3 meals (Post-gym only)</span>
                  <span>7 meals (Daily dinners)</span>
                  <span>14 meals (Lunch & Dinner)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>What is 1 hour of your personal time worth?</span>
                  <span className="font-bold text-slate-900">S${hourlyValueSgd}/hr</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={hourlyValueSgd}
                  onChange={(e) => setHourlyValueSgd(Number(e.target.value))}
                  className="w-full accent-slate-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Quick Prompt Pill */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Zero Grocery Time:</strong> An average Singapore trip to FairPrice or Cold Storage takes 55 minutes, plus unpacking, marinating, and disposing of packaging waste.
                </div>
              </div>
            </div>

            {/* Calculated Dynamic Metrics */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Metric 1: Hours Freed Up */}
              <div className="bg-gradient-to-br from-[#faf8ff] to-emerald-50/50 p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {monthlyHoursLost} <span className="text-lg font-bold text-emerald-800">hrs/mo</span>
                </div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Time Freed From Kitchen
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Equivalent to <strong>{Math.round(monthlyHoursLost / 1.5)} full training sessions</strong> or weekend outdoor runs.
                </p>
              </div>

              {/* Metric 2: Extra Sleep */}
              <div className="bg-gradient-to-br from-[#faf8ff] to-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Bed className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  +{extraSleepMinsPerDay} <span className="text-lg font-bold text-amber-800">min</span>
                </div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Extra Sleep Every Night
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Sleep is when 95% of human growth hormone (HGH) is released for muscle repair.
                </p>
              </div>

              {/* Metric 3: Avoided Spoilage & Labor Value */}
              <div className="bg-gradient-to-br from-[#faf8ff] to-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  S${monthlyFoodWasteSgd}
                </div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Food Waste Prevented
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Zero slimy herbs or half-used sauces thrown in the rubbish bin.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Head-to-Head Comparison Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                The Reality Check: Meal Prep vs Kinetic Fuel
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Direct side-by-side audit of what actually happens during your weekly routine.
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              HPB Clinical Benchmark
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
            <div className="grid grid-cols-12 bg-slate-900 text-white p-4 font-bold text-xs uppercase tracking-wider">
              <div className="col-span-3">Aspect</div>
              <div className="col-span-4 text-rose-300">Home Meal Prep (Cooking Yourself)</div>
              <div className="col-span-5 text-emerald-300">Kinetic Fuel Smart Locker Pod</div>
            </div>

            <div className="divide-y divide-slate-100">
              {COOKING_VS_KINETIC_FACTS.map((fact, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-slate-50/60 transition-colors">
                  <div className="col-span-3 font-bold text-slate-900 flex items-center gap-1.5">
                    {fact.aspect}
                  </div>
                  
                  <div className="col-span-4 pr-3 text-slate-600 flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span>{fact.homeCooking}</span>
                    </div>
                  </div>

                  <div className="col-span-5 pl-3 text-slate-900 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{fact.kineticFuel}</span>
                      <div className="text-[11px] text-[#006948] font-bold mt-1">
                        👉 {fact.impact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Athlete Testimonials */}
        <div className="space-y-4 pt-4">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Validated By Singapore Athletes
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              From Hyrox champions to corporate marathoners who stopped wasting their life cooking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ATHLETE_TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500">{t.role}</div>
                    <div className="text-[10px] font-semibold text-[#006948]">{t.verifiedPill}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Action Banner */}
        <div className="bg-gradient-to-r from-[#006948] to-[#00855d] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              First-Time ActiveSG Athlete Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Get Your 1st Recovery Meal Free at Any Smart Locker
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Use promo code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">FIRSTFUEL</span> during checkout or tap below to auto-apply 100% off your first hot or chilled meal sample!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onApplyVoucher('FIRSTFUEL')}
              className="px-6 py-3.5 bg-white text-[#006948] hover:bg-emerald-50 font-extrabold rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer whitespace-nowrap"
            >
              Claim Free Meal Voucher
            </button>
            <button
              onClick={onExploreMeals}
              className="px-5 py-3.5 bg-emerald-900/40 hover:bg-emerald-900/60 text-white font-bold rounded-xl border border-emerald-400/30 transition-all text-xs sm:text-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>View Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
