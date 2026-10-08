import { SportActivity, SportsVenue } from '../types';

export const SPORT_ACTIVITIES: SportActivity[] = [
  'Badminton',
  'Tennis',
  'Swimming',
  'Gym',
  'Basketball',
  'Futsal'
];

export const SPORTS_VENUES: SportsVenue[] = [
  {
    id: 'venue-delta',
    name: 'ActiveSG Delta Sports Centre',
    zone: 'Central',
    activities: ['Badminton', 'Gym', 'Swimming', 'Basketball'],
    linkedPodId: 'pod-activesg-delta',
    pricePerSlotSgd: 3.5
  },
  {
    id: 'venue-bishan',
    name: 'ActiveSG Bishan Sports Hall',
    zone: 'Central',
    activities: ['Badminton', 'Basketball', 'Gym', 'Futsal'],
    linkedPodId: 'pod-activesg-bishan',
    pricePerSlotSgd: 3.5
  },
  {
    id: 'venue-jurong-east',
    name: 'ActiveSG Jurong East Stadium & Aquatic Hub',
    zone: 'West',
    activities: ['Swimming', 'Gym', 'Futsal', 'Tennis'],
    linkedPodId: 'pod-jurong-east',
    pricePerSlotSgd: 2.8
  },
  {
    id: 'venue-tampines',
    name: 'Our Tampines Hub ActiveSG',
    zone: 'East',
    activities: ['Badminton', 'Swimming', 'Gym', 'Basketball', 'Futsal'],
    linkedPodId: 'pod-tampines-hub',
    pricePerSlotSgd: 3.0
  },
  {
    id: 'venue-kallang-tennis',
    name: 'Kallang Tennis Centre',
    zone: 'Central',
    activities: ['Tennis'],
    pricePerSlotSgd: 8.0
  }
];

export const SESSION_TIMES = ['07:00', '09:00', '12:00', '17:00', '19:00', '21:00'];

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Recovery meal suggested after each activity (ids from MEALS_DATA)
export const ACTIVITY_MEAL_PAIRING: Record<SportActivity, string> = {
  Badminton: 'meal-miso-chicken',
  Tennis: 'meal-peri-chicken',
  Swimming: 'meal-salmon-quinoa',
  Gym: 'meal-sirloin-mash',
  Basketball: 'meal-peri-chicken',
  Futsal: 'meal-miso-chicken'
};

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Deterministic mock availability so a slot stays consistent across renders
export function slotsRemaining(venueId: string, activity: SportActivity, dateIso: string, time: string): number {
  const key = `${venueId}|${activity}|${dateIso}|${time}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  // Evening slots are scarcer
  const peak = time >= '17:00' ? 2 : 0;
  return Math.max(0, (hash % 6) - peak);
}

// Next date (from tomorrow onwards, within 7 days) that falls on the given weekday
export function nextDateForWeekday(weekday: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== weekday) {
    d.setDate(d.getDate() + 1);
  }
  return toIsoDate(d);
}
