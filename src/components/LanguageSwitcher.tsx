'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = ["ru", "en"];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] as string || 'ru';
  
  // Remove locale prefix from pathname
  const pathWithoutLocale = pathname.replace(/^\/(ru|en)/, '') || '/';

  return (
    <div className="flex gap-1">
      {locales.map(locale => (
        <Link
          key={locale}
          href={`/${locale}${pathWithoutLocale}`}
          className={`px-2 py-1 rounded-md border text-sm transition-colors ${
            locale === currentLocale 
              ? "bg-white/10 border-white/20 text-white" 
              : "border-white/10 hover:bg-white/5 text-white/70 hover:text-white"
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
