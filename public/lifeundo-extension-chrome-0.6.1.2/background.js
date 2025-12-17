// Background service worker for LifeUndo (MV3)
import { LINKS, LIMITS, TRIAL_DAYS, LICENSE_PREFIX, MIN_LICENSE_LENGTH } from './constants.js';

const STORAGE_KEYS = {
  textHistory: 'lu_text_history',
  tabHistory: 'lu_tab_history',
  clipboardHistory: 'lu_clipboard_history',
  sessionBackups: 'lu_session_backups',
  stats: 'lu_stats',
  pro: 'lu_pro',
  screenshots: 'lu_screenshots',
  pageSnapshots: 'lu_page_snapshots'
};

const ZK_KEYS = {
  key: 'lu_zk_key',
  entries: 'lu_zk_entries',
  salt: 'lu_zk_salt',
  passwordHash: 'lu_zk_password_hash',
  sessionUntil: 'lu_zk_session_until'
};

// Helper keys for centralized license/trial
const ACCOUNT_EMAIL_KEY = 'lu_account_email';
const DEVICE_ID_KEY = 'lu_device_id';
// Время последнего напоминания о неактивной подписке/истекшем триале (ms since epoch)
const INACTIVE_NOTIFY_AT_KEY = 'lu_inactiveNotifyAt';

/**
 * Initialize statistics and pro status on install
 */
async function initializeStats() {
  const store = await getStore([STORAGE_KEYS.stats, STORAGE_KEYS.pro]);
  
  // Initialize stats if not present
  if (!store[STORAGE_KEYS.stats]) {
    await setStore({
      [STORAGE_KEYS.stats]: {
        installTime: Date.now(),
        popupOpens: 0,
        undos: 0,
        tabRestores: 0,
        clipboardRestores: 0
      }
    });
  }
  
  // Initialize pro status if not present (local trial by default, will be overridden by backend if email задан)
  if (!store[STORAGE_KEYS.pro]) {
    await setStore({
      [STORAGE_KEYS.pro]: {
        licenseKey: '',
        status: 'trial',
        trialStart: Date.now()
      }
    });
  }
}

// ---- Helpers: напоминание об окончании триала/подписки ----
async function maybeNotifyInactive(pro) {
  try {
    if (!pro) return;
    const now = Date.now();
    const store = await getStore([INACTIVE_NOTIFY_AT_KEY]);
    const last = typeof store[INACTIVE_NOTIFY_AT_KEY] === 'number' ? store[INACTIVE_NOTIFY_AT_KEY] : 0;

    // Определяем, истёк ли trial/подписка.
    const status = String(pro.status || '').toLowerCase();
    const tier = String(pro.serverTier || '').toLowerCase();
    // VIP-подписка не должна получать платёжные/триальные напоминания, даже если статус придёт странный.
    // Уведомления об обновлениях продукта идут по отдельному каналу и здесь не блокируются.
    if (tier === 'vip') return;
    let expired = false;
    const nowTs = now;

    // 1) серверный trialEnd имеет приоритет
    if (status === 'trial' && pro.serverTrialEnd) {
      const endTs = Date.parse(String(pro.serverTrialEnd));
      if (!isNaN(endTs) && endTs <= nowTs) {
        expired = true;
      }
    } else if (status === 'trial') {
      // 2) локальный trialStart по TRIAL_DAYS
      const start = pro.trialStart || 0;
      if (nowTs - start >= TRIAL_DAYS * 24 * 60 * 60 * 1000) {
        expired = true;
      }
    } else if (status !== 'pro') {
      // нет PRO и нет активного trial
      expired = true;
    }

    if (!expired) return;

    // Напоминаем только в течение первого года после окончания trial/подписки
    let endTs = 0;
    if (status === 'trial' && pro.serverTrialEnd) {
      const parsed = Date.parse(String(pro.serverTrialEnd));
      if (!isNaN(parsed)) endTs = parsed;
    } else if (status === 'trial') {
      const start = pro.trialStart || 0;
      endTs = start ? (start + TRIAL_DAYS * 24 * 60 * 60 * 1000) : 0;
    }
    const YEAR = 365 * 24 * 60 * 60 * 1000;
    if (endTs && (nowTs - endTs) > YEAR) return;

    // Не спамим: не чаще 1–2 раз в месяц (минимум ~15 дней между напоминаниями)
    const MIN_INTERVAL = 15 * 24 * 60 * 60 * 1000;
    if (last && (now - last) < MIN_INTERVAL) return;

    // Определяем язык по локальному хранилищу настроек расширения
    let lang = 'ru';
    try {
      const st = await getStore(['lu_settings_ext']);
      const cfg = st.lu_settings_ext || {};
      if (cfg.lang === 'en') lang = 'en';
    } catch (e) {}

    const isRu = lang !== 'en';
    const title = isRu ? 'Подписка GetLifeUndo не активна' : 'GetLifeUndo subscription inactive';
    const message = isRu
      ? 'GetLifeUndo приостановил работу: новые вкладки, текст и скриншоты больше не фиксируются и не защищены локально. Ранее сохранённые данные остаются на этом устройстве, но при сбоях или обновлениях браузера/системы есть риск потери — мы не сможем помочь восстановить их без активной подписки.'
      : 'GetLifeUndo has paused its work: new tabs, text and screenshots are no longer captured or protected locally. Everything you saved earlier stays on this device, but browser or system updates and crashes may still cause data loss — without an active subscription we cannot help restore it.';

    try {
      chrome.notifications.create('lu_inactive_sub', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title,
        message,
        priority: 0,
      });
    } catch (e) {
      // ignore
    }

    await setStore({ [INACTIVE_NOTIFY_AT_KEY]: now });
  } catch (e) {
    // ignore
  }
}

