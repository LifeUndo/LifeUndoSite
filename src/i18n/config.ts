// i18n Configuration
export const locales = ['ru', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'ru';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

