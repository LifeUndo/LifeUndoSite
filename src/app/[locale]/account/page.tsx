'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface AccountData {
  email?: string;
  license?: {
    level: string;
    expires_at?: string;
    seats?: number;
  };
  flags?: Array<{
    key: string;
    value: any;
    expires_at?: string;
  }>;
}

export default function AccountPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || '';
  
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (orderId) {
      loadData();
    }
  }, [orderId]);

  async function loadData() {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/payment/summary?order_id=${orderId}`);
      const json = await res.json();
      if (json.ok) {
        setData({
          email: json.email,
          license: json.license,
          flags: json.flags
        });
      }
    } catch (error) {
      console.error('Failed to load account data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Навсегда';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Личный кабинет</h1>

      {!orderId ? (
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-4">Привязать покупку</h2>
          <p className="text-gray-300 mb-4">
            Введите Order ID из письма или страницы успешной оплаты
          </p>
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/ru/account?order_id=${email}`; }} className="flex gap-3">
            <input
              type="text"
              placeholder="S6M-1759... или PROM-1759..."
              className="flex-1 rounded-xl bg-black/30 border border-white/15 px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600">
              Показать
            </button>
          </form>
        </div>
      ) : loading ? (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-300">Загрузка...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* License Info */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold mb-4">Лицензия</h2>
            <div className="space-y-3">
              <p>
                <span className="text-gray-400">Email:</span>{' '}
                <span className="font-medium">{data.email}</span>
              </p>
              <p>
                <span className="text-gray-400">Уровень:</span>{' '}
                <span className="font-medium text-indigo-300">{data.license?.level?.toUpperCase() || 'FREE'}</span>
              </p>
              <p>
                <span className="text-gray-400">Действует:</span>{' '}
                <span className={`font-medium ${isExpired(data.license?.expires_at) ? 'text-red-400' : 'text-green-400'}`}>
                  {formatDate(data.license?.expires_at)}
                </span>
              </p>
              {data.license?.seats && (
                <p>
                  <span className="text-gray-400">Мест:</span>{' '}
                  <span className="font-medium">{data.license.seats}</span>
                </p>
              )}
            </div>
          </div>

          {/* Bonus Flags */}
          {data.flags && data.flags.length > 0 && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold mb-4">Бонусы</h2>
              {data.flags.map((flag, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <span className="font-medium">{flag.key}</span>
                  <span className={`text-sm ${isExpired(flag.expires_at) ? 'text-red-400' : 'text-green-400'}`}>
                    {flag.expires_at ? `до ${formatDate(flag.expires_at)}` : 'постоянно'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold mb-4">Действия</h2>
            <div className="flex flex-wrap gap-3">
              <Link href={`/ru/features?order_id=${orderId}`} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600">
                Возможности Pro
              </Link>
              <Link href={`/ru/support?order_id=${orderId}&email=${data.email}`} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15">
                Поддержка
              </Link>
              <Link href="/ru/pricing" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15">
                Продлить
              </Link>
              <button 
                onClick={async () => {
                  const res = await fetch('/api/account/resend-license', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId, email: data.email })
                  });
                  if (res.ok) {
                    alert('Письмо отправлено повторно на ' + data.email);
                  } else {
                    alert('Ошибка отправки письма');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700"
              >
                Отправить письмо повторно
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8">
          <p className="text-gray-300">Не удалось загрузить данные. Проверьте Order ID.</p>
        </div>
      )}
    </main>
  );
}


