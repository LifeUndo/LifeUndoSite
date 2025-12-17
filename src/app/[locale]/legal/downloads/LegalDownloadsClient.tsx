'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export default function LegalDownloadsClient() {
  const { t, locale } = useTranslations();

  const contracts = [
    {
      name: 'Оферта',
      enName: 'Public Offer',
      file: `/legal/contracts/${locale.toUpperCase()}/offer_template.txt`,
      description: 'Публичная оферта на предоставление лицензии'
    },
    {
      name: 'Договор B2B',
      enName: 'Corporate Contract',
      file: `/legal/contracts/${locale.toUpperCase()}/contract_b2b_template.txt`,
      description: 'Договор для организаций от 100+ VIP'
    },
    {
      name: 'DPA',
      enName: 'DPA',
      file: `/legal/contracts/${locale.toUpperCase()}/dpa_template.txt`,
      description: 'Соглашение об обработке персональных данных'
    },
    {
      name: 'Политика',
      enName: 'Processing Policy',
      file: `/legal/contracts/${locale.toUpperCase()}/privacy_processing_short.txt`,
      description: 'Краткая политика обработки данных'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            {locale === 'ru' ? 'Бланки договоров' : 'Contract Templates'}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {locale === 'ru' 
              ? 'Шаблоны документов для организаций от 100+ VIP. TXT файлы, не публичная оферта.'
              : 'Templates for organizations (100+ VIP). TXT files, not a public offer.'
            }
          </p>
          {/* Disclaimer */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-200 font-semibold">
              {locale === 'ru' 
                ? 'Файлы — шаблоны. Не являются публичной офертой. Финальная версия предоставляется по запросу и подписывается сторонами.'
                : 'Files are templates. Not a public offer. Final version provided upon request and signed by parties.'
              }
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {locale === 'ru' ? 'Выберите язык' : 'Select Language'}
            </h2>
            <div className="flex gap-4 justify-center">
              <a 
                href="/ru/legal/downloads"
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  locale === 'ru' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Русский
              </a>
              <a 
                href="/en/legal/downloads"
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  locale === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                English
              </a>
            </div>
          </div>
        </div>

        {/* Contracts */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            {locale === 'ru' ? 'Договоры' : 'Contracts'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {contracts.map((contract, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {locale === 'ru' ? contract.name : contract.enName}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{contract.description}</p>
                <a 
                  href={contract.file}
                  download
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  📄 {locale === 'ru' ? 'Скачать .TXT' : 'Download .TXT'}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Files */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            {locale === 'ru' ? 'Дополнительные файлы' : 'Additional Files'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-2">README_IMPORTANT.txt</h3>
              <p className="text-gray-300 text-sm mb-4">
                {locale === 'ru' 
                  ? 'Важная информация о папке с бланками'
                  : 'Important information about the templates folder'
                }
              </p>
              <a 
                href="/legal/contracts/README_IMPORTANT.txt"
                download
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                📄 {locale === 'ru' ? 'Скачать' : 'Download'}
              </a>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-2">checksums.txt</h3>
              <p className="text-gray-300 text-sm mb-4">
                {locale === 'ru' 
                  ? 'SHA256 контрольные суммы всех файлов'
                  : 'SHA256 checksums of all files'
                }
              </p>
              <a 
                href="/legal/contracts/checksums.txt"
                download
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                📄 {locale === 'ru' ? 'Скачать' : 'Download'}
              </a>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              {locale === 'ru' ? 'Нужна помощь?' : 'Need Help?'}
            </h3>
            <p className="text-gray-300 mb-6">
              {locale === 'ru' 
                ? 'Свяжитесь с нами для получения персонализированных договоров'
                : 'Contact us for personalized contracts'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@getlifeundo.com"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                support@getlifeundo.com
              </a>
              <a 
                href="https://t.me/GetLifeUndoSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
