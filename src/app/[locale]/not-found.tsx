export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="glass-card p-8">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Страница не найдена
          </h1>
          <p className="text-gray-300 mb-6">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/ru" 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              На главную
            </a>
            <a 
              href="/ru/support" 
              className="px-6 py-3 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Поддержка
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
