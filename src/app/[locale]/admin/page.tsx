'use client';
import { useState, useEffect } from 'react';
import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';
import TwoFASetup from '@/components/TwoFASetup';
import TwoFAVerify from '@/components/TwoFAVerify';

export default function AdminPage() {
  const [authState, setAuthState] = useState<'login' | '2fa-setup' | '2fa-verify' | 'dashboard'>('login');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Симуляция проверки логина
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'admin@lifeundo.ru' && credentials.password === 'admin123') {
        // Проверяем, настроена ли 2FA
        const has2FA = process.env.NODE_ENV === 'development' ? false : true; // В production проверять из БД
        
        if (has2FA) {
          setAuthState('2fa-verify');
        } else {
          setAuthState('2fa-setup');
        }
      } else {
        setError('Неверные учетные данные');
      }
    } catch (err) {
      setError('Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASetupComplete = (codes: string[]) => {
    setRecoveryCodes(codes);
    setAuthState('dashboard');
  };

  const handle2FAVerifySuccess = () => {
    setAuthState('dashboard');
  };

  const handleRecoveryCode = () => {
    // В production реализовать логику recovery codes
    alert('Функция кодов восстановления будет реализована в production');
  };

  if (authState === 'login') {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white">
        <ModernHeader />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8">
              <h1 className="text-3xl font-bold gradient-text mb-8 text-center">
                Админ-панель
              </h1>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="admin@lifeundo.ru"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Пароль
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Входим...' : 'Войти'}
                </button>
              </form>
              
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              <div className="mt-6 text-center text-sm text-gray-400">
                <p>Демо-доступ: admin@lifeundo.ru / admin123</p>
              </div>
            </div>
          </div>
        </main>
        
        <ModernFooter />
      </div>
    );
  }

  if (authState === '2fa-setup') {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white">
        <ModernHeader />
        
        <main className="container mx-auto px-4 py-16">
          <TwoFASetup onComplete={handle2FASetupComplete} />
        </main>
        
        <ModernFooter />
      </div>
    );
  }

  if (authState === '2fa-verify') {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white">
        <ModernHeader />
        
        <main className="container mx-auto px-4 py-16">
          <TwoFAVerify onSuccess={handle2FAVerifySuccess} onRecovery={handleRecoveryCode} />
        </main>
        
        <ModernFooter />
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <ModernHeader />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">
            Админ-панель GetLifeUndo
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1,250</div>
              <div className="text-gray-300">Активные подписки</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">89</div>
              <div className="text-gray-300">Триалы</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">125,000₽</div>
              <div className="text-gray-300">Платежи за 24ч</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">2.5%</div>
              <div className="text-gray-300">Churn Rate</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                  Отправить рассылку
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                  Создать грант
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                  Экспорт данных
                </button>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Статус системы</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Веб-сайт</span>
                  <span className="text-green-400">✓ Работает</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">База данных</span>
                  <span className="text-green-400">✓ Работает</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Платежи</span>
                  <span className="text-green-400">✓ Работает</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Рассылки</span>
                  <span className="text-green-400">✓ Работает</span>
                </div>
              </div>
            </div>
          </div>
          
          {recoveryCodes.length > 0 && (
            <div className="mt-8 glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-yellow-300">⚠️ Коды восстановления</h2>
              <p className="text-gray-300 mb-4">
                Сохраните эти коды в безопасном месте. Они понадобятся, если вы потеряете доступ к приложению аутентификатора.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {recoveryCodes.map((code, index) => (
                  <div key={index} className="bg-white/5 p-2 rounded text-center font-mono text-sm">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <ModernFooter />
    </div>
  );
}
