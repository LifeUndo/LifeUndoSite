"use client";
import React from "react";
import { useTranslations } from '@/hooks/useTranslations';

// TODO: подключи реальный i18n-хук
function useI18n(locale: 'ru' | 'en') {
  const RU: Record<string, string> = {
    "footer.product": "Продукт",
    "footer.company": "Компания",
    "footer.legal": "Правовое",
    "footer.developers": "Разработчикам",
    "footer.partners": "Партнёрам",
    "footer.downloads": "Загрузки",
    "footer.pricing": "Тарифы",
    "footer.fund": "Фонд",
    "footer.support": "Контакты",
    "footer.privacy": "Конфиденциальность",
    "footer.offer": "Оферта",
    "footer.sla": "SLA",
    "footer.contract": "Договор",
    "footer.dpa": "DPA",
    "footer.policy": "Политика",
    "footer.downloadsTxt": "Текст лицензии/загрузок",
    "footer.slogan": "Возвращаем потерянный текст и формы, экономим время и нервы.",
    "footer.follow": "Мы в соцсетях",
    "footer.copyright": "© 2024–2025 GetLifeUndo. Все права защищены.",
  };
  const EN: Record<string, string> = {
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.developers": "Developers",
    "footer.partners": "Partners",
    "footer.downloads": "Downloads",
    "footer.pricing": "Pricing",
    "footer.fund": "Fund",
    "footer.support": "Contacts",
    "footer.privacy": "Privacy",
    "footer.offer": "Offer",
    "footer.sla": "SLA",
    "footer.contract": "Contract",
    "footer.dpa": "DPA",
    "footer.policy": "Policy",
    "footer.downloadsTxt": "License/Downloads text",
    "footer.slogan": "Bring back lost text and forms — save time and nerves.",
    "footer.follow": "Follow us",
    "footer.copyright": "© 2024–2025 GetLifeUndo. All rights reserved.",
  };
  const dict = locale === 'en' ? EN : RU;
  return (k: string) => dict[k] ?? k;
}

