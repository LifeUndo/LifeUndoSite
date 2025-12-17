import React from 'react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/legal/contract`;
  const title = locale === 'en' ? 'Software Licensing Agreement (B2B) — GetLifeUndo' : 'Договор лицензирования ПО (B2B) — GetLifeUndo';
  const description = locale === 'en'
    ? 'B2B licensing agreement terms: license scope, payment, support, liability. Templates for 100+ VIP.'
    : 'Условия B2B‑лицензии: объём прав, оплата, поддержка, ответственность. Шаблоны для 100+ VIP.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/legal/contract`,
        'en-US': `${base}/en/legal/contract`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}

export default function ContractPage({ params }: { params: { locale: string } }): React.ReactElement {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
        {locale === 'en' ? 'Software Licensing Agreement (B2B)' : 'Договор лицензирования программного обеспечения (B2B)'}
      </h1>
      <p className="text-gray-300">
        {locale === 'en'
          ? 'This agreement governs the licensing of GetLifeUndo software to organizations with 100+ VIP seats.'
          : 'Данный договор регулирует лицензирование программного обеспечения GetLifeUndo организациям от 100+ VIP мест.'}
      </p>
    </main>
  );
}
