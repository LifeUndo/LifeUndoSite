'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LicenseStatus {
  ok: boolean;
  status: string;
  tier: string;
  trialStart: string | null;
  trialEnd: string | null;
  deviceStatus: string;
}

export default function DeviceClientPage() {
  const [deviceId, setDeviceId] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [lastCode, setLastCode] = useState('');
  const [pairStatus, setPairStatus] = useState('');
  const [license, setLicense] = useState<LicenseStatus | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  function appendLog(line: string) {
    setLog((prev) => [new Date().toLocaleTimeString() + ' ' + line, ...prev].slice(0, 50));
  }

  function ensureDeviceIdSync() {
    if (typeof window === 'undefined') return '';
    const key = 'mesh_device_id';
    let id = window.localStorage.getItem(key) || '';
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(key, id);
    }
    return id;
  }

  async function refreshLicense() {
    if (!deviceId) return;
    setBusy(true);
    try {
      const res = await fetch('/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, platform: 'web', version: '0.5.2' }),
      });
      const data = await res.json();
      setLicense(data);
      appendLog('license/validate: ' + JSON.stringify(data));
    } catch (e: any) {
      appendLog('license/validate error: ' + (e?.message || String(e)));
    } finally {
      setBusy(false);
    }
  }

  async function createCode() {
    if (!deviceId) return;
    setBusy(true);
    try {
      const res = await fetch('https://getlifeundo.com/api/pair/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, platform: 'web' }),
      });
      const data = await res.json();
      if (data && data.ok && data.shortCode) {
        setLastCode(String(data.shortCode));
        appendLog('pair/create ok: ' + data.shortCode);
      } else {
        appendLog('pair/create failed: ' + JSON.stringify(data));
      }
    } catch (e: any) {
      appendLog('pair/create error: ' + (e?.message || String(e)));
    } finally {
      setBusy(false);
    }
  }

  async function acceptCode() {
    if (!deviceId || !shortCode.trim()) return;
    setBusy(true);
    setPairStatus('Отправляем запрос на подтверждение кода...');
    try {
      const res = await fetch('https://getlifeundo.com/api/pair/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, platform: 'web', shortCode: shortCode.trim() }),
      });
      const data = await res.json();
      appendLog('pair/consume: ' + JSON.stringify(data));
      if (data && data.ok) {
        setPairStatus(
          'Код принят. Устройства связаны (если оба устройства привязаны к одной лицензии). Этот код больше не действует.'
        );
      } else {
        const msg = (data && (data.error || data.message)) ||
          'Не удалось подтвердить код. Проверьте, что он введён без ошибок и не истёк (код живёт около 15 минут и одноразовый).';
        setPairStatus(String(msg));
      }
    } catch (e: any) {
      appendLog('pair/consume error: ' + (e?.message || String(e)));
      setPairStatus(
        'Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз. Если проблема повторяется, посмотрите детали в логах ниже.'
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const id = ensureDeviceIdSync();
    setDeviceId(id);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center text-[11px] text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span className="mr-1">←</span>
            <span>В админ-панель</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Устройство (Web-клиент)</h1>
        </div>
        <p className="text-sm text-slate-400">
          Это браузерный клиент устройства. Он использует тот же backend, что и расширение: лицензии, пейринг,
          короткие коды. Можно застейджить и отладить Mesh без нативного клиента.
        </p>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs">
          <div className="font-semibold text-slate-200">Идентификатор устройства</div>
          <div className="font-mono break-all text-[11px]">{deviceId || '...'}</div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-200">Статус лицензии</div>
              <div className="text-slate-400 text-[11px]">
                Проверяется через /api/license/validate с platform="web".
              </div>
            </div>
            <button
              onClick={refreshLicense}
              className="h-7 px-3 rounded-md bg-indigo-600 text-[11px] font-medium hover:bg-indigo-500 disabled:opacity-60"
              disabled={!deviceId || busy}
            >
              Обновить
            </button>
          </div>
          {license && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="text-slate-400">status:</div>
              <div>{license.status}</div>
              <div className="text-slate-400">tier:</div>
              <div>{license.tier}</div>
              <div className="text-slate-400">trialEnd:</div>
              <div>{license.trialEnd || '-'}</div>
              <div className="text-slate-400">deviceStatus:</div>
              <div>{license.deviceStatus}</div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 text-xs">
          <div className="font-semibold text-slate-200 mb-1">Пейринг через короткий код</div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">Создать короткий код для этого устройства</div>
              <button
                onClick={createCode}
                className="h-7 px-3 rounded-md bg-emerald-600 text-[11px] font-medium hover:bg-emerald-500 disabled:opacity-60"
                disabled={!deviceId || busy}
              >
                Создать код
              </button>
              {lastCode && (
                <div className="mt-2">
                  <div className="text-[11px] text-slate-400">Последний сгенерированный код:</div>
                  <div className="font-mono text-sm">{lastCode}</div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">Подтвердить код другого устройства</div>
              <input
                placeholder="ABCD-1234"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
              />
              <button
                onClick={acceptCode}
                className="h-7 px-3 rounded-md bg-sky-600 text-[11px] font-medium hover:bg-sky-500 disabled:opacity-60"
                disabled={!deviceId || !shortCode.trim() || busy}
              >
                Подтвердить код
              </button>
              {pairStatus && (
                <div className="text-[11px] text-slate-300 leading-snug">{pairStatus}</div>
              )}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 leading-snug">
            <p>
              Сценарий: на ПЕРВОМ устройстве (например, этот веб-клиент или расширение) нажмите «Создать код» / «Показать код» и
              передайте короткий код.
            </p>
            <p className="mt-1">
              На ВТОРОМ устройстве откройте раздел «Ваши устройства» или эту страницу `/device`, введите код в поле «Подтвердить код» и
              нажмите кнопку. Код действует примерно 15 минут и <span className="font-semibold">используется один раз</span>. После
              успешной связки он перестаёт работать.
            </p>
            <p className="mt-1">
              Например: на ПК откройте этот веб-клиент или админ-панель, нажмите «Создать код», а на телефоне в расширении откройте
              «Ваши устройства» и введите этот код в поле «Подтвердить код».
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-[11px]">
          <div className="font-semibold text-slate-200 mb-1">Логи</div>
          <div className="max-h-64 overflow-auto font-mono leading-snug text-slate-300 bg-slate-950/60 rounded-md px-2 py-2 border border-slate-800">
            {log.length === 0 && <div className="text-slate-500">Пока нет событий</div>}
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

