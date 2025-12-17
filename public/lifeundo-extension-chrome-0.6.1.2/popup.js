// Главная страница попапа 1:1 с Windows GOLD (герой + "Что умеет" + футер)

const api = window.browser || window.chrome;

const $ = (id) => document.getElementById(id);

function getHostFromUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.host || u.hostname || '';
  } catch (e) {
    const m = String(url).split('/');
    if (m.length >= 3) return m[2];
    return '';
  }
}

let currentLang = 'ru';

// состояние триала / плана: { mode: 'trial'|'team', days:number, hours:number }
let trialState = null;

function renderTrialCapsule() {
  const el = $('ppTrial');
  if (!el) return;

  if (!trialState) {
    el.innerHTML = currentLang === 'ru' ? '<div>ТРИАЛ</div><div>0д 0ч</div>' : '<div>TRIAL</div><div>0d 0h</div>';
    return;
  }

  if (trialState.mode === 'dev') {
    el.textContent = 'DEV';
    return;
  }

  if (trialState.mode === 'team') {
    el.innerHTML = '<div>TEAM</div><div>&nbsp;</div>';
    return;
  }

  const d = Math.max(0, trialState.days || 0);
  const h = Math.max(0, trialState.hours || 0);
  if (currentLang === 'ru') {
    el.innerHTML = `<div>ТРИАЛ</div><div>${d}д ${h}ч</div>`;
  } else {
    el.innerHTML = `<div>TRIAL</div><div>${d}d ${h}h</div>`;
  }
}

