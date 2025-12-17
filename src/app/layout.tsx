import "./[locale]/globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://getlifeundo.com'),
  title: {
    default: 'GetLifeUndo — Ctrl+Z for your browser: restore forms, tabs and clipboard',
    template: '%s — GetLifeUndo',
  },
  description:
    'Restore form text, closed tabs and clipboard history. 100% local, no cloud. Browser extension for Firefox/Chrome. RU/EN. Восстановление форм, вкладок и буфера — 100% локально.',
  keywords: [
    'restore form text',
    'undo actions',
    'reopen closed tabs',
    'clipboard history',
    'browser extension',
    'Firefox',
    'Chrome',
    'Ctrl+Z',
    'privacy',
    'local-first',
    'restore form text',
    'reopen closed tabs',
    'clipboard history',
    // EN high-intent
    'undo closed tab chrome',
    'recover lost form text',
    'browser undo extension',
    'restore clipboard history',
    'privacy first extension',
    'local only data recovery',
    // RU high-intent
    'восстановить закрытую вкладку',
    'отменить закрытие вкладки chrome',
    'потерял текст в форме браузера',
    'локальное восстановление данных',
    'ctrl z для интернета',
  ],
  authors: [{ name: 'GetLifeUndo Team' }],
  creator: 'GetLifeUndo',
  publisher: 'GetLifeUndo',
  alternates: { 
    canonical: 'https://getlifeundo.com',
    languages: {
      'ru-RU': 'https://getlifeundo.com/ru',
      'en-US': 'https://getlifeundo.com/en',
    }
  },
  openGraph: {
    type: 'website',
    title: 'GetLifeUndo — Ctrl+Z for your browser',
    description: 'Restore form text, closed tabs, clipboard — 100% local.',
    url: 'https://getlifeundo.com',
    siteName: 'GetLifeUndo',
    images: [
      {
        url: '/brand/getlifeundo-og.png',
        width: 1200,
        height: 630,
        alt: 'GetLifeUndo - restore data and undo actions in your browser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetLifeUndo — Ctrl+Z for your browser',
    description: 'Restore form text, tabs and clipboard — 100% local, private.',
    images: ['/brand/getlifeundo-og.png'],
    creator: '@GetLifeUndo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GetLifeUndo",
            "url": "https://getlifeundo.com",
            "sameAs": [
              "https://t.me/GetLifeUndoSupport",
              "https://x.com/GetLifeUndo",
              "https://www.reddit.com/r/GetLifeUndo",
              "https://www.youtube.com/@GetLifeUndo",
              "https://github.com/GetLifeUndo",
              "https://vc.ru/id5309084",
              "https://habr.com/ru/users/GetLifeUndo25/"
            ]
          })}} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "GetLifeUndo",
            "applicationCategory": "BrowserExtension",
            "operatingSystem": "Windows, macOS, Linux",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB" },
            "url": "https://getlifeundo.com/ru",
            "softwareVersion": "0.3.7.12",
            "description": "Restore form text, closed tabs and clipboard history. 100% local, private."
          })}} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "GetLifeUndo",
            "url": "https://getlifeundo.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://getlifeundo.com/ru/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

