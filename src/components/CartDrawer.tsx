import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Flame, 
  Snowflake, 
  Plus, 
  Minus, 
  Ticket, 
  Check, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { CartItem, PodLocation, DispenseTemperature } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (mealId: string, temp: DispenseTemperature, delta: number) => void;
  onRemoveItem: (mealId: string, temp: DispenseTemperature) => void;
  selectedPod: PodLocation;
  allPods: PodLocation[];
  onSelectPod: (pod: PodLocation) => void;
  appliedVoucher: string | null;
  onApplyVoucher: (code: string) => void;
  onCheckout: () => void;
  isMember?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  selectedPod,
  allPods,
  onSelectPod,
  appliedVoucher,
  onApplyVoucher,
  onCheckout,
  isMember = false
}) => {
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.meal.price * item.quantity,
    0
  );

  let discountRate = 0;
  if (appliedVoucher === 'FIRSTFUEL') discountRate = 1.0; // 100% free first meal sample
  else if (appliedVoucher === 'ACTIVESG50') discountRate = 0.5; // 50% off

  const discountAmount = rawSubtotal * discountRate;
  // Kinetic+ members get 10% off what remains after any voucher
  const memberDiscountAmount = isMember ? (rawSubtotal - discountAmount) * 0.1 : 0;
  const netTotal = Math.max(0, rawSubtotal - discountAmount - memberDiscountAmount);

  const handleApplyVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = voucherInput.trim().toUpperCase();
    if (clean === 'FIRSTFUEL' || clean === 'ACTIVESG50') {
      onApplyVoucher(clean);
      setVoucherError('');
      setVoucherInput('');
    } else {
      setVoucherError('Invalid promo code. Try FIRSTFUEL or ACTIVESG50');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Recovery Locker Cart
            </h3>
            <span className="text-xs text-slate-500">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} meals selected
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pickup Pod Selector in Cart */}
        <div className="px-5 py-3 bg-emerald-50/60 border-b border-emerald-100/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-950">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Locker Station</span>
              <span className="font-extrabold">{selectedPod.name}</span>
            </div>
          </div>
          <select
            value={selectedPod.id}
            onChange={(e) => {
              const found = allPods.find((p) => p.id === e.target.value);
              if (found) onSelectPod(found);
            }}
            className="p-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
          >
            {allPods.map((p) => (
              <option key={p.id} value={p.id}>{p.name.split(' ')[1] || p.name}</option>
            ))}
          </select>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800">Your recovery cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our biochemist-designed recovery meals and reserve your locker bay!
              </p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.meal.id}-${item.temperature}`}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={item.meal.imageUrl}
                    alt={item.meal.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {item.meal.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      {item.temperature === 'hot' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                          <Flame className="w-3 h-3" /> Hot 65°C Dispense
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                          <Snowflake className="w-3 h-3" /> Chill 3°C Take-Home
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {item.meal.protein}g Protein · {item.meal.calories} KCAL
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.meal.id, item.temperature)}
                    className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.meal.id, item.temperature, -1)}
                      className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold px-1 text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.meal.id, item.temperature, 1)}
                      className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-extrabold text-slate-900 text-sm">
                    S${(item.meal.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Vouchers and Promos */}
          {cartItems.length > 0 && (
            <div className="pt-2 space-y-2">
              <form onSubmit={handleApplyVoucherSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. FIRSTFUEL)"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </form>

              {voucherError && (
                <div className="text-[11px] text-rose-600 font-semibold">{voucherError}</div>
              )}

              {/* Quick voucher pill shortcuts */}
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => onApplyVoucher('FIRSTFUEL')}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 font-bold cursor-pointer"
                >
                  Code: FIRSTFUEL (Free Sample)
                </button>
                <button
                  type="button"
                  onClick={() => onApplyVoucher('ACTIVESG50')}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 font-bold cursor-pointer"
                >
                  Code: ACTIVESG50 (-50%)
                </button>
              </div>

              {appliedVoucher && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    Voucher '{appliedVoucher}' Applied!
                  </span>
                  <span className="font-extrabold text-emerald-700">
                    -{Math.round(discountRate * 100)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">S${rawSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#006948] font-bold">
                  <span>Promotion Discount:</span>
                  <span>-S${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {memberDiscountAmount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Kinetic+ Member 10%:</span>
                  <span>-S${memberDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-lg text-[#006948]">S${netTotal.toFixed(2)} SGD</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-[#006948] hover:bg-[#005137] text-white font-extrabold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Instant Reserve & Open Pod Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Contactless thermal lock guarantee · Cancel anytime before unlock</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