function refreshTimelineAll() {
  const listEl = $('tlAllList');
  const emptyEl = $('tlAllEmpty');
  if (!listEl) return;

  listEl.innerHTML = '';

  try {
    const rt = api && api.runtime;
    if (!rt || typeof rt.sendMessage !== 'function') {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    rt.sendMessage({ type: 'LU_GET_TIMELINE', payload: { limit: 100 } }, (res) => {
      const items = res && Array.isArray(res.items) ? res.items : [];

      if (!items.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      items.forEach((item) => {
        if (!item) return;

        const li = document.createElement('li');

        const kindEl = document.createElement('div');
        kindEl.style.fontSize = '10px';
        kindEl.style.color = '#6b7280';
        const kind = String(item.kind || '');
        if (kind === 'tab') {
          kindEl.textContent = currentLang === 'ru' ? 'Вкладка' : 'Tab';
        } else if (kind === 'text') {
          kindEl.textContent = currentLang === 'ru' ? 'Текст' : 'Text';
        } else if (kind === 'shot') {
          kindEl.textContent = currentLang === 'ru' ? 'Скриншот' : 'Screenshot';
        } else if (kind === 'page_archive' || kind === 'pagesnapshot') {
          kindEl.textContent = currentLang === 'ru' ? 'Архив страницы' : 'Saved page';
        } else {
          kindEl.textContent = kind;
        }
        li.appendChild(kindEl);

        const mainEl = document.createElement('div');
        if (item.kind === 'text') {
          const val = String(item.value || '');
          mainEl.textContent = val.length > 160 ? val.slice(0, 157) + '…' : val;
        } else {
          let host = '';
          try {
            const u = new URL(item.url);
            host = u.host || u.hostname || '';
          } catch (e) {
            const m = String(item.url).split('/');
            if (m.length >= 3) host = m[2];
          }
          mainEl.textContent = item.title || host || '';
        }
        li.appendChild(mainEl);

        const metaEl = document.createElement('div');
        metaEl.style.fontSize = '11px';
        metaEl.style.color = '#9ca3af';
        const parts = [];
        if (item.url) {
          let host = '';
          try {
            const u = new URL(item.url);
            host = u.host || u.hostname || '';
          } catch (e) {
            const m = String(item.url).split('/');
            if (m.length >= 3) host = m[2];
          }
          if (host) parts.push(host);
        }
        const ts = item.ts || 0;
        if (ts) {
          try {
            const d = new Date(ts);
            parts.push(d.toLocaleString());
          } catch (e) {}
        }
        metaEl.textContent = parts.join(' • ');
        li.appendChild(metaEl);

        li.style.cursor = 'pointer';

        li.addEventListener('click', () => {
          try {
            if (item.kind === 'tab') {
              const url = item.url || '';
              if (!url) return;
              try {
                api.tabs.create({ url });
              } catch (e) {
                window.open(url, '_blank');
              }
            } else if (item.kind === 'shot') {
              if (!item.dataUrl) return;
              try {
                const w = window.open();
                if (w && w.document) {
                  const im = w.document.createElement('img');
                  im.src = item.dataUrl;
                  im.style.maxWidth = '100%';
                  im.style.height = 'auto';
                  w.document.body.style.margin = '0';
                  w.document.body.style.backgroundColor = '#000';
                  w.document.body.appendChild(im);
                }
              } catch (e) {}
            } else if (item.kind === 'text') {
              const rt2 = api && api.runtime;
              if (!rt2 || typeof rt2.sendMessage !== 'function') return;
              const entry = {
                page: item.url || '',
                value: String(item.value || ''),
                elementPath: String(item.elementPath || ''),
                ts: item.ts || Date.now(),
                kind: 'text'
              };
              rt2.sendMessage({ type: 'LU_RESTORE_TEXT_VERSION', payload: { entry } });
            }
          } catch (e) {}
        });

        listEl.appendChild(li);
      });
    });
  } catch (e) {
    if (emptyEl) emptyEl.style.display = 'block';
  }
}

function refreshTimelineTabHistory() {
  const listEl = $('tlTabsLocalList');
  const emptyEl = $('tlTabsLocalEmpty');
  if (!listEl) return;

  listEl.innerHTML = '';

  try {
    const rt = api && api.runtime;
    if (!rt || typeof rt.sendMessage !== 'function') {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    rt.sendMessage({ type: 'LU_GET_STATE' }, (res) => {
      const hist = res && res.data && Array.isArray(res.data.tabHistory) ? res.data.tabHistory : [];

      if (!hist.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      hist.forEach((item) => {
        if (!item || !item.url) return;

        const li = document.createElement('li');

        const titleEl = document.createElement('div');
        const host = getHostFromUrl(item.url);
        titleEl.textContent = item.title || host || item.url;

        const urlEl = document.createElement('div');
        urlEl.style.fontSize = '11px';
        urlEl.style.color = '#9ca3af';
        urlEl.textContent = host;

        const ts = item.closedAt || 0;
        if (ts) {
          const dateEl = document.createElement('div');
          dateEl.style.fontSize = '10px';
          dateEl.style.color = '#6b7280';
          try {
            const d = new Date(ts);
            dateEl.textContent = d.toLocaleString();
          } catch (e) {}
          li.appendChild(dateEl);
        }

        li.appendChild(titleEl);
        li.appendChild(urlEl);

        listEl.appendChild(li);
      });
    });
  } catch (e) {
    if (emptyEl) emptyEl.style.display = 'block';
  }
}

function refreshTimelineText() {
  const listEl = $('tlTextList');
  const emptyEl = $('tlTextEmpty');
  if (!listEl) return;

  listEl.innerHTML = '';

  try {
    const rt = api && api.runtime;
    if (!rt || typeof rt.sendMessage !== 'function') {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    rt.sendMessage({ type: 'LU_GET_STATE' }, (res) => {
      const hist = res && res.data && Array.isArray(res.data.textHistory) ? res.data.textHistory : [];

      if (!hist.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      hist.forEach((item) => {
        if (!item) return;

        const li = document.createElement('li');

        const url = item.page || '';
        const urlEl = document.createElement('div');
        urlEl.style.fontSize = '11px';
        urlEl.style.color = '#9ca3af';
        urlEl.textContent = url;

        const textEl = document.createElement('div');
        const val = String(item.value || '');
        textEl.textContent = val.length > 160 ? val.slice(0, 157) + '…' : val;

        const ts = item.ts || 0;
        if (ts) {
          const dateEl = document.createElement('div');
          dateEl.style.fontSize = '10px';
          dateEl.style.color = '#6b7280';
          try {
            const d = new Date(ts);
            dateEl.textContent = d.toLocaleString();
          } catch (e) {}
          li.appendChild(dateEl);
        }

        li.appendChild(textEl);
        li.appendChild(urlEl);

        const actions = document.createElement('div');
        actions.style.marginTop = '4px';

        const btnRestore = document.createElement('button');
        btnRestore.type = 'button';
        btnRestore.textContent = currentLang === 'ru' ? 'Вернуть этот текст' : 'Restore this version';
        btnRestore.style.border = 'none';
        btnRestore.style.background = 'transparent';
        btnRestore.style.color = '#60a5fa';
        btnRestore.style.fontSize = '10px';
        btnRestore.style.cursor = 'pointer';

        btnRestore.addEventListener('click', () => {
          try {
            const rt2 = api && api.runtime;
            if (!rt2 || typeof rt2.sendMessage !== 'function') return;
            rt2.sendMessage({ type: 'LU_RESTORE_TEXT_VERSION', payload: { entry: item } });
          } catch (e) {}
        });

        actions.appendChild(btnRestore);
        li.appendChild(actions);

        listEl.appendChild(li);
      });
    });
  } catch (e) {
    if (emptyEl) emptyEl.style.display = 'block';
  }
}

function bindLang() {
  // прочитать язык из localStorage при старте
  try {
    const stored = localStorage.getItem('lu_lang');
    if (stored === 'ru' || stored === 'en') {
      currentLang = stored;
    }
  } catch (e) {}

  const btn = $('ppLangToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    try {
      localStorage.setItem('lu_lang', currentLang);
    } catch (e) {}
    applyLang();
  });
}

function applyLang() {
  const ru = currentLang === 'ru';

  // переключатель языка в хедере
  const langBtn = $('ppLangToggle');
  if (langBtn) {
    langBtn.textContent = ru ? 'RU' : 'EN';
    langBtn.classList.toggle('active', ru);
  }

  const hero = document.getElementById('heroContainer');
  if (!hero) return;

  if (ru) {
    hero.innerHTML = `
      <div class="hero-title">Потеряли текст? Закрыли вкладку? Ctrl+Z вернёт всё обратно.</div>
      <div class="hero-sub">Восстанавливайте формы, вкладки и буфер обмена. 100% локально, без облака и слежки.</div>

      <section class="card">
        <div class="card-header">Что умеет:</div>
        <ul class="card-list">
          <li>История ввода в формах. Если страница перезагрузилась или вкладка закрылась, вы возвращаете последний введённый текст и продолжаете с того же места.</li>
          <li>История буфера обмена. Хронология скопированных фрагментов позволяет вставить любой предыдущий элемент без повторного поиска.</li>
          <li>Недавние вкладки. Быстрый доступ к недавно закрытым страницам и переход обратно в один тап.</li>
          <li>Быстрые скриншоты с превью. Делайте снимки экрана и мгновенно возвращайтесь к работе; изображения сохраняются локально.</li>
          <li>Локальное хранение и ZK‑подготовка. Расширение собирает локальные журналы вкладок и текста, которые десктопный Mesh может поднять в Ленту/ZK‑TempMem. Всё по умолчанию остаётся только на ваших устройствах.</li>
          <li>Без аккаунтов и регистрации. Установили — и пользуетесь.</li>
          <li>Без интернета. Основные функции работают офлайн; приложение не отправляет информацию на внешние сервера.</li>
          <li>Без рекламы и трекинга. Нет рекламных SDK, аналитики и скрытых сборов данных.</li>
        </ul>
      </section>

      <section class="card">
        <div class="card-header">Зачем это нужно:</div>
        <ul class="card-list">
          <li>Подстраховка при длинных формах, комментариях, сообщениях и заявках — если страница «упала» или «выкинула», текст не пропадёт.</li>
          <li>Ускорение повседневной работы: удобная история буфера обмена и быстрые скриншоты экономят время.</li>
          <li>Приватность по умолчанию: информация не покидает ваше устройство.</li>
        </ul>
      </section>

      <section class="card">
        <div class="card-header">Принципы приватности:</div>
        <ul class="card-list">
          <li>Приложение не запрашивает лишних разрешений и не использует сторонние трекеры.</li>
          <li>Данные не передаются на сервера разработчика или третьих лиц.</li>
          <li>При удалении приложения вся локальная история полностью очищается.</li>
        </ul>
      </section>

      <section class="card">
        <div class="card-header">Примечания:</div>
        <ul class="card-list">
          <li>Приложение не требует учётной записи и работает локально.</li>
          <li>Список возможностей будет расширяться; акцент — на надёжность, приватность и удобство.</li>
        </ul>
        <div class="card-list" style="list-style:none;padding-left:0;margin-top:6px;font-size:12px;color:#cbd5f5;">
          В приложении есть подписка.
        </div>
      </section>
    `;

    $('ftSite').textContent = 'Сайт';
    $('ftGitHub').textContent = 'GitHub';
    $('ftPrivacy').textContent = 'Приватность';
    $('ftOffer').textContent = 'Оферта';
  } else {
    hero.innerHTML = `
      <div class="hero-title">Lost text? Closed a tab? Ctrl+Z brings it back.</div>
      <div class="hero-sub">Restore forms, tabs, and clipboard. 100% local — no cloud, no tracking.</div>

      <section class="card">
        <div class="card-header">What it does:</div>
        <ul class="card-list">
          <li>Form input history. If a page reloads or a tab is closed, you restore the last entered text and continue from the same place.</li>
          <li>Clipboard history. A timeline of copied fragments lets you paste any previous item without re‑searching.</li>
          <li>Recent tabs. Quick access to recently closed pages and one‑tap return.</li>
          <li>Quick screenshots with preview. Take captures and jump back instantly; images are stored locally.</li>
          <li>Local storage and ZK preparation. The extension builds local journals of tabs and text that the desktop Mesh client can lift into its Timeline/ZK‑TempMem. By default everything stays only on your devices.</li>
          <li>No accounts or registration. Install — and use.</li>
          <li>No internet required. Core features work offline; the app does not send information to external servers.</li>
          <li>No ads or tracking. No ad SDKs, analytics, or hidden data collection.</li>
        </ul>
      </section>

      <section class="card">
        <div class="card-header">Why it matters:</div>
        <ul class="card-list">
          <li>Safety net for long forms, comments, messages, and applications — if a page "crashes" or "kicks you out", your text won’t be lost.</li>
          <li>Faster everyday work: convenient clipboard history and quick screenshots save time.</li>
          <li>Privacy by default: your information never leaves the device.</li>
        </ul>
      </section>

      <section class="card">
        <div class="card-header">Privacy principles:</div>
        <ul class="card-list">
          <li>The app requests no unnecessary permissions and uses no third‑party trackers.</li>
          <li>Data is not transferred to the developer’s servers or to any third parties.</li>
          <li>When the app is removed, all local history is fully erased.</li>
        </ul>
      </section>

      <section class="card">
        <div class="card-header">Notes:</div>
        <ul class="card-list">
          <li>The app does not require an account and works locally.</li>
          <li>The feature list will grow; the focus is reliability, privacy and convenience.</li>
        </ul>
        <div class="card-list" style="list-style:none;padding-left:0;margin-top:6px;font-size:12px;color:#cbd5f5;">
          The app includes a subscription.
        </div>
      </section>
    `;

    $('ftSite').textContent = 'Website';
    $('ftGitHub').textContent = 'GitHub';
    $('ftPrivacy').textContent = 'Privacy';
    $('ftOffer').textContent = 'Offer';
  }

  // капсулы версии/триала
  renderTrialCapsule();

  // Настройки: заголовок меню и разделов
  const stMenuTitle = $('stMenuTitle');
  if (stMenuTitle) stMenuTitle.textContent = ru ? 'Меню' : 'Menu';

  // подписи кнопок вкладок настроек
  const tabGeneral = $('stTabGeneral');
  const tabSub = $('stTabSub');
  const tabApps = $('stTabApps');
  const tabAbout = $('stTabAbout');
  const tabFaq = $('stTabFaq');
  const tabActivity = $('stTabActivity');
  const tabDevices = $('stTabDevices');
  const tabTeam = $('stTabTeam');

  if (tabGeneral) tabGeneral.textContent = ru ? 'Общее' : 'General';
  if (tabSub) tabSub.textContent = ru ? 'Подписка' : 'Subscription';
  if (tabApps) tabApps.textContent = ru ? 'Приложения' : 'Apps';
  if (tabAbout) tabAbout.textContent = ru ? 'О нас' : 'About';
  if (tabFaq) tabFaq.textContent = 'FAQ';
  if (tabActivity) tabActivity.textContent = ru ? 'Лента' : 'Timeline';
  if (tabDevices) tabDevices.textContent = ru ? 'Устройства' : 'Devices';
  if (tabTeam) tabTeam.textContent = 'TEAM';

  const stPanelGeneral = $('stPanelGeneral');
  if (stPanelGeneral) {
    const title = stPanelGeneral.querySelector('.settings-section-title');
    const sub = stPanelGeneral.querySelector('.settings-section-sub');
    const langTitle = stPanelGeneral.querySelector('.stg-card-title');
    const emailTitle = stPanelGeneral.querySelectorAll('.stg-card-title')[1];
    const emailNote = stPanelGeneral.querySelector('.stg-email-note');
    const emailBtn = $('stGenEmailSave');
    const emailInput = $('stGenEmail');
    const cloudTitle = $('cloudTitle');
    const cloudDesc = $('cloudDesc');
    const cloudToggleLabel = $('cloudToggleLabel');
    const cloudNote = $('cloudNote');
    const cloudAccountLabel = $('cloudAccountLabel');
    const cloudEmailInput = $('stCloudEmail');
    const cloudPasswordInput = $('stCloudPassword');
    const cloudPasswordNote = $('cloudPasswordNote');
    const cloudSaveBtn = $('stCloudSave');


    if (title) title.textContent = ru ? 'Общие настройки' : 'General settings';
    if (sub)
      sub.textContent = ru
        ? 'Язык интерфейса, отображение списка внутри окна и базовые режимы работы.'
        : 'Interface language, in-window list view and basic modes.';
    if (langTitle) langTitle.textContent = ru ? 'Язык' : 'Language';
    if (emailTitle) emailTitle.textContent = ru ? 'Email для аккаунта' : 'Account email';
    if (emailNote)
      emailNote.textContent = ru
        ? 'Используется для триала, подписки и привязки устройств. Укажите рабочий адрес. В браузерном расширении email сохраняется локально и будет использован десктоп‑клиентом.'
        : 'Used for trial, subscription and device linking. Provide a work address. In the browser extension the email is stored locally and will be used by the desktop client later.';
    if (emailBtn) emailBtn.textContent = ru ? 'Отправить' : 'Send';
    if (emailInput)
      emailInput.placeholder = ru ? 'you@example.com' : 'you@example.com';

    if (cloudTitle)
      cloudTitle.textContent = ru ? 'LifeUndo Cloud (опционально)' : 'LifeUndo Cloud (optional)';
    if (cloudDesc)
      cloudDesc.textContent = ru
        ? 'Дополнительный защищённый уровень поверх локальной Mesh‑сети. По умолчанию всё остаётся только на этом устройстве, без отправки на сервер.'
        : 'An extra protected layer on top of the local Mesh network. By default everything stays on this device and nothing is sent to the server.';
    if (cloudToggleLabel)
      cloudToggleLabel.textContent = ru
        ? 'Включить LifeUndo Cloud для этого аккаунта'
        : 'Enable LifeUndo Cloud for this account';
    if (cloudNote)
      cloudNote.textContent = ru
        ? 'При включении Cloud часть Ленты и настроек может синхронизироваться между домашними и рабочими устройствами. Объём и тип данных можно будет настроить отдельно.'
        : 'When Cloud is enabled, part of your Timeline and settings may sync between home and work devices. The amount and type of data will be configurable later.';

    if (cloudAccountLabel)
      cloudAccountLabel.textContent = ru ? 'Аккаунт LifeUndo Cloud' : 'LifeUndo Cloud account';
    if (cloudEmailInput)
      cloudEmailInput.placeholder = ru ? 'you@example.com' : 'you@example.com';
    if (cloudPasswordInput)
      cloudPasswordInput.placeholder = ru
        ? 'Пароль Cloud (опционально)'
        : 'Cloud password (optional)';

    if (cloudPasswordNote)
      cloudPasswordNote.textContent = ru
        ? 'Придумайте отдельный пароль для LifeUndo Cloud и запомните его. Этот пароль не связан с почтой и не восстанавливается: позже он понадобится на других устройствах и в админ‑панели, чтобы расшифровать Cloud‑данные.'
        : 'Create a separate password for LifeUndo Cloud and remember it. This password is not your email password and cannot be recovered; later you will need it on other devices and in the admin console to decrypt your Cloud data.';

    if (cloudSaveBtn)
      cloudSaveBtn.textContent = ru ? 'Сохранить настройки Cloud' : 'Save Cloud settings';

    // подписи переключателей в Общих (showHere / shots / video / eventMode)
    const rowShowHere = $('stGenShowHere')?.closest('.stg-row');
    const rowShots = $('stGenShots')?.closest('.stg-row');
    const rowVideo = $('stGenVideo')?.closest('.stg-row');
    const rowEvent = $('stGenEvent')?.closest('.stg-row');
    const rowOfficeHome = $('stGenOfficeHome')?.closest('.stg-row');

    function setLabel(row, textRu, textEn, titleRu, titleEn) {
      if (!row) return;
      const lbl = row.querySelector('.stg-row-label');
      const hint = row.querySelector('.stg-hint');
      if (lbl) {
        const txt = ru ? textRu : textEn;
        // первый текстовый узел внутри label — сама надпись, оставляем span с "!" как есть
        if (lbl.firstChild) {
          if (lbl.firstChild.nodeType === Node.TEXT_NODE) {
            lbl.firstChild.textContent = txt + ' ';
          } else {
            lbl.insertBefore(document.createTextNode(txt + ' '), lbl.firstChild);
          }
        } else {
          lbl.appendChild(document.createTextNode(txt + ' '));
        }
      }
      if (hint)
        hint.setAttribute('title', ru ? titleRu : titleEn);
    }

    setLabel(
      rowShowHere,
      'Показывать список здесь',
      'Show list here',
      'Показывать список внутри окна приложения',
      'Show the list inside the app window'
    );
    setLabel(
      rowShots,
      'Скриншоты',
      'Screenshots',
      'Автоматически сохранять скриншоты',
      'Automatically capture screenshots'
    );
    setLabel(
      rowVideo,
      'Видео',
      'Video',
      'Запись короткого видео (позже)',
      'Capture short videos (later)'
    );
    setLabel(
      rowEvent,
      'Режим событий',
      'Event mode',
      'Экспериментальный режим, фиксирует только важные события',
      'Experimental mode, captures only important events'
    );
    setLabel(
      rowOfficeHome,
      'Офис/дом (умная синхронизация)',
      'Office/home (smart sync)',
      'Готовит локальные журналы для общей Ленты между домашними и рабочими устройствами. Облачная передача и TEAM включаются отдельно и по умолчанию выключены.',
      'Prepares local journals for a shared Timeline between home and work devices. Cloud transfer and TEAM are enabled separately and are off by default.'
    );

    // Подписка / Subscription
    const stPanelSub = $('stPanelSubscription');
    if (stPanelSub) {
      const subTitle = $('subTitle');
      const subSub = $('subSub');
      const subStatusLabel = $('subStatusLabel');
      const subStatusValue = $('subStatusValue');
      const subProTitle = $('subProTitle');
      const subProPrice = $('subProPrice');
      const subVipTitle = $('subVipTitle');
      const subVipPrice = $('subVipPrice');
      const subTeamTitle = $('subTeamTitle');
      const subTeamPrice = $('subTeamPrice');
      const btnSubPro = $('btnSubPro');
      const btnSubVip = $('btnSubVip');
      const btnSubTeam = $('btnSubTeam');

      if (subTitle) subTitle.textContent = ru ? 'Подписка' : 'Subscription';
      if (subSub)
        subSub.textContent = ru
          ? 'Тарифы PRO, VIP и TEAM 5 для персонального и командного использования.'
          : 'PRO, VIP and TEAM 5 plans for personal and team use.';

      if (subStatusLabel) subStatusLabel.textContent = ru ? 'Статус' : 'Status';
      if (subStatusValue) subStatusValue.textContent = ru ? 'Не активна' : 'Not activated';

      if (subProTitle)
        subProTitle.textContent = ru
          ? 'PRO (месяц, для одного пользователя)'
          : 'PRO (monthly, single user)';
      if (subProPrice) subProPrice.textContent = ru ? 'ежемесячно' : 'per month';
      if (btnSubPro)
        btnSubPro.textContent = ru ? 'Оплатить — ₽599' : 'Pay — ₽599';

      if (subVipTitle)
        subVipTitle.textContent = ru
          ? 'VIP (пожизненно, для одного пользователя)'
          : 'VIP (lifetime, single user)';
      if (subVipPrice) subVipPrice.textContent = ru ? 'единовременно' : 'one-time';
      if (btnSubVip)
        btnSubVip.textContent = ru ? 'Оплатить — ₽9990' : 'Pay — ₽9990';

      if (subTeamTitle)
        subTeamTitle.textContent = ru
          ? 'TEAM 5 (для команд и организаций)'
          : 'TEAM 5 (teams & organisations)';
      if (subTeamPrice) subTeamPrice.textContent = ru ? '5 мест / месяц' : '5 seats / month';
      if (btnSubTeam)
        btnSubTeam.textContent = ru ? 'Оплатить — ₽2990' : 'Pay — ₽2990';
    }

    // Apps
    const stPanelApps = $('stPanelApps');
    if (stPanelApps) {
      const appsTitle = $('appsTitle');
      const appsSub = $('appsSub');
      const appsDesktopTitle = $('appsDesktopTitle');
      const appsDesktopWin = $('appsDesktopWin');
      const appsDesktopMac = $('appsDesktopMac');
      const appsDesktopQrText = $('appsDesktopQrText');
      const appsDesktopUrl = $('appsDesktopUrl');
      const appsAndroidTitle = $('appsAndroidTitle');
      const appsAndroidRustore = $('appsAndroidRustore');
      const appsAndroidRustoreNote = $('appsAndroidRustoreNote');
      const appsAndroidGithub = $('appsAndroidGithub');
      const appsAndroidGithubNote = $('appsAndroidGithubNote');
      const appsAppleTitle = $('appsAppleTitle');
      const appsAppleIos = $('appsAppleIos');
      const appsAppleMac = $('appsAppleMac');
      const appsBrowserTitle = $('appsBrowserTitle');
      const appsBrowserChrome = $('appsBrowserChrome');
      const appsBrowserSafari = $('appsBrowserSafari');
      const appsBrowserEdge = $('appsBrowserEdge');
      const appsTabletTitle = $('appsTabletTitle');
      const appsTabletText = $('appsTabletText');
      const appsDevicesNoteTitle = $('appsDevicesNoteTitle');
      const appsDevicesNoteText = $('appsDevicesNoteText');
      const btnAppsDesktopShare = $('btnAppsDesktopShare');
      const btnAppsRustore = $('btnAppsRustore');
      const btnAppsApk = $('btnAppsApk');
      const appsAndroidRustoreLabel = $('appsAndroidRustoreLabel');
      const appsAndroidGithubTileNote = $('appsAndroidGithubTileNote');

      if (appsTitle) appsTitle.textContent = ru ? 'Приложения GetLifeUndo' : 'GetLifeUndo apps';
      if (appsSub)
        appsSub.textContent = ru
          ? 'Десктопный клиент, Android‑приложение и другие клиенты Mesh.'
          : 'Desktop app, Android client and other Mesh clients.';
      if (appsDesktopTitle) appsDesktopTitle.textContent = 'Desktop';
      if (appsDesktopWin)
        appsDesktopWin.textContent = ru
          ? 'Windows — Mesh 0.6.1.2 GOLD (эта сборка)'
          : 'Windows — Mesh 0.6.1.2 GOLD (this build)';
      if (appsDesktopMac)
        appsDesktopMac.textContent = ru ? 'macOS — в разработке' : 'macOS — in development';
      if (appsDesktopQrText)
        appsDesktopQrText.textContent = ru
          ? 'Сканируйте QR, чтобы открыть страницу загрузок GetLifeUndo.'
          : 'Scan the QR to open the GetLifeUndo downloads page.';
      if (appsDesktopUrl)
        appsDesktopUrl.textContent = 'https://getlifeundo.com/ru/downloads';
      if (btnAppsDesktopShare)
        btnAppsDesktopShare.textContent = ru ? 'Поделиться ссылкой' : 'Share link';

      if (appsAndroidTitle) appsAndroidTitle.textContent = 'Android';
      if (appsAndroidRustore) appsAndroidRustore.textContent = 'RuStore';
      if (appsAndroidRustoreNote)
        appsAndroidRustoreNote.textContent = ru ? 'Доступно в RuStore.' : 'Available in RuStore.';
      if (appsAndroidGithub) appsAndroidGithub.textContent = 'GitHub';
      if (appsAndroidGithubNote)
        appsAndroidGithubNote.textContent = ru
          ? 'APK (ручная установка) и dev‑сборки.'
          : 'APK (manual install) and dev builds.';
      if (btnAppsRustore)
        btnAppsRustore.textContent = ru ? 'Открыть RuStore' : 'Open RuStore';
      if (btnAppsApk)
        btnAppsApk.textContent = ru ? 'Открыть GitHub' : 'Open GitHub';

      if (appsAndroidRustoreLabel)
        appsAndroidRustoreLabel.textContent = ru ? 'Доступно' : 'Available';
      if (appsAndroidGithubTileNote)
        appsAndroidGithubTileNote.textContent = ru ? 'APK (ручная установка)' : 'APK (manual install)';

      try {
        const soonLabels = document.querySelectorAll('.apps-soon-label');
        soonLabels.forEach(function (el) {
          el.textContent = ru ? 'Скоро' : 'Soon';
        });
      } catch (_) {}

      if (appsAppleTitle) appsAppleTitle.textContent = 'Apple';
      if (appsAppleIos)
        appsAppleIos.textContent = ru ? 'iOS — в разработке' : 'iOS — in development';
      if (appsAppleMac)
        appsAppleMac.textContent = ru ? 'macOS‑клиент — в разработке' : 'macOS client — in development';

      if (appsBrowserTitle)
        appsBrowserTitle.textContent = ru ? 'Браузерные расширения' : 'Browser extensions';
      if (appsBrowserChrome)
        appsBrowserChrome.textContent = ru
          ? 'Chrome — доступно'
          : 'Chrome — available';
      if (appsBrowserSafari)
        appsBrowserSafari.textContent = ru
          ? 'Safari — доступно'
          : 'Safari — available';
      if (appsBrowserEdge)
        appsBrowserEdge.textContent = ru ? 'Edge — доступно' : 'Edge — available';

      if (appsTabletTitle) appsTabletTitle.textContent = 'Tablet / iPad';
      if (appsTabletText)
        appsTabletText.textContent = ru
          ? 'Планшетные клиенты — в разработке.'
          : 'Tablet clients — in development.';

      if (appsDevicesNoteTitle)
        appsDevicesNoteTitle.textContent = ru ? 'Устройства' : 'Devices';
      if (appsDevicesNoteText)
        appsDevicesNoteText.textContent = ru
          ? 'Этот desktop‑клиент уже готов. Раздел «Устройства» в настройках показывает текущий ПК и позволит позже привязывать другие устройства.'
          : 'The "Devices" section in Settings shows this PC and will later let you link other devices.';
    }

    // TEAM
    const stPanelTeam = $('stPanelTeam');
    if (stPanelTeam) {
      const teamTitle = $('teamTitle');
      const teamSub2 = $('teamSub');
      const teamIntroTitle = $('teamIntroTitle');
      const teamIntroTextMain = $('teamIntroTextMain');
      const teamIntroTextPilot = $('teamIntroTextPilot');
      const teamHowTitle = $('teamHowTitle');
      const teamHowText = $('teamHowText');
      const teamAdminTitle = $('teamAdminTitle');
      const teamAdminText = $('teamAdminText');
      const teamStatusLine = $('teamStatusLine');
      const teamDevicesSummary = $('teamDevicesSummary');
      const btnTeamAdmin = $('btnTeamAdmin');
      const teamJoinTitle = $('teamJoinTitle');
      const teamJoinDesc = $('teamJoinDesc');
      const btnTeamJoin = $('btnTeamJoin');
      const teamJoinStatus = $('teamJoinStatus');
      const btnTeamLeave = $('btnTeamLeave');

      if (teamTitle) teamTitle.textContent = 'TEAM';
      if (teamSub2)
        teamSub2.textContent = ru
          ? 'TEAM 5 для команд и организаций, слоты устройств и админ‑панель.'
          : 'TEAM 5 for teams and organisations, device slots and admin console.';

      if (teamIntroTitle) teamIntroTitle.textContent = 'TEAM / TEAM 5';
      if (teamIntroTextMain)
        teamIntroTextMain.textContent = ru
          ? 'TEAM — это доступ к GetLifeUndo для команды или небольшой организации. Тариф TEAM 5 рассчитан на 5 устройств (людей или рабочих станций) и даёт бонус +5% к каждому пополнению счёта команды.'
          : 'TEAM is access to GetLifeUndo for a team or small organisation. The TEAM 5 plan is designed for 5 devices (people or workstations) and gives a +5% bonus on every team top‑up.';
      if (teamIntroTextPilot)
        teamIntroTextPilot.textContent = ru
          ? 'Для пилотных команд действует индивидуальное предложение и дополнительные бонусы за обратную связь.'
          : 'Pilot teams can get individual terms and extra bonuses for feedback.';

      if (teamStatusLine)
        teamStatusLine.textContent = ru
          ? 'Статус TEAM будет загружен с сервера LifeUndo при открытии этого раздела.'
          : 'TEAM status will be loaded from the LifeUndo server when you open this section.';

      if (teamHowTitle) teamHowTitle.textContent = ru ? 'Как подключиться' : 'How to join';
      if (teamHowText)
        teamHowText.textContent = ru
          ? 'Напишите на support@getlifeundo.com с темой TEAM, укажите название команды/организации, примерное количество людей и нужный период. Мы создадим TEAM‑аккаунт, пришлём договор и активационные ключи.'
          : 'Email support@getlifeundo.com with subject TEAM, include your team/organisation name, approximate number of people and desired period. We will create a TEAM account, send you an agreement and activation keys.';

      if (teamAdminTitle)
        teamAdminTitle.textContent = ru ? 'TEAM / админ‑панель' : 'TEAM / admin panel';
      if (teamAdminText)
        teamAdminText.textContent = ru
          ? 'В десктопном клиенте раздел TEAM показывает организацию, ключи и устройства. В браузерном расширении используется тот же backend для проверки статусов, но управление происходит через веб‑админку.'
          : 'In the desktop app the TEAM section shows the organisation, keys and devices. The browser extension uses the same backend for status checks, but management happens via the web admin console.';
      if (teamDevicesSummary)
        teamDevicesSummary.textContent = ru
          ? 'При открытии этого раздела приложение запросит статус команды и покажет, сколько слотов устройств используется и участвует ли этот компьютер в TEAM.'
          : 'When you open this section, the app will request team status and show how many device slots are in use and whether this computer is part of TEAM.';
      if (btnTeamAdmin)
        btnTeamAdmin.textContent = ru ? 'Открыть админ‑панель' : 'Open admin console';

      if (teamJoinTitle)
        teamJoinTitle.textContent = ru ? 'Подключение по ключу TEAM' : 'Join by TEAM key';
      if (teamJoinDesc)
        teamJoinDesc.textContent = ru
          ? 'Если у вас уже есть TEAM‑ключ, вставьте его здесь, чтобы привязать этот desktop‑клиент к организации.'
          : 'If you already have a TEAM key, paste it here to attach this desktop client to your organisation.';
      if (teamJoinStatus)
        teamJoinStatus.textContent = ru
          ? 'Рабочее состояние TEAM и статусы устройств настраиваются через веб‑админку LifeUndo; здесь показан только пример интерфейса desktop‑клиента.'
          : 'Actual TEAM state and device statuses are configured in the LifeUndo web admin; this is a sample desktop client interface only.';
      if (btnTeamJoin)
        btnTeamJoin.textContent = ru ? 'Подключить TEAM' : 'Join TEAM';
      if (btnTeamJoin && teamJoinStatus && teamStatusLine) {
        btnTeamJoin.addEventListener('click', function () {
          const keyInput = $('teamKeyInput');
          const raw = keyInput && typeof keyInput.value === 'string' ? keyInput.value.trim() : '';
          if (!raw) {
            teamJoinStatus.textContent = ru ? 'Введите TEAM‑ключ.' : 'Enter a TEAM key.';
            return;
          }
          const rt = api && api.runtime;
          if (!rt || typeof rt.sendMessage !== 'function') {
            teamJoinStatus.textContent = ru
              ? 'Не удалось отправить запрос: runtime недоступен.'
              : 'Could not send request: runtime is unavailable.';
            return;
          }
          teamJoinStatus.textContent = ru ? 'Подключение…' : 'Joining…';
          teamStatusLine.textContent = ru ? 'Статус TEAM обновляется…' : 'TEAM status is updating…';
          rt.sendMessage({ type: 'LU_JOIN_ORG_BY_KEY', payload: { key: raw } }, function (res) {
            if (!res || !res.ok) {
              const err = (res && res.error) || 'JOIN_ORG_FAILED';
              teamJoinStatus.textContent = ru
                ? 'Ошибка: ' + String(err)
                : 'Error: ' + String(err);
              return;
            }
            teamJoinStatus.textContent = ru
              ? 'TEAM‑ключ принят, это устройство привязано к организации.'
              : 'TEAM key accepted, this device is now linked to the organisation.';
            if (res.org) {
              try {
                const name = String(res.org.name || '—');
                const id = String(res.org.id || '');
                teamStatusLine.textContent = ru
                  ? 'Организация: ' + name + (id ? ' / ' + id : '')
                  : 'Organisation: ' + name + (id ? ' / ' + id : '');
              } catch (_) {}
            }
          });
        });
      }

      if (btnTeamLeave && teamJoinStatus && teamStatusLine) {
        btnTeamLeave.textContent = ru ? 'Выйти из TEAM' : 'Leave TEAM';
        btnTeamLeave.addEventListener('click', function () {
          const rt = api && api.runtime;
          if (!rt || typeof rt.sendMessage !== 'function') {
            teamJoinStatus.textContent = ru
              ? 'Не удалось отправить запрос: runtime недоступен.'
              : 'Could not send request: runtime is unavailable.';
            return;
          }
          teamJoinStatus.textContent = ru ? 'Отключение…' : 'Leaving…';
          teamStatusLine.textContent = ru ? 'Статус TEAM обновляется…' : 'TEAM status is updating…';
          rt.sendMessage({ type: 'LU_LEAVE_ORG', payload: {} }, function (res) {
            if (!res || !res.ok) {
              const err = (res && res.error) || 'LEAVE_ORG_FAILED';
              teamJoinStatus.textContent = ru
                ? 'Ошибка: ' + String(err)
                : 'Error: ' + String(err);
              return;
            }
            teamJoinStatus.textContent = ru
              ? 'Это устройство отключено от TEAM.'
              : 'This device has left TEAM.';
            teamStatusLine.textContent = ru
              ? 'Это устройство сейчас не состоит в TEAM.'
              : 'This device is currently not part of any TEAM.';
          });
        });
      }
    }

    // Devices
    const devTitle = $('devTitle');
    const devSub = $('devSub');
    const devThisDeviceTitle = $('devThisDeviceTitle');
    const devThisDeviceText = $('devThisDeviceText');
    const devHowLinkTitle = $('devHowLinkTitle');
    const devHowLinkText1 = $('devHowLinkText1');
    const devHowLinkText2 = $('devHowLinkText2');
    const devLinkCode = $('devLinkCode');
    const devLinkStatus = $('devLinkStatus');
    const btnDevLink = $('btnDevLink');
    const devPeersTitle = $('devPeersTitle');
    const devPeersList = $('devPeersList');
    const devFoundTitle = $('devFoundTitle');
    const devFoundList = $('devFoundList');

    if (devTitle) devTitle.textContent = ru ? 'Устройства' : 'Devices';
    if (devSub)
      devSub.textContent = ru
        ? 'Обзор устройств TEAM и базовая информация об этом браузере. Полная связка устройств управляется через десктопный клиент и админ‑панель.'
        : 'Overview of TEAM devices and basic information about this browser. The full device linking is managed by the desktop client and the admin panel.';

    if (devThisDeviceTitle) devThisDeviceTitle.textContent = ru ? 'Это устройство' : 'This device';
    if (devThisDeviceText)
      devThisDeviceText.textContent = ru
        ? 'Расширение браузера GetLifeUndo. Тип клиента: browser‑extension. Для полноценной работы TEAM и слотов устройств подключите хотя бы один десктопный клиент.'
        : 'GetLifeUndo browser extension. Client type: browser‑extension. For full TEAM functionality and device slots, connect at least one desktop client.';

    if (devHowLinkTitle)
      devHowLinkTitle.textContent = ru ? 'Как связать устройства' : 'How to link devices';
    if (devHowLinkText1)
      devHowLinkText1.textContent = ru
        ? 'В десктопной версии есть раздел «Устройства» и коды привязки (PIN). Через него можно связать до 5 устройств в рамках TEAM 5.'
        : 'In the desktop app there is a "Devices" section and pairing PIN codes. You can link up to 5 devices within a TEAM 5 plan.';
    if (devHowLinkText2)
      devHowLinkText2.textContent = ru
        ? 'Браузерное расширение будет отображаться как ещё одно устройство, если вы отправите письмо на legal@getlifeundo.com с этого же email, что и в десктопе, и активируете TEAM.'
        : 'The browser extension will appear as another device if you send an email to legal@getlifeundo.com from the same address as in the desktop app and activate TEAM.';

    if (devLinkCode)
      devLinkCode.placeholder = ru ? 'Код привязки (15 минут)' : 'Pairing code (15 min)';
    if (btnDevLink)
      btnDevLink.textContent = ru ? 'Подключить по коду' : 'Link with code';
    if (devLinkStatus)
      devLinkStatus.textContent = ru
        ? 'Введите код привязки из десктопной версии или админ‑панели, чтобы связать это расширение с аккаунтом/TEAM.'
        : 'Enter a pairing code from the desktop app or admin console to link this extension to your account/TEAM.';

    if (devPeersTitle)
      devPeersTitle.textContent = ru ? 'Подключённые устройства' : 'Paired devices';
    if (devPeersList)
      devPeersList.textContent = '—';
    if (devFoundTitle)
      devFoundTitle.textContent = ru ? 'Найденные устройства' : 'Discovered devices';
    if (devFoundList)
      devFoundList.textContent = '—';

    // Activity / Лента
    const stPanelActivity = $('stPanelActivity');
    if (stPanelActivity) {
      const tlTitle = $('tlTitle');
      const tlSub = $('tlSub');
      const tlAllTitle = $('tlAllTitle');
      const tlAllHint = $('tlAllHint');
      const tlAllEmpty = $('tlAllEmpty');
      const tlTabsTitle = $('tlTabsTitle');
      const tlTabsHint = $('tlTabsHint');
      const tlTabsEmpty = $('tlTabsEmpty');
      const tlTabsRestoreAll = $('tlTabsRestoreAll');
      const tlTabsRestoreSelected = $('tlTabsRestoreSelected');
      const tlTabsList = $('tlTabsList');
      const tlTabsLocalHint = $('tlTabsLocalHint');
      const tlTabsLocalEmpty = $('tlTabsLocalEmpty');
      const tlShotsTitle = $('tlShotsTitle');
      const tlShotsText1 = $('tlShotsText1');
      const tlShotsText2 = $('tlShotsText2');
      const tlSnapTitle = $('tlSnapTitle');
      const tlSnapText1 = $('tlSnapText1');
      const tlTextTitle = $('tlTextTitle');
      const tlTextText1 = $('tlTextText1');
      const tlTextText2 = $('tlTextText2');
      const tlTextEmpty = $('tlTextEmpty');
      const tlZkStatus = $('tlZkStatus');

      if (tlTitle) tlTitle.textContent = ru ? 'Лента' : 'Timeline';
      if (tlSub)
        tlSub.textContent = ru
          ? 'Быстрый доступ к вкладкам, скриншотам и тексту. В браузерной версии здесь отображаются недавние вкладки этого браузера.'
          : 'Quick access to tabs, screenshots and text. In the browser this section shows recent tabs from this browser.';

      if (tlAllTitle) tlAllTitle.textContent = ru ? 'Все события' : 'All events';
      if (tlAllHint)
        tlAllHint.textContent = ru
          ? 'Сводная Лента по вкладкам, тексту и скриншотам за последние действия этого браузера.'
          : 'Unified timeline of tabs, text and screenshots for the latest activity in this browser.';
      if (tlAllEmpty)
        tlAllEmpty.textContent = ru
          ? 'Пока нет событий для отображения.'
          : 'There are no events to display yet.';

      if (tlTabsTitle) tlTabsTitle.textContent = ru ? 'Вкладки' : 'Tabs';
      if (tlTabsHint)
        tlTabsHint.textContent = ru
          ? 'Недавние вкладки этого браузера. Нажмите на строку, чтобы открыть вкладку снова.'
          : 'Recent tabs from this browser. Click a row to reopen the tab.';
      if (tlTabsEmpty)
        tlTabsEmpty.textContent = ru
          ? 'Пока нет недавних закрытых вкладок.'
          : 'There are no recently closed tabs yet.';
      if (tlTabsLocalHint)
        tlTabsLocalHint.textContent = ru
          ? 'Локальный журнал вкладок этого браузера (последние URL, которые расширение успело зафиксировать).'
          : 'Local tab journal for this browser (latest URLs the extension managed to record).';
      if (tlTabsLocalEmpty)
        tlTabsLocalEmpty.textContent = ru
          ? 'Пока нет записей в локальном журнале вкладок.'
          : 'No entries in local tab journal yet.';

      if (tlTabsRestoreAll)
        tlTabsRestoreAll.textContent = ru ? 'Восстановить' : 'Restore';
      if (tlTabsRestoreSelected)
        tlTabsRestoreSelected.textContent = ru ? 'Восстановить' : 'Restore';

      if (tlShotsTitle) tlShotsTitle.textContent = ru ? 'Скриншоты' : 'Screenshots';
      if (tlShotsText1)
        tlShotsText1.textContent = ru
          ? 'Десктопное приложение отслеживает папки скриншотов (Изображения/Скриншоты, OneDrive, Dropbox и др.) и показывает последние кадры в удобном списке.'
          : 'The desktop app watches screenshot folders (Pictures/Screenshots, OneDrive, Dropbox, etc.) and shows the latest shots in a compact list.';
      if (tlShotsText2)
        tlShotsText2.textContent = ru
          ? 'В браузерном расширении мы не читаем файловую систему: здесь только описание поведения, без отображения содержимого.'
          : 'The browser extension does not read your file system; this section only describes the behaviour without showing actual files.';

      if (tlSnapTitle) tlSnapTitle.textContent = ru ? 'Архив страниц' : 'Saved pages';
      if (tlSnapText1)
        tlSnapText1.textContent = ru
          ? 'Локальные слепки страниц «как было»: HTML на момент сохранения, который можно открыть даже если сайт изменился или недоступен.'
          : 'Local page snapshots "as it was": HTML at the time of capture that can be opened even if the site has changed or is unavailable.';

      if (tlTextTitle) tlTextTitle.textContent = ru ? 'Текст' : 'Text';
      if (tlTextText1)
        tlTextText1.textContent = ru
          ? 'В десктопе Лента хранит историю текста из буфера обмена и позволяет быстро вернуться к нужным фрагментам.'
          : 'In the desktop app the Timeline keeps a history of clipboard text and lets you quickly jump back to important snippets.';
      if (tlTextText2)
        tlTextText2.textContent = ru
          ? 'В браузере текстовые действия ограничены вкладками и формами, поэтому здесь Лента выступает как справочный раздел.'
          : 'In the browser text actions are limited to tabs and forms, so here the Timeline acts as a reference section.';
      if (tlTextEmpty)
        tlTextEmpty.textContent = ru
          ? 'Пока нет недавней истории текста.'
          : 'No recent text history yet.';

      if (tlZkStatus) {
        // Базовый текст при смене языка; конкретное состояние подтягивается из опроса ZK-сессии
        tlZkStatus.textContent = ru ? 'ZK: проверка статуса…' : 'ZK: checking status…';
      }

      // Devices panel
      const devThisDeviceTitle = $('devThisDeviceTitle');
      const devThisDeviceText = $('devThisDeviceText');
      const devThisDeviceInfo = $('devThisDeviceInfo');
      const devHowLinkTitle = $('devHowLinkTitle');
      const devHowLinkText1 = $('devHowLinkText1');
      const devHowLinkText2 = $('devHowLinkText2');
      const devPinText = $('devPinText');
      const devPinHint = $('devPinHint');
      const devAcceptLabel = $('devAcceptLabel');
      const devLinkCode = $('devLinkCode');
      const btnDevLink = $('btnDevLink');
      const btnDevCreate = $('btnDevCreate');
      const devLinkStatus = $('devLinkStatus');

      if (devThisDeviceTitle)
        devThisDeviceTitle.textContent = ru ? 'Это устройство' : 'This device';
      if (devThisDeviceText)
        devThisDeviceText.textContent = ru
          ? 'Расширение браузера GetLifeUndo. Тип клиента: browser-extension.'
          : 'GetLifeUndo browser extension. Client type: browser-extension.';
      if (devThisDeviceInfo)
        devThisDeviceInfo.textContent = ru
          ? 'Устройство: —'
          : 'Device: —';

      if (devHowLinkTitle)
        devHowLinkTitle.textContent = ru ? 'Связать с другим устройством' : 'Link another device';
      if (devHowLinkText1)
        devHowLinkText1.textContent = ru
          ? 'Связать это устройство с другим по коду.'
          : 'Link this device with another using a code.';
      if (devHowLinkText2)
        devHowLinkText2.textContent = ru
          ? 'На этом устройстве можно показать код, а на втором — ввести его. После успешной связки код станет недействительным.'
          : 'On this device you can show a code and on the second one enter it. After a successful link the code becomes invalid.';

      if (devPinText)
        devPinText.textContent = 'PIN:';
      if (devPinHint)
        devPinHint.textContent = ru
          ? 'Код сгенерирован. Введите его на втором устройстве в течение 15 минут. После успешной связки код станет недействительным.'
          : 'Code generated. Enter it on the second device within 15 minutes. After a successful link the code becomes invalid.';
      if (devAcceptLabel)
        devAcceptLabel.textContent = ru
          ? 'У меня уже есть код другого устройства:'
          : 'I already have a code from another device:';

      if (devLinkCode)
        devLinkCode.placeholder = 'XXXX-XXXX';
      if (btnDevLink)
        btnDevLink.textContent = ru ? 'Подтвердить код' : 'Confirm code';
      if (btnDevCreate)
        btnDevCreate.textContent = ru ? 'Показать код' : 'Show code';
      if (devLinkStatus)
        devLinkStatus.textContent = '';
    }
  }
}

let timelineTabItems = [];

// Обновляет блок "Вкладки" в Ленте на основе недавно закрытых вкладок браузера
function refreshTimelineTabs() {
  const listEl = $('tlTabsList');
  const emptyEl = $('tlTabsEmpty');
  const btnAll = $('tlTabsRestoreAll');
  const btnSel = $('tlTabsRestoreSelected');

  if (!listEl) return;

  listEl.innerHTML = '';
  timelineTabItems = [];

  const disableButtons = () => {
    if (btnAll) btnAll.disabled = true;
    if (btnSel) btnSel.disabled = true;
  };

  disableButtons();

  try {
    const s = api && api.sessions;
    if (!s || typeof s.getRecentlyClosed !== 'function') {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    s.getRecentlyClosed({ maxResults: 20 }, (items) => {
      const sessions = Array.isArray(items) ? items : [];

      if (!sessions.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';
      if (btnAll) btnAll.disabled = false;
      if (btnSel) btnSel.disabled = false;

      sessions.forEach((session) => {
        const t = session.tab;
        if (!t || !t.url) return;

        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'flex-start';
        li.style.gap = '6px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginTop = '2px';
        li.appendChild(checkbox);

        const col = document.createElement('div');
        col.style.display = 'flex';
        col.style.flexDirection = 'column';
        col.style.cursor = 'pointer';

        const title = document.createElement('span');
        const host = getHostFromUrl(t.url);
        title.textContent = t.title || host || t.url;
        col.appendChild(title);

        const urlLine = document.createElement('span');
        urlLine.textContent = host;
        urlLine.style.fontSize = '11px';
        urlLine.style.color = '#9ca3af';
        col.appendChild(urlLine);

        col.addEventListener('click', () => {
          try {
            if (session.sessionId) {
              api.sessions.restore(session.sessionId, () => {});
            } else if (t.sessionId) {
              api.sessions.restore(t.sessionId, () => {});
            }
          } catch (e) {}
        });

        li.appendChild(col);
        listEl.appendChild(li);

        timelineTabItems.push({ session, tab: t, checkbox });
      });
    });
  } catch (e) {
    if (emptyEl) emptyEl.style.display = 'block';
  }
}

function bindAppsAboutTeam() {
  // Apps — QR/ссылки
  const btnDesktopShare = $('btnAppsDesktopShare');
  if (btnDesktopShare) {
    btnDesktopShare.addEventListener('click', () => {
      const url = 'https://getlifeundo.com/ru/downloads';
      try {
        navigator.clipboard.writeText(url).then(
          () => {
            alert(
              currentLang === 'ru'
                ? 'Ссылка на загрузки скопирована в буфер обмена.'
                : 'Downloads link copied to clipboard.'
            );
          },
          () => {
            try {
              api.tabs.create({ url });
            } catch (e) {
              window.open(url, '_blank');
            }
          }
        ).catch((e) => {
          try {
            api.tabs.create({ url });
          } catch (e2) {
            window.open(url, '_blank');
          }
        });
      } catch (e) {}
    });
  }

  const btnTeamAdmin = $('btnTeamAdmin');
  if (btnTeamAdmin) {
    btnTeamAdmin.addEventListener('click', () => {
      const url = 'https://getlifeundo.com/admin';
      try {
        api.tabs.create({ url });
      } catch (e) {
        window.open(url, '_blank');
      }
    });
  }

  // About — соцсети / магазины / действия
  const openUrl = (id, url) => {
    const btn = $(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      try {
        api.tabs.create({ url });
      } catch (e) {
        window.open(url, '_blank');
      }
    });
  };

  openUrl('btnAboutTelegram', 'https://t.me/getlifeundo');
  openUrl('btnAboutVK', 'https://vk.ru/GetLifeUndo');
  openUrl('btnAboutX', 'https://x.com/getlifeundo');
  openUrl('btnAboutYouTube', 'https://youtube.com/@getlifeundo');
  openUrl('btnAboutFirefox', 'https://addons.mozilla.org');
  openUrl('btnAboutRuStore', 'https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app');
  openUrl('btnAboutGitHub', 'https://github.com/LifeUndo');

  const btnShare = $('btnAboutShare');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const url = 'https://getlifeundo.com';
      try {
        const n = navigator;
        if (n && typeof n.share === 'function') {
          n.share({ title: 'GetLifeUndo', url }).catch(() => {});
          return;
        }
      } catch (e) {}

      try {
        navigator.clipboard.writeText(url).then(
          () => {
            alert(
              currentLang === 'ru'
                ? 'Ссылка на сайт скопирована в буфер обмена.'
                : 'Website link copied to clipboard.'
            );
          },
          () => {
            try {
              api.tabs.create({ url });
            } catch (e) {
              window.open(url, '_blank');
            }
          }
        );
      } catch (e) {
        try {
          api.tabs.create({ url });
        } catch (e2) {
          window.open(url, '_blank');
        }
      }
    });
  }

  const btnRate = $('btnAboutRate');
  if (btnRate) {
    btnRate.addEventListener('click', () => {
      const url = 'https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app';
      try {
        api.tabs.create({ url });
      } catch (e) {
        window.open(url, '_blank');
      }
    });
  }
}

function bindDevicesPanel() {
  const codeInput = $('devLinkCode');
  const btnLink = $('btnDevLink');
  const btnCreate = $('btnDevCreate');
  const statusEl = $('devLinkStatus');
  const pinTextEl = $('devPinText');
  const pinHintEl = $('devPinHint');
  const infoEl = $('devThisDeviceInfo');
  if (!codeInput || !btnLink) return;

  // гарантированно инициализировать deviceId и показать его
  try {
    const rt = api && api.runtime;
    if (rt && typeof rt.sendMessage === 'function') {
      rt.sendMessage({ type: 'LU_GET_DEVICE_ID', payload: {} }, (resp) => {
        const devId = resp && resp.ok && resp.deviceId ? String(resp.deviceId) : '';
        if (infoEl && devId) {
          const shortId = devId.length > 48 ? `${devId.slice(0, 24)}…${devId.slice(-12)}` : devId;
          infoEl.textContent = currentLang === 'ru'
            ? `Устройство: ${shortId}`
            : `Device: ${shortId}`;
        }
      });
    }
  } catch (e) {}

  // показать текущий статус устройства, если есть
  try {
    api.storage.local.get({ lu_device_info_ext: null }, (res) => {
      const info = res && res.lu_device_info_ext;
      if (!info) return;

      const status = info.status;
      const license = info.licenseLevel || null;
      if (status === 'initiator' && info.lastPin) {
        const pin = info.lastPin;
        const exp = info.lastPinExpiresAt ? new Date(info.lastPinExpiresAt) : null;
        const expStr = exp && !isNaN(exp.getTime()) ? exp.toLocaleTimeString() : '';
        if (pinTextEl) pinTextEl.textContent = `PIN: ${pin}`;
        if (pinHintEl) {
          const base = currentLang === 'ru'
            ? 'Код сгенерирован. Введите его на втором устройстве в течение 15 минут. После успешной связки код станет недействительным.'
            : 'Code generated. Enter it on the second device within 15 minutes. After a successful link the code becomes invalid.';
          pinHintEl.textContent = expStr ? `${base} (${expStr})` : base;
        }
      } else if (status === 'linked') {
        const base = currentLang === 'ru'
          ? 'Устройства успешно связаны.'
          : 'Devices are now linked.';
        if (license) {
          statusEl.textContent = `${base} ${currentLang === 'ru' ? `Уровень лицензии: ${license}.` : `License level: ${license}.`}`;
        } else {
          statusEl.textContent = base;
        }
      }
    });
  } catch (e) {}

  let busyLink = false;
  let busyCreate = false;

  // Активировать код (ввести PIN)
  btnLink.addEventListener('click', () => {
    if (busyLink) return;
    const code = (codeInput.value || '').trim();
    if (!code) {
      alert(currentLang === 'ru' ? 'Введите код привязки.' : 'Please enter a pairing code.');
      return;
    }

    busyLink = true;
    const originalText = btnLink.textContent || '';
    btnLink.disabled = true;
    btnLink.textContent = currentLang === 'ru' ? 'Подключаем…' : 'Linking…';

    try {
      const rt = api && api.runtime;
      if (!rt || typeof rt.sendMessage !== 'function') {
        btnLink.disabled = false;
        btnLink.textContent = originalText;
        busyLink = false;
        alert(currentLang === 'ru' ? 'Не удалось связаться с фоновым процессом.' : 'Failed to reach background script.');
        return;
      }

      rt.sendMessage({ type: 'LU_LINK_DEVICE_WITH_CODE', payload: { code } }, (res) => {
        btnLink.disabled = false;
        btnLink.textContent = originalText;
        busyLink = false;

        if (!res || !res.ok) {
          const msg = (res && res.message) || (currentLang === 'ru' ? 'Не удалось подтвердить код.' : 'Failed to confirm code.');
          alert(msg);
          return;
        }

        codeInput.value = '';
        if (statusEl) {
          const license = res.licenseLevel || null;
          const base = currentLang === 'ru'
            ? 'Устройства успешно связаны.'
            : 'Devices are now linked.';
          if (license) {
            statusEl.textContent = `${base} ${currentLang === 'ru' ? `Уровень лицензии: ${license}.` : `License level: ${license}.`}`;
          } else {
            statusEl.textContent = base;
          }
        }
      });
    } catch (e) {
      btnLink.disabled = false;
      btnLink.textContent = originalText;
      busyLink = false;
      alert(currentLang === 'ru' ? 'Ошибка при привязке устройства.' : 'Error while linking device.');
    }
  });

  // Создать код активации (мы — инициатор)
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      if (busyCreate) return;

      busyCreate = true;
      const originalText = btnCreate.textContent || '';
      btnCreate.disabled = true;
      btnCreate.textContent = currentLang === 'ru' ? 'Создаём…' : 'Creating…';

      try {
        const rt = api && api.runtime;
        if (!rt || typeof rt.sendMessage !== 'function') {
          btnCreate.disabled = false;
          btnCreate.textContent = originalText;
          busyCreate = false;
          alert(currentLang === 'ru' ? 'Не удалось связаться с фоновым процессом.' : 'Failed to reach background script.');
          return;
        }

        rt.sendMessage({ type: 'LU_CREATE_PAIR_CODE', payload: {} }, (res) => {
          btnCreate.disabled = false;
          btnCreate.textContent = originalText;
          busyCreate = false;

          if (!res || !res.ok) {
            const msg = (res && res.message) || (currentLang === 'ru' ? 'Не удалось создать код.' : 'Failed to create code.');
            alert(msg);
            return;
          }

          const pin = res.shortCode || '';
          let expStr = '';
          if (res.expiresAt) {
            const d = new Date(res.expiresAt);
            if (!isNaN(d.getTime())) {
              expStr = d.toLocaleTimeString();
            }
          }
          if (pinTextEl) pinTextEl.textContent = `PIN: ${pin}`;
          if (pinHintEl) {
            const base = currentLang === 'ru'
              ? 'Код сгенерирован. Введите его на втором устройстве в течение 15 минут. После успешной связки код станет недействительным.'
              : 'Code generated. Enter it on the second device within 15 minutes. After a successful link the code becomes invalid.';
            pinHintEl.textContent = expStr ? `${base} (${expStr})` : base;
          }
        });
      } catch (e) {
        btnCreate.disabled = false;
        btnCreate.textContent = originalText;
        busyCreate = false;
        alert(currentLang === 'ru' ? 'Ошибка при создании кода.' : 'Error while creating code.');
      }
    });
  }
}

