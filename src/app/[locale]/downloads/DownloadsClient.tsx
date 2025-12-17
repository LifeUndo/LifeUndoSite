'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

interface LatestData {
  version: string;
  publishedAt: string;
  files: {
    firefox?: string;
    firefox_xpi?: string;
    win?: string;
    mac?: string;
  };
}

interface DownloadCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
  isAvailable?: boolean;
  t: any; // Добавляем t как параметр
}

function DownloadCard({ icon, title, description, href, className, isAvailable = true, t }: DownloadCardProps) {
  if (!isAvailable) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center opacity-50">
        <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-400 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        <div className="bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
          {t.downloads.comingSoon}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <a 
        href={href} 
        className={`font-bold py-2 px-4 rounded-lg transition-colors ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.downloads.download}
      </a>
    </div>
  );
}

interface WhatsNewData {
  version: string;
  items: string[];
}

interface NewsItem {
  version: string;
  platform: string;
  publishedAt: string;
  items: string[];
  links?: Record<string, string>;
}

export default function DownloadsClient() {
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  const [whatsNewData, setWhatsNewData] = useState<WhatsNewData | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslations();

  useEffect(() => {
    const buildId = Date.now();

    const fetchJson = (url: string) => fetch(url).then(r => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });

    const loadNews = async () => {
      const candidates = [
        `/app/latest/news.${locale}.json?v=${buildId}`,
        `/app/latest/news.json?v=${buildId}`,
      ];
      for (const url of candidates) {
        try {
          const data = await fetchJson(url);
          if (Array.isArray(data)) return data;
        } catch (_) { /* try next */ }
      }
      return [] as NewsItem[];
    };

    const loadWhatsNew = async () => {
      const candidates = [
        `/app/latest/whats-new.${locale}.json?v=${buildId}`,
        `/app/latest/whats-new.json?v=${buildId}`,
      ];
      for (const url of candidates) {
        try {
          const data = await fetchJson(url);
          if (data && typeof data === 'object' && Array.isArray((data as any).items)) return data as WhatsNewData;
        } catch (_) { /* try next */ }
      }
      return null as unknown as WhatsNewData;
    };

    Promise.all([
      fetchJson(`/app/latest/latest.json?v=${buildId}`),
      loadWhatsNew(),
      loadNews(),
    ])
      .then(([latest, whatsNew, news]) => {
        setLatestData(latest);
        setWhatsNewData(whatsNew);
        setNewsList(news);
        setLoading(false);
      })
      .catch(() => {
        // Fallback если файлы недоступны
        setLatestData({
          version: '0.3.7.13',
          publishedAt: '2025-10-04T10:00:00Z',
          files: {
            firefox: "https://addons.mozilla.org/firefox/addon/lifeundo/"
          }
        });
        setWhatsNewData({
          version: '0.3.7.13',
          items: [
            'Исправлены ссылки в попапе (Website/Privacy/Support → getlifeundo.com)',
            'Полная синхронизация RU/EN строк',
            'Баннер и шапка — корректные отступы',
            'Кнопки оплаты на сайте активированы'
          ]
        });
        setLoading(false);
      });
  }, [locale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.downloads.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.downloads.subtitle}
          </p>
          
          {/* Version Info */}
          {latestData && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">{t.downloads.currentVersion}</span> {latestData.version}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t.downloads.publishedAt} {new Date(latestData.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {t.downloads.latestVersion}
                  </div>
                </div>
              </div>
              
              {/* What's New */}
              {whatsNewData && whatsNewData.items.length > 0 && (
                <div className="border-t border-white/20 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-3">{t.downloads.whatsNew} {whatsNewData.version}:</h4>
                  <ul className="space-y-2">
                    {whatsNewData.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2 mt-1">•</span>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* News Feed */}
          {newsList.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto mb-10">
              <h3 className="text-2xl font-semibold text-white mb-4">{locale === 'en' ? 'Recent releases' : 'Последние релизы'}</h3>
              <ul className="space-y-4">
                {newsList.map((n, idx) => (
                  <li key={idx} className="border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold">{n.platform} — {n.version}</div>
                      <div className="text-sm text-gray-400">{new Date(n.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU')}</div>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 text-sm mb-2">
                      {n.items.map((it, i) => (<li key={i}>{it}</li>))}
                    </ul>
                    {n.links && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {Object.entries(n.links).map(([k, v]) => (
                          <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                            {k.toUpperCase()}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Chrome */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Chrome"
            description={t.downloads.chrome}
            href="https://chrome.google.com/webstore/detail/getlifeundo/PLACEHOLDER_CHROME_ID"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            t={t}
            isAvailable={false}
          />

          {/* Firefox */}
          <div>
            <DownloadCard
              icon={
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              }
              title="Firefox"
              description={t.downloads.firefox}
              href={latestData?.files.firefox || "https://addons.mozilla.org/firefox/addon/getlifeundo/"}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              t={t}
              isAvailable={true}
            />
            {latestData?.files.firefox_xpi && (
              <div className="mt-2 text-xs text-gray-400 text-center">
                <a
                  href={latestData.files.firefox_xpi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-300"
                >
                  {locale === 'en' ? 'Download XPI directly (advanced)' : 'Скачать XPI напрямую (для опытных)'}
                </a>
              </div>
            )}
          </div>

          {/* Edge */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Edge"
            description={t.downloads.edge}
            href="https://microsoftedge.microsoft.com/addons/detail/getlifeundo/PLACEHOLDER_EDGE_ID"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            isAvailable={false}
            t={t}
          />

          {/* Windows EXE */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Windows"
            description={t.downloads.windows}
            href={latestData?.files.win || "#"}
            className="bg-gray-600 hover:bg-gray-700 text-white"
            isAvailable={true}
            t={t}
          />

          {/* macOS DMG */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="macOS"
            description={t.downloads.macos}
            href={latestData?.files.mac || "#"}
            className="bg-gray-700 hover:bg-gray-800 text-white"
            isAvailable={false}
            t={t}
          />

          {/* App Store (iOS) */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="App Store (iOS)"
            description={locale === 'en' ? 'iOS app' : 'Приложение для iOS'}
            href="#"
            className="bg-black hover:bg-black text-white"
            isAvailable={false}
            t={t}
          />

          {/* Android APK (GitHub Release) */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.6 9.48l1.84-3.18-.86-.5-1.86 3.22a7.06 7.06 0 00-8.64 0L5.32 5.8l-.86.5 1.84 3.18A6.98 6.98 0 004 14v5a1 1 0 001 1h2a1 1 0 001-1v-3h8v3a1 1 0 001 1h2a1 1 0 001-1v-5c0-2.09-.86-3.98-2.4-5.52zM9 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            }
            title="Android (APK)"
            description={t.downloads.android}
            href="https://github.com/LifeUndo/LifeUndo/releases/tag/v1.0.0-10-rev5a"
            className="bg-green-600 hover:bg-green-700 text-white"
            isAvailable={true}
            t={t}
          />

          {/* Android (RuStore) */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Android (RuStore)"
            description={locale === 'en' ? 'Available in RuStore.' : 'Доступно в RuStore.'}
            href="https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app"
            className="bg-green-600 hover:bg-green-700 text-white"
            isAvailable={true}
            t={t}
          />

          {/* Android (NashStore) */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Android (NashStore)"
            description={locale === 'en' ? 'Submitted for review.' : 'Отправлено на модерацию.'}
            href="#"
            className="bg-green-600 hover:bg-green-700 text-white"
            isAvailable={false}
            t={t}
          />

          {/* Huawei AppGallery */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Huawei AppGallery"
            description={locale === 'en' ? 'Preparing publication.' : 'Готовим публикацию.'}
            href="#"
            className="bg-red-600 hover:bg-red-700 text-white"
            isAvailable={false}
            t={t}
          />

          {/* F‑Droid */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="F‑Droid"
            description={locale === 'en' ? 'MR is open, pending review.' : 'MR открыт, ожидаем ревью.'}
            href="#"
            className="bg-blue-700 hover:bg-blue-800 text-white"
            isAvailable={false}
            t={t}
          />
        </div>

        {/* License Key Input */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            {t.downloads.licenseTitle}
          </h3>
          <p className="text-gray-300 text-center mb-6">
            {t.downloads.licenseDescription}
          </p>
          <form className="grid gap-3 md:grid-cols-[1fr_auto] items-stretch">
            <input 
              type="text" 
              placeholder={t.downloads.licensePlaceholder}
              className="min-w-0 h-11 text-[16px] md:h-11 px-4 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/30 focus:border-blue-400 focus:outline-none"
            />
            <button 
              type="submit"
              className="h-11 md:h-11 rounded-lg bg-green-500 hover:bg-green-600 text-white w-full md:w-auto"
            >
              {t.downloads.activate}
            </button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            {t.downloads.featuresTitle}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t.downloads.feature1Title}</h4>
              <p className="text-gray-300">{t.downloads.feature1Description}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t.downloads.feature2Title}</h4>
              <p className="text-gray-300">{t.downloads.feature2Description}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t.downloads.feature3Title}</h4>
              <p className="text-gray-300">{t.downloads.feature3Description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}