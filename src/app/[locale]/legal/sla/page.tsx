import React from 'react';
import type { Metadata } from 'next';
import SlaClient from './SlaClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/legal/sla`;
  const title = locale === 'en' ? 'Service Level Agreement (SLA) — GetLifeUndo' : 'SLA — GetLifeUndo';
  const description = locale === 'en'
    ? 'Basic SLA: availability, support response, maintenance notifications, evidence requirements, exclusions.'
    : 'Базовый SLA: доступность, реакция поддержки, уведомления о работах, требования к доказательствам, исключения.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/legal/sla`,
        'en-US': `${base}/en/legal/sla`,
      }
    },
    openGraph: { url, title, description },
    twitter: { title, description },
  };
}

export default function SLAPage(): React.ReactElement {
  return <SlaClient />;
}