function openUrl(url) {
  try {
    api.tabs.create({ url });
  } catch (e) {
    window.open(url, '_blank');
  }
}

function bindFooter() {
  const map = {
    ftSite: 'https://getlifeundo.com',
    ftGitHub: 'https://github.com/LifeUndo',
    ftPrivacy: 'https://getlifeundo.com/ru/privacy',
    ftOffer: 'https://getlifeundo.com/ru/offer'
  };

  Object.keys(map).forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener('click', () => openUrl(map[id]));
  });
}

function bindSettingsTabs() {
  const overlay = $('settingsOverlay');
  const btnGear = document.getElementById('btnGear');
  const btnBack = $('stBack');
  const titleEl = $('stTitle');
  const buttons = Array.from(document.querySelectorAll('.settings-tab-btn'));
  const sections = Array.from(document.querySelectorAll('.settings-section'));

  if (btnGear && overlay) {
    btnGear.addEventListener('click', () => {
      overlay.classList.add('open');
      document.body.classList.add('settings-open');
      if (titleEl) titleEl.textContent = currentLang === 'ru' ? 'Настройки' : 'Settings';
    });
  }

  if (btnBack && overlay) {
    btnBack.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.classList.remove('settings-open');
      buttons.forEach((b) => b.classList.remove('active'));
      sections.forEach((s) => s.classList.remove('active'));
      if (titleEl) titleEl.textContent = currentLang === 'ru' ? 'Настройки' : 'Settings';
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      sections.forEach((s) => s.classList.remove('active'));
      if (tab) {
        const panelId = 'stPanel' + tab.charAt(0).toUpperCase() + tab.slice(1);
        const panel = $(panelId);
        if (panel) panel.classList.add('active');

        if (tab === 'activity') {
          try {
            if (typeof refreshTimelineAll === 'function') refreshTimelineAll();
          } catch (e) {}
          try {
            if (typeof refreshTimelineTabs === 'function') refreshTimelineTabs();
          } catch (e) {}
          try {
            if (typeof refreshTimelineTabHistory === 'function') refreshTimelineTabHistory();
          } catch (e) {}
          try {
            if (typeof refreshTimelineText === 'function') refreshTimelineText();
          } catch (e) {}
          try {
            if (typeof refreshTimelineScreens === 'function') refreshTimelineScreens();
          } catch (e) {}
        }
      }

      if (titleEl) {
        const txt = btn.textContent && btn.textContent.trim();
        titleEl.textContent = txt || (currentLang === 'ru' ? 'Настройки' : 'Settings');
      }
    });
  });
}

