"use client";

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import MobileBadges from "@/components/ui/MobileBadges";

export default function LocaleIndex({ params }: { params: { locale: string } }) {
  const { t, locale } = useTranslations();

  return (
    <main className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        {/* Hero: как на текущем getlifeundo.com, но без trial */}
        <header className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t.hero.title}
          </h1>
          <p className="mb-6 text-base md:text-lg text-white/80 max-w-2xl">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm md:text-base">
            <a
              href={`/${locale}/downloads`}
              className="inline-flex items-center justify-center px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {t.hero.cta_primary}
            </a>
            <a
              href={`/${locale}/features`}
              className="inline-flex items-center justify-center px-4 py-2 rounded border border-white/20 hover:border-white transition-colors"
            >
              {t.hero.cta_secondary}
            </a>
          </div>
        </header>

        {/* Как это работает: три шага в виде простого списка */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            {t.howItWorks.title}
          </h2>

          <ol className="space-y-8 text-base md:text-lg">
            <li>
              <h3 className="font-semibold mb-1">{t.howItWorks.step1.title}</h3>
              <p className="text-white/80">{t.howItWorks.step1.description}</p>
            </li>
            <li>
              <h3 className="font-semibold mb-1">{t.howItWorks.step2.title}</h3>
              <p className="text-white/80">{t.howItWorks.step2.description}</p>
            </li>
            <li>
              <h3 className="font-semibold mb-1">{t.howItWorks.step3.title}</h3>
              <p className="text-white/80">{t.howItWorks.step3.description}</p>
            </li>
          </ol>
        </section>

        {/* LifeUndo Cloud (опционально) — текстовый блок, без маркетинга trial */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            {locale === "en" ? "LifeUndo Cloud (optional)" : "LifeUndo Cloud (опционально)"}
          </h2>
          <p className="text-white/80 mb-3 text-base md:text-lg">
            {locale === "en"
              ? "By default GetLifeUndo works locally: your Timeline is stored on your device. LifeUndo Cloud is an extra encrypted layer on top of the local Mesh network and will let you sync selected parts of your Timeline and settings between home and work devices."
              : "По умолчанию GetLifeUndo работает локально: Лента хранится на вашем устройстве. LifeUndo Cloud — это дополнительный зашифрованный слой поверх локальной Mesh‑сети и в будущем позволит синхронизировать выбранные части Ленты и настроек между домом и офисом."}
          </p>
          <p className="text-white/60 text-sm md:text-base">
            {locale === "en"
              ? "Cloud is disabled by default and is turned on explicitly in Settings. A separate Cloud password is used to encrypt and decrypt cloud data."
              : "Cloud по умолчанию выключен и включается отдельно в настройках. Для шифрования и расшифровки Cloud‑данных используется отдельный пароль Cloud."}
          </p>
        </section>

        {/* CTA без trial: локальное ядро бесплатно, Cloud/TEAM — платные надстройки */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t.cta.ready}</h2>
          <p className="text-white/80 mb-4 text-base md:text-lg max-w-3xl">
            {locale === "en"
              ? "The local core is free and works on your devices. Cloud/TEAM and higher limits are optional paid add-ons."
              : "Локальное ядро бесплатно и работает на ваших устройствах. Cloud/TEAM и повышенные лимиты — это опциональные платные надстройки."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm md:text-base">
            <a
              href={`/${locale}/downloads`}
              className="inline-flex items-center justify-center px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition-colors"
            >
              {locale === "en" ? "Download free" : "Скачать бесплатно"}
            </a>
            <a
              href={`/${locale}/pricing`}
              className="inline-flex items-center justify-center px-4 py-2 rounded border border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-colors"
            >
              {locale === "en" ? "View pricing" : "Посмотреть тарифы"}
            </a>
          </div>
        </section>

        {/* Мобильные приложения — скоро */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            {locale === "en" ? "Mobile apps — coming soon" : "Мобильные приложения — скоро"}
          </h2>
          <p className="text-white/80 mb-6 text-base md:text-lg max-w-3xl">
            {locale === "en"
              ? "iOS, Android and RuStore versions are in development. Stay tuned."
              : "Версии для iOS, Android и RuStore в разработке. Следите за новостями."}
          </p>
          <MobileBadges />
        </section>
      </div>
    </main>
  );
}