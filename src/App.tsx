import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CookingComparison } from './components/CookingComparison';
import { MealCatalog } from './components/MealCatalog';
import { MealDetailModal } from './components/MealDetailModal';
import { LockerSimulatorModal } from './components/LockerSimulatorModal';
import { PodLocator } from './components/PodLocator';
import { MealScanner } from './components/MealScanner';
import { RecoveryCalculator } from './components/RecoveryCalculator';
import { McpConsole } from './components/McpConsole';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { PerformancePointsView } from './components/PerformancePointsView';
import { MobileAppShell } from './components/MobileAppShell';
import { MEALS_DATA, POD_LOCATIONS } from './data/mockData';
import { 
  INITIAL_BADGES, 
  INITIAL_REWARDS, 
  INITIAL_USER_PROFILE 
} from './data/performanceData';
import { 
  Meal, 
  PodLocation, 
  DispenseTemperature, 
  CartItem, 
  UserPerformanceProfile, 
  PerformanceBadge, 
  PerformanceReward 
} from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('meals');
  const [selectedPod, setSelectedPod] = useState<PodLocation>(POD_LOCATIONS[0]);
  const [globalTemp, setGlobalTemp] = useState<DispenseTemperature>('hot');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      meal: MEALS_DATA[0],
      temperature: 'hot',
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedMealDetail, setSelectedMealDetail] = useState<Meal | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  
  // Gamification & Performance Points State
  const [userProfile, setUserProfile] = useState<UserPerformanceProfile>(INITIAL_USER_PROFILE);
  const [badges, setBadges] = useState<PerformanceBadge[]>(INITIAL_BADGES);
  const [rewards, setRewards] = useState<PerformanceReward[]>(INITIAL_REWARDS);
  const [streakAwardToast, setStreakAwardToast] = useState<{ message: string; points: number } | null>(null);

  // Locker Simulator Modal state
  const [lockerModalState, setLockerModalState] = useState<{
    isOpen: boolean;
    meal?: Meal | null;
    pod: PodLocation;
    temperature: DispenseTemperature;
  }>({
    isOpen: false,
    meal: null,
    pod: POD_LOCATIONS[0],
    temperature: 'hot'
  });

  const handleAddToCart = (meal: Meal, temp: DispenseTemperature) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.meal.id === meal.id && i.temperature === temp
      );
      if (existing) {
        return prev.map((i) =>
          i.meal.id === meal.id && i.temperature === temp
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { meal, temperature: temp, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (
    mealId: string,
    temp: DispenseTemperature,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.meal.id === mealId && item.temperature === temp) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (mealId: string, temp: DispenseTemperature) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.meal.id === mealId && item.temperature === temp)
      )
    );
  };

  const handleInstantReserve = (meal: Meal, temp: DispenseTemperature) => {
    // Reward points for instant reservation
    awardOrderPoints(meal);

    setLockerModalState({
      isOpen: true,
      meal,
      pod: selectedPod,
      temperature: temp
    });
  };

  const handleOpenLockerDemo = () => {
    setLockerModalState({
      isOpen: true,
      meal: MEALS_DATA[0],
      pod: selectedPod,
      temperature: globalTemp
    });
  };

  const handleTestPodLocker = (pod: PodLocation) => {
    setLockerModalState({
      isOpen: true,
      meal: MEALS_DATA[1],
      pod,
      temperature: globalTemp
    });
  };

  const handleApplyVoucher = (code: string) => {
    setAppliedVoucher(code);
    setIsCartOpen(true);
  };

  // Award Points & Update Streaks on Successful Meal Order
  const awardOrderPoints = (meal: Meal) => {
    const earned = meal.hpbCertified ? 75 : 50; // 50 base + 25 HPB bonus
    
    setUserProfile((prev) => {
      const updatedStreak = prev.currentStreakDays + 1;
      const updatedPoints = prev.totalPoints + earned;
      const updatedBest = Math.max(prev.bestStreakDays, updatedStreak);

      // Check if 7-day badge is unlocked
      if (updatedStreak >= 7) {
        setBadges((bList) =>
          bList.map((b) =>
            b.id === 'badge-streak-7'
              ? { ...b, unlocked: true, unlockedDate: 'Today' }
              : b
          )
        );
      }

      return {
        ...prev,
        totalPoints: updatedPoints,
        currentStreakDays: updatedStreak,
        bestStreakDays: updatedBest,
        lifetimeMealsOrdered: prev.lifetimeMealsOrdered + 1,
        hpbHealthierChoiceCount: meal.hpbCertified
          ? prev.hpbHealthierChoiceCount + 1
          : prev.hpbHealthierChoiceCount
      };
    });

    setStreakAwardToast({
      message: `+${earned} Performance Points Earned! Streak Updated 🔥`,
      points: earned
    });

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    setTimeout(() => setStreakAwardToast(null), 3500);
  };

  const handleCheckout = () => {
    const firstMeal = cartItems[0]?.meal || MEALS_DATA[0];
    const firstTemp = cartItems[0]?.temperature || globalTemp;
    
    awardOrderPoints(firstMeal);

    setIsCartOpen(false);
    setCartItems([]);
    setLockerModalState({
      isOpen: true,
      meal: firstMeal,
      pod: selectedPod,
      temperature: firstTemp
    });
  };

  const handleRedeemReward = (reward: PerformanceReward) => {
    if (userProfile.totalPoints < reward.costPoints) return;

    setUserProfile((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - reward.costPoints,
      claimedRewardCodes: [...prev.claimedRewardCodes, reward.voucherCode]
    }));

    setRewards((prev) =>
      prev.map((r) =>
        r.id === reward.id ? { ...r, claimed: true } : r
      )
    );
  };

  return (
    <MobileAppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      cartItems={cartItems}
      openCart={() => setIsCartOpen(true)}
      currentStreakDays={userProfile.currentStreakDays}
      totalPoints={userProfile.totalPoints}
      isMobileDeviceView={isMobileDeviceView}
      setIsMobileDeviceView={setIsMobileDeviceView}
    >
      <div className="min-h-full flex flex-col bg-[#faf8ff] text-[#131b2e]">
        {/* Streak Award Toast Notification */}
        {streakAwardToast && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-2.5 animate-bounce">
            <span className="text-xl">🔥</span>
            <div>
              <div className="text-xs font-extrabold text-emerald-400">
                {streakAwardToast.message}
              </div>
              <div className="text-[10px] text-slate-300">
                Keep ordering balanced recovery meals to unlock S$15 voucher!
              </div>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedPod={selectedPod}
          setSelectedPod={setSelectedPod}
          allPods={POD_LOCATIONS}
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          openCart={() => setIsCartOpen(true)}
          globalTemp={globalTemp}
          setGlobalTemp={setGlobalTemp}
          openLockerDemo={handleOpenLockerDemo}
          userProfile={userProfile}
          isMobileDeviceView={isMobileDeviceView}
          setIsMobileDeviceView={setIsMobileDeviceView}
        />

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Hero Banner only on meals or why-better */}
          {(activeTab === 'meals' || activeTab === 'why-better') && (
            <HeroBanner
              onExploreMeals={() => setActiveTab('meals')}
              onCompareCooking={() => setActiveTab('why-better')}
              onOpenPods={() => setActiveTab('pods')}
              globalTemp={globalTemp}
              setGlobalTemp={setGlobalTemp}
            />
          )}

          {/* Tab 1: Meals Catalog */}
          {activeTab === 'meals' && (
            <MealCatalog
              onSelectMealDetail={(meal) => setSelectedMealDetail(meal)}
              onAddToCart={handleAddToCart}
              onInstantReserve={handleInstantReserve}
              globalTemp={globalTemp}
              selectedPod={selectedPod}
            />
          )}

          {/* Tab 2: Performance Points, Streaks & Badges */}
          {activeTab === 'points' && (
            <PerformancePointsView
              userProfile={userProfile}
              badges={badges}
              rewards={rewards}
              onRedeemReward={handleRedeemReward}
              onApplyVoucherToCart={handleApplyVoucher}
              onOrderMealClick={() => setActiveTab('meals')}
            />
          )}

          {/* Tab 3: Why Better Than Cooking */}
          {activeTab === 'why-better' && (
            <CookingComparison
              onExploreMeals={() => setActiveTab('meals')}
              onApplyVoucher={handleApplyVoucher}
            />
          )}

          {/* Tab 4: Smart Locker Pods Map & Telemetry */}
          {activeTab === 'pods' && (
            <PodLocator
              pods={POD_LOCATIONS}
              selectedPod={selectedPod}
              onSelectPod={(pod) => setSelectedPod(pod)}
              onTestPodLocker={handleTestPodLocker}
            />
          )}

          {/* Tab 5: AI Meal Photo & Recovery Scanner */}
          {activeTab === 'scanner' && (
            <MealScanner
              onSelectMealDetail={(meal) => setSelectedMealDetail(meal)}
              onInstantReserve={handleInstantReserve}
            />
          )}

          {/* Tab 6: Clinical Recovery Calculator & Weekly Locker Schedule */}
          {activeTab === 'calculator' && (
            <RecoveryCalculator
              onSelectMealDetail={(meal) => setSelectedMealDetail(meal)}
              onInstantReserve={handleInstantReserve}
              selectedPod={selectedPod}
            />
          )}

          {/* Tab 7: Extensible MCP & API Engine */}
          {activeTab === 'mcp' && <McpConsole />}
        </div>

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          selectedPod={selectedPod}
          allPods={POD_LOCATIONS}
          onSelectPod={setSelectedPod}
          appliedVoucher={appliedVoucher}
          onApplyVoucher={handleApplyVoucher}
          onCheckout={handleCheckout}
        />

        {/* Meal Detail Nutritional Matrix Modal */}
        <MealDetailModal
          meal={selectedMealDetail}
          onClose={() => setSelectedMealDetail(null)}
          onAddToCart={handleAddToCart}
          onInstantReserve={handleInstantReserve}
          globalTemp={globalTemp}
        />

        {/* Smart Locker Bay Chamber Simulator Modal */}
        {lockerModalState.isOpen && (
          <LockerSimulatorModal
            meal={lockerModalState.meal}
            pod={lockerModalState.pod}
            temperature={lockerModalState.temperature}
            onClose={() =>
              setLockerModalState({
                isOpen: false,
                meal: null,
                pod: selectedPod,
                temperature: 'hot'
              })
            }
          />
        )}

        {/* Footer (hidden inside mobile device view for cleaner phone screen) */}
        {!isMobileDeviceView && (
          <Footer onNavClick={(tab) => setActiveTab(tab)} />
        )}
      </div>
    </MobileAppShell>
  );
}
