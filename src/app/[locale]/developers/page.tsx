import React from 'react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/developers`;
  const title = locale === 'en' ? 'Developers — GetLifeUndo API (beta)' : 'Разработчикам — API GetLifeUndo (beta)';
  const description = locale === 'en'
    ? 'Integrate local-first form/clipboard recovery. Public endpoints, OpenAPI, security notes. No user text leaves the browser.'
    : 'Интегрируйте локальное восстановление форм/буфера. Публичные эндпоинты, OpenAPI, заметки по безопасности. Текст форм не отправляется.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/developers`,
        'en-US': `${base}/en/developers`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}

export const dynamic = 'force-dynamic';

export default function DevelopersPage({ params }: { params: { locale: string } }) {
  const isEN = params?.locale === 'en';

  const t = {
    title: isEN ? 'GetLifeUndo API (beta)' : 'API GetLifeUndo (beta)',
    subtitle: isEN ? 'Integrate form/buffer recovery into your product' : 'Подключите восстановление форм/буфера в свой продукт',
    how: isEN ? 'How it works (short)' : 'Как это работает (вкратце)',
    how1: isEN ? 'The extension stores data locally' : 'Расширение хранит данные локально',
    how2: isEN ? 'API is for license/org validation and activation events' : 'API нужен для валидации лицензий/организаций и событий активаций',
    how3: isEN ? 'We do not receive or store user form text' : 'Мы не принимаем и не храним пользовательский текст форм',
    public: isEN ? 'Public endpoints (ready)' : 'Публичные эндпоинты (уже есть)',
    ping: isEN ? 'Server ping' : 'Пинг сервера',
    fkdiag: isEN ? 'FreeKassa diagnostics' : 'Диагностика платёжки FreeKassa',
    payments: isEN ? 'Payments and subscription status' : 'Платежи и статусы подписки',
    createDesc: isEN ? 'Create payment and activate subscription (returns pay_url)' : 'Создать платёж и активировать подписку (возвращает pay_url)',
    statusDesc: isEN ? 'Get payment/subscription status' : 'Получить статус платежа/подписки',
    openapi: isEN ? 'OpenAPI spec' : 'OpenAPI спецификация',
    spec: '/openapi.yaml',
    ratelimit: isEN ? 'Rate-Limit: 10 req/min per IP on /api/license/validate' : 'Rate-Limit: 10 req/min по IP на /api/license/validate',
    security: isEN ? 'Security' : 'Безопасность',
    securityTxt: isEN ? '100% local. API does not transmit form text. All data stays in the user browser.' : '100% локально, API не передаёт текст форм. Все данные остаются в браузере пользователя.',
    cta: isEN ? 'Request API keys' : 'Получить API ключи',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">{t.title}</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.how}</h2>
            <ul className="space-y-4 text-gray-300 list-disc pl-6">
              <li>{t.how1}</li>
              <li>{t.how2}</li>
              <li>{t.how3}</li>
            </ul>
          </div>
        </div>

        {/* Endpoints */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.public}</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/healthz</div>
                <div className="text-gray-300 text-sm mb-2">{t.ping}</div>
                <div className="text-gray-300 text-sm">→ 200 OK</div>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/debug/fk</div>
                <div className="text-gray-300 text-sm mb-2">{t.fkdiag}</div>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">POST /api/payments/freekassa/create</div>
                <div className="text-gray-300 text-sm mb-2">{t.createDesc}</div>
                <pre className="text-xs text-gray-300 bg-black/30 rounded p-3 overflow-auto"><code>{`curl -X POST https://getlifeundo.com/api/payments/freekassa/create \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROM","email":"user@example.com"}'`}</code></pre>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/payments/status?orderId=...</div>
                <div className="text-gray-300 text-sm mb-2">{t.statusDesc}</div>
                <pre className="text-xs text-gray-300 bg-black/30 rounded p-3 overflow-auto"><code>{`curl "https://getlifeundo.com/api/payments/status?orderId=ORDER-123"`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* OpenAPI */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.openapi}</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>OpenAPI:</strong> <a href={t.spec} className="text-blue-400 hover:text-blue-300">{t.spec}</a></p>
              <p>{t.ratelimit}</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.security}</h2>
            <p className="text-gray-300">{t.securityTxt}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="mailto:support@getlifeundo.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            {t.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
