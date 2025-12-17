'use client';
import { useState } from 'react';

interface TwoFASetupProps {
  onComplete: (recoveryCodes: string[]) => void;
}

export default function TwoFASetup({ onComplete }: TwoFASetupProps) {
  const [step, setStep] = useState<'setup' | 'confirm' | 'complete'>('setup');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/2fa/setup');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup 2FA');
      }
      
      setQrDataUrl(data.qrDataUrl);
      setSecret(data.secret);
      setSessionId(data.sessionId);
      setStep('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!token || token.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/2fa/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, token })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm 2FA');
      }
      
      setRecoveryCodes(data.recoveryCodes);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Confirmation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete(recoveryCodes);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
          Настройка 2FA
        </h2>
        
        {step === 'setup' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Для безопасности админ‑панели необходимо настроить двухфакторную аутентификацию.
              </p>
              <button
                onClick={handleSetup}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Настраиваем...' : 'Начать настройку'}
              </button>
            </div>
          </div>
        )}
        
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Отсканируйте QR‑код</h3>
              {qrDataUrl && (
                <div className="mb-4">
                  <img src={qrDataUrl} alt="QR Code" className="mx-auto" />
                </div>
              )}
              <p className="text-sm text-gray-300 mb-4">
                Используйте Google Authenticator, Authy или аналогичное приложение
              </p>
              <div className="bg-white/5 p-4 rounded-lg mb-4">
                <p className="text-xs text-gray-400 mb-2">Или введите секрет вручную:</p>
                <code className="text-sm text-purple-300 break-all">{secret}</code>
              </div>
            </div>
            
            <div>
              <label htmlFor="token" className="block text-sm font-medium mb-2">
                Код из приложения
              </label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={isLoading || token.length !== 6}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Проверяем...' : 'Подтвердить'}
            </button>
          </div>
        )}
        
        {step === 'complete' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-lg font-semibold mb-4">2FA настроена!</h3>
              <p className="text-gray-300 mb-6">
                Сохраните эти коды восстановления в безопасном месте.
                Они понадобятся, если вы потеряете доступ к приложению аутентификатора.
              </p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">Коды восстановления:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {recoveryCodes.map((code, index) => (
                  <div key={index} className="bg-white/5 p-2 rounded text-center font-mono">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Завершить настройку
            </button>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

