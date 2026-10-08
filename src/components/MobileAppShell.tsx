import React from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  ShoppingBag, 
  Flame, 
  ArrowRight,
  Smartphone,
  Monitor
} from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { CartItem } from '../types';

interface MobileAppShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItems: CartItem[];
  openCart: () => void;
  currentStreakDays: number;
  totalPoints: number;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (mobile: boolean) => void;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  children,
  activeTab,
  setActiveTab,
  cartItems,
  openCart,
  currentStreakDays,
  totalPoints,
  isMobileDeviceView,
  setIsMobileDeviceView
}) => {
  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, i) => acc + i.meal.price * i.quantity, 0);

  if (!isMobileDeviceView) {
    // Standard Responsive Desktop View with Mobile Bottom Nav on small viewports
    return (
      <div className="relative min-h-screen pb-20 xl:pb-0">
        {children}

        {/* Floating Cart Pill on small screens */}
        {totalCartCount > 0 && (
          <div className="xl:hidden fixed bottom-18 left-4 right-4 z-40">
            <button
              onClick={openCart}
              className="w-full py-3 px-4 bg-[#006948] hover:bg-[#005137] text-white rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer border border-emerald-400/30"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-300" />
                <span>{totalCartCount} recovery {totalCartCount === 1 ? 'meal' : 'meals'}</span>
                <span className="text-emerald-300">·</span>
                <span className="font-mono text-emerald-200">S${totalCartPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-200">
                <span>Reserve Locker Bay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}

        {/* Mobile Bottom Navigation pinned for narrow viewports */}
        <div className="xl:hidden">
          <MobileBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={totalCartCount}
            openCart={openCart}
            currentStreakDays={currentStreakDays}
            totalPoints={totalPoints}
          />
        </div>
      </div>
    );
  }

  // Mobile App Device View (Realistic Smartphone Frame preview)
  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4 flex flex-col items-center justify-center">
      {/* Top Device Bar Controls */}
      <div className="w-full max-w-sm flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>ActiveSG Mobile App Mode</span>
        </div>
        <button
          onClick={() => setIsMobileDeviceView(false)}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit Mobile Frame</span>
        </button>
      </div>

      {/* Realistic Phone Enclosure Frame */}
      <div className="w-full max-w-[420px] h-[860px] bg-black rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_12px_#1e293b] border-4 border-slate-700/80 relative flex flex-col overflow-hidden">
        
        {/* Dynamic Island & Hardware Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] text-emerald-400 font-mono">65°C</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="w-full h-8 pt-1 px-7 flex items-center justify-between text-[11px] font-bold text-slate-900 bg-[#faf8ff] z-40 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Phone Content Screen */}
        <div className="flex-1 overflow-y-auto bg-[#faf8ff] rounded-b-[40px] pb-24 no-scrollbar relative">
          {children}

          {/* Floating Cart Pill inside mobile frame */}
          {totalCartCount > 0 && (
            <div className="sticky bottom-18 left-3 right-3 px-3 z-40">
              <button
                onClick={openCart}
                className="w-full py-2.5 px-3.5 bg-[#006948] hover:bg-[#005137] text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-bold transition-all cursor-pointer border border-emerald-400/30"
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{totalCartCount} meals · S${totalCartPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-200 text-[11px]">
                  <span>Unlock Bay →</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Pinned Mobile Tab Bar inside phone frame */}
        <div className="absolute bottom-2 left-3 right-3 z-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
          <MobileBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={totalCartCount}
            openCart={openCart}
            currentStreakDays={currentStreakDays}
            totalPoints={totalPoints}
          />
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
