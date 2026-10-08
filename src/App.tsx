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
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { PerformancePointsView } from './components/PerformancePointsView';
import { MobileAppShell } from './components/MobileAppShell';
import { SportsBooking } from './components/SportsBooking';
import { Membership } from './components/Membership';
import { SPORTS_VENUES, nextDateForWeekday, slotsRemaining } from './data/sportsData';
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
  PerformanceReward,
  SportsBooking as SportsBookingType,
  AutoBookingRule,
  NutritionistMessage
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

  // Sports booking, auto-booking bots & membership state
  const [sportsBookings, setSportsBookings] = useState<SportsBookingType[]>([]);
  const [autoRules, setAutoRules] = useState<AutoBookingRule[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [nutritionistMessages, setNutritionistMessages] = useState<NutritionistMessage[]>([
    {
      id: 'msg-welcome',
      from: 'nutritionist',
      text: "Hi! I'm Samantha, your board-certified sports nutritionist. Tell me about your training this week and I'll help plan your recovery meals.",
      sentAt: 'Today'
    }
  ]);

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

  const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const handleBookSession = (booking: Omit<SportsBookingType, 'id'>) => {
    setSportsBookings((prev) => [...prev, { ...booking, id: newId('bk') }]);
  };

  const handleCancelSession = (bookingId: string) => {
    setSportsBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleAddMealPickup = (bookingId: string, meal: Meal) => {
    const booking = sportsBookings.find((b) => b.id === bookingId);
    const venue = SPORTS_VENUES.find((v) => v.id === booking?.venueId);
    const pod = POD_LOCATIONS.find((p) => p.id === venue?.linkedPodId) || selectedPod;
    setSportsBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, mealPickupMealId: meal.id } : b))
    );
    awardOrderPoints(meal);
    setLockerModalState({ isOpen: true, meal, pod, temperature: globalTemp });
  };

  // The bot books the next occurrence straight away if a slot is open, otherwise it waits
  const runAutoBot = (rule: AutoBookingRule): AutoBookingRule => {
    if (!rule.enabled) return rule;
    const dateIso = nextDateForWeekday(rule.weekday);
    if (slotsRemaining(rule.venueId, rule.activity, dateIso, rule.time) === 0) {
      return { ...rule, lastBookedDateIso: undefined };
    }
    setSportsBookings((prev) =>
      prev.some((b) => b.venueId === rule.venueId && b.activity === rule.activity && b.dateIso === dateIso && b.time === rule.time)
        ? prev
        : [...prev, { id: newId('bk'), venueId: rule.venueId, activity: rule.activity, dateIso, time: rule.time, createdBy: 'autobot' }]
    );
    return { ...rule, lastBookedDateIso: dateIso };
  };

  const handleAddAutoRule = (rule: Omit<AutoBookingRule, 'id' | 'enabled'>) => {
    const created = runAutoBot({ ...rule, id: newId('bot'), enabled: true });
    setAutoRules((prev) => [...prev, created]);
  };

  const handleToggleAutoRule = (ruleId: string) => {
    const rule = autoRules.find((r) => r.id === ruleId);
    if (!rule) return;
    const toggled = rule.enabled ? { ...rule, enabled: false } : runAutoBot({ ...rule, enabled: true });
    setAutoRules((prev) => prev.map((r) => (r.id === ruleId ? toggled : r)));
  };

  const handleDeleteAutoRule = (ruleId: string) => {
    setAutoRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleSendNutritionistMessage = (text: string) => {
    const now = new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });
    setNutritionistMessages((prev) => [...prev, { id: newId('msg'), from: 'user', text, sentAt: now }]);
    setTimeout(() => {
      setNutritionistMessages((prev) => [
        ...prev,
        { id: newId('msg'), from: 'nutritionist', text: nutritionistReply(text), sentAt: now }
      ]);
    }, 900);
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

          {/* Tab: Sports court & activity booking with auto-booking bots */}
          {activeTab === 'book' && (
            <SportsBooking
              bookings={sportsBookings}
              onBook={handleBookSession}
              onCancelBooking={handleCancelSession}
              onAddMealPickup={handleAddMealPickup}
              autoRules={autoRules}
              onAddAutoRule={handleAddAutoRule}
              onToggleAutoRule={handleToggleAutoRule}
              onDeleteAutoRule={handleDeleteAutoRule}
              isMember={isMember}
              onOpenMembership={() => setActiveTab('membership')}
            />
          )}

          {/* Tab: Kinetic+ membership, referrals, monthly summary, nutritionist chat */}
          {activeTab === 'membership' && (
            <Membership
              isMember={isMember}
              onToggleMembership={() => setIsMember((m) => !m)}
              userProfile={userProfile}
              bookings={sportsBookings}
              referralCount={referralCount}
              onSimulateReferral={() => setReferralCount((c) => c + 1)}
              messages={nutritionistMessages}
              onSendMessage={handleSendNutritionistMessage}
            />
          )}

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
          isMember={isMember}
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

// Canned demo replies until a real nutritionist messaging backend is connected
function nutritionistReply(text: string): string {
  const t = text.toLowerCase();
  if (/(cut|lose|weight|fat)/.test(t)) {
    return 'For a cut, keep protein high (around 2g/kg) and pick lean meals like the Barramundi & Cauli-Mash. Avoid skipping the post-session meal; that is when muscle loss creeps in.';
  }
  if (/(marathon|run|race|endurance|cycling|swim)/.test(t)) {
    return 'For endurance sessions, refuel carbohydrates within 45 minutes. The Miso Chicken & Soba or Salmon Quinoa bowl give you a good 3:1 carb-to-protein ratio.';
  }
  if (/(muscle|strength|gym|lift|protein)/.test(t)) {
    return 'After strength work aim for 30-50g protein with some carbs. The Sirloin & Sweet Potato (52g protein) is ideal within an hour of training.';
  }
  if (/(senior|knee|joint|elderly|old)/.test(t)) {
    return 'For joint health, prioritise omega-3s and anti-inflammatory foods. The Salmon & Quinoa bowl with turmeric greens is a gentle, balanced option.';
  }
  return 'Thanks for sharing! Tell me your sport, how often you train and your goal (performance, weight, recovery) and I will suggest a weekly meal plan.';
}
