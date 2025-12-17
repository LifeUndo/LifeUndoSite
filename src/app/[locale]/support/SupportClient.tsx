"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from '@/hooks/useTranslations';

function getFAQ(isEN: boolean) {
  if (isEN) {
    return [
      { q: "Didn't receive license email?", a: "Check Spam/Promotions and the email used in the order. If there's no email — send us a ticket with order_id, we'll resend the key." },
      { q: "How to activate Pro?", a: "Open GetLifeUndo extension → Settings → License → Paste key. Restart the browser after activation." },
      { q: "What is Starter Bundle?", a: "A bundle: Pro for 6 months + a bonus flag 'starter_bonus' for the same period. Expiration date is shown in account settings." },
      { q: "Refunds?", a: "We follow a fair refund policy in reasonable cases. Describe the situation in a ticket, include your email and order_id — we'll help." },
      { q: "Can I change the plan?", a: "Yes. Write to us, include your current and desired plan. We'll propose the best option." },
    ];
  }
  return [
    { q: "Не пришло письмо с лицензией. Что делать?", a: "Проверьте папку «Спам», вкладку «Промоакции» и корректность email в заказе. Если письма нет — отправьте нам тикет с указанием order_id, мы вышлем ключ повторно." },
    { q: "Как активировать Pro?", a: "Откройте расширение GetLifeUndo → Настройки → Лицензия → Вставьте ключ. После активации перезапустите браузер." },
    { q: "Что такое Starter Bundle?", a: "Это пакет: Pro на 6 месяцев + бонусный флаг 'starter_bonus' на тот же срок. Дата окончания отображается в настройках аккаунта." },
    { q: "Можно вернуть деньги?", a: "Мы придерживаемся честной политики возврата в разумных случаях. Опишите ситуацию в тикете, укажите email и order_id — разберёмся." },
    { q: "Можно сменить тариф?", a: "Да. Напишите нам, укажите текущий план и желаемый. Мы предложим наиболее выгодный вариант." },
  ];
}

export default function SupportClient() {
  const { locale } = useTranslations();
  const isEN = locale === 'en';
  const searchParams = useSearchParams();
  const order_id = searchParams.get('order_id') || '';
  const plan = searchParams.get('plan') || '';
  const email = searchParams.get('email') || '';

  const [form, setForm] = useState({
    email: email,
    order_id: order_id,
    topic: "general",
    message: ""
  });
  const [sent, setSent] = useState(false);
  const submitDisabled = useMemo(() => !form.email || !form.message, [form]);
  const FAQ = getFAQ(isEN);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan })
      });
      if (res.ok) setSent(true);
    } catch { /* no-op */ }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{isEN ? 'Support' : 'Поддержка'}</h1>

      {(process.env.NEXT_PUBLIC_IS_TEST_MODE === "true") && (
        <div className="mb-6 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-yellow-200">
          {isEN ? (
            <>Test mode is enabled. For payments questions specify order_id: <strong>{order_id || "—"}</strong>.</>
          ) : (
            <>Тестовый режим активирован. Вопросы по оплате — указывайте order_id: <strong>{order_id || "—"}</strong>.</>
          )}
        </div>
      )}

      <section className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">{isEN ? 'FAQ' : 'Частые вопросы'}</h2>
          <ul className="space-y-4">
            {FAQ.map((item, i) => (
              <li key={i}>
                <p className="font-medium text-white">{item.q}</p>
                <p className="text-gray-300 mt-1">{item.a}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">{isEN ? 'Contact support' : 'Написать в поддержку'}</h2>
          {sent ? (
            <div className="rounded-xl bg-emerald-400/10 border border-emerald-400/30 p-4 text-emerald-200">
              {isEN ? 'Thank you! We received your request and will reply to ' : 'Спасибо! Мы получили вашу заявку и ответим на email '}{form.email}.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={isEN ? 'you@example.com' : 'you@example.com'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">{isEN ? 'Order ID' : 'Order ID'}</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                  value={form.order_id}
                  onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                  placeholder={isEN ? 'e.g., S6M-172... or PROM-1759...' : 'например, S6M-172... или PROM-1759...'}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">{isEN ? 'Topic' : 'Тема'}</label>
                <select
                  className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                >
                  <option value="general">{isEN ? 'Usage question' : 'Вопрос по работе'}</option>
                  <option value="payment">{isEN ? 'Payment and license' : 'Оплата и лицензия'}</option>
                  <option value="refund">{isEN ? 'Refund / exchange' : 'Возврат / обмен'}</option>
                  <option value="bug">{isEN ? 'Bug / issue' : 'Баг / ошибка'}</option>
                  <option value="feature">{isEN ? 'Feature request' : 'Предложение по фиче'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">{isEN ? 'Message' : 'Сообщение'}</label>
                <textarea
                  className="w-full min-h-[120px] rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                  placeholder={isEN ? 'Describe the situation. You can add screenshots via links.' : 'Опишите ситуацию. Можно добавить скриншоты ссылками.'}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button 
                disabled={submitDisabled} 
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEN ? 'Submit request' : 'Отправить заявку'}
              </button>

              <div className="text-sm text-gray-400">
                {isEN ? 'Or write to ' : 'Или напишите на'}{" "}
                <a 
                  className="underline text-indigo-300 hover:text-indigo-200" 
                  href={isEN ? `mailto:support@getlifeundo.com?subject=Purchase%20%23${form.order_id || order_id || ""}` : `mailto:support@getlifeundo.com?subject=Покупка%20%23${form.order_id || order_id || ""}`}
                >
                  support@getlifeundo.com
                </a>
                .
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