function initVersionAndTrial() {
  try {
    const manifest = api && api.runtime && api.runtime.getManifest ? api.runtime.getManifest() : null;
    const v = manifest && manifest.version ? manifest.version : '';
    const verEl = $('ppVersion');
    if (verEl) verEl.textContent = v ? `v${v}` : 'v0.0.0';
  } catch (e) {}

  // trialState может быть заполнен позже из storage; сейчас просто отрисуем капсулу
  renderTrialCapsule();
}

function bindGeneralSettings() {
  const langSelect = $('stGenLang');
  const emailInput = $('stGenEmail');
  const emailBtn = $('stGenEmailSave');
  const btnShowHere = $('stGenShowHere');
  const btnShots = $('stGenShots');
  const btnVideo = $('stGenVideo');
  const btnEvent = $('stGenEvent');

  // инициализация языка и email из chrome.storage.local
  try {
    api.storage.local.get({ lu_settings_ext: {}, lu_accountEmail: '' }, (res) => {
      const st = res.lu_settings_ext || {};

      if (st.lang === 'en' || st.lang === 'ru') {
        currentLang = st.lang;
      }
      if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', () => {
          currentLang = langSelect.value === 'en' ? 'en' : 'ru';
          api.storage.local.set({
            lu_settings_ext: { ...st, lang: currentLang }
          });
          try {
            localStorage.setItem('lu_lang', currentLang);
          } catch (e) {}
          applyLang();
        });
      }

      const savedEmail = res.lu_accountEmail || '';
      if (emailInput) emailInput.value = savedEmail;

      if (btnShowHere) {
        btnShowHere.checked = !!st.showListHere;
      }
      if (btnShots) {
        btnShots.checked = !!st.shotsEnabled;
      }
      if (btnVideo) {
        btnVideo.checked = !!st.videoEnabled;
      }
      if (btnEvent) {
        btnEvent.checked = !!st.eventMode;
      }
    });
  } catch (e) {}

  if (emailBtn && emailInput) {
    emailBtn.addEventListener('click', () => {
      const val = emailInput.value.trim();
      try {
        api.storage.local.set({ lu_accountEmail: val });
      } catch (e) {}
    });
  }
}

