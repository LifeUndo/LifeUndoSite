// src/lib/i18n.ts
export type Locale = 'ru' | 'en';

// Создаём статические объекты вместо импорта JSON
const ru_common = {
  "cta": {
    "learnMore": "Узнать о возможностях",
    "needHelp": "Нужна помощь?",
    "download": "Скачать расширение"
  },
  "nav": {
    "pricing": "Тарифы",
    "features": "Возможности",
    "support": "Поддержка"
  },
  "badge": {
    "popular": "Популярно",
    "bestValue": "Выгодно"
  }
};

const ru_downloads = {
  "title": "Скачать расширение GetLifeUndo",
  "testing.disabled": "Тестирование отключено",
  "testing.disabled.desc": "Активация тестовой лицензии доступна только в Preview/Dev окружении.",
  "db.missing.title": "База данных не подключена",
  "db.missing.desc": "Для выдачи тестовых лицензий подключите DATABASE_URL в Preview и примените миграцию.",
  "grant.title": "Тестовая активация лицензии",
  "grant.email": "Email",
  "grant.plan": "Тариф",
  "grant.button": "Выдать тестовую лицензию",
  "grant.success": "Готово! Лицензия активирована.",
  "alert.forbidden": "Dev-режим запрещён в продакшене.",
  "alert.devDisabled": "Включите DEV_SIMULATE_WEBHOOK_ENABLED=true в Preview.",
  "alert.noDb": "DATABASE_URL не задан в Preview.",
  "alert.unexpected": "Непредвиденная ошибка. Попробуйте ещё раз.",
  "browsers.chrome.title": "Chrome",
  "browsers.chrome.desc": "Установить как распакованное расширение",
  "browsers.chrome.button": "Получить для Chrome",
  "browsers.firefox.title": "Firefox",
  "browsers.firefox.desc": "Загрузить временное дополнение",
  "browsers.firefox.button": "Получить для Firefox",
  "browsers.edge.title": "Edge",
  "browsers.edge.desc": "Установить как распакованное расширение",
  "browsers.edge.button": "Получить для Edge",
  "instructions.title": "Ручная установка (Dev)",
  "instructions.chrome.title": "Chrome/Edge",
  "instructions.chrome.step1": "Откройте chrome://extensions/",
  "instructions.chrome.step2": "Включите \"Режим разработчика\"",
  "instructions.chrome.step3": "Нажмите \"Загрузить распакованное\"",
  "instructions.chrome.step4": "Выберите папку расширения: extension/",
  "instructions.firefox.title": "Firefox",
  "instructions.firefox.step1": "Откройте about:debugging",
  "instructions.firefox.step2": "Нажмите \"Этот Firefox\"",
  "instructions.firefox.step3": "Нажмите \"Загрузить временное дополнение…\"",
  "instructions.firefox.step4": "Выберите extension/manifest.json",
  "instructions.path.title": "Путь к сборке расширения",
  "instructions.path.desc": "Файлы расширения находятся в: extension/",
  "instructions.path.build": "Запустите npm run build:ext для подготовки расширения к установке.",
  "instructions.download.button": "📦 Скачать ZIP расширения",
  "instructions.download.desc": "Запустите npm run build:ext:zip для создания этого файла"
};

const en_common = {
  "cta.learnMore": "Learn more",
  "cta.needHelp": "Need help?",
  "cta.download": "Download the extension",
  "nav.pricing": "Pricing",
  "nav.features": "Features",
  "nav.support": "Support",
  "badge.popular": "Popular",
  "badge.bestValue": "Best value"
};

const en_downloads = {
  "title": "Download LifeUndo Extension",
  "testing.disabled": "Testing Disabled",
  "testing.disabled.desc": "Test license activation is available only in Preview/Development environment.",
  "db.missing.title": "Database Not Connected",
  "db.missing.desc": "To grant test licenses, set DATABASE_URL in Preview and run the migration.",
  "grant.title": "Test License Activation",
  "grant.email": "Email",
  "grant.plan": "Plan",
  "grant.button": "Grant Test License",
  "grant.success": "Done! License activated.",
  "alert.forbidden": "Dev mode is forbidden in Production.",
  "alert.devDisabled": "Turn on DEV_SIMULATE_WEBHOOK_ENABLED=true in Preview.",
  "alert.noDb": "DATABASE_URL is not set in Preview.",
  "alert.unexpected": "Unexpected error. Please try again.",
  "browsers.chrome.title": "Chrome",
  "browsers.chrome.desc": "Install as unpacked extension",
  "browsers.chrome.button": "Get for Chrome",
  "browsers.firefox.title": "Firefox",
  "browsers.firefox.desc": "Load temporary add-on",
  "browsers.firefox.button": "Get for Firefox",
  "browsers.edge.title": "Edge",
  "browsers.edge.desc": "Install as unpacked extension",
  "browsers.edge.button": "Get for Edge",
  "instructions.title": "Manual Installation (Dev)",
  "instructions.chrome.title": "Chrome/Edge",
  "instructions.chrome.step1": "Open chrome://extensions/",
  "instructions.chrome.step2": "Enable \"Developer mode\"",
  "instructions.chrome.step3": "Click \"Load unpacked\"",
  "instructions.chrome.step4": "Select the extension folder: extension/",
  "instructions.firefox.title": "Firefox",
  "instructions.firefox.step1": "Open about:debugging",
  "instructions.firefox.step2": "Click \"This Firefox\"",
  "instructions.firefox.step3": "Click \"Load Temporary Add-on…\"",
  "instructions.firefox.step4": "Select extension/manifest.json",
  "instructions.path.title": "Extension Build Path",
  "instructions.path.desc": "The extension files are located in: extension/",
  "instructions.path.build": "Run npm run build:ext to prepare the extension for installation.",
  "instructions.download.button": "📦 Download Extension ZIP",
  "instructions.download.desc": "Run npm run build:ext:zip to generate this file"
};

export const BUNDLE: Record<Locale, Record<string, any>> = {
  ru: { common: ru_common, downloads: ru_downloads },
  en: { common: en_common, downloads: en_downloads }
};

export function safeLocale(loc?: string): Locale {
  return loc === 'en' ? 'en' : 'ru';
}
