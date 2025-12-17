'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('adminToken') || '';
    if (stored) {
      setToken(stored);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('adminToken', token);
      }
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-6 shadow-lg">
        <h1 className="text-lg font-semibold tracking-tight mb-1">Админ-вход</h1>
        <p className="text-xs text-slate-400 mb-4">
          Введите служебный токен администратора. Он будет сохранён локально в браузере и будет автоматически
          подставляться во все запросы /api/admin как заголовок <code className="font-mono">X-Admin-Token</code>.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-slate-300">X-Admin-Token</label>
            <input
              type="password"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!token || loading}
            className="w-full h-9 rounded-md bg-indigo-600 text-xs font-medium hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? 'Входим…' : 'Войти в админку'}
          </button>

          <p className="text-[11px] text-slate-500 mt-2">
            После входа можно переходить на разделы <code className="font-mono">/admin/licenses</code>,{' '}
            <code className="font-mono">/admin/devices</code>, <code className="font-mono">/admin/email-domains</code>.
          </p>
        </form>
      </div>
    </main>
  );
}

