import React from 'react';
import type { Metadata } from 'next';
import SupportClient from './SupportClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/support`;
  const title = locale === 'en' ? 'Support — GetLifeUndo' : 'Поддержка — GetLifeUndo';
  const description = locale === 'en'
    ? 'GetLifeUndo Support: answers to common questions and contact form.'
    : 'Поддержка GetLifeUndo: ответы на частые вопросы и форма связи.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/support`,
        'en-US': `${base}/en/support`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}
export default function SupportPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const faq = locale === 'en'
    ? [
        { q: "Didn't receive license email?", a: "Check Spam/Promotions and the email used in the order. If there's no email — send us a ticket with order_id, we'll resend the key." },
        { q: 'How to activate Pro?', a: 'Open GetLifeUndo extension → Settings → License → Paste key. Restart the browser after activation.' },
        { q: 'What is Starter Bundle?', a: "A bundle: Pro for 6 months + a bonus flag 'starter_bonus' for the same period. Expiration date is shown in account settings." },
        { q: 'Refunds?', a: "We follow a fair refund policy in reasonable cases. Describe the situation in a ticket, include your email and order_id — we'll help." },
        { q: 'Can I change the plan?', a: 'Yes. Write to us, include your current and desired plan. We\'ll propose the best option.' },
      ]
    : [
        { q: 'Не пришло письмо с лицензией. Что делать?', a: 'Проверьте папку «Спам», вкладку «Промоакции» и корректность email в заказе. Если письма нет — отправьте нам тикет с указанием order_id, мы вышлем ключ повторно.' },
        { q: 'Как активировать Pro?', a: 'Откройте расширение GetLifeUndo → Настройки → Лицензия → Вставьте ключ. После активации перезапустите браузер.' },
        { q: 'Что такое Starter Bundle?', a: "Это пакет: Pro на 6 месяцев + бонусный флаг 'starter_bonus' на тот же срок. Дата окончания отображается в настройках аккаунта." },
        { q: 'Можно вернуть деньги?', a: 'Мы придерживаемся честной политики возврата в разумных случаях. Опишите ситуацию в тикете, укажите email и order_id — разберёмся.' },
        { q: 'Можно сменить тариф?', a: 'Да. Напишите нам, укажите текущий план и желаемый. Мы предложим наиболее выгодный вариант.' },
      ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SupportClient />
    </>
  );
}
