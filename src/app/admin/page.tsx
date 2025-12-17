export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Админ-панель</h1>
      <p className="text-sm text-slate-400 max-w-xl">
        Внутренний интерфейс для управления лицензиями, устройствами и доменными правилами email.
        Для API-запросов используется заголовок <code>X-Admin-Token</code> с секретным токеном, который вводится
        один раз на странице входа <code>/admin/login</code> и сохраняется в браузере.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <a href="/admin/licenses" className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-600">
          <h2 className="font-medium mb-1">Лицензии</h2>
          <p className="text-xs text-slate-400">Просмотр и корректировка лицензий, ручной revoke/обновление.</p>
        </a>
        <a href="/admin/devices" className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-600">
          <h2 className="font-medium mb-1">Устройства</h2>
          <p className="text-xs text-slate-400">Список устройств по email/типу, базовые операции.</p>
        </a>
        <a href="/admin/email-domains" className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-600">
          <h2 className="font-medium mb-1">Домены email</h2>
          <p className="text-xs text-slate-400">Чёрный/белый списки доменов для валидации почты.</p>
        </a>
      </div>
      <div className="text-xs text-slate-500">
        Для тестов Mesh и связки устройств можно использовать веб-клиент устройства по адресу{' '}
        <code className="font-mono">/device</code> (Ops-консоль).
      </div>
    </div>
  );
}

// code omitted in chat
