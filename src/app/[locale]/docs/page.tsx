// src/app/docs/page.tsx
export const metadata = { 
  title: "API Документация — GetLifeUndo",
  description: "Полная документация API для интеграции с платформой GetLifeUndo."
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Документация</h1>
          <p className="text-xl text-gray-600 mb-6">Интеграция с платформой GetLifeUndo</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/api-docs" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Интерактивная документация
            </a>
            <a 
              href="/api/openapi.json" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              OpenAPI JSON
            </a>
            <a 
              href="/api/README.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Markdown версия
            </a>
          </div>
        </div>

        <div className="space-y-8">
          {/* Authentication */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">🔐 Аутентификация</h2>
            <p className="text-gray-600 mb-4">Все API запросы требуют API ключ в заголовке:</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
            </div>
          </div>

          {/* Health Check */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">🏥 Health Check</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">GET /api/health</h3>
                <p className="text-gray-600">Проверка состояния API</p>
                <div className="bg-gray-100 p-4 rounded-lg mt-2">
                  <pre className="text-sm">{`{
  "status": "ok",
  "timestamp": "2025-09-27T00:00:00.000Z"
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* FreeKassa API */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">💳 FreeKassa API</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">POST /api/fk/create</h3>
                <p className="text-gray-600">Создание платежа</p>
                <div className="bg-gray-100 p-4 rounded-lg mt-2">
                  <pre className="text-sm">{`{
  "email": "user@example.com",
  "plan": "pro_monthly",
  "amount": 99.00,
  "currency": "RUB"
}`}</pre>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">GET /api/fk/notify</h3>
                <p className="text-gray-600">Обработка уведомлений от FreeKassa</p>
              </div>
            </div>
          </div>

          {/* License API */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">🔑 License API</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">POST /api/license/validate</h3>
                <p className="text-gray-600">Проверка лицензии</p>
                <div className="bg-gray-100 p-4 rounded-lg mt-2">
                  <pre className="text-sm">{`{
  "license_key": "LICENSE_KEY_HERE",
  "product_id": "lifeundo_pro"
}`}</pre>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">POST /api/license/activate</h3>
                <p className="text-gray-600">Активация лицензии</p>
              </div>
            </div>
          </div>

          {/* Email API */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">📧 Email API</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">POST /api/email/pause</h3>
                <p className="text-gray-600">Приостановка отправки писем</p>
              </div>
              <div>
                <h3 className="font-semibold">POST /api/email/resume</h3>
                <p className="text-gray-600">Возобновление отправки</p>
              </div>
              <div>
                <h3 className="font-semibold">GET /api/email/status</h3>
                <p className="text-gray-600">Статус очереди писем</p>
              </div>
            </div>
          </div>

          {/* SDK Links */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">📦 SDK</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">JavaScript</h3>
                <code className="text-sm">npm install @lifeundo/sdk</code>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Python</h3>
                <code className="text-sm">pip install lifeundo-sdk</code>
              </div>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">⚡ Лимиты</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="font-semibold">PRO</h3>
                <p className="text-gray-600">1000 запросов/месяц</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">VIP</h3>
                <p className="text-gray-600">Безлимитно</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Rate Limit</h3>
                <p className="text-gray-600">100 запросов/минуту</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