export default function ModernFooter() {
  const { locale } = useTranslations();
  const t = useI18n(locale === 'en' ? 'en' : 'ru');
  const withLocale = (p: string) => `/${locale}${p}` ;

  const product = [
    { href: withLocale("/developers"), label: t("footer.developers") },
    { href: withLocale("/partners"), label: t("footer.partners") },
    { href: withLocale("/downloads"), label: t("footer.downloads") },
    { href: withLocale("/pricing"), label: t("footer.pricing") },
  ];

  const company = [
    { href: withLocale("/fund"), label: t("footer.fund") },
    // Контакты → /{locale}/support
    { href: withLocale("/support"), label: t("footer.support") },
    { href: withLocale("/privacy"), label: t("footer.privacy") },
  ];

  const legal = [
    { href: withLocale("/legal/offer"), label: t("footer.offer") },
    { href: withLocale("/legal/sla"), label: t("footer.sla") },
    { href: withLocale("/legal/contract"), label: t("footer.contract") },
    { href: withLocale("/legal/dpa"), label: t("footer.dpa") },
    { href: withLocale("/privacy"), label: t("footer.policy") },
    { href: withLocale("/downloads"), label: t("footer.downloadsTxt") },
  ];

  return (
    <footer className="px-6 py-10 border-t border-white/10">
      {/* Верхний блок: слоган и соцсети */}
      <div className="max-w-6xl mx-auto mb-8">
        <p className="text-sm text-white/80 mb-4">{t("footer.slogan")}</p>
        <div className="flex items-center gap-3" aria-label={t("footer.follow")}>
          {/* TG */}
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition" href="https://t.me/getlifeundo" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M9.04 15.47 8.9 18.4c.29 0 .41-.12.56-.27l1.35-1.3 2.8 2.06c.51.28.87.13 1-.47l1.82-8.56c.16-.72-.26-1-.74-.82L5.36 11.3c-.71.28-.7.68-.12.86l3.57 1.11 8.28-5.22-8.05 7.42z"/></svg>
          </a>
          {/* X/Twitter */}
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition" href="https://x.com/getlifeundo" target="_blank" rel="noopener noreferrer" aria-label="X">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M17.53 3h2.2l-4.81 5.5L21 21h-5.45l-4.26-6.47L5.94 21H3.73l5.14-5.88L3 3h5.5l3.86 6.02L17.53 3zm-1.91 16h1.22L8.5 4h-1.2l8.32 15z"/></svg>
          </a>
          {/* YouTube */}
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition" href="https://youtube.com/@getlifeundo" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M23.5 6.2s-.23-1.62-.94-2.33c-.9-.94-1.9-.94-2.36-.99C16.97 2.5 12 2.5 12 2.5h-.01s-4.97 0-8.19.38c-.46.05-1.46.05-2.36.99C.73 4.58.5 6.2.5 6.2S.25 8.08.25 9.96v1.84c0 1.88.25 3.76.25 3.76s.23 1.62.94 2.33c.9.94 2.08.91 2.61 1.01 1.89.18 8 .38 8 .38s4.98-.01 8.2-.39c.46-.05 1.46-.05 2.36-.99.71-.71.94-2.33.94-2.33s.25-1.88.25-3.76V9.96c0-1.88-.25-3.76-.25-3.76zM9.75 13.5v-5l5 2.5-5 2.5z"/></svg>
          </a>
          {/* VK */}
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition" href="https://vk.ru/GetLifeUndo" target="_blank" rel="noopener noreferrer" aria-label="VK">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.864-1.744-.864-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.795.780 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
          </a>
          {/* GitHub */}
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition" href="https://github.com/LifeUndo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.87 3.16 9 7.54 10.45.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.07.67-3.72-1.3-3.72-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.58 1.19 3.21.91.1-.71.39-1.2.71-1.48-2.45-.28-5.02-1.22-5.02-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.42.11-2.96 0 0 .92-.29 3.02 1.13.88-.24 1.82-.36 2.76-.37.94.01 1.88.13 2.76.37 2.09-1.42 3.01-1.13 3.01-1.13.6 1.54.22 2.68.11 2.96.7.77 1.12 1.75 1.12 2.95 0 4.23-2.58 5.15-5.03 5.43.4.35.76 1.04.76 2.1 0 1.52-.01 2.75-.01 3.12 0 .29.2.64.76.53 4.37-1.46 7.54-5.58 7.54-10.45C23.1 5.33 18.27.5 12 .5z"/></svg>
          </a>
          {/* Reddit */}
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition" href="https://reddit.com/r/getlifeundo" target="_blank" rel="noopener noreferrer" aria-label="Reddit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M14.5 3a1 1 0 0 0-1 1v2.09c-1.15.09-2.2.36-3.06.76-.44-.44-1.05-.71-1.72-.71-1.33 0-2.4 1.02-2.4 2.28 0 .35.08.68.22.98C4.63 10.12 4 11.12 4 12.25 4 14.87 7.58 17 12 17s8-2.13 8-4.75c0-1.13-.63-2.13-1.54-2.84.14-.3.22-.63.22-.98 0-1.26-1.07-2.28-2.4-2.28-.67 0-1.28.27-1.72.71-.85-.4-1.9-.67-3.06-.76V4a1 1 0 0 0-1-1zm5 9c0 1.79-3.15 3.25-7.5 3.25S4.5 13.79 4.5 12c0-1.79 3.15-3.25 7.5-3.25S19.5 10.21 19.5 12zM8.75 11A1.25 1.25 0 1 0 8.75 13.5 1.25 1.25 0 1 0 8.75 11zm6.5 0A1.25 1.25 0 1 0 15.25 13.5 1.25 1.25 0 1 0 15.25 11zM9 14.75s1.25.75 3 .75 3-.75 3-.75-.75 1.75-3 1.75-3-1.75-3-1.75z"/></svg>
          </a>
        </div>
      </div>

      {/* Нижний блок: колонки ссылок */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
        <nav>
          <h4 className="text-white font-semibold mb-4">{t("footer.product")}</h4>
          <ul className="space-y-1">{product.map((i) => <li key={i.href}><a className="text-white/80 hover:text-white" href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
        <nav>
          <h4 className="text-white font-semibold mb-4">{t("footer.company")}</h4>
          <ul className="space-y-1">{company.map((i) => <li key={i.href}><a className="text-white/80 hover:text-white" href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
        <nav>
          <h4 className="text-white font-semibold mb-4">{t("footer.legal")}</h4>
          <ul className="space-y-1">{legal.map((i) => <li key={i.href}><a className="text-white/80 hover:text-white" href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
      </div>

      {/* Копирайт */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-white/60">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}






