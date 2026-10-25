import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Clock, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { lastCompletedOrder, setCurrentPage } = useStore();

  useEffect(() => {
    // Fire celebratory confetti if order is paid
    if (lastCompletedOrder?.paymentStatus === 'paid') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [lastCompletedOrder]);

  if (!lastCompletedOrder) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold mb-4">No Recent Order Found</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-[var(--theme-primary)] text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const isManualPending = lastCompletedOrder.paymentStatus === 'manual_verification';

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Status Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
          {isManualPending ? 'Order Received · Pending Verification' : 'Payment Confirmed · Instant Download Ready'}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-3">
          Thank You, {lastCompletedOrder.customerName}!
        </h1>
        <p className="text-xs text-slate-500">
          Order Confirmation Number: <strong className="font-mono text-slate-800">{lastCompletedOrder.orderNumber}</strong> · Receipt dispatched to <strong className="text-slate-800">{lastCompletedOrder.customerEmail}</strong>
        </p>
      </div>

      {/* Manual wire alert notice if applicable */}
      {isManualPending && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl mb-8 text-xs text-amber-900 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <h4 className="font-bold text-sm text-amber-950 mb-1">Manual Transfer Pending Approval</h4>
            Your transaction reference <span className="font-mono font-semibold">"{lastCompletedOrder.manualPaymentRef}"</span> has been submitted to our operations desk. As soon as an administrator verifies receipt of funds, your download tokens below will automatically activate.
          </div>
        </div>
      )}

      {/* Purchased Assets & Direct Downloads */}
      <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-6 md:p-8 shadow-xs mb-8">
        <h2 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          <span>Your Authorized Digital Downloads</span>
        </h2>

        <div className="divide-y divide-[var(--theme-border)]">
          {lastCompletedOrder.items.map((item, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900">{item.productName}</h3>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                  <span>Format: {item.fileFormat}</span>
                  <span>·</span>
                  <span>Size: {item.fileSize}</span>
                  <span>·</span>
                  <span>Version {item.version}</span>
                </div>
              </div>

              {isManualPending ? (
                <span className="text-xs font-mono text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg font-medium">
                  Verification Pending
                </span>
              ) : (
                <a
                  href={`/api/downloads/${item.downloadToken}`}
                  download
                  className="px-5 py-2.5 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-[var(--theme-radius)] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Files (ZIP)</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary & Receipt */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-xs text-slate-600 mb-8 space-y-2">
        <div className="font-serif font-bold text-sm text-slate-900 mb-2">Transaction Details</div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-mono text-slate-900 tabular-nums">${lastCompletedOrder.subtotal.toFixed(2)}</span>
        </div>
        {lastCompletedOrder.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount Applied</span>
            <span className="font-mono tabular-nums">-${lastCompletedOrder.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
          <span>Total Paid</span>
          <span className="font-mono tabular-nums">${lastCompletedOrder.totalAmount.toFixed(2)} USD</span>
        </div>
        {lastCompletedOrder.gatewayTransactionId && (
          <div className="text-[10px] text-slate-400 font-mono pt-1">
            Gateway Reference ID: {lastCompletedOrder.gatewayTransactionId}
          </div>
        )}
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--theme-border)]">
        <button
          onClick={() => {
            setCurrentPage('customer_account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs font-semibold text-[var(--theme-primary)] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-4 h-4" /> Go to My Customer Download Library →
        </button>

        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
};
