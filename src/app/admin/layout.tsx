import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur px-4 py-6 flex flex-col gap-4">
        <div className="text-lg font-semibold tracking-tight">GetLifeUndo Admin</div>
        <nav className="flex flex-col gap-1 text-sm">
          <a href="/admin" className="px-3 py-2 rounded-md hover:bg-slate-800">Обзор</a>
          <a href="/admin/licenses" className="px-3 py-2 rounded-md hover:bg-slate-800">Лицензии</a>
          <a href="/admin/devices" className="px-3 py-2 rounded-md hover:bg-slate-800">Устройства</a>
          <a href="/admin/email-domains" className="px-3 py-2 rounded-md hover:bg-slate-800">Доменные правила</a>
          <a href="/admin/payments" className="px-3 py-2 rounded-md hover:bg-slate-800">Платежи</a>
          <a href="/admin/exports" className="px-3 py-2 rounded-md hover:bg-slate-800">Экспорт</a>
          <a href="/admin/events" className="px-3 py-2 rounded-md hover:bg-slate-800">Журнал</a>
          <a href="/admin/ops-console" className="px-3 py-2 rounded-md hover:bg-slate-800">Ops-консоль (web-клиент)</a>
        </nav>
      </aside>
      <main className="flex-1 px-6 py-6">
        {children}
      </main>
    </div>
  );
}

// code omitted in chat