// ---- Centralized license/trial sync ----
async function ensureDeviceIdAndSyncLicense() {
  try {
    const store = await getStore([STORAGE_KEYS.pro, ACCOUNT_EMAIL_KEY, DEVICE_ID_KEY]);
    const pro = store[STORAGE_KEYS.pro] || {};
    let deviceId = store[DEVICE_ID_KEY];
    if (!deviceId) {
      try {
        deviceId = crypto.randomUUID();
      } catch (_) {
        deviceId = 'ext-' + Date.now() + '-' + Math.random().toString(16).slice(2);
      }
      await setStore({ [DEVICE_ID_KEY]: deviceId });
    }

    const emailRaw = store[ACCOUNT_EMAIL_KEY] || '';
    const email = (typeof emailRaw === 'string' ? emailRaw : '').trim();
    if (!email) {
      // Нет email — живём на локальном trial / лицензии
      return;
    }

    const payload = {
      deviceId,
      platform: 'extension',
      version: '0.5.2',
      email,
    };

    const res = await fetch('https://getlifeundo.com/api/license/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => null);

    if (!res) return;
    const data = await res.json().catch(() => null);
    if (!data || !data.ok) return;

    // Приводим ответ backend к pro-структуре расширения
    let nextPro = { ...pro };
    if (data.status === 'active') {
      nextPro = {
        ...nextPro,
        status: 'pro',
        serverTier: data.tier || 'pro',
        serverTrialEnd: null,
        trialStart: null,
      };
    } else if (data.status === 'trial') {
      nextPro = {
        ...nextPro,
        status: 'trial',
        serverTier: 'trial',
        serverTrialEnd: data.trialEnd || null,
        // Сохраняем локальный trialStart для обратной совместимости, но серверный приоритетнее
        trialStart: pro.trialStart || Date.now(),
      };
    }

    await setStore({ [STORAGE_KEYS.pro]: nextPro, [DEVICE_ID_KEY]: deviceId });
  } catch (_) {
    // тихо игнорируем ошибки, остаёмся на локальном trial/pro
  }
}

/**
 * Get feature limits based on pro status
 */
async function getFeatureLimits() {
  // локальный dev‑режим для отладки: всегда отдаём PRO‑лимиты, не трогая backend
  const devStore = await getStore(['lu_dev_mode']);
  if (devStore && devStore.lu_dev_mode) {
    return {
      text: LIMITS.PRO.text,
      tabs: LIMITS.PRO.tabs,
      clipboard: LIMITS.PRO.clipboard,
      tier: 'dev',
    };
  }

  // Сначала пробуем синхронизировать статус с backend (если есть email)
  await ensureDeviceIdAndSyncLicense().catch(() => {});

  const { pro } = await getStore({ pro: {} });
  const now = Date.now();

  // 1) Пробуем использовать серверный trialEnd, если он есть
  let isTrial = false;
  if (pro?.status === 'trial' && pro.serverTrialEnd) {
    const endTs = Date.parse(String(pro.serverTrialEnd));
    if (!isNaN(endTs) && endTs > now) {
      isTrial = true;
    }
  } else if (pro?.status === 'trial') {
    // 2) Fallback: старый локальный trial по TRIAL_DAYS
    isTrial = now - (pro.trialStart || 0) < TRIAL_DAYS * 24 * 60 * 60 * 1000;
  }

  const isPro = pro?.status === 'pro';

  if (isPro || isTrial) {
    return {
      text: LIMITS.PRO.text,
      tabs: LIMITS.PRO.tabs,
      clipboard: LIMITS.PRO.clipboard,
      tier: isPro ? 'pro' : 'trial',
    };
  }

  return {
    text: LIMITS.FREE.text,
    tabs: LIMITS.FREE.tabs,
    clipboard: LIMITS.FREE.clipboard,
    tier: 'free',
  };
}

/**
 * Increment statistics counter
 */
async function incrementStat(statName) {
  const store = await getStore([STORAGE_KEYS.stats]);
  const stats = store[STORAGE_KEYS.stats] || {};
  stats[statName] = (stats[statName] || 0) + 1;
  await setStore({ [STORAGE_KEYS.stats]: stats });
}

/**
 * Helper: push item into an array with cap.
 */
function pushWithCap(array, item, cap) {
  const next = [item, ...array.filter(Boolean)];
  if (next.length > cap) next.length = cap;
  return next;
}

async function zkEnsureKey() {
  const store = await getStore([ZK_KEYS.key]);
  let b64 = store[ZK_KEYS.key];
  if (typeof b64 !== 'string' || !b64) {
    const raw = crypto.getRandomValues(new Uint8Array(32));
    b64 = arrayToBase64(raw);
    await setStore({ [ZK_KEYS.key]: b64 });
  }
  const bytes = base64ToArray(b64);
  const key = await crypto.subtle.importKey('raw', bytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  return key;
}

async function zkSaveEntry(kind, payload) {
  try {
    const key = await zkEnsureKey();
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const wrapper = {
      kind: String(kind || ''),
      ts: Number(payload && payload.ts ? payload.ts : Date.now()),
      payload
    };
    const data = enc.encode(JSON.stringify(wrapper));
    const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    const cipher = new Uint8Array(cipherBuf);
    const store = await getStore([ZK_KEYS.entries]);
    const list = Array.isArray(store[ZK_KEYS.entries]) ? store[ZK_KEYS.entries] : [];
    const next = pushWithCap(
      list,
      {
        kind: wrapper.kind,
        ts: wrapper.ts,
        iv: arrayToBase64(iv),
        data: arrayToBase64(cipher)
      },
      1000
    );
    await setStore({ [ZK_KEYS.entries]: next });
    return true;
  } catch (e) {
    return false;
  }
}

async function zkListLast(limit) {
  const max = Number(limit || 100) || 100;
  const store = await getStore([ZK_KEYS.entries]);
  const list = Array.isArray(store[ZK_KEYS.entries]) ? store[ZK_KEYS.entries] : [];
  if (!list.length) return [];
  const key = await zkEnsureKey();
  const dec = new TextDecoder();
  const out = [];
  const slice = list.slice(0, max);
  for (const item of slice) {
    if (!item || !item.iv || !item.data) continue;
    try {
      const iv = base64ToArray(item.iv);
      const cipher = base64ToArray(item.data);
      const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
      const json = dec.decode(new Uint8Array(buf));
      const parsed = JSON.parse(json);
      out.push(parsed);
    } catch (e) {}
  }
  return out;
}

async function zkHashPassword(password, saltBytes) {
  const enc = new TextEncoder();
  const passBytes = enc.encode(String(password || ''));
  const merged = new Uint8Array(passBytes.length + saltBytes.length);
  merged.set(passBytes, 0);
  merged.set(saltBytes, passBytes.length);
  const hashBuf = await crypto.subtle.digest('SHA-256', merged);
  return arrayToBase64(new Uint8Array(hashBuf));
}

async function zkEnsurePasswordSet() {
  const store = await getStore([ZK_KEYS.passwordHash]);
  const val = store[ZK_KEYS.passwordHash];
  return typeof val === 'string' && !!val;
}

async function zkSetPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await zkHashPassword(password, salt);
  await setStore({
    [ZK_KEYS.salt]: arrayToBase64(salt),
    [ZK_KEYS.passwordHash]: hash,
    [ZK_KEYS.sessionUntil]: 0
  });
}

async function zkVerifyPassword(password, sessionMs) {
  const store = await getStore([ZK_KEYS.salt, ZK_KEYS.passwordHash, ZK_KEYS.sessionUntil]);
  const b64Salt = store[ZK_KEYS.salt];
  const storedHash = store[ZK_KEYS.passwordHash];
  if (typeof b64Salt !== 'string' || typeof storedHash !== 'string' || !storedHash) {
    return { ok: false, reason: 'NO_PASSWORD' };
  }
  const salt = base64ToArray(b64Salt);
  const hash = await zkHashPassword(password, salt);
  if (hash !== storedHash) {
    return { ok: false, reason: 'BAD_PASSWORD' };
  }
  const now = Date.now();
  const duration = typeof sessionMs === 'number' && sessionMs > 0 ? sessionMs : 15 * 60 * 1000;
  const until = now + duration;
  await setStore({ [ZK_KEYS.sessionUntil]: until });
  return { ok: true, sessionUntil: until };
}

async function zkGetSessionInfo() {
  const store = await getStore([ZK_KEYS.sessionUntil]);
  const until = typeof store[ZK_KEYS.sessionUntil] === 'number' ? store[ZK_KEYS.sessionUntil] : 0;
  const now = Date.now();
  const active = until > now;
  return { active, sessionUntil: until };
}

async function deriveLuzkKey(password, saltBytes) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(String(password || '')), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: 150000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return key;
}

