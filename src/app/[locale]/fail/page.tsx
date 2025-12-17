import Link from 'next/link';

export const metadata = { 
  title: "Ошибка платежа — GetLifeUndo",
  description: "Произошла ошибка при обработке платежа. Попробуйте еще раз или обратитесь в поддержку."
};

export default function FailPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Оплата не прошла или отменена</h1>
          <p className="text-xl text-gray-600 mb-6">
            К сожалению, произошла ошибка при обработке вашего платежа. Деньги не списаны.
          </p>

          {/* Common Issues */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold mb-4">Возможные причины:</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">•</span>
                <p className="text-gray-700">Недостаточно средств на карте</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">•</span>
                <p className="text-gray-700">Банк заблокировал операцию</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">•</span>
                <p className="text-gray-700">Технические проблемы с платежной системой</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">•</span>
                <p className="text-gray-700">Превышен лимит операций</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/ru/pricing" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Попробовать снова
            </Link>
            <Link 
              href="/ru/support" 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Написать в поддержку
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Если проблема повторяется, свяжитесь с нами:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <a 
                href="mailto:support@getlifeundo.com" 
                className="text-blue-600 hover:underline"
              >
                support@getlifeundo.com
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a 
                href="https://t.me/GetLifeUndoSupport" 
                className="text-blue-600 hover:underline"
              >
                Telegram поддержка
              </a>
            </div>
          </div>

          {/* Free Alternative */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Пока можно использовать бесплатную версию</h3>
            <p className="text-blue-700 text-sm mb-4">
              GetLifeUndo Free включает основные функции: восстановление текста, закрытых вкладок и буфера обмена.
            </p>
            <Link 
              href="/features" 
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Узнать о возможностях →
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Главная</Link>
            <Link href="/pricing" className="hover:text-gray-700">Цены</Link>
            <Link href="/features" className="hover:text-gray-700">Возможности</Link>
            <Link href="/support" className="hover:text-gray-700">Поддержка</Link>
            <Link href="/fund" className="hover:text-gray-700">Фонд</Link>
          </div>
        </div>
      </div>
    </main>
  );
}


