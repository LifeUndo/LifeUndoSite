"use client";

import { useEffect, useState } from "react";

interface PaymentRow {
  id: number;
  order_id: string | null;
  email: string | null;
  plan: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<PaymentRow[]>([]);
  const [adminToken, setAdminToken] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!adminToken) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (email) qs.set("email", email);
      if (orderId) qs.set("order_id", orderId);
      const res = await fetch("/api/admin/payments?" + qs.toString(), {
        headers: { "X-Admin-Token": adminToken },
      });
      const data = await res.json().catch(() => null);
      if (data && data.ok && Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 text-sm">
          Платежи и подписки
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Внутренний просмотр платежей и статусов подписки. Здесь будут фильтры по email,
          order_id и плану, а также статусы успешных и неуспешных оплат. Пока это
          минимальная версия списка.
        </p>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col text-slate-400">
          <label className="mb-1">X-Admin-Token</label>
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
        <div className="flex flex-col text-slate-400">
          <label className="mb-1">Email</label>
          <input
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[220px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-slate-400">
          <label className="mb-1">Order ID</label>
          <input
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[200px]"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
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

      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="px-2 py-2 text-left">ID</th>
              <th className="px-2 py-2 text-left">Order ID</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">План</th>
              <th className="px-2 py-2 text-left">Сумма</th>
              <th className="px-2 py-2 text-left">Валюта</th>
              <th className="px-2 py-2 text-left">Статус</th>
              <th className="px-2 py-2 text-left">Создано</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-900/60">
                <td className="px-2 py-1">{it.id}</td>
                <td className="px-2 py-1 font-mono text-[11px]">{it.order_id || "-"}</td>
                <td className="px-2 py-1">{it.email || "-"}</td>
                <td className="px-2 py-1">{it.plan || "-"}</td>
                <td className="px-2 py-1">{it.amount ?? "-"}</td>
                <td className="px-2 py-1">{it.currency || "-"}</td>
                <td className="px-2 py-1">{it.status || "-"}</td>
                <td className="px-2 py-1">{it.created_at}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-slate-500">
                  Нет данных (эндпоинт /api/admin/payments ещё можно доработать).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
