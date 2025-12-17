import React from 'react';
import type { Metadata } from 'next';
import PdpClient from './PdpClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/legal/pdp`;
  const title = locale === 'en' ? 'Personal Data Processing Policy — GetLifeUndo' : 'Политика обработки ПДн — GetLifeUndo';
  const description = locale === 'en'
    ? 'How GetLifeUndo processes personal data: local processing, no telemetry, payment data via providers, user rights.'
    : 'Как GetLifeUndo обрабатывает персональные данные: локальная обработка, без телеметрии, платежные данные у провайдеров, права пользователей.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/legal/pdp`,
        'en-US': `${base}/en/legal/pdp`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}

export default function PDPPage(): React.ReactElement {
  return <PdpClient />;
}
