import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Bot,
  Check,
  Clock,
  MapPin,
  Plus,
  Trash2,
  UtensilsCrossed,
  Crown,
  Power
} from 'lucide-react';
import {
  AutoBookingRule,
  Meal,
  SportActivity,
  SportsBooking as SportsBookingType
} from '../types';
import {
  ACTIVITY_MEAL_PAIRING,
  SESSION_TIMES,
  SPORT_ACTIVITIES,
  SPORTS_VENUES,
  WEEKDAY_NAMES,
  slotsRemaining,
  toIsoDate
} from '../data/sportsData';
import { MEALS_DATA, POD_LOCATIONS } from '../data/mockData';

export const FREE_AUTOBOT_LIMIT = 1;

interface SportsBookingProps {
  bookings: SportsBookingType[];
  onBook: (booking: Omit<SportsBookingType, 'id'>) => void;
  onCancelBooking: (bookingId: string) => void;
  onAddMealPickup: (bookingId: string, meal: Meal) => void;
  autoRules: AutoBookingRule[];
  onAddAutoRule: (rule: Omit<AutoBookingRule, 'id' | 'enabled'>) => void;
  onToggleAutoRule: (ruleId: string) => void;
  onDeleteAutoRule: (ruleId: string) => void;
  isMember: boolean;
  onOpenMembership: () => void;
}

function formatDate(dateIso: string) {
  const d = new Date(`${dateIso}T00:00:00`);
  return d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' });
}

