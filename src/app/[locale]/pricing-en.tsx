import ServiceCard from '@/components/ServiceCard';
import FreeKassaButton from '@/components/payments/FreeKassaButton';
import { fkPublic } from '@/lib/fk-public';
import { PLANS } from '@/config/plans';
import { PLAN_TO_PRODUCT } from '@/business/pricing/plans';

export default function PricingPageEN() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-lg text-gray-300">
          The local core of GetLifeUndo works for free on your devices. Paid plans add optional Cloud/TEAM features and higher limits.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Free */}
        <ServiceCard
          icon="🆓"
          title="Free"
          description="Basic functionality for getting started"
          features={[
            'Up to 10 tabs',
            'Basic form recovery',
            'Community support',
            'Local-first, no automatic cloud sync'
          ]}
          price="Free"
          period="forever"
          ctaText="Get Started"
          ctaLink="/en/downloads"
        />

        {/* Pro */}
        <ServiceCard
          icon="⭐"
          title={PLANS.pro_month.label}
          description="Extended features for active users"
          features={[
            'Up to 100 tabs',
            'Clipboard history',
            'Sync between devices',
            'Priority support',
            'Data export'
          ]}
          price={`${PLANS.pro_month.amount} ₽`}
          period="per month"
          isPopular={true}
          ctaText="Get Pro"
          ctaLink="/buy?plan=pro"
          customCTA={<FreeKassaButton plan="pro_month" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />

        {/* VIP */}
        <ServiceCard
          icon="👑"
          title={PLANS.vip_lifetime.label}
          description="Full access to all features forever"
          features={[
            'Unlimited tabs',
            'All Pro features',
            'Lifetime license',
            '10% to GetLifeUndo Fund',
            'Personal support',
            'Early access to new features'
          ]}
          price={`${PLANS.vip_lifetime.amount} ₽`}
          period="forever"
          ctaText="Buy VIP"
          ctaLink="/buy?plan=vip"
          customCTA={<FreeKassaButton plan="vip_lifetime" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />
      </div>

      {/* Team */}
      <div className="max-w-2xl mx-auto mb-12">
        <ServiceCard
          icon="👥"
          title={PLANS.team_5.label}
          description="Corporate solutions for teams"
          features={[
            '5 seats included',
            'Centralized management',
            'Corporate support',
            'Usage analytics',
            'Integration with corporate systems'
          ]}
          price={`${PLANS.team_5.amount} ₽`}
          period="for 5 seats per month"
          ctaText="Order Team"
          ctaLink="/buy?plan=team"
          customCTA={<FreeKassaButton plan="team_5" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />
      </div>

      {/* FAQ */}
      <section className="bg-white/5 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Is the app free?</h3>
            <p className="text-gray-300">
              The local core of GetLifeUndo is free by default and keeps working on your devices even without any paid plan. Paid
              Pro / VIP / Team options only add Cloud/TEAM sync, higher limits and support on top of the local core.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-300">Yes, you can cancel your subscription at any time. VIP is a one-time payment.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
            <p className="text-gray-300">Absolutely! All data is stored locally in your browser. We don't collect any personal information.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
