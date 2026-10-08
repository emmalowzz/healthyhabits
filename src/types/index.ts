export type MealCategory =
  | 'all'
  | 'high-protein'
  | 'glycogen-refuel'
  | 'lean-cut'
  | 'plant-power'
  | 'anti-inflammatory';

export type DispenseTemperature = 'hot' | 'chill';

export interface Micronutrient {
  name: string;
  amount: string;
  benefit: string;
}

export interface Meal {
  id: string;
  name: string;
  tagline: string;
  category: MealCategory;
  price: number;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sodiumMg: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  description: string;
  hpbCertified: boolean; // Health Promotion Board Healthier Choice
  sfaCertified: boolean;
  nutritionistQuote: string;
  nutritionistName: string;
  recoveryWindow: string; // e.g. "Within 45m post-workout"
  bestForSport: string[];
  allergens: string[];
  ingredients: string[];
  micronutrients: Micronutrient[];
  hotStock: number;
  chillStock: number;
  prepMinutes: number; // heating time if chilled (e.g. 3 mins)
}

export interface PodLocation {
  id: string;
  name: string;
  type: 'ActiveSG Gym' | 'Sports Hub' | 'MRT Transit' | 'Commercial Fitness';
  address: string;
  zone: 'Central' | 'West' | 'North-East' | 'East' | 'South';
  distanceMinutesWalk: number;
  hotStockTotal: number;
  chillStockTotal: number;
  status: 'optimal' | 'low-stock' | 'restocking-soon';
  restockInMins?: number;
  lat: number;
  lng: number;
  chamberTempHot: number; // e.g. 65.2 C
  chamberTempChill: number; // e.g. 3.4 C
  lockersAvailable: number;
}

export interface CartItem {
  meal: Meal;
  temperature: DispenseTemperature;
  quantity: number;
}

export interface MealAnalysisResult {
  foodName: string;
  estimatedCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  sodiumMg: number;
  recoveryScore: number; // 0 - 100
  critique: string;
  missingNutrients: string[];
  suggestedKineticMealId: string;
  reason: string;
}

export interface CookingComparisonMetrics {
  mealsPerWeek: number;
  cookingHoursLost: number;
  cookingDishesWashed: number;
  cookingGroceryCost: number;
  cookingWastedFoodCost: number;
  kineticHoursNeeded: number;
  kineticCost: number;
  netHoursSaved: number;
  netExtraSleepMinutes: number;
}

export interface PerformanceBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  criteria: string;
  tier: 'bronze' | 'silver' | 'gold' | 'elite';
  pointsAwarded: number;
}

export interface PerformanceReward {
  id: string;
  title: string;
  costPoints: number;
  discountType: 'fixed_sgd' | 'percent' | 'free_item' | 'service';
  discountValue: number;
  description: string;
  voucherCode: string;
  claimed: boolean;
}

export interface StreakDay {
  dayName: string; // "Mon", "Tue", etc.
  dateString: string;
  isCompleted: boolean;
  mealName?: string;
  pointsEarned?: number;
}

export interface UserPerformanceProfile {
  totalPoints: number;
  currentStreakDays: number;
  bestStreakDays: number;
  lifetimeMealsOrdered: number;
  hpbHealthierChoiceCount: number;
  levelTitle: string;
  nextTierPoints: number;
  weeklyStreak: StreakDay[];
  unlockedBadgeIds: string[];
  claimedRewardCodes: string[];
}