export const SportsBooking: React.FC<SportsBookingProps> = ({
  bookings,
  onBook,
  onCancelBooking,
  onAddMealPickup,
  autoRules,
  onAddAutoRule,
  onToggleAutoRule,
  onDeleteAutoRule,
  isMember,
  onOpenMembership
}) => {
  const [activity, setActivity] = useState<SportActivity>('Badminton');
  const venuesForActivity = SPORTS_VENUES.filter((v) => v.activities.includes(activity));
  const [venueId, setVenueId] = useState(venuesForActivity[0]?.id ?? '');
  const venue = SPORTS_VENUES.find((v) => v.id === venueId && v.activities.includes(activity)) ?? venuesForActivity[0];

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return toIsoDate(d);
    });
  }, []);
  const [dateIso, setDateIso] = useState(days[0]);

  const [ruleWeekday, setRuleWeekday] = useState(2);
  const [ruleTime, setRuleTime] = useState('19:00');

  const canAddBot = isMember || autoRules.length < FREE_AUTOBOT_LIMIT;

  const isAlreadyBooked = (time: string) =>
    bookings.some(
      (b) => b.venueId === venue?.id && b.activity === activity && b.dateIso === dateIso && b.time === time
    );

  const upcoming = [...bookings].sort((a, b) => `${a.dateIso}${a.time}`.localeCompare(`${b.dateIso}${b.time}`));

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
          <CalendarDays className="w-4 h-4 text-emerald-600" />
          All sports bookings in one app
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Book Courts &amp; Activities
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Book ActiveSG courts, pools and gyms, set an auto-booking bot for your weekly sessions, and have a recovery meal waiting at the venue's smart pod when you finish.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
          {/* Activity chips */}
          <div className="flex flex-wrap gap-2">
            {SPORT_ACTIVITIES.map((a) => (
              <button
                key={a}
                onClick={() => {
                  setActivity(a);
                  const first = SPORTS_VENUES.find((v) => v.activities.includes(a));
                  if (first) setVenueId(first.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  activity === a ? 'bg-[#006948] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {venuesForActivity.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVenueId(v.id)}
                  className={`text-left p-3 rounded-xl border cursor-pointer transition-colors ${
                    venue?.id === v.id ? 'border-[#006948] bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900">{v.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {v.zone} · S${v.pricePerSlotSgd.toFixed(2)} / slot
                  </div>
                  {v.linkedPodId && (
                    <div className="text-[10px] font-bold text-emerald-700 mt-1">Smart meal pod on site</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setDateIso(d)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    dateIso === d ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {formatDate(d)}
                </button>
              ))}
            </div>
          </div>

          {/* Slots */}
          {venue && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available slots</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SESSION_TIMES.map((time) => {
                  const left = slotsRemaining(venue.id, activity, dateIso, time);
                  const booked = isAlreadyBooked(time);
                  return (
                    <button
                      key={time}
                      disabled={left === 0 || booked}
                      onClick={() =>
                        onBook({ venueId: venue.id, activity, dateIso, time, createdBy: 'manual' })
                      }
                      className={`p-3 rounded-xl border text-left cursor-pointer disabled:cursor-not-allowed transition-colors ${
                        booked
                          ? 'border-emerald-500 bg-emerald-50'
                          : left === 0
                          ? 'border-slate-200 bg-slate-50 opacity-60'
                          : 'border-slate-200 hover:border-[#006948]'
                      }`}
                    >
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {time}
                      </div>
                      <div className="text-[11px] mt-0.5 font-semibold">
                        {booked ? (
                          <span className="text-emerald-700">Booked</span>
                        ) : left === 0 ? (
                          <span className="text-slate-500">Full</span>
                        ) : (
                          <span className="text-slate-600">{left} left · Book</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Auto-booking bots */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold">Auto-booking bots</h3>
          </div>
          <p className="text-xs text-slate-300">
            Pre-set your weekly session. The bot books the next free slot for you as soon as it opens.
          </p>

          <div className="space-y-2">
            {autoRules.length === 0 && (
              <div className="text-xs text-slate-400 italic">No bots yet.</div>
            )}
            {autoRules.map((rule) => {
              const v = SPORTS_VENUES.find((x) => x.id === rule.venueId);
              return (
                <div key={rule.id} className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold">
                      {rule.activity} · every {WEEKDAY_NAMES[rule.weekday]} {rule.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleAutoRule(rule.id)}
                        aria-label={rule.enabled ? 'Pause bot' : 'Resume bot'}
                        className={`p-1 rounded-md cursor-pointer ${rule.enabled ? 'text-emerald-400' : 'text-slate-500'}`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteAutoRule(rule.id)}
                        aria-label="Delete bot"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-slate-400 mt-0.5">{v?.name}</div>
                  <div className="mt-1 text-[11px]">
                    {!rule.enabled ? (
                      <span className="text-slate-500">Paused</span>
                    ) : rule.lastBookedDateIso ? (
                      <span className="text-emerald-400">Booked for {formatDate(rule.lastBookedDateIso)}</span>
                    ) : (
                      <span className="text-amber-300">Slot full. Bot will retry when one frees up.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {venue && (
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="text-xs font-bold text-slate-300">
                New bot: {activity} at {venue.name}
              </div>
              <div className="flex gap-2">
                <select
                  value={ruleWeekday}
                  onChange={(e) => setRuleWeekday(Number(e.target.value))}
                  className="flex-1 bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-xs"
                >
                  {WEEKDAY_NAMES.map((name, i) => (
                    <option key={name} value={i} className="text-slate-900">
                      Every {name}
                    </option>
                  ))}
                </select>
                <select
                  value={ruleTime}
                  onChange={(e) => setRuleTime(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-xs"
                >
                  {SESSION_TIMES.map((t) => (
                    <option key={t} value={t} className="text-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {canAddBot ? (
                <button
                  onClick={() =>
                    onAddAutoRule({ venueId: venue.id, activity, weekday: ruleWeekday, time: ruleTime })
                  }
                  className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs py-2 rounded-lg cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Create bot
                </button>
              ) : (
                <button
                  onClick={onOpenMembership}
                  className="w-full flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs py-2 rounded-lg cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" /> Free plan includes {FREE_AUTOBOT_LIMIT} bot. Upgrade for unlimited.
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-slate-900">My upcoming sessions</h3>
        {upcoming.length === 0 && (
          <div className="text-sm text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center">
            No sessions booked yet. Pick a slot above.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcoming.map((b) => {
            const v = SPORTS_VENUES.find((x) => x.id === b.venueId);
            const pod = POD_LOCATIONS.find((p) => p.id === v?.linkedPodId);
            const pairedMeal = MEALS_DATA.find((m) => m.id === ACTIVITY_MEAL_PAIRING[b.activity]);
            const pickupMeal = MEALS_DATA.find((m) => m.id === b.mealPickupMealId);
            return (
              <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      {b.activity}
                      {b.createdBy === 'autobot' && (
                        <span className="text-[9px] font-black uppercase bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Bot className="w-2.5 h-2.5" /> Bot
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDate(b.dateIso)} · {b.time} · {v?.name}
                    </div>
                  </div>
                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="text-[11px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {pod && pairedMeal && (
                  pickupMeal ? (
                    <div className="text-xs bg-emerald-50 text-emerald-800 rounded-xl px-3 py-2 flex items-center gap-1.5 font-semibold">
                      <Check className="w-3.5 h-3.5" /> {pickupMeal.name} reserved at {pod.name}
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddMealPickup(b.id, pairedMeal)}
                      className="w-full text-left text-xs bg-orange-50 hover:bg-orange-100 text-orange-900 rounded-xl px-3 py-2 flex items-center gap-1.5 font-semibold cursor-pointer"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      Add post-session meal: {pairedMeal.name} (S${pairedMeal.price.toFixed(2)})
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
