'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function SlaClient() {
  const { locale } = useTranslations();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              {locale === 'en' ? 'SLA (Basic)' : 'SLA (базовый)'}
            </h1>
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? 'Availability' : 'Доступность'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' ? 'Storefront: hosted on Vercel (their SLA).' : 'Витрина: хостится на Vercel (их SLA).'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? 'Support' : 'Поддержка'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' ? 'Critical incidents (payment/access): response ≤ 4h during business hours.' : 'Критические инциденты (платёж/доступ): реакция ≤ 4 ч в рабочее время.'}
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' ? 'Support channel: support@getlifeundo.com.' : 'Канал поддержки: support@getlifeundo.com.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? 'Scheduled Maintenance' : 'Плановые работы'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' ? 'We notify ≥ 24h in advance.' : 'Уведомляем ≥ 24 ч.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? 'Evidence Requirements' : 'Требования к доказательствам'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' ? 'Claims regarding data loss require verifiable artifacts: extension logs (with user consent), timestamps, reproducible scenarios.' : 'Претензии по потере данных требуют верифицируемых артефактов: логи расширения (с согласия пользователя), таймстемпы, воспроизводимые сценарии.'}
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' ? 'Exclusions: force majeure, power/network outages, software/OS issues, third-party actions, standard browser limitations.' : 'Исключения: форс-мажор, перебои питания/сети, проблемы ПО/ОС, действия третьих лиц, штатные ограничения браузера.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? 'Data Export' : 'Экспорт данных'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' ? 'For payments — upon organization request.' : 'По платежам — по запросу организации.'}
              </p>

              <p className="text-gray-400 text-sm mt-8">
                <em>{locale === 'en' ? 'Last updated: 2025-10-04' : 'Дата обновления: 2025-10-04'}</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
