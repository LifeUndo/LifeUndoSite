import useCasesRU from '@/data/use_cases_ru.json';
import useCasesEN from '@/data/use_cases_en.json';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/use-cases`;
  const title = locale === 'en' ? 'Use Cases — GetLifeUndo' : 'Кейсы использования — GetLifeUndo';
  const description = locale === 'en'
    ? 'Real-world scenarios: recover lost form text, reopen tabs, clipboard history. For work, study and daily browsing.'
    : 'Практические сценарии: восстановление текста форм, возврат вкладок, история буфера. Для работы, учёбы и повседневного серфинга.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/use-cases`,
        'en-US': `${base}/en/use-cases`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function UseCasesPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const data = locale === 'en' ? (useCasesEN as typeof useCasesRU) : useCasesRU;
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            {locale === 'en' ? 'Use Cases' : 'Кейсы использования'}
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            {locale === 'en' ? 'How GetLifeUndo helps across different areas' : 'Как GetLifeUndo помогает в разных сферах'}
          </p>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((useCase, index) => (
              <div key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center mb-4">
                  <span className="text-sm px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                    {useCase.sector}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {useCase.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {useCase.summary}
                </p>
                <div className="mt-4">
                  <a
                    href={
                      useCase.cta === 'Узнать о GLU' || useCase.cta === 'Learn about GLU'
                        ? `/${locale}/email-pause`
                        : `/${locale}/downloads`
                    }
                    className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    {useCase.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            {locale === 'en' ? 'Ready to try?' : 'Готовы попробовать?'}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {locale === 'en'
              ? 'Join thousands of users who already use GetLifeUndo'
              : 'Присоединяйтесь к тысячам пользователей, которые уже используют GetLifeUndo'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/downloads`}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              {locale === 'en' ? 'Download for free' : 'Скачать бесплатно'}
            </a>
            <a
              href={`/${locale}/pricing`}
              className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-200"
            >
              {locale === 'en' ? 'View pricing' : 'Посмотреть тарифы'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
