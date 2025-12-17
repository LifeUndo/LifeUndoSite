import type { Metadata } from 'next';
import LegalDownloadsClient from './LegalDownloadsClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/legal/downloads`;
  const title = locale === 'en' ? 'Contract Templates — GetLifeUndo' : 'Бланки договоров — GetLifeUndo';
  const description = locale === 'en'
    ? 'TXT templates: Public Offer, Corporate Contract, DPA, Processing Policy. For organizations (100+ VIP).'
    : 'TXT‑шаблоны: Оферта, Договор B2B, DPA, Политика обработки. Для организаций (100+ VIP).';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/legal/downloads`,
        'en-US': `${base}/en/legal/downloads`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}

export default function LegalDownloadsPage() {
  return <LegalDownloadsClient />;
}