async function zkExportLuzk(password, limit) {
  const items = await zkListLast(limit || 1000);
  const payload = {
    kind: 'zk_export',
    created_at: new Date().toISOString(),
    platform: 'extension',
    entries: items
  };
  const enc = new TextEncoder();
  const data = enc.encode(JSON.stringify(payload));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveLuzkKey(password, salt);
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, data);
  const cipher = new Uint8Array(cipherBuf);

  const container = {
    kdf: {
      algo: 'pbkdf2-hmac-sha256',
      salt_b64: arrayToBase64(salt),
      iterations: 150000
    },
    cipher: {
      algo: 'aes-gcm-256',
      nonce_b64: arrayToBase64(nonce),
      data_b64: arrayToBase64(cipher),
      tag_b64: null
    },
    meta: {
      created_at: payload.created_at,
      platform: payload.platform
    }
  };

  return container;
}

// Core helpers for history entries (first step towards unified timeline)
async function saveTextHistoryEntry(entry) {
  const limits = await getFeatureLimits();
  const store = await getStore([STORAGE_KEYS.textHistory]);
  const next = pushWithCap(store[STORAGE_KEYS.textHistory] || [], entry, limits.text);
  await setStore({ [STORAGE_KEYS.textHistory]: next });
  return next;
}

async function saveTabHistoryEntry(entry) {
  const limits = await getFeatureLimits();
  const store = await getStore([STORAGE_KEYS.tabHistory]);
  const next = pushWithCap(store[STORAGE_KEYS.tabHistory] || [], entry, limits.tabs);
  await setStore({ [STORAGE_KEYS.tabHistory]: next });
  return next;
}

async function saveClipboardHistoryEntry(entry) {
  const limits = await getFeatureLimits();
  const store = await getStore([STORAGE_KEYS.clipboardHistory]);
  const next = pushWithCap(store[STORAGE_KEYS.clipboardHistory] || [], entry, limits.clipboard);
  await setStore({ [STORAGE_KEYS.clipboardHistory]: next });
  return next;
}

async function saveScreenshotHistoryEntry(entry) {
  const store = await getStore([STORAGE_KEYS.screenshots]);
  const list = Array.isArray(store[STORAGE_KEYS.screenshots]) ? store[STORAGE_KEYS.screenshots] : [];
  const next = pushWithCap(list, entry, 20);
  await setStore({ [STORAGE_KEYS.screenshots]: next });
  return next;
}

async function savePageSnapshotEntry(entry) {
  const store = await getStore([STORAGE_KEYS.pageSnapshots]);
  const list = Array.isArray(store[STORAGE_KEYS.pageSnapshots]) ? store[STORAGE_KEYS.pageSnapshots] : [];
  const next = pushWithCap(list, entry, 100);
  await setStore({ [STORAGE_KEYS.pageSnapshots]: next });
  return next;
}

