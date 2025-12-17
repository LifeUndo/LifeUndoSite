import React from 'react';
import type { Metadata } from 'next';
import PartnersClient from './PartnersClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/partners`;
  const title = 'White‑label / OEM — GetLifeUndo';
  const description = locale === 'en'
    ? 'Brand GetLifeUndo for your company. WL‑Starter/WL‑Pro/WL‑Enterprise. From 100 VIP subscriptions.'
    : 'Брендируйте GetLifeUndo под вашу компанию. Пакеты WL‑Starter/WL‑Pro/WL‑Enterprise. От 100 VIP‑подписок.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/partners`,
        'en-US': `${base}/en/partners`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <PartnersClient />
      {/* содержимое перенесено в <PartnersClient /> */}
    </div>
  );
}
