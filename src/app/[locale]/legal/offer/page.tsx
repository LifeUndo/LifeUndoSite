import type { Metadata } from 'next';
import OfferClient from './OfferClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/legal/offer`;
  const title = locale === 'en'
    ? 'Public Offer — GetLifeUndo'
    : 'Публичная оферта — GetLifeUndo';
  const description = locale === 'en'
    ? 'Public Offer for a non-exclusive license to GetLifeUndo software. Terms, license, payments, support.'
    : 'Публичная оферта на предоставление неисключительной лицензии на ПО GetLifeUndo. Условия, лицензия, оплата, поддержка.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/legal/offer`,
        'en-US': `${base}/en/legal/offer`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              {/* title rendered inside client as well */}
            </h1>
            <div className="prose prose-invert max-w-none">
              <OfferClient />
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}
