import { PerformanceBadge, PerformanceReward, UserPerformanceProfile } from '../types';

export const INITIAL_BADGES: PerformanceBadge[] = [
  {
    id: 'badge-first-fuel',
    title: 'First Kinetic Fuel',
    description: 'Ordered your first clinical sports recovery meal at an ActiveSG pod.',
    icon: '⚡',
    unlocked: true,
    unlockedDate: 'Oct 3, 2026',
    criteria: '1 balanced meal ordered',
    tier: 'bronze',
    pointsAwarded: 50
  },
  {
    id: 'badge-streak-3',
    title: '3-Day Kinetic Momentum',
    description: 'Ordered nutritionally balanced recovery meals 3 days in a row.',
    icon: '🔥',
    unlocked: true,
    unlockedDate: 'Oct 5, 2026',
    criteria: '3 consecutive days',
    tier: 'silver',
    pointsAwarded: 100
  },
  {
    id: 'badge-hpb-champion',
    title: 'HPB Choice Champion',
    description: 'Selected 5 certified Healthier Choice meals with lower sodium.',
    icon: '🛡️',
    unlocked: true,
    unlockedDate: 'Oct 6, 2026',
    criteria: '5 HPB certified meals',
    tier: 'silver',
    pointsAwarded: 150
  },
  {
    id: 'badge-streak-7',
    title: '7-Day Anabolic Streak',
    description: 'A full week of zero meal prep and 100% bioavailable post-workout nutrition.',
    icon: '🏆',
    unlocked: false,
    criteria: '7 consecutive days (4/7 completed)',
    tier: 'gold',
    pointsAwarded: 250
  },
  {
    id: 'badge-recovery-ninja',
    title: '45m Golden Window',
    description: 'Retrieved a hot meal from a gym locker within 45 minutes of finishing training.',
    icon: '⏱️',
    unlocked: false,
    criteria: 'Order hot locker within 45m',
    tier: 'gold',
    pointsAwarded: 120
  },
  {
    id: 'badge-eco-streak',
    title: 'Biopolymer Guardian',
    description: 'Returned 5 eco-trays into the pod recycling receptacle.',
    icon: '🌱',
    unlocked: false,
    criteria: 'Return 5 trays at pod',
    tier: 'bronze',
    pointsAwarded: 80
  },
  {
    id: 'badge-streak-14',
    title: '14-Day Lifestyle Architect',
    description: 'Two weeks without kitchen burnout or grocery waste. Permanent habit formed.',
    icon: '👑',
    unlocked: false,
    criteria: '14 consecutive days',
    tier: 'elite',
    pointsAwarded: 500
  }
];

export const INITIAL_REWARDS: PerformanceReward[] = [
  {
    id: 'reward-sgd-5',
    title: 'S$5.00 Off Any Locker Meal',
    costPoints: 200,
    discountType: 'fixed_sgd',
    discountValue: 5.0,
    description: 'Valid for instant pickup at any ActiveSG or MRT smart vending pod.',
    voucherCode: 'PERF5SGD',
    claimed: false
  },
  {
    id: 'reward-free-bcaa',
    title: 'Free Electrolyte & BCAA Hydration Pouch',
    costPoints: 150,
    discountType: 'free_item',
    discountValue: 4.5,
    description: 'Dispensed alongside your hot or cold meal from locker chamber.',
    voucherCode: 'FREEBCAA',
    claimed: true
  },
  {
    id: 'reward-weekly-15',
    title: 'S$15.00 Off 5-Day Weekly Auto-Plan',
    costPoints: 400,
    discountType: 'fixed_sgd',
    discountValue: 15.0,
    description: 'Save an additional S$15 on your weekly gym locker schedule.',
    voucherCode: 'WEEKLY15OFF',
    claimed: false
  },
  {
    id: 'reward-hpb-50',
    title: '50% Off Wild Salmon or Sirloin Bowl',
    costPoints: 350,
    discountType: 'percent',
    discountValue: 50,
    description: 'Half-price reward for consistent high-protein recovery.',
    voucherCode: 'HPB50PRO',
    claimed: false
  },
  {
    id: 'reward-dietitian',
    title: '1-on-1 Dietitian Tele-Consult (30 Mins)',
    costPoints: 700,
    discountType: 'service',
    discountValue: 65.0,
    description: 'Review blood markers and metabolic output with Dr. Marcus Lim (ActiveSG).',
    voucherCode: 'NUTRITION30',
    claimed: false
  }
];

export const INITIAL_USER_PROFILE: UserPerformanceProfile = {
  totalPoints: 480,
  currentStreakDays: 4,
  bestStreakDays: 6,
  lifetimeMealsOrdered: 11,
  hpbHealthierChoiceCount: 7,
  levelTitle: 'Consistent Performer (Level 2)',
  nextTierPoints: 600,
  weeklyStreak: [
    { dayName: 'Mon', dateString: 'Oct 4', isCompleted: true, mealName: 'Wild Salmon Quinoa Bowl', pointsEarned: 60 },
    { dayName: 'Tue', dateString: 'Oct 5', isCompleted: true, mealName: 'Grass-Fed Sirloin Mash', pointsEarned: 60 },
    { dayName: 'Wed', dateString: 'Oct 6', isCompleted: true, mealName: 'Kyoto Miso Chicken Soba', pointsEarned: 60 },
    { dayName: 'Thu', dateString: 'Today', isCompleted: true, mealName: 'Peri-Peri Chicken Bowl', pointsEarned: 60 },
    { dayName: 'Fri', dateString: 'Tomorrow', isCompleted: false },
    { dayName: 'Sat', dateString: 'Weekend', isCompleted: false },
    { dayName: 'Sun', dateString: 'Weekend', isCompleted: false }
  ],
  unlockedBadgeIds: ['badge-first-fuel', 'badge-streak-3', 'badge-hpb-champion'],
  claimedRewardCodes: ['FREEBCAA']
};