function bindSubscriptionActions() {
  const btnPortal = $('btnSubPortal');
  const btnStatus = $('btnSubStatus');
  const btnPro = $('btnSubPro');
  const btnVip = $('btnSubVip');
  const btnTeam = $('btnSubTeam');

  if (btnPortal) {
    btnPortal.addEventListener('click', () => {
      const url = 'https://getlifeundo.com/account';
      openUrl(url);
    });
  }

  if (btnStatus) {
    btnStatus.addEventListener('click', () => {
      const url = 'https://getlifeundo.com/account';
      openUrl(url);
    });
  }

  const goPlan = (plan) => {
    const locale = currentLang === 'ru' ? 'ru' : 'en';
    try {
      const rt = api && api.runtime;
      if (!rt || typeof rt.sendMessage !== 'function') {
        const base = 'https://getlifeundo.com/account';
        const url = `${base}?plan=${encodeURIComponent(plan)}`;
        openUrl(url);
        return;
      }

      rt.sendMessage({ type: 'LU_CREATE_PAYMENT', payload: { plan, locale } }, (res) => {
        if (!res || !res.ok || !res.payUrl) {
          const msg = (res && res.message) || (currentLang === 'ru'
            ? 'Не удалось создать платёж.'
            : 'Failed to create payment.');
          alert(msg);
          return;
        }

        const payUrl = String(res.payUrl);
        try {
          api.tabs.create({ url: payUrl });
        } catch (e) {
          try {
            window.open(payUrl, '_blank');
          } catch (_) {}
        }
      });
    } catch (e) {}
  };

  if (btnPro) {
    btnPro.addEventListener('click', () => goPlan('pro_month'));
  }
  if (btnVip) {
    btnVip.addEventListener('click', () => goPlan('vip_lifetime'));
  }
  if (btnTeam) {
    btnTeam.addEventListener('click', () => goPlan('team_5'));
  }
}

