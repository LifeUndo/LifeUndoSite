'use client';

import React from 'react';

export default function DownloadsClientEN() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Download GetLifeUndo
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose your platform and get protection from data loss in one click
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Chrome */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Chrome</h3>
            <p className="text-gray-300 mb-4">For Chrome browser</p>
            <a 
              href="https://chrome.google.com/webstore/detail/getlifeundo/placeholder" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Install
            </a>
          </div>

          {/* Firefox */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Firefox</h3>
            <p className="text-gray-300 mb-4">For Firefox browser</p>
            <a 
              href="https://addons.mozilla.org/firefox/addon/getlifeundo/" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Install
            </a>
          </div>

          {/* Edge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Edge</h3>
            <p className="text-gray-300 mb-4">For Edge browser</p>
            <a 
              href="https://microsoftedge.microsoft.com/addons/detail/getlifeundo/placeholder" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Install
            </a>
          </div>
        </div>

        {/* License Key Input */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Do you have a license key?
          </h3>
          <p className="text-gray-300 text-center mb-6">
            Enter your license key to activate Pro or VIP features
          </p>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Enter license key..." 
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/30 focus:border-blue-400 focus:outline-none"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Activate
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            What you get after installation
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Form Recovery</h4>
              <p className="text-gray-300">Automatic saving of entered text</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Tab History</h4>
              <p className="text-gray-300">Restore accidentally closed pages</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Clipboard</h4>
              <p className="text-gray-300">History of copied text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
