import React, { useState } from 'react';
import { 
  Flame, 
  Award, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Copy, 
  Check,
  Star,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  UserPerformanceProfile, 
  PerformanceBadge, 
  PerformanceReward 
} from '../types';

interface PerformancePointsViewProps {
  userProfile: UserPerformanceProfile;
  badges: PerformanceBadge[];
  rewards: PerformanceReward[];
  onRedeemReward: (reward: PerformanceReward) => void;
  onApplyVoucherToCart: (voucherCode: string) => void;
  onOrderMealClick: () => void;
}

export const PerformancePointsView: React.FC<PerformancePointsViewProps> = ({
  userProfile,
  badges,
  rewards,
  onRedeemReward,
  onApplyVoucherToCart,
  onOrderMealClick
}) => {
  const [activeTab, setActiveTab] = useState<'streak' | 'badges' | 'rewards'>('streak');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const progressPercent = Math.min(
    100,
    Math.round((userProfile.totalPoints / userProfile.nextTierPoints) * 100)
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClaimReward = (reward: PerformanceReward) => {
    onRedeemReward(reward);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      
      {/* Top Hero Performance Points Card */}
      <div className="bg-gradient-to-br from-slate-900 via-[#004730] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-900/60">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Kinetic Performance Habit Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Recovery Points & Streaks
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-bold text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{userProfile.levelTitle}</span>
              </div>
            </div>
          </div>

          {/* Points & Streak Big Stat Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Total Points */}
            <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                PERFORMANCE POINTS
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 flex items-baseline gap-1">
                {userProfile.totalPoints}
                <span className="text-xs font-semibold text-slate-300 font-mono">PTS</span>
              </div>
              <span className="text-[11px] text-emerald-200/80 mt-1 block">
                +{userProfile.nextTierPoints - userProfile.totalPoints} pts to Level 3 Elite
              </span>
            </div>

            {/* Current Streak */}
            <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-orange-500/30">
              <span className="text-[10px] text-orange-200 font-bold uppercase tracking-wider block">
                ACTIVE STREAK
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-orange-400 mt-1 flex items-baseline gap-1">
                <Flame className="w-7 h-7 text-orange-500 fill-orange-500 inline-block animate-pulse" />
                {userProfile.currentStreakDays}
                <span className="text-xs font-semibold text-orange-200 font-mono">DAYS</span>
              </div>
              <span className="text-[11px] text-orange-200/90 mt-1 block">
                Best streak: {userProfile.bestStreakDays} consecutive days
              </span>
            </div>

            {/* Next Milestone Reward */}
            <div className="col-span-2 sm:col-span-1 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider block">
                  NEXT STREAK REWARD
                </span>
                <div className="text-base font-extrabold text-white mt-1">
                  7-Day Anabolic Master
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Unlock +250 bonus points & S$15 voucher in 3 days!
                </p>
              </div>

              <div className="w-full bg-white/10 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(userProfile.currentStreakDays / 7) * 100}%` }}
                />
              </div>
            </div>

          </div>

          {/* Tier Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Level 2: Consistent Performer</span>
              <span className="font-mono text-emerald-300">{userProfile.totalPoints} / {userProfile.nextTierPoints} PTS</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setActiveTab('streak')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'streak'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>7-Day Recovery Streak</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Redeem Rewards</span>
        </button>
      </div>

      {/* Tab 1: 7-Day Streak & Habit Mechanics */}
      {activeTab === 'streak' && (
        <div className="space-y-6">
          {/* Streak Timeline Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Weekly Habit Tracker
                </h3>
                <p className="text-xs text-slate-500">
                  Order 1 nutritionally balanced meal daily to maintain your recovery streak.
                </p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                4-Day Streak Live
              </span>
            </div>

            {/* 7 Days Visual Indicators */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {userProfile.weeklyStreak.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-between transition-all ${
                    day.isCompleted
                      ? 'bg-emerald-50 border-2 border-emerald-500/60 shadow-2xs'
                      : day.dayName === 'Today'
                      ? 'bg-orange-50 border-2 border-orange-500/60 animate-pulse'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {day.dayName}
                  </span>
                  
                  <div className="my-2">
                    {day.isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-mono font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold ${
                    day.isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {day.isCompleted ? '+60 PTS' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            {/* Streak Clinical Insight */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Why Consecutive Days Matter:</strong> Research in the <em>Journal of Applied Physiology</em> shows that consuming bioavailable leucine and anti-inflammatory Omega-3s consistently over 5+ days lowers muscle protein breakdown by 34% compared to sporadic eating.
              </div>
            </div>
          </div>

          {/* How Points Are Earned */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              How To Earn Performance Points
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🥗</span>
                  <div>
                    <div className="font-bold text-slate-900">Order Balanced Meal</div>
                    <div className="text-[11px] text-slate-500">HPB Healthier Choice certified</div>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                  +50 PTS
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <div className="font-bold text-slate-900">Golden Window Pickup</div>
                    <div className="text-[11px] text-slate-500">Hot locker within 45m post-workout</div>
                  </div>
                </div>
                <span className="font-extrabold text-orange-700 bg-orange-100 px-2 py-1 rounded-lg">
                  +25 BONUS
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🔥</span>
                  <div>
                    <div className="font-bold text-slate-900">3-Day Streak Bonus</div>
                    <div className="text-[11px] text-slate-500">3 consecutive days completed</div>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                  +100 PTS
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌱</span>
                  <div>
                    <div className="font-bold text-slate-900">Eco-Tray Recycling</div>
                    <div className="text-[11px] text-slate-500">Return tray to pod receptacle</div>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                  +10 PTS
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onOrderMealClick}
                className="w-full sm:w-auto px-6 py-3 bg-[#006948] hover:bg-[#005137] text-white font-extrabold rounded-xl text-xs transition-colors shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order Today's Meal to Keep Streak Active</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Badges Collection */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((badge) => {
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-emerald-300 shadow-2xs ring-1 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-emerald-100 to-amber-100 border border-emerald-200 shadow-xs'
                    : 'bg-slate-200 text-slate-400 border border-slate-300'
                }`}>
                  {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                        +{badge.pointsAwarded} PTS
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full shrink-0">
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">
                    {badge.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-400">
                      Criteria: {badge.criteria}
                    </span>
                    {badge.unlockedDate && (
                      <span className="text-emerald-700 font-bold">
                        Earned {badge.unlockedDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Rewards Redemption Store */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
            <span>Available Balance to Spend:</span>
            <span className="font-extrabold text-emerald-800 text-sm">
              {userProfile.totalPoints} Performance Points
            </span>
          </div>

          <div className="space-y-3">
            {rewards.map((reward) => {
              const canAfford = userProfile.totalPoints >= reward.costPoints;
              const isClaimed = reward.claimed;

              return (
                <div
                  key={reward.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {reward.title}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        {reward.costPoints} PTS
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {reward.description}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400 pt-0.5">
                      Voucher Code: <strong>{reward.voucherCode}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isClaimed ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(reward.voucherCode)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode === reward.voucherCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => onApplyVoucherToCart(reward.voucherCode)}
                          className="px-4 py-2 bg-[#006948] hover:bg-[#005137] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                        >
                          Apply to Cart
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimReward(reward)}
                        disabled={!canAfford}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-[#006948] hover:bg-[#005137] text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Redeem with Points' : 'Need More Points'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
