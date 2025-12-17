import Link from "next/link";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/features`;
  const title = locale === 'en'
    ? 'Features — GetLifeUndo'
    : 'Возможности — GetLifeUndo';
  const description = locale === 'en'
    ? 'Restore lost text, tabs and clipboard history. Local-first, no cloud. Pro/VIP features for productivity.'
    : 'Восстанавливайте потерянный текст, вкладки и историю буфера. 100% локально. Pro/VIP функции для продуктивности.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/features`,
        'en-US': `${base}/en/features`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function FeaturesPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  
  if (locale === 'en') {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">GetLifeUndo Features</h1>
          <p className="text-lg text-gray-300">
            "Ctrl+Z" for online life: restore lost text, tabs, clipboard history,
            quick notes and entire work sessions — neatly and safely.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-3">What's included in <span className="text-indigo-300">Pro</span></h2>
            <ul className="space-y-2 list-disc ml-5 text-gray-300">
              <li>Clipboard history: up to <strong>50</strong> recent items with quick search</li>
              <li>"Undo" for closed tabs and sessions</li>
              <li>Auto-save input fields (forms, posts, comments)</li>
              <li>Data export (JSON/CSV), local backup</li>
              <li>Priority support</li>
            </ul>
          </div>

          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-3">What's included in <span className="text-purple-300">VIP</span></h2>
            <ul className="space-y-2 list-disc ml-5 text-gray-300">
              <li>Everything from Pro</li>
              <li>Unlimited tabs and clipboard history</li>
              <li>Lifetime license (no monthly payments)</li>
              <li>10% goes to GetLifeUndo Fund</li>
              <li>Personal support</li>
              <li>Early access to new features</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl p-6 bg-white/5 border border-white/10 mb-12">
          <h2 className="text-xl font-semibold mb-3">How to get started</h2>
          <ol className="list-decimal ml-5 space-y-2 text-gray-300">
            <li>Install browser extension (Chrome / Firefox / Edge)</li>
            <li>Open extension settings and activate license</li>
            <li>Enable auto-save fields and clipboard history</li>
            <li>Check "undo panel" on frequently used sites</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors" target="_blank" rel="noopener noreferrer">
              Download for Chrome
            </a>
            <a href="https://addons.mozilla.org/firefox/addon/lifeundo/" className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 transition-colors" target="_blank" rel="noopener noreferrer">
              For Firefox
            </a>
            <a href="#" className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
              For Edge
            </a>
            <Link href="/en/support" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-colors">
              Need help?
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-3">Privacy & Security</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• 100% local storage — no cloud</li>
              <li>• No telemetry or data collection</li>
              <li>• Password fields are never saved</li>
              <li>• Open source core components</li>
            </ul>
          </div>

          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-3">Compatibility</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Chrome 88+</li>
              <li>• Firefox 85+</li>
              <li>• Edge 88+</li>
              <li>• Works on all websites</li>
            </ul>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to try?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/downloads" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Download Free
            </Link>
            <Link href="/en/pricing" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              View Pricing
            </Link>
          </div>
        </section>
      </main>
    );
  }
  
  // Russian version (default)
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Возможности GetLifeUndo</h1>
        <p className="text-lg text-gray-300">
          «Ctrl+Z» для онлайн-жизни: восстанавливайте потерянный текст, вкладки, историю буфера,
          быстрые заметки и целые рабочие сессии — аккуратно и безопасно.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-3">Что входит в <span className="text-indigo-300">Pro</span></h2>
          <ul className="space-y-2 list-disc ml-5 text-gray-300">
            <li>История буфера обмена: до <strong>50</strong> последних элементов с быстрым поиском</li>
            <li>«Отмена» для закрытых вкладок и сессий</li>
            <li>Автосохранение полей ввода (формы, посты, комментарии)</li>
            <li>Экспорт данных (JSON/CSV), локальный бэкап</li>
            <li>Приоритетная поддержка</li>
          </ul>
        </div>

        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-3">Что входит в <span className="text-purple-300">VIP</span></h2>
          <ul className="space-y-2 list-disc ml-5 text-gray-300">
            <li>Всё из Pro</li>
            <li>Безлимитные вкладки и история буфера</li>
            <li>Пожизненная лицензия (без ежемесячных платежей)</li>
            <li>10% идёт в GetLifeUndo Fund</li>
            <li>Персональная поддержка</li>
            <li>Ранний доступ к новым функциям</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl p-6 bg-white/5 border border-white/10 mb-12">
        <h2 className="text-xl font-semibold mb-3">Как начать</h2>
        <ol className="list-decimal ml-5 space-y-2 text-gray-300">
          <li>Установите расширение для браузера (Chrome / Firefox / Edge)</li>
          <li>Откройте настройки расширения и активируйте лицензию</li>
          <li>Включите автосохранение полей и историю буфера</li>
          <li>Проверьте «панель отмены» на часто используемых сайтах</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors" target="_blank" rel="noopener noreferrer">
            Скачать для Chrome
          </a>
          <a href="https://addons.mozilla.org/firefox/addon/lifeundo/" className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 transition-colors" target="_blank" rel="noopener noreferrer">
            Для Firefox
          </a>
          <a href="#" className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
            Для Edge
          </a>
          <Link href="/ru/support" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-colors">
            Нужна помощь?
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-3">Приватность и безопасность</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• 100% локальное хранение — никаких облаков</li>
            <li>• Никакой телеметрии и сбора данных</li>
            <li>• Парольные поля никогда не сохраняются</li>
            <li>• Открытый исходный код ключевых компонентов</li>
          </ul>
        </div>

        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-3">Совместимость</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Chrome 88+</li>
            <li>• Firefox 85+</li>
            <li>• Edge 88+</li>
            <li>• Работает на всех сайтах</li>
          </ul>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-6">Готовы попробовать?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/ru/downloads" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Скачать бесплатно
          </Link>
          <Link href="/ru/pricing" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Посмотреть цены
          </Link>
        </div>
      </section>
    </main>
  );
}