(function init() {
  bindLang();
  bindSettingsTabs();
  bindFooter();
  initVersionAndTrial();
  bindGeneralSettings();
  bindSubscriptionActions();
  bindAppsAboutTeam();
  bindDevicesPanel();
  initZkStatusPolling();

  applyLang();
})();

function refreshTimelineScreens() {
  const listEl = $('tlShotsList');
  const emptyEl = $('tlShotsEmpty');
  if (!listEl) return;

  listEl.innerHTML = '';

  try {
    const rt = api && api.runtime;
    if (!rt || typeof rt.sendMessage !== 'function') {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    rt.sendMessage({ type: 'LU_GET_SCREENSHOTS' }, (res) => {
      const list = (res && res.list && Array.isArray(res.list)) ? res.list : [];

      if (!list.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      list.forEach((item, index) => {
        if (!item || !item.dataUrl) return;

        const root = document.createElement('div');
        root.style.display = 'flex';
        root.style.flexDirection = 'column';
        root.style.gap = '2px';

        const wrap = document.createElement('div');
        wrap.style.width = '80px';
        wrap.style.height = '50px';
        wrap.style.overflow = 'hidden';
        wrap.style.borderRadius = '4px';
        wrap.style.border = '1px solid rgba(148,163,184,0.5)';
        wrap.style.position = 'relative';
        wrap.style.cursor = 'pointer';
        wrap.style.backgroundColor = '#020617';

        const img = document.createElement('img');
        img.src = item.dataUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        const openImage = () => {
          try {
            const w = window.open();
            if (w && w.document) {
              const im = w.document.createElement('img');
              im.src = item.dataUrl;
              im.style.maxWidth = '100%';
              im.style.height = 'auto';
              w.document.body.style.margin = '0';
              w.document.body.style.backgroundColor = '#000';
              w.document.body.appendChild(im);
            }
          } catch (e) {}
        };

        img.addEventListener('click', openImage);

        const del = document.createElement('button');
        del.textContent = '?';
        del.style.position = 'absolute';
        del.style.top = '2px';
        del.style.right = '2px';
        del.style.width = '16px';
        del.style.height = '16px';
        del.style.border = 'none';
        del.style.borderRadius = '999px';
        del.style.padding = '0';
        del.style.fontSize = '11px';
        del.style.lineHeight = '16px';
        del.style.cursor = 'pointer';
        del.style.backgroundColor = 'rgba(15,23,42,0.8)';
        del.style.color = '#e5e7eb';

        del.addEventListener('click', (ev) => {
          ev.stopPropagation();
          try {
            rt.sendMessage({ type: 'LU_DELETE_SCREENSHOT', payload: { index } }, () => {
              refreshTimelineScreens();
            });
          } catch (e) {}
        });

        wrap.appendChild(img);
        wrap.appendChild(del);

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '4px';

        const btnImg = document.createElement('button');
        btnImg.type = 'button';
        btnImg.textContent = currentLang === 'ru' ? 'Открыть картинку' : 'Open image';
        btnImg.style.border = 'none';
        btnImg.style.background = 'transparent';
        btnImg.style.color = '#9ca3af';
        btnImg.style.fontSize = '10px';
        btnImg.style.cursor = 'pointer';
        btnImg.addEventListener('click', (ev) => {
          ev.stopPropagation();
          openImage();
        });

        const btnPage = document.createElement('button');
        btnPage.type = 'button';
        btnPage.textContent = currentLang === 'ru' ? 'Открыть вкладку' : 'Open page';
        btnPage.style.border = 'none';
        btnPage.style.background = 'transparent';
        btnPage.style.color = '#9ca3af';
        btnPage.style.fontSize = '10px';
        btnPage.style.cursor = item.url ? 'pointer' : 'default';
        btnPage.disabled = !item.url;
        btnPage.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (!item.url) return;
          try {
            api.tabs.create({ url: item.url });
          } catch (e) {
            try {
              window.open(item.url, '_blank');
            } catch (_) {}
          }
        });

        actions.appendChild(btnImg);
        actions.appendChild(btnPage);

        root.appendChild(wrap);
        root.appendChild(actions);
        listEl.appendChild(root);
      });
    });
  } catch (e) {
    if (emptyEl) emptyEl.style.display = 'block';
  }
}

