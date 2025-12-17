'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { SocialBar } from '@/components/SocialBar';
import MobileBadges from '@/components/ui/MobileBadges';

export default function LocaleIndex({ params }: { params: { locale: string } }) {
  const { t, locale } = useTranslations();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`/${locale}/downloads`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              {t.hero.cta_primary}
            </a>
            <a 
              href={`/${locale}/features`}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              {t.hero.cta_secondary}
            </a>
          </div>
          
        </div>

        {/* How it works - 3 steps */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {t.howItWorks.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t.howItWorks.step1.title}</h3>
              <p className="text-gray-300">
                {t.howItWorks.step1.description}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t.howItWorks.step2.title}</h3>
              <p className="text-gray-300">
                {t.howItWorks.step2.description}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t.howItWorks.step3.title}</h3>
              <p className="text-gray-300">
                {t.howItWorks.step3.description}
              </p>
            </div>
          </div>
        </div>

        {/* LifeUndo Cloud highlight */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {locale === 'en' ? 'LifeUndo Cloud (optional)' : 'LifeUndo Cloud (опционально)'}
            </h3>
            <p className="text-gray-300 mb-3">
              {locale === 'en'
                ? 'By default GetLifeUndo works locally: your timeline is stored on your device. LifeUndo Cloud is an extra encrypted layer on top of the local Mesh network and will let you sync selected parts of your Timeline and settings between home and work devices.'
                : 'По умолчанию GetLifeUndo работает локально: Лента хранится на вашем устройстве. LifeUndo Cloud — это дополнительный зашифрованный слой поверх локальной Mesh‑сети и в будущем позволит синхронизировать выбранные части Ленты и настроек между домом и офисом.'}
            </p>
            <p className="text-gray-400 text-sm">
              {locale === 'en'
                ? 'Cloud is disabled by default and is turned on explicitly in Settings. A separate Cloud password is used to encrypt and decrypt cloud data.'
                : 'Cloud по умолчанию выключен и включается отдельно в настройках. Для шифрования и расшифровки Cloud‑данных используется отдельный пароль Cloud.'}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t.cta.ready}
            </h3>
            <p className="text-gray-300 mb-6">
              {locale === 'en'
                ? 'The local core is free and works on your devices. Cloud/TEAM and higher limits are optional paid add-ons.'
                : 'Локальное ядро бесплатно и работает на ваших устройствах. Cloud/TEAM и повышенные лимиты — это опциональные платные надстройки.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`/${locale}/downloads`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                {locale === 'en' ? 'Download free' : 'Скачать бесплатно'}
              </a>
              <a 
                href={`/${locale}/pricing`}
                className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                {locale === 'en' ? 'View pricing' : 'Посмотреть тарифы'}
              </a>
            </div>
            {/* Share block */}
            <div className="mt-6">
              <div className="flex items-center justify-center gap-3 text-sm">
                <a
                  className="text-gray-300 hover:text-white underline-offset-2 hover:underline"
                  href={`https://t.me/share/url?url=${encodeURIComponent(`https://getlifeundo.com/${locale}`)}&text=${encodeURIComponent(locale === 'en' ? 'Undo your browser fails with GetLifeUndo' : 'Верни потерянный текст и вкладки с GetLifeUndo')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {locale === 'en' ? 'Share in Telegram' : 'Поделиться в Telegram'}
                </a>
                <span className="text-gray-500">·</span>
                <a
                  className="text-gray-300 hover:text-white underline-offset-2 hover:underline"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(locale === 'en' ? 'Undo your browser fails with GetLifeUndo' : 'Верни потерянный текст и вкладки с GetLifeUndo')}&url=${encodeURIComponent(`https://getlifeundo.com/${locale}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {locale === 'en' ? 'Share in X' : 'Поделиться в X'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Apps Announcement */}
        <div className="text-center mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {locale === 'en' ? 'Mobile Apps Coming Soon' : 'Мобильные приложения — скоро'}
            </h3>
            <p className="text-gray-300 mb-8">
              {locale === 'en' 
                ? 'iOS, Android and RuStore versions are in development. Stay tuned.' 
                : 'Версии для iOS, Android и RuStore в разработке. Следите за новостями.'
              }
            </p>
            <MobileBadges />
          </div>
        </div>
      </div>
    </div>
  );
}