// Generic entry point for timeline events (currently routes into existing per-kind histories)
async function addTimelineEvent(raw) {
  if (!raw || !raw.kind) return null;
  const kind = raw.kind;

  if (kind === 'text') {
    const entry = {
      page: raw.page || raw.url || 'unknown',
      value: String(raw.value || ''),
      elementPath: String(raw.elementPath || raw.path || ''),
      ts: Number(raw.ts || Date.now()),
      kind: 'text'
    };
    const saved = await saveTextHistoryEntry(entry);
    await zkSaveEntry('text', entry);
    return saved;
  }

  if (kind === 'tab') {
    const now = Number(raw.ts || raw.closedAt || Date.now());
    const entry = {
      url: raw.url || '',
      title: raw.title || '',
      favicon: raw.favicon || '',
      closedAt: now,
      ts: now,
      kind: 'tab'
    };
    const saved = await saveTabHistoryEntry(entry);
    await zkSaveEntry('tab', entry);
    return saved;
  }

  if (kind === 'clipboard') {
    const entry = {
      value: String(raw.value || ''),
      ts: Number(raw.ts || Date.now()),
      kind: 'clipboard'
    };
    const saved = await saveClipboardHistoryEntry(entry);
    await zkSaveEntry('clipboard', entry);
    return saved;
  }

  if (kind === 'shot') {
    const entry = {
      ts: Number(raw.ts || Date.now()),
      dataUrl: String(raw.dataUrl || ''),
      url: raw.url || '',
      title: raw.title || '',
      kind: 'shot'
    };
    const saved = await saveScreenshotHistoryEntry(entry);
    await zkSaveEntry('shot', entry);
    return saved;
  }

  if (kind === 'pagesnapshot') {
    const entry = {
      id: raw.id || null,
      url: raw.url || '',
      title: raw.title || '',
      createdAt: Number(raw.ts || Date.now()),
      format: raw.format || 'html',
      size: Number(raw.size || 0),
      meta: raw.meta || null,
      kind: 'pagesnapshot'
    };
    const saved = await savePageSnapshotEntry(entry);
    await zkSaveEntry('pagesnapshot', entry);
    return saved;
  }

  // Unknown kind: пока игнорируем, позже можно логировать/расширять
  return null;
}

async function getStore(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

async function setStore(obj) {
  return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
}

// Promisified helpers for callback-based Chrome/Firefox APIs
function getRecentlyClosed(maxResults) {
  return new Promise((resolve) => chrome.sessions.getRecentlyClosed({ maxResults }, resolve));
}

function queryTabs(queryInfo) {
  return new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));
}

function createTab(createProperties) {
  return new Promise((resolve) => chrome.tabs.create(createProperties, resolve));
}

function sendTabMessage(tabId, message) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.sendMessage(tabId, message, resolve);
    } catch (e) {
      resolve();
    }
  });
}

// Initialize stats on startup
chrome.runtime.onStartup.addListener(async () => {
  await initializeStats();
  try {
    const store = await getStore([STORAGE_KEYS.pro]);
    await maybeNotifyInactive(store[STORAGE_KEYS.pro] || null);
  } catch (e) {}
  ensureAutoSnapshotAlarm();
});
chrome.runtime.onInstalled.addListener(async () => {
  await initializeStats();
  try {
    const store = await getStore([STORAGE_KEYS.pro]);
    await maybeNotifyInactive(store[STORAGE_KEYS.pro] || null);
  } catch (e) {}
  ensureAutoSnapshotAlarm();
});

/**
 * Ensure Chrome alarm exists for periodic session snapshots
 */
function ensureAutoSnapshotAlarm() {
  try {
    // Default every 30 minutes; later can be made configurable via options
    chrome.alarms.create('lu_auto_snapshot', { periodInMinutes: 30 });
  } catch (_) {
    // no-op
  }
}

/**
 * Take a lightweight snapshot of current tabs in the focused window
 */
async function takeSessionSnapshot() {
  try {
    const limits = await getFeatureLimits();
    const allWindows = await new Promise((resolve) => chrome.windows.getAll({ populate: true }, resolve));
    const windowsData = (allWindows || []).map(w => ({
      id: w.id,
      focused: !!w.focused,
      tabs: (w.tabs || []).map(t => ({
        url: t.url || '',
        title: t.title || '',
        favicon: t.favIconUrl || ''
      }))
    }));
    const snapshot = { ts: Date.now(), windows: windowsData };

    const store = await getStore([STORAGE_KEYS.sessionBackups]);
    const cap = Math.max(5, Math.min(50, limits?.tabs || 20));
    const next = pushWithCap(store[STORAGE_KEYS.sessionBackups] || [], snapshot, cap);
    await setStore({ [STORAGE_KEYS.sessionBackups]: next });
  } catch (_) {
    // no-op
  }
}

// Alarm handler for periodic snapshots
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm && alarm.name === 'lu_auto_snapshot') {
    takeSessionSnapshot();
  }
});

/**
 * Restore snapshot by opening URLs in current window (simple strategy)
 */
async function restoreSnapshot(snapshot) {
  try {
    const urls = [];
    (snapshot.windows || []).forEach(w => {
      (w.tabs || []).forEach(t => {
        if (t.url) urls.push(t.url);
      });
    });
    if (urls.length === 0) return;
    // Open the first active, rest background
    const [first, ...rest] = urls;
    await createTab({ url: first, active: true });
    for (const u of rest) {
      await createTab({ url: u, active: false });
    }
  } catch (_) {
    // no-op
  }
}

// ===== Simple AES-GCM helpers for encrypted export/import =====
async function encryptString(password, plaintext) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  return { cipher: arrayToBase64(new Uint8Array(data)), iv: arrayToBase64(iv), salt: arrayToBase64(salt) };
}

async function decryptString(password, b64cipher, b64iv, b64salt) {
  const dec = new TextDecoder();
  const iv = base64ToArray(b64iv);
  const salt = base64ToArray(b64salt);
  const key = await deriveKey(password, salt);
  const cipher = base64ToArray(b64cipher);
  const data = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return dec.decode(new Uint8Array(data));
}

async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function arrayToBase64(arr) {
  let binary = '';
  arr.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToArray(b64) {
  const binary = atob(b64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

/**
 * Track closed tabs via sessions API (recently closed).
 */
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) return;
  try {
    const sessions = await getRecentlyClosed(1);
    const last = sessions && sessions[0];
    if (!last || !last.tab) return;
    const url = last.tab.url || '';
    const title = last.tab.title || '';
    const favicon = last.tab.favIconUrl || '';
    const now = Date.now();
    await addTimelineEvent({ kind: 'tab', url, title, favicon, closedAt: now, ts: now });
  } catch (err) {
    // no-op
  }
});

