import React from 'react';
import { 
  UtensilsCrossed, 
  Flame, 
  MapPin, 
  Camera, 
  User, 
  Sparkles, 
  ShoppingBag,
  Zap,
  Calculator
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  currentStreakDays: number;
  totalPoints: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  currentStreakDays,
  totalPoints
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-lg px-2 py-1.5 max-w-md mx-auto sm:max-w-none">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* Tab 1: Meals */}
        <button
          onClick={() => setActiveTab('meals')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'meals'
              ? 'text-[#006948] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <UtensilsCrossed className={`w-5 h-5 ${activeTab === 'meals' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Meals</span>
        </button>

        {/* Tab 2: Points & Streaks */}
        <button
          onClick={() => setActiveTab('points')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'points'
              ? 'text-orange-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Flame className={`w-5 h-5 ${activeTab === 'points' ? 'fill-orange-500 text-orange-500' : 'text-slate-500'}`} />
            <span className="absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full bg-orange-500 text-white text-[9px] font-black">
              {currentStreakDays}d
            </span>
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Streaks</span>
        </button>

        {/* Tab 3: Pods Map */}
        <button
          onClick={() => setActiveTab('pods')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pods'
              ? 'text-[#006948] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <MapPin className={`w-5 h-5 ${activeTab === 'pods' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Pods</span>
        </button>

        {/* Tab 4: AI Scanner */}
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'scanner'
              ? 'text-[#006948] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Camera className={`w-5 h-5 ${activeTab === 'scanner' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Scanner</span>
        </button>

        {/* Tab 5: Vs Cooking / Planner */}
        <button
          onClick={() => setActiveTab('why-better')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'why-better'
              ? 'text-[#006948] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'why-better' ? 'text-amber-500' : 'text-slate-500'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Vs Cooking</span>
        </button>

        {/* Cart Quick Button */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-700 relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#006948] text-white text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Cart</span>
        </button>

      </div>
    </div>
  );
};
