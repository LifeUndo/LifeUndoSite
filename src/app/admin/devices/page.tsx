'use client';

import { useEffect, useState } from 'react';

interface DeviceRow {
  id: number;
  user_email: string;
  device_id: string;
  kind: string;
  label: string | null;
  created_at: string;
  last_seen_at: string | null;
}

export default function AdminDevicesPage() {
  const [items, setItems] = useState<DeviceRow[]>([]);
  const [email, setEmail] = useState('');
  const [kind, setKind] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  async function load() {
    if (!adminToken) return;
    setLoading(true);
    setActionStatus(null);
    try {
      const qs = new URLSearchParams();
      if (email) qs.set('email', email);
      if (kind) qs.set('kind', kind);
      const res = await fetch('/api/admin/devices?' + qs.toString(), {
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

  async function mutate(id: number, action: 'disable' | 'enable' | 'setLabel' | 'delete', extra?: { label?: string }) {
    if (!adminToken) return;
    setActionStatus(null);
    const body: any = { id, action };
    if (action === 'setLabel' && typeof extra?.label === 'string') {
      body.label = extra.label;
    }
    try {
      const res = await fetch('/api/admin/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data || data.error) {
        setActionStatus(
          `Ошибка действия "${action}": ${
            data && data.error ? String(data.error) : `HTTP ${res.status}`
          }`,
        );
        return;
      }

      setActionStatus('Действие применено, список обновлён.');
      await load();
    } catch (e: any) {
      setActionStatus(`Ошибка сети при действии "${action}": ${String(e?.message || e)}`);
    }
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
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">Устройства</h1>
        <p className="text-slate-400 max-w-2xl">
          Раздел для просмотра устройств, привязанных к лицензиям, и базовых операций
          (отключение, включение, метки, удаление). Для API-запросов используется заголовок
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
          <label className="mb-1">Email</label>
          <input
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[220px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">Тип устройства</label>
          <input
            placeholder="extension / desktop / android"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[200px]"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
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

      {actionStatus && (
        <div className="text-[11px] text-slate-300 bg-slate-900/70 border border-slate-800 rounded-md px-3 py-2">
          {actionStatus}
        </div>
      )}

      <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
        <table className="w-full border-collapse">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="px-2 py-2 text-left">ID</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">ID устройства</th>
              <th className="px-2 py-2 text-left">Тип устройства</th>
              <th className="px-2 py-2 text-left">Метка (внутренняя)</th>
              <th className="px-2 py-2 text-left">Создано</th>
              <th className="px-2 py-2 text-left">Последняя активность</th>
              <th className="px-2 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-900/60">
                <td className="px-2 py-1">{it.id}</td>
                <td className="px-2 py-1">{it.user_email}</td>
                <td className="px-2 py-1 font-mono text-[11px]">{it.device_id}</td>
                <td className="px-2 py-1">{it.kind}</td>
                <td className="px-2 py-1">{it.label || '-'}</td>
                <td className="px-2 py-1">{it.created_at}</td>
                <td className="px-2 py-1">{it.last_seen_at || '-'}</td>
                <td className="px-2 py-1">
                  <div className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => mutate(it.id, 'disable')}
                    className="px-2 py-1 rounded bg-slate-800 text-[11px] hover:bg-slate-700"
                  >
                    Отключить
                  </button>
                  <button
                    onClick={() => mutate(it.id, 'enable')}
                    className="px-2 py-1 rounded bg-emerald-700 text-[11px] hover:bg-emerald-600"
                  >
                    Включить
                  </button>
                  <button
                    onClick={() => {
                      const next =
                        window.prompt(
                          'Внутренняя метка устройства (например, "ПК дома" или "Телефон жены")',
                          it.label || ''
                        ) || '';
                      mutate(it.id, 'setLabel', { label: next });
                    }}
                    className="px-2 py-1 rounded bg-sky-700 text-[11px] hover:bg-sky-600"
                  >
                    Метка
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Пометить устройство как удалённое в админке? Данные на стороне клиента это не сотрёт.'
                        )
                      ) {
                        mutate(it.id, 'delete');
                      }
                    }}
                    className="px-2 py-1 rounded bg-red-700 text-[11px] hover:bg-red-600"
                  >
                    Удалить
                  </button>
                  </div>
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