/**
 * Messaging protocol
 * Messages from content/popup use {type, payload}
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message || {};

  (async () => {
    switch (type) {
      case 'LU_PUSH_TEXT_STATE': {
        const page = sender?.tab?.url || 'unknown';
        await addTimelineEvent({
          kind: 'text',
          page,
          value: payload?.value,
          elementPath: payload?.path,
          ts: Date.now()
        });
        sendResponse({ ok: true });
        break;
      }
      case 'LU_LEAVE_ORG': {
        try {
          const store = await getStore([DEVICE_ID_KEY]);
          let deviceId = store[DEVICE_ID_KEY];
          if (!deviceId) {
            try {
              deviceId = crypto.randomUUID();
            } catch (_) {
              deviceId = 'ext-' + Date.now() + '-' + Math.random().toString(16).slice(2);
            }
            await setStore({ [DEVICE_ID_KEY]: deviceId });
          }
          const body = { deviceId };
          let data = null;
          try {
            const res = await fetch('https://getlifeundo.com/api/org/leave', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            data = await res.json().catch(() => null);
            if (!res.ok || !data) {
              const err = String((data && data.error) || 'LEAVE_ORG_FAILED');
              sendResponse({ ok: false, error: err });
              break;
            }
          } catch (e) {
            sendResponse({ ok: false, error: String(e?.message || e) });
            break;
          }
          sendResponse({ ok: true, changed: !!(data && data.changed) });
        } catch (e) {
          sendResponse({ ok: false, error: 'LEAVE_ORG_ERROR' });
        }
        break;
      }
      case 'LU_GET_ORG_STATUS': {
        try {
          const store = await getStore([DEVICE_ID_KEY, ACCOUNT_EMAIL_KEY]);
          let deviceId = store[DEVICE_ID_KEY];
          if (!deviceId) {
            try {
              deviceId = crypto.randomUUID();
            } catch (_) {
              deviceId = 'ext-' + Date.now() + '-' + Math.random().toString(16).slice(2);
            }
            await setStore({ [DEVICE_ID_KEY]: deviceId });
          }

          const accountEmail = (store[ACCOUNT_EMAIL_KEY] || '').trim();
          const payload = {
            deviceId,
            platform: 'extension',
            appVersion: '0.6.1.2',
            email: accountEmail,
          };

          let data = null;
          try {
            const res = await fetch('https://getlifeundo.com/api/org/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            data = await res.json().catch(() => null);
            if (!res.ok || !data) {
              const err = String((data && data.error) || 'ORG_STATUS_FAILED');
              sendResponse({ ok: false, error: err });
              break;
            }
          } catch (e) {
            sendResponse({ ok: false, error: String(e?.message || e) });
            break;
          }

          sendResponse({
            ok: true,
            org: data.org || null,
            member: data.member || null,
            limits: data.limits || null,
          });
        } catch (e) {
          sendResponse({ ok: false, error: 'ORG_STATUS_ERROR' });
        }
        break;
      }
      case 'LU_JOIN_ORG_BY_KEY': {
        try {
          const rawKey = String(payload?.key || '').trim();
          if (!rawKey) {
            sendResponse({ ok: false, error: 'MISSING_KEY' });
            break;
          }
          const store = await getStore([DEVICE_ID_KEY, ACCOUNT_EMAIL_KEY]);
          let deviceId = store[DEVICE_ID_KEY];
          if (!deviceId) {
            try {
              deviceId = crypto.randomUUID();
            } catch (_) {
              deviceId = 'ext-' + Date.now() + '-' + Math.random().toString(16).slice(2);
            }
            await setStore({ [DEVICE_ID_KEY]: deviceId });
          }

          const accountEmail = (store[ACCOUNT_EMAIL_KEY] || '').trim();
          const body = {
            deviceId,
            platform: 'extension',
            appVersion: '0.6.1.2',
            email: accountEmail,
            key: rawKey,
          };

          let data = null;
          try {
            const res = await fetch('https://getlifeundo.com/api/org/join-by-key', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            data = await res.json().catch(() => null);
            if (!res.ok || !data) {
              const err = String((data && data.error) || 'JOIN_ORG_FAILED');
              sendResponse({ ok: false, error: err });
              break;
            }
          } catch (e) {
            sendResponse({ ok: false, error: String(e?.message || e) });
            break;
          }

          sendResponse({
            ok: true,
            org: data.org || null,
            member: data.member || null,
            limits: data.limits || null,
          });
        } catch (e) {
          sendResponse({ ok: false, error: 'JOIN_ORG_ERROR' });
        }
        break;
      }
      case 'LU_GET_TIMELINE': {
        const limit = Number(payload?.limit ?? 100) || 100;
        const items = await getUnifiedTimeline(limit);
        sendResponse({ ok: true, items });
        break;
      }
      case 'LU_ZK_ENSURE_PASSWORD': {
        try {
          const hasPassword = await zkEnsurePasswordSet();
          const session = await zkGetSessionInfo();
          sendResponse({ ok: true, hasPassword, session });
        } catch (e) {
          sendResponse({ ok: false, error: 'ZK_ENSURE_FAILED' });
        }
        break;
      }
      case 'LU_ZK_SET_PASSWORD': {
        try {
          const pwd = String(payload?.password || '');
          if (!pwd) {
            sendResponse({ ok: false, error: 'EMPTY_PASSWORD' });
            break;
          }
          await zkSetPassword(pwd);
          const hasPassword = await zkEnsurePasswordSet();
          const session = await zkGetSessionInfo();
          sendResponse({ ok: true, hasPassword, session });
        } catch (e) {
          sendResponse({ ok: false, error: 'ZK_SET_FAILED' });
        }
        break;
      }
      case 'LU_ZK_VERIFY_PASSWORD': {
        try {
          const pwd = String(payload?.password || '');
          const sessionMs = typeof payload?.sessionMs === 'number' ? payload.sessionMs : undefined;
          const res = await zkVerifyPassword(pwd, sessionMs);
          if (!res.ok) {
            sendResponse(res);
            break;
          }
          const session = await zkGetSessionInfo();
          sendResponse({ ok: true, session });
        } catch (e) {
          sendResponse({ ok: false, error: 'ZK_VERIFY_FAILED' });
        }
        break;
      }
      case 'LU_ZK_GET_SESSION': {
        try {
          const session = await zkGetSessionInfo();
          sendResponse({ ok: true, session });
        } catch (e) {
          sendResponse({ ok: false, error: 'ZK_SESSION_FAILED' });
        }
        break;
      }
      case 'LU_ZK_SAVE': {
        try {
          const kind = String(payload?.kind || '');
          const data = payload?.data || null;
          await zkSaveEntry(kind, data || {});
          sendResponse({ ok: true });
        } catch (e) {
          sendResponse({ ok: false, error: 'ZK_SAVE_FAILED' });
        }
        break;
      }
      case 'LU_ZK_LIST_LAST': {
        try {
          const limit = Number(payload?.limit ?? 100) || 100;
          const items = await zkListLast(limit);
          sendResponse({ ok: true, items });
        } catch (e) {
          sendResponse({ ok: false, error: 'ZK_LIST_FAILED' });
        }
        break;
      }
      case 'LU_ZK_EXPORT_LUZK': {
        try {
          const pwd = String(payload?.password || '');
          if (!pwd) {
            sendResponse({ ok: false, error: 'EMPTY_PASSWORD' });
            break;
          }
          const limit = Number(payload?.limit ?? 1000) || 1000;
          const container = await zkExportLuzk(pwd, limit);
          sendResponse({ ok: true, container });
        } catch (e) {
          sendResponse({ ok: false, error: 'ZK_EXPORT_FAILED' });
        }
        break;
      }
      case 'LU_RESTORE_TEXT_VERSION': {
        const entry = payload && payload.entry;
        if (!entry) {
          sendResponse({ ok: false, reason: 'No entry' });
          break;
        }

        let targetTabId = sender?.tab?.id;
        if (!targetTabId) {
          const tabs = await queryTabs({ active: true, currentWindow: true });
          if (tabs && tabs[0] && tabs[0].id) targetTabId = tabs[0].id;
        }

        if (targetTabId) {
          await sendTabMessage(targetTabId, { type: 'LU_RESTORE_TEXT', payload: entry });
          await incrementStat('undos');
          sendResponse({ ok: true });
        } else {
          sendResponse({ ok: false, reason: 'No target tab' });
        }
        break;
      }
      case 'LU_PUSH_CLIPBOARD': {
        await addTimelineEvent({ kind: 'clipboard', value: payload?.value, ts: Date.now() });
        sendResponse({ ok: true });
        break;
      }
      case 'LU_GET_DEVICE_ID': {
        try {
          const store = await getStore([DEVICE_ID_KEY]);
          let deviceId = store[DEVICE_ID_KEY];
          if (!deviceId) {
            try {
              deviceId = crypto.randomUUID();
            } catch (_) {
              deviceId = 'ext-' + Date.now() + '-' + Math.random().toString(16).slice(2);
            }
            await setStore({ [DEVICE_ID_KEY]: deviceId });
          }
          sendResponse({ ok: true, deviceId });
        } catch (e) {
          sendResponse({ ok: false });
        }
        break;
      }
      case 'LU_CREATE_PAIR_CODE': {
        try {
          const store = await getStore([DEVICE_ID_KEY, ACCOUNT_EMAIL_KEY]);
          let deviceId = store[DEVICE_ID_KEY];
          if (!deviceId) {
            try {
              deviceId = crypto.randomUUID();
            } catch (_) {
              deviceId = 'ext-' + Date.now() + '-' + Math.random().toString(16).slice(2);
            }
            await setStore({ [DEVICE_ID_KEY]: deviceId });
          }

          const emailRaw = store[ACCOUNT_EMAIL_KEY] || '';
          const email = (typeof emailRaw === 'string' ? emailRaw : '').trim();

          const body = {
            deviceId,
            platform: 'extension',
            email
          };

          const res = await fetch('https://getlifeundo.com/api/pair/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }).catch(() => null);

          if (!res) {
            sendResponse({ ok: false, message: 'Network error' });
            break;
          }

          const data = await res.json().catch(() => null);
          if (!data || !data.ok || !data.shortCode) {
            sendResponse({ ok: false, message: 'Failed to create code' });
            break;
          }

          const info = {
            deviceId,
            status: 'initiator',
            lastPin: data.shortCode,
            lastPinExpiresAt: data.expiresAt || null,
            licenseLevel: data.licenseLevel || null
          };

          await setStore({ lu_device_info_ext: info });

          sendResponse({ ok: true, shortCode: data.shortCode, expiresAt: data.expiresAt, licenseLevel: data.licenseLevel || null });
        } catch (e) {
          sendResponse({ ok: false, message: 'Unexpected error' });
        }
        break;
      }
      case 'LU_LINK_DEVICE_WITH_CODE': {
        try {
          const rawCode = String(payload?.code || '').trim();
          if (!rawCode) {
            sendResponse({ ok: false, message: 'Empty code' });
            break;
          }

          const store = await getStore([DEVICE_ID_KEY]);
          let deviceId = store[DEVICE_ID_KEY];
          if (!deviceId) {
            try {
              deviceId = crypto.randomUUID();
            } catch (_) {
              deviceId = 'ext-' + Date.now() + '-' + Math.random().toString(16).slice(2);
            }
            await setStore({ [DEVICE_ID_KEY]: deviceId });
          }

          const body = {
            deviceId,
            shortCode: rawCode,
            platform: 'extension'
          };

          const res = await fetch('https://getlifeundo.com/api/pair/consume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }).catch(() => null);

          if (!res) {
            sendResponse({ ok: false, message: 'Network error' });
            break;
          }

          const data = await res.json().catch(() => null);
          if (!data || !data.ok) {
            const msg = (data && data.error) || 'Invalid or expired code';
            sendResponse({ ok: false, message: msg });
            break;
          }

          const info = {
            deviceId,
            status: 'linked',
            linkedAt: Date.now(),
            initiatorDeviceId: data.initiatorDeviceId || null,
            targetDeviceId: data.targetDeviceId || null,
            licenseLevel: data.licenseLevel || null
          };

          await setStore({ lu_device_info_ext: info });

          sendResponse({ ok: true, licenseLevel: data.licenseLevel || null });
        } catch (e) {
          sendResponse({ ok: false, message: 'Unexpected error' });
        }
        break;
      }
      case 'LU_SAVE_PAGE_SNAPSHOT': {
        const url = String(payload?.url || '');
        const title = String(payload?.title || '');
        const html = String(payload?.html || '');
        const size = html.length;
        await addTimelineEvent({
          kind: 'pagesnapshot',
          url,
          title,
          ts: Date.now(),
          format: 'html',
          size,
          meta: { html }
        });
        sendResponse({ ok: true });
        break;
      }
      case 'LU_GET_STATE': {
        const store = await getStore(Object.values(STORAGE_KEYS));
        const limits = await getFeatureLimits();
        sendResponse({ ok: true, data: { ...store, limits } });
        break;
      }
      case 'LU_GET_LIMITS': {
        const limits = await getFeatureLimits();
        sendResponse({ ok: true, limits });
        break;
      }
      case 'LU_GET_STATS': {
        const store = await getStore([STORAGE_KEYS.stats, STORAGE_KEYS.pro]);
        const pro = store[STORAGE_KEYS.pro];
        sendResponse({ ok: true, stats: store[STORAGE_KEYS.stats], pro });
        // при ручном просмотре статуса можем мягко напомнить, если подписка не активна
        await maybeNotifyInactive(pro || null);
        break;
      }
      case 'LU_CREATE_PAYMENT': {
        try {
          const plan = String(payload?.plan || '').trim();
          const locale = (payload?.locale === 'en' ? 'en' : 'ru');
          if (!plan) {
            sendResponse({ ok: false, message: 'No plan specified' });
            break;
          }

          const body = JSON.stringify({ plan, locale });
          const resp = await fetch('https://getlifeundo.com/api/payments/freekassa/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          }).catch(() => null);

          if (!resp) {
            sendResponse({ ok: false, message: 'Network error' });
            break;
          }

          const data = await resp.json().catch(() => null);
          if (!resp.ok || !data || !data.pay_url) {
            const msg = (data && data.error) || 'Failed to create payment';
            sendResponse({ ok: false, message: msg });
            break;
          }

          sendResponse({ ok: true, payUrl: String(data.pay_url), orderId: data.orderId || null });
        } catch (e) {
          sendResponse({ ok: false, message: 'Unexpected error' });
        }
        break;
      }
      case 'LU_ACTIVATE_LICENSE': {
        const key = String(payload?.key || '').trim();
        if (key.startsWith(LICENSE_PREFIX) && key.length >= MIN_LICENSE_LENGTH) {
          await setStore({
            [STORAGE_KEYS.pro]: {
              licenseKey: key,
              status: 'pro',
              trialStart: null
            }
          });
          sendResponse({ ok: true, message: 'License activated successfully' });
        } else {
          sendResponse({ ok: false, message: 'Invalid license key format' });
        }
        break;
      }
      case 'LU_EXPORT_DATA': {
        const store = await getStore(Object.values(STORAGE_KEYS));
        const exportData = {
          version: '0.2.0',
          exportTime: Date.now(),
          stats: store[STORAGE_KEYS.stats],
          pro: store[STORAGE_KEYS.pro],
          textHistory: store[STORAGE_KEYS.textHistory],
          tabHistory: store[STORAGE_KEYS.tabHistory],
          clipboardHistory: store[STORAGE_KEYS.clipboardHistory]
        };
        sendResponse({ ok: true, data: exportData });
        break;
      }
      case 'LU_GET_BACKUPS': {
        const store = await getStore([STORAGE_KEYS.sessionBackups]);
        sendResponse({ ok: true, backups: store[STORAGE_KEYS.sessionBackups] || [] });
        break;
      }
      case 'LU_TAKE_SNAPSHOT': {
        await takeSessionSnapshot();
        const store = await getStore([STORAGE_KEYS.sessionBackups]);
        sendResponse({ ok: true, backups: store[STORAGE_KEYS.sessionBackups] || [] });
        break;
      }
      case 'LU_RESTORE_BACKUP': {
        const snap = payload?.snapshot;
        if (!snap || !Array.isArray(snap.windows)) {
          sendResponse({ ok: false, reason: 'Invalid snapshot' });
          break;
        }
        await restoreSnapshot(snap);
        await incrementStat('tabRestores');
        sendResponse({ ok: true });
        break;
      }
      case 'LU_EXPORT_BACKUPS': {
        const { password = '' } = payload || {};
        const store = await getStore([STORAGE_KEYS.sessionBackups]);
        const dataStr = JSON.stringify({ version: '1', ts: Date.now(), backups: store[STORAGE_KEYS.sessionBackups] || [] });
        if (password && password.trim().length > 0) {
          const { cipher, iv, salt } = await encryptString(password, dataStr);
          sendResponse({ ok: true, encrypted: true, iv, salt, data: cipher });
        } else {
          sendResponse({ ok: true, encrypted: false, data: dataStr });
        }
        break;
      }
      case 'LU_TAKE_SCREENSHOT': {
        const tabs = await queryTabs({ active: true, currentWindow: true });
        const active = Array.isArray(tabs) && tabs[0] ? tabs[0] : null;
        const pageUrl = active && active.url ? active.url : '';
        const title = active && active.title ? active.title : '';

        const dataUrl = await takeVisibleTabScreenshot();
        if (!dataUrl) {
          sendResponse({ ok: false, reason: 'capture_failed' });
          break;
        }
        const shot = { ts: Date.now(), dataUrl, url: pageUrl, title, kind: 'shot' };
        const list = await addTimelineEvent(shot);
        sendResponse({ ok: true, item: shot, list });
        break;
      }
      case 'LU_GET_SCREENSHOTS': {
        const store = await getStore([STORAGE_KEYS.screenshots]);
        sendResponse({ ok: true, list: store[STORAGE_KEYS.screenshots] || [] });
        break;
      }
      case 'LU_DELETE_SCREENSHOT': {
        const idx = Number(payload?.index ?? -1);
        const store = await getStore([STORAGE_KEYS.screenshots]);
        const arr = Array.isArray(store[STORAGE_KEYS.screenshots]) ? store[STORAGE_KEYS.screenshots] : [];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx, 1);
          await setStore({ [STORAGE_KEYS.screenshots]: arr });
        }
        sendResponse({ ok: true, list: arr });
        break;
      }
      case 'LU_IMPORT_BACKUPS': {
        try {
          const { content, password = '', encrypted = false, iv, salt } = payload || {};
          let parsed;
          if (encrypted) {
            if (!password) throw new Error('Password required');
            parsed = JSON.parse(await decryptString(password, content, iv, salt));
          } else {
            parsed = JSON.parse(String(content || '{}'));
          }
          const backups = Array.isArray(parsed?.backups) ? parsed.backups : [];
          const store = await getStore([STORAGE_KEYS.sessionBackups]);
          const current = store[STORAGE_KEYS.sessionBackups] || [];
          const merged = [...backups, ...current];
          await setStore({ [STORAGE_KEYS.sessionBackups]: merged });
          sendResponse({ ok: true, count: merged.length });
        } catch (e) {
          sendResponse({ ok: false, reason: e?.message || 'Import failed' });
        }
        break;
      }
      case 'LU_RESET_STATS': {
        await setStore({
          [STORAGE_KEYS.stats]: {
            installTime: Date.now(),
            popupOpens: 0,
            undos: 0,
            tabRestores: 0,
            clipboardRestores: 0
          }
        });
        sendResponse({ ok: true, message: 'Statistics reset successfully' });
        break;
      }
      case 'LU_INCREMENT_STAT': {
        const statName = payload?.stat;
        if (statName) {
          await incrementStat(statName);
        }
        sendResponse({ ok: true });
        break;
      }
      case 'LU_UNDO_LAST': {
        const result = await performUndoLast(sender?.tab?.id);
        sendResponse(result);
        break;
      }
      default:
        sendResponse({ ok: false, reason: 'Unknown message type' });
    }
  })();

  return true; // keep channel open for async
});

/**
 * Screenshot helpers (MV3)
 */
