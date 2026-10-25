import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../store/ProductCard';
import {
  Download,
  Package,
  Heart,
  User,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Mail,
  HelpCircle,
} from 'lucide-react';

interface CustomerDashboardProps {
  onQuickView: (product: any) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onQuickView }) => {
  const { currentUser, orders, products, wishlist, setCurrentPage, showNotification } = useStore();
  const [activeTab, setActiveTab] = useState<'downloads' | 'orders' | 'wishlist' | 'settings'>('downloads');
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);

  // Orders belonging to this user
  const userOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role !== 'customer'
  );

  // Collect all downloadable items from paid orders
  const paidDownloads = userOrders
    .filter((o) => o.paymentStatus === 'paid')
    .flatMap((o) => o.items.map((i) => ({ ...i, orderNumber: o.orderNumber, purchasedAt: o.createdAt })));

  // Wishlisted products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Account Header */}
      <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-6 md:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif text-2xl font-bold">
            {currentUser.fullName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-slate-900">{currentUser.fullName}</h1>
              <span className="text-[11px] font-mono uppercase bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-semibold">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {paidDownloads.length} Downloadable Files · {userOrders.length} Orders
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--theme-border)] mb-8 gap-8 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('downloads')}
          className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'downloads'
              ? 'text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>My Download Library ({paidDownloads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'wishlist'
              ? 'text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Preferences & Support</span>
        </button>
      </div>

      {/* Tab 1: Download Library */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 flex items-center justify-between mb-2">
            <span>All purchased digital products come with verified licenses and free lifetime updates.</span>
          </div>

          {paidDownloads.length === 0 ? (
            <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-12 text-center">
              <Download className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-slate-800 mb-1">No Downloads Available</h3>
              <p className="text-xs text-slate-500 mb-6">You have not completed any purchases yet.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-5 py-2.5 bg-[var(--theme-primary)] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Browse Shop →
              </button>
            </div>
          ) : (
            <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] divide-y divide-[var(--theme-border)] overflow-hidden">
              {paidDownloads.map((item, idx) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-serif text-base font-bold text-slate-900">{item.productName}</h4>
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                        Version {item.version}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                      <span>Order: {item.orderNumber}</span>
                      <span>·</span>
                      <span>Format: {item.fileFormat}</span>
                      <span>·</span>
                      <span>Size: {item.fileSize}</span>
                    </div>
                  </div>

                  <a
                    href={`/api/downloads/${item.downloadToken}`}
                    download
                    className="px-5 py-2.5 bg-[var(--theme-primary)] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File (ZIP)</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-12 text-center text-slate-500 text-xs">
              No orders found for this account.
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-6 shadow-xs text-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--theme-border)]">
                    <div>
                      <span className="font-mono text-slate-400 uppercase text-[10px] block">Order Number</span>
                      <span className="font-bold text-sm text-slate-900 font-mono">{ord.orderNumber}</span>
                    </div>

                    <div>
                      <span className="font-mono text-slate-400 uppercase text-[10px] block">Date</span>
                      <span className="text-slate-700">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <span className="font-mono text-slate-400 uppercase text-[10px] block">Total Amount</span>
                      <span className="font-bold text-slate-900 font-mono">${ord.totalAmount.toFixed(2)} USD</span>
                    </div>

                    <div>
                      <span className="font-mono text-slate-400 uppercase text-[10px] block">Status</span>
                      <span
                        className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800'
                            : ord.paymentStatus === 'manual_verification'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {ord.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-700">
                        <span>{item.productName} ({item.fileFormat})</span>
                        <span className="font-mono font-semibold">${item.unitPrice}</span>
                      </div>
                    ))}
                  </div>

                  {ord.manualPaymentRef && (
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 font-mono">
                      Manual Reference / UTR: {ord.manualPaymentRef}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-12 text-center text-slate-500 text-xs">
              Your wishlist is empty. Tap the heart icon on any product to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Preferences & Support */}
      {activeTab === 'settings' && (
        <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-8 max-w-xl shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900 mb-1">Newsletter & Updates</h3>
            <p className="text-slate-500 mb-4">Receive new product releases, template updates, and Pinterest growth articles.</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => {
                  setNewsletterOptIn(e.target.checked);
                  showNotification('Newsletter preferences updated.');
                }}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-slate-800 font-medium">Subscribed to the VeritasCraft Weekly Dispatch</span>
            </label>
          </div>

          <div className="pt-6 border-t border-[var(--theme-border)]">
            <h3 className="font-serif text-base font-bold text-slate-900 mb-1">Download Troubleshooting</h3>
            <p className="text-slate-500 mb-3">
              Need assistance extracting ZIP files or accessing your Notion workspace link?
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email Support: <strong>support@veritascraft.com</strong></span>
              </div>
              <div className="text-[11px] text-slate-500">Average response time: &lt; 2 hours</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
