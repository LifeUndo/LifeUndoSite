export default function HomePageEN() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ctrl+Z for your online life
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Forms, tabs, clipboard — 100% local, private. 
            Install, type, relax.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/en/downloads" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Download extension
            </a>
            <a 
              href="/en/features" 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* How it works - 3 steps */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Install</h3>
              <p className="text-gray-300">
                Download extension for Chrome, Firefox or Edge. 
                One click — protection is active.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Keep working</h3>
              <p className="text-gray-300">
                Fill forms, copy text, open tabs. 
                Everything saves locally in your browser.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Restore when needed</h3>
              <p className="text-gray-300">
                Accidentally closed a tab? Lost text? 
                Press "Undo" — everything is back in place.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to try?
            </h3>
            <p className="text-gray-300 mb-6">
              7 days free. No limits, no subscriptions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/en/downloads" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                Download free
              </a>
              <a 
                href="/en/pricing" 
                className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                View pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
