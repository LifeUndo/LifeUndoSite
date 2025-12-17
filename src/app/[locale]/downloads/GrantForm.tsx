'use client';

import React, { useState, useEffect } from 'react';
import { useT } from '@/lib/i18n-react';

export default function GrantForm() {
  const t = useT('downloads');
  const [testEmail, setTestEmail] = useState('');
  const [testPlan, setTestPlan] = useState('starter_6m');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [devEnabled, setDevEnabled] = useState<boolean | null>(null);
  const [diagInfo, setDiagInfo] = useState<any>(null);

  // Check dev status and diagnostics
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check dev status
        const statusRes = await fetch('/api/dev/license/status', { cache: 'no-store' });
        const statusData = await statusRes.json();
        setDevEnabled(statusData.enabled);

        // Check diagnostics
        const diagRes = await fetch('/api/dev/diag', { cache: 'no-store' });
        const diagData = await diagRes.json();
        setDiagInfo(diagData);
      } catch (error) {
        console.error('Failed to check dev status:', error);
        setDevEnabled(false);
      }
    };

    checkStatus();
  }, []);

  // Show loading while checking dev status
  if (devEnabled === null) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
        <div className="text-center text-white">
          <p>Checking testing availability...</p>
        </div>
      </div>
    );
  }

  // Show disabled message if not in dev mode
  if (!devEnabled) {
    return (
      <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">⚠️ {t('testing.disabled')}</h2>
        <p className="text-gray-300">
          {t('testing.disabled.desc')}
        </p>
      </div>
    );
  }

  // Show database warning if no DATABASE_URL (but still show form)
  const showDbWarning = diagInfo && !diagInfo.hasDbUrl;

  const handleGrantTestLicense = async () => {
    if (!testEmail.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');
    setTestResult(null);

    try {
      const r = await fetch('/api/dev/license/grant-ui', { 
        method: 'POST', 
        body: JSON.stringify({ email: testEmail.trim(), plan: testPlan }), 
        headers: { 'Content-Type': 'application/json' }
      });

      if (r.status >= 500) {
        setError(t('alert.unexpected'));
        return;
      }

      const data = await r.json();
      
      if (data.ok) {
        setTestResult(data);
      } else {
        // Маппинг кодов ошибок
        if (data.code === 'FORBIDDEN') {
          setError(t('alert.forbidden'));
        } else if (data.code === 'DEV_DISABLED') {
          setError(t('alert.devDisabled'));
        } else if (data.code === 'NO_DATABASE_URL') {
          setError(t('alert.noDb'));
        } else {
          setError(t('alert.unexpected'));
        }
      }
    } catch (error) {
      setError(t('alert.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  const openAccount = () => {
    if (testResult?.email) {
      window.open(`/ru/account?email=${encodeURIComponent(testResult.email)}`, '_blank');
    }
  };

  const openExtensionInstructions = () => {
    // Scroll to extension instructions
    document.getElementById('extension-instructions')?.scrollIntoView({ behavior: 'smooth' });
  };

      return (
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-8 mb-8">
          {/* Database warning banner */}
          {showDbWarning && (
            <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-orange-300 mb-2">🗄️ {t('db.missing.title')}</h2>
              <p className="text-gray-300 text-sm">
                {t('db.missing.desc')}
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mb-4">🧪 {t('grant.title')}</h2>
          <p className="text-gray-300 mb-6">
            Test the full license flow without any payment. Perfect for development and testing.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">{t('grant.email')}</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">{t('grant.plan')}</label>
              <select
                value={testPlan}
                onChange={(e) => setTestPlan(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="starter_6m">Starter Bundle (6 months)</option>
                <option value="pro_month">Pro Monthly</option>
                <option value="vip_lifetime">VIP Lifetime</option>
                <option value="team_5">Team (5 seats)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleGrantTestLicense}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Granting...' : t('grant.button')}
            </button>
          </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300">❌ {error}</p>
        </div>
      )}

          {testResult && (
            <div className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-4">✅ {t('grant.success')}</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-white">Order ID:</strong>
              <p className="text-gray-300 font-mono">{testResult.order_id}</p>
            </div>
            <div>
              <strong className="text-white">Level:</strong>
              <p className="text-gray-300">{testResult.level?.toUpperCase()}</p>
            </div>
            <div>
              <strong className="text-white">Expires:</strong>
              <p className="text-gray-300">{new Date(testResult.expires_at).toLocaleDateString()}</p>
            </div>
            <div>
              <strong className="text-white">Plan:</strong>
              <p className="text-gray-300">{testResult.plan}</p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={openAccount}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Open Account
            </button>
            <button
              onClick={openExtensionInstructions}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
            >
              Extension Instructions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
