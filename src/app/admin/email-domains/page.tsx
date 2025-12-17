'use client';

import { useEffect, useState } from 'react';

interface DomainRule {
  id: number;
  domain: string;
  mode: 'whitelist' | 'blacklist' | string;
  comment: string | null;
}

export default function AdminEmailDomainsPage() {
  const [items, setItems] = useState<DomainRule[]>([]);
  const [adminToken, setAdminToken] = useState('');
  const [domain, setDomain] = useState('');
  const [mode, setMode] = useState<'whitelist' | 'blacklist'>('blacklist');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email-domains', {
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

  async function upsert() {
    if (!adminToken || !domain) return;
    const body = { action: 'upsert', domain, mode, comment }; 
    const res = await fetch('/api/admin/email-domains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setDomain('');
      setComment('');
      load();
    }
  }

  async function remove(domainToDelete: string) {
    if (!adminToken) return;
    const res = await fetch('/api/admin/email-domains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ action: 'delete', domain: domainToDelete }),
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
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">Доменные правила email</h1>
        <p className="text-slate-400 max-w-2xl">
          Чёрные и белые списки доменов для валидации почты. Здесь можно добавлять и удалять
          правила, а также оставлять комментарии. Для API-запросов используется заголовок
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
          <label className="mb-1">Домен</label>
          <input
            placeholder="example.com"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[200px]"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">Режим</label>
          <select
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="blacklist">blacklist</option>
            <option value="whitelist">whitelist</option>
          </select>
        </div>
        <div className="flex flex-col text-xs text-slate-400 flex-1 min-w-[220px]">
          <label className="mb-1">Комментарий</label>
          <input
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          onClick={upsert}
          className="h-8 px-3 rounded-md bg-indigo-600 text-xs font-medium hover:bg-indigo-500 disabled:opacity-60"
          disabled={loading || !adminToken || !domain}
        >
          Сохранить
        </button>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
        <table className="w-full border-collapse">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="px-2 py-2 text-left">Домен</th>
              <th className="px-2 py-2 text-left">Режим</th>
              <th className="px-2 py-2 text-left">Комментарий</th>
              <th className="px-2 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-900/60">
                <td className="px-2 py-1">{it.domain}</td>
                <td className="px-2 py-1">{it.mode}</td>
                <td className="px-2 py-1">{it.comment || '-'}</td>
                <td className="px-2 py-1">
                  <button
                    onClick={() => remove(it.domain)}
                    className="px-2 py-1 rounded bg-red-600 text-[11px] hover:bg-red-500"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                  Нет правил
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
