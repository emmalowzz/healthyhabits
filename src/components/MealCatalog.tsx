import React, { useState } from 'react';
import { 
  Flame, 
  Snowflake, 
  ShieldCheck, 
  Info, 
  Plus, 
  Check, 
  Star, 
  Filter, 
  Sparkles, 
  Zap, 
  ChevronRight,
  Search
} from 'lucide-react';
import { Meal, MealCategory, DispenseTemperature, PodLocation } from '../types';
import { MEALS_DATA } from '../data/mockData';

interface MealCatalogProps {
  onSelectMealDetail: (meal: Meal) => void;
  onAddToCart: (meal: Meal, temp: DispenseTemperature) => void;
  onInstantReserve: (meal: Meal, temp: DispenseTemperature) => void;
  globalTemp: DispenseTemperature;
  selectedPod: PodLocation;
}

export const MealCatalog: React.FC<MealCatalogProps> = ({
  onSelectMealDetail,
  onAddToCart,
  onInstantReserve,
  globalTemp,
  selectedPod
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories: { key: MealCategory; label: string; icon: string }[] = [
    { key: 'all', label: 'All Recovery Meals', icon: '⚡' },
    { key: 'high-protein', label: 'Hyper-Protein (48g+)', icon: '🥩' },
    { key: 'anti-inflammatory', label: 'Anti-Inflammatory (Omega-3)', icon: '🐟' },
    { key: 'glycogen-refuel', label: 'Glycogen Refuel (Carbs)', icon: '🌾' },
    { key: 'lean-cut', label: 'Lean Cut (<400 KCAL)', icon: '🥗' },
    { key: 'plant-power', label: 'Plant Botanical Bio', icon: '🌱' }
  ];

  const filteredMeals = MEALS_DATA.filter((meal) => {
    const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    const matchesSearch = 
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.bestForSport.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (meal: Meal) => {
    onAddToCart(meal, globalTemp);
    setAddedAnimationId(meal.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Catalog Title & Pod Stock Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sports Nutritionist Curated Menu
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Targeted Sports Recovery Meals
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Each tray is vacuum-sealed in biopolymer and held in dual-temperature chambers at <strong>{selectedPod.name}</strong>.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sport, salmon, steak, soba..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
        </div>
      </div>

      {/* Category Filter Pills (Functional Filter Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.key
                ? 'bg-[#006948] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Meal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => {
          const isAdded = addedAnimationId === meal.id;
          const hotAvailable = meal.hotStock > 0;
          const chillAvailable = meal.chillStock > 0;

          return (
            <div
              key={meal.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Image Badges */}
              <div className="relative h-52 sm:h-56 overflow-hidden">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />

                {/* HPB Seal & Score */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {meal.hpbCertified && (
                    <span className="bg-white/95 backdrop-blur-md text-rose-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1 border border-rose-200">
                      <ShieldCheck className="w-3 h-3 text-rose-600" />
                      HPB Healthier Choice
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                  S${meal.price.toFixed(2)}
                </div>

                {/* Bottom title on photo */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold mb-0.5">
                    <span>{meal.recoveryWindow}</span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight line-clamp-1">
                    {meal.name}
                  </h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {meal.tagline}
                  </p>

                  {/* Macro Progress Rings / Indicators */}
                  <div className="grid grid-cols-4 gap-2 bg-[#faf8ff] p-2.5 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <div className="text-base font-extrabold text-orange-600">
                        {meal.protein}g
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Protein</div>
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-amber-600">
                        {meal.carbs}g
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Carbs</div>
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-blue-600">
                        {meal.fat}g
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Fats</div>
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-[#006948]">
                        {meal.calories}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">KCAL</div>
                    </div>
                  </div>

                  {/* Sport Tags & Sodium */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">Best for:</span>
                      <span>{meal.bestForSport.slice(0, 2).join(', ')}</span>
                    </div>
                    <div className="font-medium text-emerald-800">
                      Sodium: {meal.sodiumMg}mg
                    </div>
                  </div>

                  {/* Pod Chamber Live Stock Telemetry */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Locker Stock:</span>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 font-bold ${hotAvailable ? 'text-orange-600' : 'text-slate-400'}`}>
                        <Flame className="w-3 h-3" />
                        {meal.hotStock} Hot Ready
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className={`flex items-center gap-1 font-bold ${chillAvailable ? 'text-sky-600' : 'text-slate-400'}`}>
                        <Snowflake className="w-3 h-3" />
                        {meal.chillStock} Chilled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* View Details */}
                    <button
                      onClick={() => onSelectMealDetail(meal)}
                      className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Details & Macros</span>
                    </button>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAdd(meal)}
                      className={`w-full py-2.5 px-3 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-[#006948]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add ({globalTemp === 'hot' ? 'Hot' : 'Cold'})</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1-Tap Instant Reserve & Unlock */}
                  <button
                    onClick={() => onInstantReserve(meal, globalTemp)}
                    className="w-full py-2.5 px-4 bg-[#006948] hover:bg-[#005137] text-white font-extrabold rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Instant Locker Unlock ({globalTemp === 'hot' ? 'Hot 65°C' : 'Chill 3°C'})</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