async function takeVisibleTabScreenshot() {
  try {
    const dataUrl = await new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab({ format: 'png' }, (data) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(data);
      });
    });
    return dataUrl;
  } catch (_) {
    return null;
  }
}

async function saveScreenshotEntry(entry) {
  const store = await getStore([STORAGE_KEYS.screenshots]);
  const list = Array.isArray(store[STORAGE_KEYS.screenshots]) ? store[STORAGE_KEYS.screenshots] : [];
  const next = pushWithCap(list, entry, 20);
  await setStore({ [STORAGE_KEYS.screenshots]: next });
  return next;
}

async function getUnifiedTimeline(limit) {
  const store = await getStore([
    STORAGE_KEYS.textHistory,
    STORAGE_KEYS.tabHistory,
    STORAGE_KEYS.screenshots,
    STORAGE_KEYS.pageSnapshots
  ]);
  const text = Array.isArray(store[STORAGE_KEYS.textHistory]) ? store[STORAGE_KEYS.textHistory] : [];
  const tabs = Array.isArray(store[STORAGE_KEYS.tabHistory]) ? store[STORAGE_KEYS.tabHistory] : [];
  const shots = Array.isArray(store[STORAGE_KEYS.screenshots]) ? store[STORAGE_KEYS.screenshots] : [];
  const snaps = Array.isArray(store[STORAGE_KEYS.pageSnapshots]) ? store[STORAGE_KEYS.pageSnapshots] : [];

  const mapped = [];

  text.forEach((t) => {
    if (!t) return;
    const ts = Number(t.ts || Date.now());
    mapped.push({
      kind: t.kind || 'text',
      ts,
      url: t.page || '',
      title: '',
      value: String(t.value || ''),
      elementPath: String(t.elementPath || '')
    });
  });

  tabs.forEach((t) => {
    if (!t) return;
    const ts = Number(t.ts || t.closedAt || Date.now());
    mapped.push({
      kind: t.kind || 'tab',
      ts,
      url: t.url || '',
      title: t.title || '',
      favicon: t.favicon || ''
    });
  });

  shots.forEach((s) => {
    if (!s) return;
    const ts = Number(s.ts || Date.now());
    mapped.push({
      kind: s.kind || 'shot',
      ts,
      url: s.url || '',
      title: s.title || '',
      dataUrl: s.dataUrl || ''
    });
  });

  snaps.forEach((p) => {
    if (!p) return;
    const ts = Number(p.createdAt || p.ts || Date.now());
    mapped.push({
      kind: p.kind || 'page_archive',
      ts,
      url: p.url || '',
      title: p.title || '',
      size: Number(p.size || 0),
      format: p.format || 'html'
    });
  });

  mapped.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (mapped.length > limit) return mapped.slice(0, limit);
  return mapped;
}

