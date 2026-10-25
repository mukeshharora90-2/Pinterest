import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, FileText, RefreshCw, Truck, ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'delivery' | 'faq';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const { setCurrentPage } = useStore();

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy & Cookie Preferences',
          subtitle: 'Last updated October 18, 2026',
          icon: ShieldCheck,
          body: (
            <div className="space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
              <p>
                At VeritasCraft, accessible from veritascraft.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by VeritasCraft and how we use it.
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900">1. Information We Collect</h3>
              <p>
                When you make a purchase or subscribe to our dispatch, we collect your name and email address to dispatch transaction receipts and authorized download tokens. We never store raw debit/credit card credentials on our servers; all payment transactions are tokenized and processed via certified PCI-DSS compliant providers (Stripe, PayPal, Razorpay, etc.).
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900">2. Digital Download Access Tracking</h3>
              <p>
                To prevent fraudulent link distribution and maintain license integrity, our system records download timestamps, IP hashes, and download frequency for authorized tokens.
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900">3. Your Data Rights</h3>
              <p>
                You may request a full export or permanent deletion of your customer profile, order history, and email subscriptions at any time by contacting privacy@veritascraft.com.
              </p>
            </div>
          ),
        };

      case 'terms':
        return {
          title: 'Terms of Service & Licensing Terms',
          subtitle: 'Effective October 2026',
          icon: FileText,
          body: (
            <div className="space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
              <p>
                By downloading, purchasing, or duplicating templates from VeritasCraft, you agree to adhere to these licensing conditions:
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900">1. Permitted Commercial & Personal Use</h3>
              <p>
                You are granted a non-exclusive, perpetual license to use our Notion workspaces, Canva graphics, spreadsheets, and PDF guides for personal organization, internal business operations, and client project deliverables.
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900">2. Prohibited Redistribution</h3>
              <p>
                You may not sub-license, resell, redistribute, or share public duplication links to our raw templates or digital download packages. Violation of these terms results in immediate revocation of download tokens without refund.
              </p>
            </div>
          ),
        };

      case 'delivery':
      default:
        return {
          title: 'Digital Delivery & 30-Day Refund Policy',
          subtitle: 'Standard Digital Goods Fulfillment',
          icon: RefreshCw,
          body: (
            <div className="space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
              <h3 className="font-serif text-lg font-bold text-slate-900">1. Instant Automated Delivery</h3>
              <p>
                All digital purchases on VeritasCraft are fulfilled electronically immediately upon verified payment. You will receive instantaneous access on the post-checkout confirmation screen and a duplicate access receipt sent to your provided email address.
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900">2. 30-Day Satisfaction Guarantee</h3>
              <p>
                We stand behind the engineering quality of every workspace and template we publish. If you encounter technical incompatibilities or feel the asset failed to meet its promised functionality, contact us within 30 days of purchase at support@veritascraft.com for troubleshooting assistance or a prompt refund.
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900">3. Manual Payment Orders (Wire / UPI)</h3>
              <p>
                For orders placed via direct bank wire or UPI with manual UTR submission, digital delivery tokens unlock as soon as our operations desk confirms receipt of funds (typically under 2 hours).
              </p>
            </div>
          ),
        };
    }
  };

  const { title, subtitle, icon: Icon, body } = getContent();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-8 cursor-pointer font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Legal & Compliance
        </span>
      </div>

      <h1 className="font-serif text-3xl font-bold text-slate-900 mb-1">{title}</h1>
      <p className="text-xs text-slate-400 font-mono mb-8">{subtitle}</p>

      <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-8 shadow-xs">
        {body}
      </div>
    </div>
  );
};
