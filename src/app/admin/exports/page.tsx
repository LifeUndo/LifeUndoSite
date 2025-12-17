"use client";

import { useEffect, useState } from "react";

export default function AdminExportsPage() {
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("adminToken") || "";
    if (stored) setAdminToken(stored);
  }, []);

  function openExport(path: string, format: "csv" | "json") {
    if (!adminToken || typeof window === "undefined") return;
    const url = `/api/admin/exports/${path}?format=${format}&token=${encodeURIComponent(adminToken)}`;
    window.open(url, "_blank");
  }

  const canExport = !!adminToken;

  return (
    <div className="space-y-6 text-xs">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 text-sm">
          Экспорт данных
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Внутренний раздел для выгрузки данных в CSV/JSON: лицензии, устройства, платежи.
          Сейчас это только каркас интерфейса, без тяжёлой логики. Позже сюда будут
          подключены эндпоинты экспорта.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="font-medium text-slate-100">Лицензии</div>
          <p className="text-slate-400 text-[11px]">
            Выгрузка всех лицензий (email, уровень, план, срок действия, количество мест).
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 h-8 rounded-md bg-indigo-600 text-[11px] text-slate-50 disabled:opacity-50"
              disabled={!canExport}
              onClick={() => openExport("licenses", "csv")}
            >
              CSV
            </button>
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-200 disabled:opacity-50"
              disabled={!canExport}
              onClick={() => openExport("licenses", "json")}
            >
              JSON
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="font-medium text-slate-100">Устройства</div>
          <p className="text-slate-400 text-[11px]">
            Список устройств с device_id, типом (extension/desktop/android/web),
            последней активностью и привязкой к email.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 h-8 rounded-md bg-indigo-600 text-[11px] text-slate-50 disabled:opacity-50"
              disabled={!canExport}
              onClick={() => openExport("devices", "csv")}
            >
              CSV
            </button>
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-200 disabled:opacity-50"
              disabled={!canExport}
              onClick={() => openExport("devices", "json")}
            >
              JSON
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="font-medium text-slate-100">Платежи</div>
          <p className="text-slate-400 text-[11px]">
            Платежи и статусы подписки для бухгалтерии/аналитики. Можно будет фильтровать
            по диапазону дат и плану.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 h-8 rounded-md bg-indigo-600 text-[11px] text-slate-50 disabled:opacity-50"
              disabled={!canExport}
              onClick={() => openExport("payments", "csv")}
            >
              CSV
            </button>
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-200 disabled:opacity-50"
              disabled={!canExport}
              onClick={() => openExport("payments", "json")}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 max-w-xl">
        Для экспорта используется тот же <code>X-Admin-Token</code>, что и в других
        разделах админки: он подставляется в параметр <code>?token=</code>. Позже здесь
        можно добавить фильтры (диапазон дат, план, статус) и счётчики строк.
      </p>
    </div>
  );
}
