import ServiceCard from '@/components/ServiceCard';
import FreeKassaButton from '@/components/payments/FreeKassaButton';
import { PLANS } from '@/config/plans';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/pricing`;
  const other = locale === 'en' ? 'ru' : 'en';
  const title = locale === 'en'
    ? 'Pricing — GetLifeUndo'
    : 'Тарифы — GetLifeUndo';
  const description = locale === 'en'
    ? 'Choose a plan: Pro (monthly), VIP (lifetime), Team (from 5 seats). Local-first core, optional Cloud/TEAM sync. Payments via FreeKassa. 100% local.'
    : 'Выберите тариф: Pro (ежемесячно), VIP (навсегда), Team (от 5 мест). Локальное ядро бесплатно, Cloud/TEAM — опционально. Оплата через FreeKassa. 100% локально.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/pricing`,
        'en-US': `${base}/en/pricing`,
      }
    },
    openGraph: {
      url,
      title,
      description,
    },
    twitter: {
      title,
      description,
    }
  };
}

export default function PricingPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale === 'en' ? 'en' : 'ru';

  const txt = locale === 'en'
    ? {
        title: 'Pricing',
        subtitle: 'The local core of GetLifeUndo is free and works on your devices. Paid plans add optional Cloud/TEAM features and higher limits.',
        trialTitle: 'Local core is always free',
        trialDesc: 'You can use GetLifeUndo locally without any subscription. Paid Pro / VIP / Team plans only add Cloud/TEAM sync, higher limits and support.',
        proDesc: 'Extended features for active users',
        perMonth: 'per month',
        vipDesc: 'Full access to all features forever',
        vipPeriod: 'forever',
        teamDesc: 'Team capabilities and corporate support. Starts from 5 seats, larger bundles and organisation bonuses are available on request.',
        teamPeriod: 'from 5 seats per month',
        proCta: 'Get Pro',
        vipCta: 'Buy VIP',
        teamCta: 'Order Team',
        payTitle: 'Payment and Security',
        payDesc: 'We accept payments via FreeKassa. YooKassa — coming soon. All payments are processed over secure channels.',
        stripeSoon: 'YooKassa — coming soon',
        trialNote: 'The local core keeps working even without an active subscription. Paid plans only affect Cloud/TEAM and limits, not your local data.',
        faq: 'Frequently Asked Questions',
        q1: 'Can I pay monthly?',
        a1: 'Yes. If the payment fails — try again or choose Starter Bundle (6 months for 3,000 ₽).',
        q2: 'What is the difference between Pro and Free?',
        a2: 'Higher limits, team features and priority support.',
        q3: 'How does the Team account work?',
      }
    : {
        title: 'Тарифы',
        subtitle: 'Локальное ядро GetLifeUndo бесплатно и работает на ваших устройствах. Платные тарифы добавляют Cloud/TEAM и повышенные лимиты.',
        trialTitle: 'Локальное ядро всегда бесплатно',
        trialDesc: 'Вы можете пользоваться GetLifeUndo локально без подписки. Платные тарифы Pro/VIP/TEAM добавляют Cloud/TEAM, повышенные лимиты и поддержку.',
        proDesc: 'Расширенные функции для активных пользователей',
        perMonth: 'в месяц',
        vipDesc: 'Полный доступ ко всем функциям навсегда',
        vipPeriod: 'навсегда',
        teamDesc: 'Командные возможности и корпоративная поддержка. Стартовый Team‑тариф — от 5 мест, расширенные пакеты и бонусы для организаций доступны по договорённости.',
        teamPeriod: 'от 5 мест в месяц',
        proCta: 'Оформить Pro',
        vipCta: 'Купить VIP',
        teamCta: 'Заказать Team',
        payTitle: 'Оплата и безопасность',
        payDesc: 'Принимаем платежи через FreeKassa. YooKassa — скоро. Все платежи проходят по защищённым каналам.',
        stripeSoon: 'YooKassa — скоро',
        trialNote: 'Локальное ядро продолжит работать даже без активной подписки. Платные тарифы влияют только на Cloud/TEAM и лимиты, а не на сохранённые локальные данные.',
        faq: 'Часто задаваемые вопросы',
        q1: 'Можно ли платить помесячно?',
        a1: 'Да. Если плата не прошла — попробуйте снова или выберите Starter Bundle (6 месяцев за 3 000 ₽).',
        q2: 'Чем Pro отличается от Free?',
        a2: 'Больше лимитов, функции команд и приоритетная поддержка.',
        q3: 'Как работает Team-аккаунт?',
      };

  // Отображаемые суммы и символ валюты
  const isEN = locale === 'en';
  const currencySymbol = isEN ? '$' : '₽';
  const display = {
    pro: isEN ? 7.40 : PLANS.pro_month.amount,
    vip: isEN ? 123.33 : PLANS.vip_lifetime.amount,
    team: isEN ? 36.91 : PLANS.team_5.amount,
  } as const;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "" + (locale === 'en' ? 'Can I pay monthly?' : 'Можно ли платить помесячно?'),
              "acceptedAnswer": {"@type": "Answer", "text": "" + (locale === 'en' ? 'Yes. If the payment fails — try again or choose Starter Bundle (6 months for 3,000 ₽).' : 'Да. Если плата не прошла — попробуйте снова или выберите Starter Bundle (6 месяцев за 3 000 ₽).')}
            },
            {
              "@type": "Question",
              "name": "" + (locale === 'en' ? 'What is the difference between Pro and Free?' : 'Чем Pro отличается от Free?'),
              "acceptedAnswer": {"@type": "Answer", "text": "" + (locale === 'en' ? 'Higher limits, team features and priority support.' : 'Больше лимитов, функции команд и приоритетная поддержка.')}
            },
            {
              "@type": "Question",
              "name": "" + (locale === 'en' ? 'How does the Team account work?' : 'Как работает Team-аккаунт?'),
              "acceptedAnswer": {"@type": "Answer", "text": "" + (locale === 'en' ? 'Bring back lost text and forms — save time and nerves.' : 'Возвращайте потерянный текст и формы — экономьте время и нервы.')}
            }
          ]
        }) }}
      />
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{txt.title}</h1>
        <p className="text-lg text-gray-300">{txt.subtitle}</p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-green-400/40 bg-green-500/10 px-4 py-3 text-left">
          <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
          <div>
            <div className="font-semibold text-white">{txt.trialTitle}</div>
            <div className="text-sm text-white/80">{txt.trialDesc}</div>
          </div>
        </div>
      </header>

      {/* Currency notice */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
          {isEN ? (
            <>
              Default invoice on FreeKassa shows RUB. To pay in USD, choose the <span className="font-semibold">USD</span> tile on the right on the payment page.
            </>
          ) : (
            <>
              На странице оплаты FreeKassa по умолчанию показывается счёт в рублях. Чтобы оплатить в долларах, выберите плитку <span className="font-semibold">USD</span> справа.
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <ServiceCard
          icon="⭐"
          title={PLANS.pro_month.label}
          description={txt.proDesc}
          price={`${currencySymbol}${display.pro}`}
          period={txt.perMonth}
          isPopular={true}
          ctaText={txt.proCta}
          ctaLink={`/${locale}/buy?plan=pro`}
          customCTA={<FreeKassaButton plan="pro_month" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />

        <ServiceCard
          icon="👑"
          title={PLANS.vip_lifetime.label}
          description={txt.vipDesc}
          price={`${currencySymbol}${display.vip}`}
          period={txt.vipPeriod}
          ctaText={txt.vipCta}
          ctaLink={`/${locale}/buy?plan=vip`}
          customCTA={<FreeKassaButton plan="vip_lifetime" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />

        <ServiceCard
          icon="👥"
          title={PLANS.team_5.label}
          description={txt.teamDesc}
          price={`${currencySymbol}${display.team}`}
          period={txt.teamPeriod}
          ctaText={txt.teamCta}
          ctaLink={`/${locale}/buy?plan=team`}
          customCTA={<FreeKassaButton plan="team_5" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />
      </div>

      <section className="max-w-2xl mx-auto mb-12">
        <div className="rounded-xl bg-gradient-to-r from-purple-700/40 to-blue-700/40 border border-white/10 p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">{txt.payTitle}</h3>
          <p className="text-sm text-white/80 mb-4">{txt.payDesc}</p>
          <div className="flex items-center justify-center gap-3">
            <FreeKassaButton plan="pro_month" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />
            <button type="button" aria-disabled="true" className="px-4 py-2 rounded border border-white/20 text-white/60 cursor-not-allowed" title={txt.stripeSoon}>
              {txt.stripeSoon}
            </button>
          </div>
          <div className="mt-4 text-xs text-white/60">{txt.trialNote}</div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">{txt.faq}</h2>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">{txt.q1}</h3>
              <p className="text-gray-300">{txt.a1}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">{txt.q2}</h3>
              <p className="text-gray-300">{txt.a2}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">{txt.q3}</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}