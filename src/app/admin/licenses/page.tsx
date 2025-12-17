'use client';

import { useEffect, useState } from 'react';

interface LicenseRow {
  id: number;
  user_email: string;
  level: string;
  plan: string | null;
  expires_at: string | null;
  seats: number | null;
  created_at: string;
}

export default function AdminLicensesPage() {
  const [items, setItems] = useState<LicenseRow[]>([]);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  async function load() {
    if (!adminToken) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (email) qs.set('email', email);
      if (plan) qs.set('plan', plan);
      const res = await fetch('/api/admin/licenses?' + qs.toString(), {
        headers: { 'X-Admin-Token': adminToken },
      });
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } finally {
      setLoading(false);
    }
  }

  async function mutate(id: number, action: 'revoke' | 'update') {
    if (!adminToken) return;
    const body: any = { id, action };
    const res = await fetch('/api/admin/licenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(body),
    });
    if (res.ok) load();
  }

  useEffect(() => {
    const stored = window.localStorage.getItem('adminToken') || '';
    if (stored) setAdminToken(stored);
  }, []);

  useEffect(() => {
    if (adminToken) load();
  }, [adminToken]);

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-xs">
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">Лицензии</h1>
        <p className="text-slate-400 max-w-2xl">
          Управление лицензиями пользователей: просмотр, поиск по email и плану, ручной revoke.
          Для API-запросов на этой странице используется заголовок
          <code className="mx-1">X-Admin-Token</code>, который вводится один раз на странице
          входа <code>/admin/login</code> и сохраняется в браузере.
        </p>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">X-Admin-Token</label>
          <input
            type="password"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[260px]"
            value={adminToken}
            onChange={(e) => {
              const v = e.target.value;
              setAdminToken(v);
              window.localStorage.setItem('adminToken', v);
            }}
          />
        </div>
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">Email (поиск)</label>
          <input
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[220px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">План</label>
          <input
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[160px]"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />
        </div>
        <button
          onClick={load}
          className="h-8 px-3 rounded-md bg-indigo-600 text-xs font-medium hover:bg-indigo-500 disabled:opacity-60"
          disabled={loading || !adminToken}
        >
          {loading ? 'Загрузка…' : 'Обновить'}
        </button>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
        <table className="w-full border-collapse">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="px-2 py-2 text-left">ID</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">Уровень</th>
              <th className="px-2 py-2 text-left">План</th>
              <th className="px-2 py-2 text-left">Истекает</th>
              <th className="px-2 py-2 text-left">Мест</th>
              <th className="px-2 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-900/60">
                <td className="px-2 py-1">{it.id}</td>
                <td className="px-2 py-1">{it.user_email}</td>
                <td className="px-2 py-1">{it.level}</td>
                <td className="px-2 py-1">{it.plan || '-'}</td>
                <td className="px-2 py-1">{it.expires_at || '∞'}</td>
                <td className="px-2 py-1">{it.seats ?? '-'}</td>
                <td className="px-2 py-1 space-x-1">
                  <button
                    onClick={() => mutate(it.id, 'revoke')}
                    className="px-2 py-1 rounded bg-red-600 text-[11px] hover:bg-red-500"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// code omitted in chat
