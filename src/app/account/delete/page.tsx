'use client';

import { useEffect, useState } from 'react';

export default function AccountDeletePage() {
  const [isRu, setIsRu] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      setIsRu(langParam !== 'en');
    } catch {
      setIsRu(true);
    }
  }, []);

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
      setMessage(
        isRu ? 'Укажите email, к которому привязан аккаунт.' : 'Enter the email linked to your account.',
      );
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
            (isRu
              ? 'Не удалось отправить запрос. Попробуйте позже или свяжитесь с поддержкой.'
              : 'Failed to submit the request. Please try again later or contact support.'),
        );
        return;
      }

      const backendMessage = typeof json.message === 'string' ? (json.message as string) : undefined;

      setStatus('success');
      setMessage(
        isRu
          ? backendMessage ||
              'Запрос на удаление аккаунта отправлен. Мы обработаем его и удалим/анонимизируем данные согласно политике хранения. Подтверждение будет отправлено на ваш email (если включена отправка писем).'
          : 'Your account deletion request has been submitted. We will process it and delete/anonymize your server-side data according to our data retention policy. A confirmation email will be sent to you (if email sending is enabled).',
      );
    } catch (error) {
      console.error('[account.delete] submit error', error);
      setStatus('error');
      setMessage(
        isRu
          ? 'Не удалось отправить запрос. Попробуйте позже или свяжитесь с поддержкой.'
          : 'Failed to submit the request. Please try again later or contact support.',
      );
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev));
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {isRu ? 'Удаление аккаунта GetLifeUndo' : 'Delete your GetLifeUndo account'}
        </h1>
        <p className="text-gray-300 mb-6">
          {isRu
            ? 'Здесь вы можете отправить запрос на удаление аккаунта и связанных с ним данных на стороне серверов GetLifeUndo. Локальные данные на ваших устройствах (история вкладок, локальные ZK‑снимки и т.п.) нужно удалять отдельно через настройки соответствующих приложений.'
            : 'Here you can submit a request to delete your GetLifeUndo account and associated server-side data. Local data on your devices (tab history, local ZK snapshots, etc.) must be deleted separately via the corresponding app settings.'}
        </p>

        <div className="glass-card bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <form
            method="POST"
            action="/api/account/delete-request"
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                {isRu ? 'Email аккаунта' : 'Account email'}
              </label>
              <input
                type="email"
                required
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-xl bg-black/40 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {isRu
                  ? 'Укажите тот же email, который вы использовали при оформлении подписки или активации лицензии.'
                  : 'Use the same email you used to purchase your subscription or activate your license.'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {isRu ? 'Причина удаления' : 'Reason for deletion'}
              </label>
              <select
                name="reasonCode"
                className="w-full rounded-xl bg-black/40 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                defaultValue="not-using"
              >
                <option value="not-using">
                  {isRu ? 'Перестал(а) пользоваться' : 'I stopped using LifeUndo'}
                </option>
                <option value="privacy">
                  {isRu ? 'Беспокоит приватность / хранение данных' : 'Privacy / data storage concerns'}
                </option>
                <option value="another-service">
                  {isRu ? 'Перехожу на другой сервис' : 'Switching to another service'}
                </option>
                <option value="bug">
                  {isRu ? 'Проблемы или баги в работе' : 'Problems or bugs in the app'}
                </option>
                <option value="other">{isRu ? 'Другая причина' : 'Other reason'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {isRu ? 'Комментарий (необязательно)' : 'Comment (optional)'}
              </label>
              <textarea
                name="comment"
                rows={3}
                placeholder={
                  isRu
                    ? 'Расскажите, что не устроило или чего не хватило. Это поможет нам улучшить сервис.'
                    : 'Tell us what went wrong or what you were missing. This helps us improve.'
                }
                className="w-full rounded-xl bg-black/40 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading'
                ? isRu
                  ? 'Отправка запроса...'
                  : 'Submitting request...'
                : isRu
                ? 'Отправить запрос на удаление аккаунта'
                : 'Submit account deletion request'}
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
              {isRu
                ? 'После подтверждения запроса мы удалим или анонимизируем данные аккаунта на сервере, за исключением тех, которые обязаны хранить по юридическим требованиям (например, учётные записи платежей).'
                : 'Once the request is confirmed, we will delete or anonymize your account data on the server, except for records we are legally required to keep (for example, payment records).'}
            </p>
            <p>
              {isRu
                ? 'Если вы ошибочно отправили запрос, свяжитесь с поддержкой как можно скорее, указав тот же email.'
                : 'If you submitted this request by mistake, contact support as soon as possible using the same email.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
