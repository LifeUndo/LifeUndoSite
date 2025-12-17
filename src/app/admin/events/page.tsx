"use client";

import { useEffect, useState } from "react";

interface AdminEventRow {
  id: number;
  actor: string;
  section: string;
  action: string;
  target_type: string;
  target_id: number;
  meta: any;
  created_at: string;
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<AdminEventRow[]>([]);
  const [section, setSection] = useState("");
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  async function load() {
    if (!adminToken) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (section) qs.set("section", section);
      if (targetId) qs.set("targetId", targetId);
      const res = await fetch("/api/admin/events?" + qs.toString(), {
        headers: { "X-Admin-Token": adminToken },
      });
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = window.localStorage.getItem("adminToken") || "";
    if (stored) setAdminToken(stored);
  }, []);

  useEffect(() => {
    if (adminToken) load();
  }, [adminToken]);

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-1">
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">Журнал действий</h1>
        <p className="text-slate-400 max-w-2xl">
          Внутренний лог действий админ-панели: операции с лицензиями, устройствами и другими
          сущностями. Помогает разбираться в истории изменений и демонстрировать хронологию
          для инвесторов и поддержки.
        </p>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col text-slate-400">
          <label className="mb-1 text-xs">X-Admin-Token</label>
          <input
            type="password"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[260px]"
            value={adminToken}
            onChange={(e) => {
              const v = e.target.value;
              setAdminToken(v);
              window.localStorage.setItem("adminToken", v);
            }}
          />
        </div>
        <div className="flex flex-col text-slate-400 text-xs">
          <label className="mb-1">Раздел</label>
          <input
            placeholder="devices / licenses / payments"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[200px]"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-slate-400 text-xs">
          <label className="mb-1">ID сущности</label>
          <input
            placeholder="например, 42"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[120px]"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
        </div>
        <button
          onClick={load}
          className="h-8 px-3 rounded-md bg-indigo-600 text-xs font-medium hover:bg-indigo-500 disabled:opacity-60"
          disabled={loading || !adminToken}
        >
          {loading ? "Загрузка…" : "Обновить"}
        </button>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
        <table className="w-full border-collapse">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="px-2 py-2 text-left">ID</th>
              <th className="px-2 py-2 text-left">Время</th>
              <th className="px-2 py-2 text-left">Раздел</th>
              <th className="px-2 py-2 text-left">Действие</th>
              <th className="px-2 py-2 text-left">Тип</th>
              <th className="px-2 py-2 text-left">ID сущности</th>
              <th className="px-2 py-2 text-left">Подробности</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-900/60">
                <td className="px-2 py-1">{it.id}</td>
                <td className="px-2 py-1 font-mono text-[11px]">{it.created_at}</td>
                <td className="px-2 py-1">{it.section}</td>
                <td className="px-2 py-1">{it.action}</td>
                <td className="px-2 py-1">{it.target_type}</td>
                <td className="px-2 py-1">{it.target_id}</td>
                <td className="px-2 py-1 max-w-xs">
                  <pre className="whitespace-pre-wrap break-words text-[10px] text-slate-300 bg-slate-950/60 rounded-md px-2 py-1 border border-slate-800">
                    {JSON.stringify(it.meta, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                  Пока нет событий
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
