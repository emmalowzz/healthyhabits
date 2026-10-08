import React, { useState } from 'react';
import {
  Crown,
  Check,
  Copy,
  Gift,
  BarChart3,
  MessageCircle,
  Send,
  Bell,
  Mail,
  Smartphone
} from 'lucide-react';
import {
  NutritionistMessage,
  SportsBooking,
  UserPerformanceProfile
} from '../types';

export const MEMBERSHIP_PRICE_SGD = 10;

interface MembershipProps {
  isMember: boolean;
  onToggleMembership: () => void;
  userProfile: UserPerformanceProfile;
  bookings: SportsBooking[];
  referralCount: number;
  onSimulateReferral: () => void;
  messages: NutritionistMessage[];
  onSendMessage: (text: string) => void;
}

const PERKS = [
  'Unlimited auto-booking bots for courts & activities',
  '10% off every recovery meal',
  'Free delivery to any smart pod',
  'Chat with a board-certified nutritionist',
  'Monthly health & training summary'
];

export const Membership: React.FC<MembershipProps> = ({
  isMember,
  onToggleMembership,
  userProfile,
  bookings,
  referralCount,
  onSimulateReferral,
  messages,
  onSendMessage
}) => {
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState('');
  const [notify, setNotify] = useState({ daily: true, app: true, email: false });

  const referralLink = 'https://kineticfuel.sg/r/ATHLETE-7Q2K';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(text);
    setDraft('');
  };

  const sessionsByActivity = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.activity] = (acc[b.activity] || 0) + 1;
    return acc;
  }, {});
  const mealsWithBookings = bookings.filter((b) => b.mealPickupMealId).length;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <Crown className="w-4 h-4" /> Your health is your true value
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Kinetic+ Membership</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan */}
        <div className={`rounded-2xl p-5 space-y-4 border ${isMember ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">S${MEMBERSHIP_PRICE_SGD}</span>
            <span className="text-sm text-slate-500">/ month</span>
          </div>
          <ul className="space-y-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> {perk}
              </li>
            ))}
          </ul>
          <button
            onClick={onToggleMembership}
            className={`w-full py-2.5 rounded-xl font-extrabold text-sm cursor-pointer ${
              isMember ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-[#006948] text-white hover:bg-[#00573c]'
            }`}
          >
            {isMember ? 'Cancel membership' : 'Join Kinetic+'}
          </button>
          {isMember && <div className="text-xs font-bold text-amber-800 text-center">You're a Kinetic+ member</div>}
        </div>

        {/* Monthly summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-slate-900">
            <BarChart3 className="w-5 h-5 text-emerald-600" /> This month's summary
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Meals ordered" value={userProfile.lifetimeMealsOrdered} />
            <Stat label="HPB healthier choices" value={userProfile.hpbHealthierChoiceCount} />
            <Stat label="Sessions booked" value={bookings.length} />
            <Stat label="Current streak" value={`${userProfile.currentStreakDays}d`} />
          </div>
          {Object.keys(sessionsByActivity).length > 0 && (
            <div className="text-xs text-slate-600 space-y-1">
              {Object.entries(sessionsByActivity).map(([activity, count]) => (
                <div key={activity} className="flex justify-between">
                  <span>{activity}</span>
                  <strong>{count} session{count > 1 ? 's' : ''}</strong>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500">
            {bookings.length === 0
              ? 'Book a session to start tracking training alongside your nutrition.'
              : `${mealsWithBookings} of ${bookings.length} sessions have a recovery meal lined up.`}
          </p>
        </div>

        {/* Referral + notifications */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Gift className="w-5 h-5 text-orange-500" /> Refer a friend
            </div>
            <p className="text-xs text-slate-500">You both get a S$5 meal voucher when they place their first order.</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={referralLink}
                className="flex-1 min-w-0 bg-slate-100 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-700"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Friends joined: <strong>{referralCount}</strong> · Vouchers earned: <strong>S${referralCount * 5}</strong>
              </span>
              <button onClick={onSimulateReferral} className="text-[#006948] font-bold hover:underline cursor-pointer">
                Simulate signup
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Bell className="w-5 h-5 text-blue-600" /> Notifications
            </div>
            <Toggle icon={<Bell className="w-3.5 h-3.5" />} label="Daily meal & training reminder" checked={notify.daily} onChange={() => setNotify((n) => ({ ...n, daily: !n.daily }))} />
            <Toggle icon={<Smartphone className="w-3.5 h-3.5" />} label="App notifications (bookings, pickups)" checked={notify.app} onChange={() => setNotify((n) => ({ ...n, app: !n.app }))} />
            <Toggle icon={<Mail className="w-3.5 h-3.5" />} label="Email vouchers & monthly summary" checked={notify.email} onChange={() => setNotify((n) => ({ ...n, email: !n.email }))} />
          </div>
        </div>
      </div>

      {/* Nutritionist chat */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2 font-extrabold text-slate-900">
          <MessageCircle className="w-5 h-5 text-emerald-600" /> Message a nutritionist
          {!isMember && (
            <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Kinetic+</span>
          )}
        </div>
        {isMember ? (
          <>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.from === 'user' ? 'bg-[#006948] text-white' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {m.text}
                    <div className={`text-[10px] mt-1 ${m.from === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>{m.sentAt}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about recovery, protein, cutting, race prep..."
                className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
              <button
                onClick={handleSend}
                aria-label="Send message"
                className="px-3 rounded-xl bg-[#006948] text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-500">
            Join Kinetic+ to message our board-certified nutritionists about your training and recovery.
          </div>
        )}
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-3">
    <div className="text-xl font-black text-slate-900">{value}</div>
    <div className="text-[11px] text-slate-500">{label}</div>
  </div>
);

const Toggle: React.FC<{ icon: React.ReactNode; label: string; checked: boolean; onChange: () => void }> = ({
  icon,
  label,
  checked,
  onChange
}) => (
  <label className="flex items-center justify-between gap-2 text-xs text-slate-700 cursor-pointer">
    <span className="flex items-center gap-1.5">
      {icon} {label}
    </span>
    <input type="checkbox" checked={checked} onChange={onChange} className="accent-[#006948] w-4 h-4" />
  </label>
);
