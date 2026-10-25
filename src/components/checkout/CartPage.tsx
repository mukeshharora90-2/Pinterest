import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles, Check } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculatedDiscount,
    setCurrentPage,
    products,
    addToCart,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // One-click checkout add-on product (e.g. Video Walkthrough Masterclass or Social Kit)
  const addonProduct = products.find((p) => p.id === 'prod-05') || products[1];
  const isAddonInCart = cart.some((i) => i.product.id === addonProduct.id);

  const finalTotal = Math.max(0, cartSubtotal - calculatedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Tag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-2">Your Cart Is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
          Explore our collection of Notion operating systems, Pinterest growth kits, and digital templates.
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-3 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-[var(--theme-radius)] transition-colors cursor-pointer"
        >
          Browse Digital Catalog →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[var(--theme-text)] mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] divide-y divide-[var(--theme-border)] overflow-hidden">
            {cart.map((item) => (
              <div key={item.product.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-0.5">
                    {item.product.category}
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                    {item.product.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                    <span>{item.product.fileFormat}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">Instant Download</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right w-20">
                    <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* One-Click Checkout Add-on Offer */}
          {!isAddonInCart && (
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                      Special Checkout Add-On
                    </span>
                    <span className="text-xs font-bold text-amber-950">${addonProduct.price}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 mt-0.5">{addonProduct.name}</h4>
                  <p className="text-xs text-slate-600">{addonProduct.shortDescription}</p>
                </div>
              </div>
              <button
                onClick={() => addToCart(addonProduct, true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add to Order
              </button>
            </div>
          )}
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-6 shadow-xs space-y-6">
          <h2 className="font-serif text-lg font-bold text-slate-900 pb-3 border-b border-[var(--theme-border)]">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900 font-semibold tabular-nums">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span className="font-mono font-semibold tabular-nums">
                  -${calculatedDiscount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-mono text-slate-900 font-semibold tabular-nums">$0.00</span>
            </div>

            <div className="pt-3 border-t border-[var(--theme-border)] flex justify-between text-base font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="font-mono tabular-nums">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Field */}
          <div className="pt-2">
            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    Coupon <strong>{appliedCoupon.code}</strong> applied!
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. WELCOME20"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md uppercase font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                <p className="text-[10px] text-slate-400">
                  Tip: Use code <span className="font-mono font-bold text-slate-700">WELCOME20</span> for 20% off.
                </p>
              </form>
            )}
          </div>

          <button
            onClick={() => {
              setCurrentPage('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3.5 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-[var(--theme-radius)] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-[var(--theme-border)]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted · Instant Download Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
