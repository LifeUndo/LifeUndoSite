export default function MobileIOSPageEN() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">рџ“±</div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            GetLifeUndo for iOS
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Mobile version of GetLifeUndo coming to App Store
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-yellow-200 mb-6 text-center">
              Development Status
            </h2>
            <div className="space-y-4 text-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>In development вЂ” preparing for release</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Planned release вЂ” Q1 2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Notify about launch
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Leave your email and we'll notify when the app appears in App Store
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Notify about release
              </button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/en/downloads"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Download for browser
            </a>
            <a 
              href="https://t.me/GetLifeUndoSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Telegram support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