function bindTimelineScreenshots() {
  const btn = $('tlShotCapture');
  if (!btn) return;

  let busy = false;

  btn.addEventListener('click', () => {
    if (busy) return;
    busy = true;

    const originalText = btn.textContent || '';
    btn.disabled = true;
    btn.textContent = currentLang === 'ru' ? 'Сохраняем…' : 'Saving…';

    try {
      const rt = api && api.runtime;
      if (!rt || typeof rt.sendMessage !== 'function') {
        btn.disabled = false;
        btn.textContent = originalText;
        busy = false;
        alert(currentLang === 'ru' ? 'Не удалось сделать скриншот.' : 'Failed to capture screenshot.');
        return;
      }

      rt.sendMessage({ type: 'LU_TAKE_SCREENSHOT' }, (res) => {
        btn.disabled = false;
        btn.textContent = originalText;
        busy = false;

        if (!res || !res.ok) {
          alert(currentLang === 'ru' ? 'Не удалось сделать скриншот.' : 'Failed to capture screenshot.');
          return;
        }

        refreshTimelineScreens();
      });
    } catch (e) {
      btn.disabled = false;
      btn.textContent = originalText;
      busy = false;
      alert(currentLang === 'ru' ? 'Ошибка при создании скриншота.' : 'Error while capturing screenshot.');
    }
  });
}