/**
 * Reusable undo logic. Priority: text > tab > clipboard
 */
async function performUndoLast(senderTabId) {
  const store = await getStore(Object.values(STORAGE_KEYS));
  const text = store[STORAGE_KEYS.textHistory] || [];
  const tabs = store[STORAGE_KEYS.tabHistory] || [];
  const clips = store[STORAGE_KEYS.clipboardHistory] || [];

  if (text.length > 0) {
    const [last, ...rest] = text;
    await setStore({ [STORAGE_KEYS.textHistory]: rest });
    await incrementStat('undos');
    let targetTabId = senderTabId;
    if (!targetTabId) {
      const activeTabs = await queryTabs({ active: true, currentWindow: true });
      if (activeTabs && activeTabs[0] && activeTabs[0].id) targetTabId = activeTabs[0].id;
    }
    if (targetTabId) {
      await sendTabMessage(targetTabId, { type: 'LU_RESTORE_TEXT', payload: last });
    }
    return { ok: true, restored: { type: 'text', item: last } };
  }

  if (tabs.length > 0) {
    const [last, ...rest] = tabs;
    await setStore({ [STORAGE_KEYS.tabHistory]: rest });
    await createTab({ url: last.url, active: true });
    await incrementStat('tabRestores');
    return { ok: true, restored: { type: 'tab', item: last } };
  }

  if (clips.length > 0) {
    const [last, ...rest] = clips;
    await setStore({ [STORAGE_KEYS.clipboardHistory]: rest });
    await incrementStat('clipboardRestores');
    return { ok: true, restored: { type: 'clipboard', item: last } };
  }

  return { ok: false, reason: 'Nothing to undo' };
}

// Quick Undo command (Alt+U)
try {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'lu_quick_undo') {
      await performUndoLast();
    }
  });
} catch (_) {
  // no-op
}

