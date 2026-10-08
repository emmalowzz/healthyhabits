import React from 'react';
import { 
  Flame, 
  Snowflake, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Award,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { DispenseTemperature } from '../types';

interface HeroBannerProps {
  onExploreMeals: () => void;
  onCompareCooking: () => void;
  onOpenPods: () => void;
  globalTemp: DispenseTemperature;
  setGlobalTemp: (temp: DispenseTemperature) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreMeals,
  onCompareCooking,
  onOpenPods,
  globalTemp,
  setGlobalTemp
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf8ff] via-[#f2f4ff] to-[#faf8ff] border-b border-slate-200/60 py-10 md:py-16">
      {/* Background Decorative Graphic Blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 translate-y-12 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Kicker Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                HPB Healthier Choice Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 border border-slate-200 shadow-2xs">
                <Award className="w-4 h-4 text-blue-600" />
                ActiveSG Gym Partner
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 border border-slate-200 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                SFA Grade A Central Kitchen
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Nutrient-Engineered Recovery. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006948] via-[#00855d] to-[#059669]">
                  Zero Cooking Hassle.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Skip the Sunday grocery rush, greasy pan scrubbing, and macro guesswork. 
                Pick up biochemist-designed recovery meals <span className="font-bold text-slate-900">piping hot at 65°C</span> in 15 seconds outside your gym, or take home chilled for a 3-minute refuel.
              </p>
            </div>

            {/* Quick Interactive Dual-Temperature Switcher Card */}
            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200 shadow-xs max-w-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Select Your Instant Dispense Mode:</span>
                <span className="text-emerald-700 font-semibold">Automated Pod Lockers</span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setGlobalTemp('hot')}
                  className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                    globalTemp === 'hot'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Flame className={`w-4 h-4 ${globalTemp === 'hot' ? 'text-white' : 'text-orange-500'}`} />
                    <span>Hot & Ready</span>
                  </div>
                  <p className={`text-[11px] mt-1 leading-snug ${globalTemp === 'hot' ? 'text-orange-100' : 'text-slate-500'}`}>
                    Dispensed at 65°C. Eat immediately at gym or office bench.
                  </p>
                </button>

                <button
                  onClick={() => setGlobalTemp('chill')}
                  className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                    globalTemp === 'chill'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Snowflake className={`w-4 h-4 ${globalTemp === 'chill' ? 'text-white' : 'text-sky-600'}`} />
                    <span>Take-Home Chill</span>
                  </div>
                  <p className={`text-[11px] mt-1 leading-snug ${globalTemp === 'chill' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Blast-chilled at 3°C. Keeps fresh 4 days, reheats in 3 mins.
                  </p>
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMeals}
                className="px-6 py-3.5 bg-[#006948] hover:bg-[#005137] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                <span>Browse Recovery Meals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCompareCooking}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold rounded-xl shadow-2xs hover:border-slate-400 transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>See Why It Beats Cooking</span>
              </button>

              <button
                onClick={onOpenPods}
                className="px-4 py-3.5 text-slate-700 hover:text-emerald-800 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>ActiveSG Locker Network</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase & Stat Pillars */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Hero Feature Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xl relative overflow-hidden group">
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                  alt="Wild Salmon & Tri-Color Quinoa Recovery Bowl"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Floating Temperature Indicator */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Ready at ActiveSG Delta Pod</span>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-sm">
                  42g PROTEIN
                </div>

                {/* Bottom title in photo */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs uppercase tracking-wider text-emerald-300 font-extrabold">
                    CLINICAL RECOVERY FORMULA
                  </p>
                  <h3 className="text-lg font-bold leading-tight">
                    Wild Salmon & Tri-Color Quinoa Bowl
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
                    <span>520 KCAL</span>
                    <span>·</span>
                    <span>2,150mg Omega-3</span>
                    <span>·</span>
                    <span>Low Sodium HPB</span>
                  </div>
                </div>
              </div>

              {/* 3 Value Comparison Micro-Pillars */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-[#faf8ff] p-2.5 rounded-xl border border-slate-100">
                  <div className="text-lg font-extrabold text-[#006948]">15 sec</div>
                  <div className="text-[11px] text-slate-500 font-medium">Locker Pickup</div>
                </div>
                <div className="bg-[#faf8ff] p-2.5 rounded-xl border border-slate-100">
                  <div className="text-lg font-extrabold text-[#9d4300]">S$0</div>
                  <div className="text-[11px] text-slate-500 font-medium">Grocery Spoilage</div>
                </div>
                <div className="bg-[#faf8ff] p-2.5 rounded-xl border border-slate-100">
                  <div className="text-lg font-extrabold text-blue-700">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Macro Precision</div>
                </div>
              </div>
            </div>

            {/* Live Athlete Habit Alert */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">Recovery Window Guarantee</div>
                  <div className="text-emerald-700 text-[11px]">
                    Consume complete EAAs within 30m of workout for 2.4× muscle protein synthesis.
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
