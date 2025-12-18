'use client';

import { useState } from 'react';

export default function AccountDeletePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get('email') as string | null)?.trim() || '';
    const reasonCode = (formData.get('reasonCode') as string | null) || 'not-using';
    const comment = (formData.get('comment') as string | null) || '';

    if (!email) {
      setStatus('error');
      setMessage('Укажите email, к которому привязан аккаунт.');
      return;
    }

    try {
      const res = await fetch('/api/account/delete-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reason: {
            code: reasonCode,
            comment: comment.trim() || undefined,
          },
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setStatus('error');
        setMessage(
          (json && (json.error as string)) ||
            'Не удалось отправить запрос. Попробуйте позже или свяжитесь с поддержкой.',
        );
        return;
      }

      setStatus('success');
      setMessage(
        (json.message as string) ||
          'Запрос на удаление аккаунта отправлен. Мы обработаем его и удалим/анонимизируем данные согласно политике хранения. Подтверждение будет отправлено на ваш email (если включена отправка писем).',
      );
    } catch (error) {
      console.error('[account.delete] submit error', error);
      setStatus('error');
      setMessage('Не удалось отправить запрос. Попробуйте позже или свяжитесь с поддержкой.');
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev));
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Удаление аккаунта GetLifeUndo</h1>
        <p className="text-gray-300 mb-6">
          Здесь вы можете отправить запрос на удаление аккаунта и связанных с ним данных на стороне серверов
          GetLifeUndo. Локальные данные на ваших устройствах (история вкладок, локальные ZK‑снимки и т.п.) нужно
          удалять отдельно через настройки соответствующих приложений.
        </p>

        <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <form
            method="POST"
            action="/api/account/delete-request"
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email аккаунта</label>
              <input
                type="email"
                required
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-xl bg-black/40 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Укажите тот же email, который вы использовали при оформлении подписки или активации лицензии.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Причина удаления</label>
              <select
                name="reasonCode"
                className="w-full rounded-xl bg-black/40 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                defaultValue="not-using"
              >
                <option value="not-using">Перестал(а) пользоваться</option>
                <option value="privacy">Беспокоит приватность / хранение данных</option>
                <option value="another-service">Перехожу на другой сервис</option>
                <option value="bug">Проблемы или баги в работе</option>
                <option value="other">Другая причина</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Комментарий (необязательно)</label>
              <textarea
                name="comment"
                rows={3}
                placeholder="Расскажите, что не устроило или чего не хватило. Это поможет нам улучшить сервис."
                className="w-full rounded-xl bg-black/40 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Отправка запроса...' : 'Отправить запрос на удаление аккаунта'}
            </button>

            {message && (
              <p
                className={`text-sm mt-2 ${
                  status === 'success'
                    ? 'text-emerald-400'
                    : status === 'error'
                    ? 'text-red-400'
                    : 'text-gray-300'
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs text-gray-400 space-y-2">
            <p>
              После подтверждения запроса мы удалим или анонимизируем данные аккаунта на сервере, за исключением тех,
              которые обязаны хранить по юридическим требованиям (например, учётные записи платежей).
            </p>
            <p>
              Если вы ошибочно отправили запрос, свяжитесь с поддержкой как можно скорее, указав тот же email.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
