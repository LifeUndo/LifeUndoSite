import type { Metadata } from 'next';
import DownloadsClient from './DownloadsClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/downloads`;
  const title = locale === 'en' ? 'Downloads — GetLifeUndo' : 'Скачать — GetLifeUndo';
  const description = locale === 'en'
    ? 'Download GetLifeUndo for Chrome/Firefox/Edge. Restore lost text, tabs and clipboard history. 100% local.'
    : 'Скачайте GetLifeUndo для Chrome/Firefox/Edge. Восстанавливайте потерянный текст, вкладки и историю буфера. 100% локально.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/downloads`,
        'en-US': `${base}/en/downloads`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function Page() {
  return <DownloadsClient />;
}