function refreshTimelineSnapshots() {
  const listEl = $('tlSnapList');
  const emptyEl = $('tlSnapEmpty');
  if (!listEl) return;

  listEl.innerHTML = '';

  try {
    const rt = api && api.runtime;
    if (!rt || typeof rt.sendMessage !== 'function') {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    rt.sendMessage({ type: 'LU_GET_STATE' }, (res) => {
      const data = res && res.data;
      const snaps = data && Array.isArray(data.lu_page_snapshots || data.pageSnapshots)
        ? (data.lu_page_snapshots || data.pageSnapshots)
        : [];

      if (!snaps.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      snaps.forEach((s) => {
        if (!s) return;

        const li = document.createElement('li');

        const title = document.createElement('div');
        title.style.fontWeight = '500';
        const host = getHostFromUrl(s.url || '');
        title.textContent = s.title || host || (s.url || '');

        const meta = document.createElement('div');
        meta.style.fontSize = '11px';
        meta.style.color = '#9ca3af';
        const parts = [];
        if (host) parts.push(host);
        const ts = s.createdAt || s.ts;
        if (ts) {
          try {
            const d = new Date(ts);
            parts.push(d.toLocaleString());
          } catch (e) {}
        }
        if (s.size) {
          const kb = Math.round(Number(s.size) / 1024);
          parts.push((currentLang === 'ru' ? `${kb} КБ` : `${kb} KB`));
        }
        meta.textContent = parts.join(' • ');

        const actions = document.createElement('div');
        actions.style.marginTop = '4px';

        const btnOpen = document.createElement('button');
        btnOpen.type = 'button';
        btnOpen.textContent = currentLang === 'ru' ? 'Открыть снапшот' : 'Open snapshot';
        btnOpen.style.border = 'none';
        btnOpen.style.background = 'transparent';
        btnOpen.style.color = '#60a5fa';
        btnOpen.style.fontSize = '10px';
        btnOpen.style.cursor = 'pointer';

        btnOpen.addEventListener('click', () => {
          try {
            const html = s.meta && s.meta.html ? String(s.meta.html) : '';
            if (!html) return;
            const w = window.open();
            if (w && w.document) {
              w.document.open();
              w.document.write(html);
              w.document.close();
            }
          } catch (e) {}
        });

        actions.appendChild(btnOpen);

        li.appendChild(title);
        li.appendChild(meta);
        li.appendChild(actions);

        listEl.appendChild(li);
      });
    });
  } catch (e) {
    if (emptyEl) emptyEl.style.display = 'block';
  }
}

function bindTimelineSnapshots() {
  const btn = $('tlSnapCapture');
  if (!btn) return;

  let busy = false;

  btn.addEventListener('click', () => {
    if (busy) return;
    busy = true;

    const originalText = btn.textContent || '';
    btn.disabled = true;
    btn.textContent = currentLang === 'ru' ? 'Сохраняем…' : 'Saving…';

    try {
      const bt = api && api.tabs;
      if (!bt || typeof bt.query !== 'function' || typeof api.runtime?.sendMessage !== 'function') {
        btn.disabled = false;
        btn.textContent = originalText;
        busy = false;
        alert(currentLang === 'ru' ? 'Не удалось сохранить страницу.' : 'Failed to save page.');
        return;
      }

      bt.query({ active: true, currentWindow: true }, (tabs) => {
        const t = Array.isArray(tabs) && tabs[0] ? tabs[0] : null;
        if (!t || !t.id) {
          btn.disabled = false;
          btn.textContent = originalText;
          busy = false;
          alert(currentLang === 'ru' ? 'Нет активной вкладки.' : 'No active tab.');
          return;
        }

        try {
          api.tabs.sendMessage(t.id, { type: 'LU_CAPTURE_PAGE_SNAPSHOT' }, () => {
            // после того как контент‑скрипт отправит HTML в background, обновим список
            setTimeout(() => {
              refreshTimelineSnapshots();
              btn.disabled = false;
              btn.textContent = originalText;
              busy = false;
            }, 200);
          });
        } catch (e) {
          btn.disabled = false;
          btn.textContent = originalText;
          busy = false;
          alert(currentLang === 'ru' ? 'Ошибка при сохранении страницы.' : 'Error while saving page.');
        }
      });
    } catch (e) {
      btn.disabled = false;
      btn.textContent = originalText;
      busy = false;
      alert(currentLang === 'ru' ? 'Ошибка при сохранении страницы.' : 'Error while saving page.');
    }
  });
}

(function initTimelineScreenshots() {
  try {
    bindTimelineScreenshots();
    refreshTimelineScreens();
  } catch (e) {}
})();

(function initTimelineSnapshots() {
  try {
    bindTimelineSnapshots();
    refreshTimelineSnapshots();
  } catch (e) {}
})();
