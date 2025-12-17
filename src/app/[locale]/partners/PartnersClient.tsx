'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export default function PartnersClient() {
  const { locale } = useTranslations();
  const isEN = locale === 'en';
  return (
    <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            {isEN ? 'Partners & Resellers' : 'Партнёры и реселлеры'}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {isEN ? 'Partner with GetLifeUndo for teams, companies and integrations.' : 'Станьте партнёром GetLifeUndo для команд, компаний и интеграций.'}
          </p>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-200 font-semibold">
              {isEN
                ? <>For organizations from <strong>100 VIP subscriptions</strong>. Templates available on request.</>
                : <>Для организаций от <strong>100 VIP-подписок</strong>. Предоставляем шаблоны документов по запросу.</>}
            </p>
          </div>
          <div className="text-center mb-8">
            <a 
              href={`/${locale}/legal/downloads`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isEN ? '📄 Download .TXT templates' : '📄 Скачать .TXT-шаблоны'}
            </a>
          </div>
        </div>

        {/* Partner Packages */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">{isEN ? 'Partner packages' : 'Партнёрские пакеты'}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Team-100</h3>
              <div className="text-2xl font-bold text-green-400 mb-4">100 VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• {isEN ? 'Volume license keys for teams' : 'Пакеты лицензионных ключей для команд'}</li>
                <li>• {isEN ? 'Basic onboarding materials' : 'Базовые материалы для онбординга'}</li>
                <li>• {isEN ? 'Email support' : 'Email‑поддержка'}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Team-250</h3>
              <div className="text-2xl font-bold text-blue-400 mb-4">250 VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• {isEN ? 'Extended onboarding and materials' : 'Расширенные материалы для онбординга'}</li>
                <li>• SLA 99.9%</li>
                <li>• {isEN ? 'Priority support' : 'Приоритетная поддержка'}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WL-Enterprise</h3>
              <div className="text-2xl font-bold text-purple-400 mb-4">1000+ VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• {isEN ? 'Dedicated build' : 'Выделенный билд'}</li>
                <li>• {isEN ? 'Private CDN' : 'Приватный CDN'}</li>
                <li>• {isEN ? 'Custom policies' : 'Кастомные политики'}</li>
                <li>• {isEN ? 'Personal manager' : 'Персональный менеджер'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{isEN ? 'Process' : 'Процесс'}</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>1. {isEN ? 'Brief' : 'Бриф'}</strong> → {isEN ? 'requirements and technical discussion' : 'обсуждение требований и технических деталей'}</p>
              <p><strong>2. {isEN ? 'Mockup' : 'Макет'}</strong> → {isEN ? 'branding and design' : 'создание дизайна и брендинга'}</p>
              <p><strong>3. {isEN ? 'Test build' : 'Тестовый билд'}</strong> → {isEN ? 'private AMO/unlisted for testing' : 'private AMO/unlisted для тестирования'}</p>
              <p><strong>4. {isEN ? 'Pilot' : 'Пилот'}</strong> → {isEN ? 'limited testing with the team' : 'ограниченное тестирование с командой'}</p>
              <p><strong>5. {isEN ? 'Prod' : 'Прод'}</strong> → {isEN ? 'production launch' : 'запуск в продакшн'}</p>
            </div>
          </div>
        </div>

        {/* Model */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{isEN ? 'Model' : 'Модель'}</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• {isEN ? 'One-time setup fee' : 'Разовая настройка (setup fee)'}</li>
              <li>• {isEN ? 'Subscription: monthly per seat (Team/Org)' : 'Подписка: помесячно по числу мест (Team/Org)'}</li>
              <li>• {isEN ? 'Legal entities: invoice payment (offer below)' : 'Юридические лица: оплата по счёту (оферта ниже)'}</li>
            </ul>
          </div>
        </div>

        {/* Onboarding */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{isEN ? 'Onboarding (3 steps)' : 'Онбординг (3 шага)'}</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{isEN ? 'Brief' : 'Бриф'}</h3>
                  <p className="text-gray-300">{isEN ? 'Logos, colors, domain' : 'Логотипы, цвета, домен'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{isEN ? 'Technical build and test' : 'Техническая сборка и тест'}</h3>
                  <p className="text-gray-300">{isEN ? '1–3 days' : '1–3 дня'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{isEN ? 'Offer signing / access to reports' : 'Подписание оферты / доступ к отчётам'}</h3>
                  <p className="text-gray-300">{isEN ? 'Legal formalization' : 'Юридическое оформление'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="mailto:support@getlifeundo.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isEN ? 'Request brief and quote' : 'Получить бриф и расчёт'}
          </a>
          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              {isEN
                ? 'This is a template. Not a public offer. Final version is provided on request and signed by parties.'
                : 'Это шаблон. Не является публичной офертой. Финальная версия предоставляется по запросу и подписывается сторонами.'}
            </p>
          </div>
        </div>
    </div>
  );
}
