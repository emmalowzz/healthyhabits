import React, { useState } from 'react';
import { 
  Flame, 
  Snowflake, 
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  Camera,
  Calculator,
  ShieldCheck,
  Smartphone,
  Monitor,
  Award,
  CalendarDays,
  Crown
} from 'lucide-react';
import { PodLocation, DispenseTemperature, UserPerformanceProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPod: PodLocation;
  setSelectedPod: (pod: PodLocation) => void;
  allPods: PodLocation[];
  cartCount: number;
  openCart: () => void;
  globalTemp: DispenseTemperature;
  setGlobalTemp: (temp: DispenseTemperature) => void;
  openLockerDemo: () => void;
  userProfile: UserPerformanceProfile;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (mobile: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedPod,
  setSelectedPod,
  allPods,
  cartCount,
  openCart,
  globalTemp,
  setGlobalTemp,
  openLockerDemo,
  userProfile,
  isMobileDeviceView,
  setIsMobileDeviceView
}) => {
  const [podDropdownOpen, setPodDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#faf8ff]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Athletic Telemetry Bar */}
      <div className="bg-[#006948] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold tracking-wide">ACTIVE NETWORK:</span>
            <span>6 Smart Pods Live Across ActiveSG Gyms</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-100">
            <button
              onClick={() => setActiveTab('membership')}
              className="flex items-center gap-1 bg-amber-400/90 hover:bg-amber-300 px-2.5 py-0.5 rounded-full text-slate-900 font-bold transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Kinetic+</span>
            </button>
            {/* User points pill */}
            <button
              onClick={() => setActiveTab('points')}
              className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-2.5 py-0.5 rounded-full text-white font-bold transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>{userProfile.currentStreakDays}d Streak</span>
              <span className="text-emerald-300">·</span>
              <span className="text-emerald-200 font-mono">{userProfile.totalPoints} PTS</span>
            </button>

            {/* Device View Mode Toggle */}
            <div className="hidden lg:flex items-center bg-black/20 rounded-lg p-0.5 border border-emerald-600/40">
              <button
                onClick={() => setIsMobileDeviceView(false)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  !isMobileDeviceView ? 'bg-white text-emerald-950 shadow-2xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Full Responsive View"
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setIsMobileDeviceView(true)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  isMobileDeviceView ? 'bg-white text-emerald-950 shadow-2xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Mobile App View (iPhone / Android Shell)"
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile App</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setActiveTab('meals')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-emerald-600"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  KINETIC<span className="text-[#006948]">FUEL</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                  ActiveSG
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block xl:hidden">
                Clinical Recovery Nutrition · Smart Hot & Cold Lockers
              </p>
            </div>
          </button>
        </div>

        {/* Center Navigation */}
        <nav className="hidden xl:flex min-w-0 items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'meals'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recovery Meals
          </button>

          <button
            onClick={() => setActiveTab('points')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'points'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            Points & Streaks
          </button>

          <button
            onClick={() => setActiveTab('why-better')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'why-better'
                ? 'bg-[#006948] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Vs Cooking
          </button>

          <button
            onClick={() => setActiveTab('pods')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pods'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Pods Map
          </button>

          <button
            onClick={() => setActiveTab('book')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'book'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
            Book
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            AI Scanner
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-orange-600" />
            Planner
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Nearest Pod Selector */}
          <div className="relative">
            <button
              onClick={() => setPodDropdownOpen(!podDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:border-emerald-600 transition-colors shadow-2xs text-slate-800 cursor-pointer"
              title="Change your active locker pickup station"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="text-left hidden sm:block max-w-[130px] truncate">
                <span className="text-[10px] text-slate-400 block leading-tight">PICKUP POD</span>
                <span className="font-bold text-xs truncate block">{selectedPod.name.replace('ActiveSG ', '')}</span>
              </div>
              <span className="sm:hidden font-bold">Pod</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {podDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-2 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select ActiveSG or MRT Smart Pod
                </div>
                <div className="max-h-60 overflow-y-auto mt-1 space-y-1">
                  {allPods.map((pod) => (
                    <button
                      key={pod.id}
                      onClick={() => {
                        setSelectedPod(pod);
                        setPodDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between cursor-pointer ${
                        selectedPod.id === pod.id
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{pod.name}</div>
                        <div className="text-[11px] text-slate-500">{pod.distanceMinutesWalk} min walk · {pod.zone}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold block">
                          {pod.hotStockTotal} Hot Ready
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {pod.chillStockTotal} Chilled
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Global Hot / Cold Toggle Switch */}
          <div className="hidden md:flex xl:hidden items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setGlobalTemp('hot')}
              className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                globalTemp === 'hot'
                  ? 'bg-orange-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Hot 65°C
            </button>
            <button
              onClick={() => setGlobalTemp('chill')}
              className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                globalTemp === 'chill'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" />
              Chill 3°C
            </button>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative p-2.5 bg-emerald-50 text-[#006948] rounded-xl hover:bg-emerald-100 transition-colors font-bold flex items-center gap-1.5 cursor-pointer"
            aria-label="View Cart and Lockers"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-[#9d4300] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center -top-1 -right-1 shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
