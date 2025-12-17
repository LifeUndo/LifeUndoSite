// LifeUndo Extension — Options page in Mesh / TEAM style, aligned with Windows GOLD

(function () {
  const api = window.browser || window.chrome;

  // ==== DOM helpers ====

  const $ = (id) => document.getElementById(id);

  function setFlash(el, msg, type = '') {
    if (!el) return;
    el.textContent = msg || '';
    el.className = type ? `flash ${type}` : 'flash';
  }

  // ==== I18n (simple, EN/RU texts only for this page) ====

  let currentLang = 'en';

  const dict = {
    en: {
      subtitle: 'Mesh client for your browsing — unified with desktop TEAM.',
      headerStatus: 'Settings for this browser',
      settingsTitle: 'Settings',
      moreText: 'Additional sections will appear later.',
      menu: 'Menu',
      general: 'General',
      apps: 'Apps',
      sub: 'Subscription',
      team: 'TEAM',
      timeline: 'Activity',
      about: 'About',
      faq: 'FAQ',
      sidebarHint:
        'TEAM 5 — up to 5 devices with unified status across desktop, browsers and mobile.',
      generalTitle: 'General',
      generalSub: 'Language, visibility and event mode for this extension.',
      generalTag: 'Local only',
      lang: 'Language',
      langSub: 'Follows your choice here and in desktop client.',
      showHere: 'Show list here',
      showHereSub:
        'Recent tabs list opens directly in popup instead of mini‑drawer. Affects this browser only.',
      screens: 'Screenshots',
      screensSub:
        'Keep screenshot pipeline ready for desktop Mesh companion and future flows.',
      event: 'Event mode',
      eventSub:
        'Hide sensitive UI, show QR‑style views and keep undo data off screen during demos and events.',
      appsTitle: 'Apps and devices',
      appsSub: 'Install LifeUndo Mesh on desktop and mobile for full TEAM experience.',
      appsTag: 'Mesh family',
      appsBrowserTitle: 'Browser extensions',
      appsBrowserText:
        'Chromium and Firefox extensions share TEAM status and limits with your desktop client.',
      appsDesktopTitle: 'Windows desktop',
      appsDesktopText:
        'Full Mesh client with TEAM 5, device slots and admin console. Browser extensions follow its status.',
      appsAndroidTitle: 'Android',
      appsAndroidText:
        'Companion app for tabs, screenshots and clipboard on the go, connected to the same TEAM.',
      appsOtherTitle: 'Other platforms',
      appsOtherText:
        'iOS, macOS and Linux companions are planned. All will share TEAM 5 and the same backend.',
      appsOtherBadge: 'Roadmap',
      subTitle: 'Subscription',
      subSub: 'TEAM plan with 5 device slots and unified billing.',
      subTag: 'Billing on getlifeundo.com',
      subPlanTitle: 'Current plan',
      subPlanText:
        'Status and limits are managed by the same backend as your desktop client. Extension never stores billing data locally.',
      subManageTitle: 'Manage subscription',
      subManageText:
        'Use the account center to manage payment method, invoices, TEAM members and device slots.',
      teamTitle: 'TEAM and devices',
      teamSub: 'TEAM 5, device slots and admin tools shared with desktop Mesh.',
      teamTag: 'Backend‑driven',
      teamSlotsTitle: 'Device slots',
      teamSlotsText:
        'Desktop, laptop, work PC and browsers can live under the same TEAM. Slots are managed in admin panel, not inside extensions.',
      teamKeysTitle: 'License keys',
      teamKeysText:
        'Keys are issued for people or workstations. Backend maps them to TEAMS; this extension only sees final status.',
      teamAdminTitle: 'Admin console',
      teamAdminText:
        'Admin adds devices, rotates keys and reviews activity from the web panel. Extensions are lightweight Mesh clients.',
      teamPrivacyTitle: 'What stays local',
      teamPrivacyText:
        'Tabs, screenshots and text history are stored locally or on your desktop Mesh. TEAM backend only knows aggregate limits and status.',
      timelineTitle: 'Timeline & activity',
      timelineSub: 'Shortcuts and exports for tabs, screenshots and text history.',
      timelineTag: 'Local data',
      timelineTabsTitle: 'Tabs',
      timelineTabsText:
        'Open or export recently closed tabs. Desktop can reuse the same list for Mesh actions.',
      timelineTextTitle: 'Text',
      timelineTextText:
        'Recover last typed snippets, export history or clear it before presentations and events.',
      timelineScreensTitle: 'Screenshots',
      timelineScreensText:
        'Screenshot flow primarily lives in desktop Mesh; extension can trigger and list recent captures where supported.',
      timelineLogsTitle: 'Diagnostics',
      timelineLogsText:
        'Export minimal logs or stats when support asks, without sending private contents.',
      aboutTitle: 'About LifeUndo',
      aboutSub: 'Mesh client family — desktop, browsers and mobile — under one TEAM.',
      aboutTag: 'Version & links',
      aboutVersionTitle: 'Current build',
      aboutVersionText:
        'Extension version {v} follows the same line as Windows GOLD 0.6.1.2. Some Mesh features may appear earlier on desktop.',
      faqTitle: 'FAQ',
      faqSub: 'Short answers about TEAM, devices, privacy and Mesh behaviour.',
      faqTag: 'Same as desktop',
      faqQ1: 'What is TEAM 5?',
      faqA1:
        'TEAM 5 is a license with up to five devices in one TEAM: desktops, laptops and browsers. Extension receives a simple “team / free” status from backend and follows the same limits as desktop Mesh.',
      faqQ2: 'Where is my data stored?',
      faqA2:
        'By default, tabs, screenshots and text history are stored locally on your devices or in desktop Mesh, not in a central cloud. TEAM backend only manages licenses, device slots and billing.',
      faqQ3: 'How do desktop and extension stay in sync?',
      faqA3:
        'Both desktop client and extensions talk to the same backend for TEAM status and limits. When admin changes devices or TEAM plan, this extension refreshes its state automatically.',
      faqQ4: 'Can I use this extension without desktop?',
      faqA4:
        'Yes. You can run it in “local only” mode with undo for tabs and text. TEAM 5 and Mesh features unlock extra flows when desktop, mobile and extension work together.',
      zkTab: 'ZK',
      zkTitle: 'ZK / secure journal',
      zkSub:
        'Local encrypted ZK-TempMem for this browser profile. Master password protects debug view and exports.',
      zkTag: 'Local only',
      zkStatusTitle: 'Status',
      zkStatusText:
        'ZK master password gates access to the encrypted journal. Without it, entries stay on disk but cannot be inspected from UI.',
      zkCreateTitle: 'Create or change master password',
      zkCreateText:
        'Password is local to this browser profile. We store only SHA-256(password+salt). If you forget it, ZK contents cannot be recovered.',
      zkUnlockTitle: 'Unlock ZK session',
      zkUnlockText:
        'Enter your ZK master password to start a temporary session. During the session you can inspect recent ZK entries and export a .luzk snapshot.',
      zkEntriesTitle: 'Recent ZK entries',
      zkEntriesText:
        'After unlocking, you will see a short list of recent encrypted ZK entries (kind, time and short preview).',
      faqQ5: 'What is ZK-TempMem / local journals here?',
      faqA5:
        'On desktop and Android, ZK-TempMem is an encrypted local store for text and screenshots. The extension prepares local journals of tabs and text that the desktop Mesh client can later lift into its Timeline/ZK. Nothing is sent to the cloud by default.',
      faqQ6: 'What happens if I remove the browser or reset the profile?',
      faqA6:
        'Local history and journals live only inside this browser profile and on your desktop Mesh. If you remove the browser, clear the profile or wipe the machine, these local records cannot be restored. Cloud/TEAM only keep license and device metadata, not backups of your history.',
      // footer
      ftSite: 'Site',
      ftDownloads: 'Downloads',
      ftPrivacy: 'Privacy',
      ftOffer: 'Offer',
      ftGitHub: 'GitHub',
      // misc
      whatsNew: 'What’s new',
      releaseNotes: 'Release notes',
      openAccount: 'Open account',
      refreshStatus: 'Refresh status',
      flashStatusOk: 'Status refreshed.',
      flashStatusErr: 'Failed to refresh status. Try again later.',
      tlFlashTabs: 'Tabs action triggered from extension.',
      tlFlashText: 'Text action triggered from extension.',
      tlFlashScreens: 'Screenshot action triggered from extension.',
      tlFlashLogs: 'Logs action triggered from extension.'
    },
    ru: {
      subtitle: 'Mesh‑клиент для браузера — синхронен с десктопным TEAM.',
      headerStatus: 'Настройки этого браузера',
      settingsTitle: 'Настройки',
      moreText: 'Дополнительные разделы появятся позже.',
      menu: 'Меню',
      general: 'Настройки',
      apps: 'Приложения',
      sub: 'Подписка',
      team: 'TEAM',
      timeline: 'Активность',
      about: 'О нас',
      faq: 'FAQ',
      sidebarHint:
        'TEAM 5 — до 5 устройств с единым статусом между десктопом, браузерами и мобильными.',
      generalTitle: 'Общие',
      generalSub: 'Язык, отображение списка и режим мероприятия для этого расширения.',
      generalTag: 'Только локально',
      lang: 'Язык',
      langSub: 'Повторяет выбор здесь и в десктопном клиенте.',
      showHere: 'Показывать список здесь',
      showHereSub:
        'Список недавних вкладок открывается прямо в попапе вместо мини‑шторки. Влияет только на этот браузер.',
      screens: 'Скриншоты',
      screensSub:
        'Поддерживать готовность пайплайна скринов для десктопного Mesh‑клиента и будущих сценариев.',
      event: 'Режим мероприятия',
      eventSub:
        'Спрятать чувствительные элементы и показать QR‑виды на время демо/ивентов без вывода истории на экран.',
      appsTitle: 'Приложения и устройства',
      appsSub: 'Установите LifeUndo Mesh на десктоп и мобильные для полного TEAM‑опыта.',
      appsTag: 'Семейство Mesh',
      appsBrowserTitle: 'Браузерные расширения',
      appsBrowserText:
        'Расширения для Chromium и Firefox разделяют TEAM‑статус и лимиты с десктопным клиентом.',
      appsDesktopTitle: 'Десктоп Windows',
      appsDesktopText:
        'Полный Mesh‑клиент с TEAM 5, слотами устройств и админкой. Расширения просто следуют его статусу.',
      appsAndroidTitle: 'Android',
      appsAndroidText:
        'Компаньон для вкладок, скринов и буфера «на ходу», подключённый к тому же TEAM.',
      appsOtherTitle: 'Другие платформы',
      appsOtherText:
        'Компаньоны для iOS, macOS и Linux появятся позже. Все будут разделять TEAM 5 и один backend.',
      appsOtherBadge: 'Дорожная карта',
      subTitle: 'Подписка',
      subSub: 'TEAM‑план с 5 слотами устройств и единой биллинг‑системой.',
      subTag: 'Биллинг на getlifeundo.com',
      subPlanTitle: 'Текущий план',
      subPlanText:
        'Статус и лимиты управляются тем же backend, что и у десктопа. Расширение не хранит биллинг локально.',
      subManageTitle: 'Управление подпиской',
      subManageText:
        'Откройте аккаунт, чтобы управлять платежами, чеками, участниками TEAM и слотами устройств.',
      teamTitle: 'TEAM и устройства',
      teamSub: 'TEAM 5, слоты устройств и админ‑инструменты общие с десктопным Mesh.',
      teamTag: 'Управляется backend',
      teamSlotsTitle: 'Слоты устройств',
      teamSlotsText:
        'Десктоп, ноутбук, рабочий ПК и браузеры могут жить в одной TEAM. Слоты настраиваются в админке, не в расширениях.',
      teamKeysTitle: 'Лицензионные ключи',
      teamKeysText:
        'Ключи выдаются пользователям или рабочим местам. Backend мапит их на TEAM; расширения видят только итоговый статус.',
      teamAdminTitle: 'Админ‑консоль',
      teamAdminText:
        'Администратор добавляет устройства, меняет ключи и смотрит активность через веб‑панель. Расширение — лёгкий Mesh‑клиент.',
      teamPrivacyTitle: 'Что остаётся локально',
      teamPrivacyText:
        'Вкладки, скрины и история текста хранятся локально или в десктопном Mesh. TEAM‑backend знает только лимиты и статусы.',
      timelineTitle: 'Лента и активность',
      timelineSub: 'Шорткаты и экспорт по вкладкам, скринам и истории текста.',
      timelineTag: 'Локальные данные',
      timelineTabsTitle: 'Вкладки',
      timelineTabsText:
        'Открыть или экспортировать недавно закрытые вкладки. Десктоп может переиспользовать этот список в Mesh‑сценариях.',
      timelineTextTitle: 'Текст',
      timelineTextText:
        'Восстановить последние фрагменты текста, экспортировать историю или очистить её перед выступлением.',
      timelineScreensTitle: 'Скриншоты',
      timelineScreensText:
        'Пайплайн скринов живёт в десктопном Mesh; расширение может триггерить и показывать список там, где это поддержано.',
      timelineLogsTitle: 'Диагностика',
      timelineLogsText:
        'Экспортировать минимальные логи/статистику по запросу поддержки без пересылки содержимого.',
      aboutTitle: 'О LifeUndo',
      aboutSub: 'Семейство Mesh‑клиентов — десктоп, браузеры и мобильные — в одном TEAM.',
      aboutTag: 'Версия и ссылки',
      aboutVersionTitle: 'Текущая сборка',
      aboutVersionText:
        'Версия расширения {v} идёт в одной линии с Windows GOLD 0.6.1.2. Часть Mesh‑функций может появляться раньше на десктопе.',
      faqTitle: 'FAQ',
      faqSub: 'Короткие ответы про TEAM, устройства, приватность и поведение Mesh.',
      faqTag: 'Синхронно с десктопом',
      faqQ1: 'Что такое TEAM 5?',
      faqA1:
        'TEAM 5 — это лицензия до пяти устройств в одной TEAM: десктопы, ноутбуки и браузеры. Расширение получает простой статус «team / free» и следует тем же лимитам, что и десктоп.',
      faqQ2: 'Где хранятся мои данные?',
      faqA2:
        'По умолчанию вкладки, скриншоты и история текста хранятся локально на устройствах или в десктопном Mesh, а не в общем облаке. TEAM‑backend отвечает только за лицензии, устройства и биллинг.',
      faqQ3: 'Как десктоп и расширение остаются синхронными?',
      faqA3:
        'И десктоп, и расширения общаются с одним backend по TEAM‑статусу и лимитам. Когда админ меняет план или устройства, расширение обновляет своё состояние автоматически.',
      faqQ4: 'Можно ли использовать расширение без десктопа?',
      faqA4:
        'Да. Можно работать в «только локальном» режиме с отменой по вкладкам и тексту. TEAM 5 и Mesh‑фичи раскрываются полностью, когда вместе работают десктоп, мобильные и расширение.',
      zkTab: 'ZK',
      zkTitle: 'ZK / защищённый журнал',
      zkSub:
        'Локальное зашифрованное ZK‑хранилище (ZK‑TempMem) для этого профиля браузера. Мастер‑пароль защищает отладочный просмотр и экспорт.',
      zkTag: 'Только локально',
      zkStatusTitle: 'Статус',
      zkStatusText:
        'ZK‑мастер‑пароль ограничивает доступ к зашифрованному журналу. Без него записи остаются на диске, но не видны из интерфейса.',
      zkCreateTitle: 'Создать или сменить мастер‑пароль',
      zkCreateText:
        'Пароль локален для этого профиля браузера. В хранилище попадает только SHA‑256(пароль+salt). Если забыть пароль, содержимое ZK восстановить нельзя.',
      zkUnlockTitle: 'Разблокировать ZK‑сессию',
      zkUnlockText:
        'Введите ZK‑мастер‑пароль, чтобы запустить временную сессию. В течение сессии можно просмотреть последние записи ZK и сделать экспорт .luzk.',
      zkEntriesTitle: 'Последние ZK‑записи',
      zkEntriesText:
        'После разблокировки здесь появится короткий список последних ZK‑записей (тип, время и краткий превью).',
      faqQ5: 'Что такое ZK‑TempMem и локальные журналы в браузере?',
      faqA5:
        'На десктопе и Android ZK‑TempMem — это локальное зашифрованное хранилище текста и скринов. Браузерное расширение готовит локальные журналы вкладок и текста, которые десктопный Mesh позже может поднять в свою Ленту/ZK. По умолчанию ничего не уходит в облако.',
      faqQ6: 'Что будет с данными, если удалить браузер или сбросить профиль?',
      faqA6:
        'Локальная история и журналы живут только внутри этого профиля браузера и на вашем десктопном Mesh. Если удалить браузер, очистить профиль или обнулить машину, эти записи восстановить нельзя. Cloud/TEAM хранят только лицензию и метаданные устройств, а не резервные копии истории.',
      ftSite: 'Сайт',
      ftDownloads: 'Загрузки',
      ftPrivacy: 'Приватность',
      ftOffer: 'Оферта',
      ftGitHub: 'GitHub',
      whatsNew: 'Что нового',
      releaseNotes: 'Список изменений',
      openAccount: 'Открыть аккаунт',
      refreshStatus: 'Обновить статус',
      flashStatusOk: 'Статус обновлён.',
      flashStatusErr: 'Не удалось обновить статус. Попробуйте позже.',
      tlFlashTabs: 'Действие по вкладкам выполнено из расширения.',
      tlFlashText: 'Действие по тексту выполнено из расширения.',
      tlFlashScreens: 'Действие по скринам выполнено из расширения.',
      tlFlashLogs: 'Действие по логам выполнено из расширения.'
    }
  };

  function tr(key) {
    const d = dict[currentLang] || dict.en;
    return d[key] || key;
  }

  // ==== State ====

  let settingsCache = {
    showHere: true,
    screens: true,
    eventMode: false,
    lang: 'auto'
  };

  // ==== UI binding ====

  function applyLanguage() {
    // Header
    const st = $('settingsTitle');
    if (st) st.textContent = tr('settingsTitle');
    $('menuTitle').textContent = tr('menu');
    $('tabGeneral').textContent = tr('general');
    $('tabApps').textContent = tr('apps');
    $('tabSub').textContent = tr('sub');
    $('tabTeam').textContent = tr('team');
    $('tabTimeline').textContent = tr('timeline');
    if ($('tabZk')) $('tabZk').textContent = tr('zkTab');
    $('tabAbout').textContent = tr('about');
    $('tabFaq').textContent = tr('faq');
    if ($('moreText')) $('moreText').textContent = tr('moreText');

    // General
    $('generalTitle').textContent = tr('generalTitle');
    $('generalSub').textContent = tr('generalSub');
    $('generalTag').textContent = tr('generalTag');
    $('lblLang').textContent = tr('lang');
    $('lblLangSub').textContent = tr('langSub');
    $('lblShowHere').textContent = tr('showHere');
    $('lblShowHereSub').textContent = tr('showHereSub');
    $('lblScreens').textContent = tr('screens');
    $('lblScreensSub').textContent = tr('screensSub');
    $('lblEvent').textContent = tr('event');
    $('lblEventSub').textContent = tr('eventSub');

    // Apps
    $('appsTitle').textContent = tr('appsTitle');
    $('appsSub').textContent = tr('appsSub');
    $('appsTag').textContent = tr('appsTag');
    $('appsBrowserTitle').textContent = tr('appsBrowserTitle');
    $('appsBrowserText').textContent = tr('appsBrowserText');
    $('appsDesktopTitle').textContent = tr('appsDesktopTitle');
    $('appsDesktopText').textContent = tr('appsDesktopText');
    $('appsAndroidTitle').textContent = tr('appsAndroidTitle');
    $('appsAndroidText').textContent = tr('appsAndroidText');
    $('appsOtherTitle').textContent = tr('appsOtherTitle');
    $('appsOtherText').textContent = tr('appsOtherText');
    $('appsOtherBadge').textContent = tr('appsOtherBadge');

    // Subscription
    $('subTitle').textContent = tr('subTitle');
    $('subSub').textContent = tr('subSub');
    $('subTag').textContent = tr('subTag');
    $('subPlanTitle').textContent = tr('subPlanTitle');
    $('subPlanText').textContent = tr('subPlanText');
    $('subManageTitle').textContent = tr('subManageTitle');
    $('subManageText').textContent = tr('subManageText');
    $('btnSubPortal').textContent = tr('openAccount');
    $('btnSubStatus').textContent = tr('refreshStatus');

    // TEAM
    $('teamTitle').textContent = tr('teamTitle');
    $('teamSub').textContent = tr('teamSub');
    $('teamTag').textContent = tr('teamTag');
    $('teamSlotsTitle').textContent = tr('teamSlotsTitle');
    $('teamSlotsText').textContent = tr('teamSlotsText');
    $('teamKeysTitle').textContent = tr('teamKeysTitle');
    $('teamKeysText').textContent = tr('teamKeysText');
    $('teamAdminTitle').textContent = tr('teamAdminTitle');
    $('teamAdminText').textContent = tr('teamAdminText');
    $('teamPrivacyTitle').textContent = tr('teamPrivacyTitle');
    $('teamPrivacyText').textContent = tr('teamPrivacyText');

    // Timeline
    $('timelineTitle').textContent = tr('timelineTitle');
    $('timelineSub').textContent = tr('timelineSub');
    $('timelineTag').textContent = tr('timelineTag');
    $('timelineTabsTitle').textContent = tr('timelineTabsTitle');
    $('timelineTabsText').textContent = tr('timelineTabsText');
    $('timelineTextTitle').textContent = tr('timelineTextTitle');
    $('timelineTextText').textContent = tr('timelineTextText');
    $('timelineScreensTitle').textContent = tr('timelineScreensTitle');
    $('timelineScreensText').textContent = tr('timelineScreensText');
    $('timelineLogsTitle').textContent = tr('timelineLogsTitle');
    $('timelineLogsText').textContent = tr('timelineLogsText');

    // About
    $('aboutTitle').textContent = tr('aboutTitle');
    $('aboutSub').textContent = tr('aboutSub');
    $('aboutTag').textContent = tr('aboutTag');
    $('aboutVersionTitle').textContent = tr('aboutVersionTitle');

    // ZK panel (if present)
    if ($('zkTitle')) {
      $('zkTitle').textContent = tr('zkTitle');
      $('zkSub').textContent = tr('zkSub');
      $('zkTag').textContent = tr('zkTag');
      $('zkStatusTitle').textContent = tr('zkStatusTitle');
      $('zkStatusText').textContent = tr('zkStatusText');
      $('zkCreateTitle').textContent = tr('zkCreateTitle');
      $('zkCreateText').textContent = tr('zkCreateText');
      $('zkUnlockTitle').textContent = tr('zkUnlockTitle');
      $('zkUnlockText').textContent = tr('zkUnlockText');
      $('zkEntriesTitle').textContent = tr('zkEntriesTitle');
      $('zkEntriesText').textContent = tr('zkEntriesText');
    }

    // FAQ
    $('faqTitle').textContent = tr('faqTitle');
    $('faqSub').textContent = tr('faqSub');
    $('faqTag').textContent = tr('faqTag');
    $('faqQ1').textContent = tr('faqQ1');
    $('faqA1').textContent = tr('faqA1');
    $('faqQ2').textContent = tr('faqQ2');
    $('faqA2').textContent = tr('faqA2');
    $('faqQ3').textContent = tr('faqQ3');
    $('faqA3').textContent = tr('faqA3');
    $('faqQ4').textContent = tr('faqQ4');
    $('faqA4').textContent = tr('faqA4');

    // Footer
    $('ftSite').textContent = tr('ftSite');
    $('ftPrivacy').textContent = tr('ftPrivacy');
    $('ftOffer').textContent = tr('ftOffer');
    $('ftGitHub').textContent = tr('ftGitHub');

    // Buttons with text already set above retain their structure.
    $('btnSubPortal').textContent = tr('openAccount');
    $('btnSubStatus').textContent = tr('refreshStatus');

    // Subscription plan buttons (PRO/VIP/TEAM) — RU/EN captions with prices
    const btnSubPro = $('btnSubPro');
    const btnSubVip = $('btnSubVip');
    const btnSubTeam = $('btnSubTeam');
    if (btnSubPro)
      btnSubPro.textContent =
        currentLang === 'ru' ? 'Оплатить — P599' : 'Pay — P599';
    if (btnSubVip)
      btnSubVip.textContent =
        currentLang === 'ru' ? 'Оплатить — P9990' : 'Pay — P9990';
    if (btnSubTeam)
      btnSubTeam.textContent =
        currentLang === 'ru' ? 'Оплатить — P2990' : 'Pay — P2990';

    // TEAM admin button
    const btnTeamAdmin = $('btnTeamAdmin');
    if (btnTeamAdmin)
      btnTeamAdmin.textContent =
        currentLang === 'ru' ? 'Открыть админ-панель' : 'Open admin console';

    // Apps section action buttons
    const btnAppsDesktopShare = $('btnAppsDesktopShare');
    if (btnAppsDesktopShare)
      btnAppsDesktopShare.textContent =
        currentLang === 'ru' ? 'Поделиться ссылкой' : 'Share link';
    const btnAppsRustore = $('btnAppsRustore');
    if (btnAppsRustore)
      btnAppsRustore.textContent =
        currentLang === 'ru' ? 'Открыть RuStore' : 'Open RuStore';
    const btnAppsApk = $('btnAppsApk');
    if (btnAppsApk)
      btnAppsApk.textContent =
        currentLang === 'ru' ? 'Открыть GitHub' : 'Open GitHub';

    // About section buttons (share / rate)
    const btnAboutShare = $('btnAboutShare');
    if (btnAboutShare)
      btnAboutShare.textContent =
        currentLang === 'ru' ? 'Поделиться' : 'Share';
    const btnAboutRate = $('btnAboutRate');
    if (btnAboutRate)
      btnAboutRate.textContent =
        currentLang === 'ru' ? 'Оценить' : 'Rate';

    // Lang pill
    const pill = $('pillLangCurrent');
    if (pill) {
      if (currentLang === 'ru') pill.textContent = 'Русский';
      else pill.textContent = 'English';
    }

    // Lang header buttons
    $('optLangEn').classList.toggle('active', currentLang === 'en');
    $('optLangRu').classList.toggle('active', currentLang === 'ru');
  }

  // ==== Tabs ====

  function bindTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (!tab) return;

        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-panel').forEach((p) => {
          p.classList.remove('active');
        });
        const panel = document.getElementById('panel' + tab[0].toUpperCase() + tab.slice(1));
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ==== Toggles ====

  function syncToggle(id, value) {
    const el = $(id);
    if (!el) return;
    el.classList.toggle('on', !!value);
  }

  function readSettingsAndApply() {
    try {
      api.storage.local.get(
        {
          lu_settings_ext: {
            showHere: true,
            screens: true,
            eventMode: false,
            lang: 'auto'
          },
          lu_plan: 'free'
        },
        (res) => {
          const st = res.lu_settings_ext || {};
          settingsCache = {
            showHere: !!st.showHere,
            screens: st.screens !== false,
            eventMode: !!st.eventMode,
            lang: st.lang || 'auto'
          };

          // language – take stored or fallback to currentLang
          if (settingsCache.lang === 'ru') currentLang = 'ru';
          else if (settingsCache.lang === 'en') currentLang = 'en';

          syncToggle('tgShowHere', settingsCache.showHere);
          syncToggle('tgScreens', settingsCache.screens);
          syncToggle('tgEvent', settingsCache.eventMode);

          // plan badge
          const plan = res.lu_plan || 'free';
          const planEl = $('optPlan');
          if (planEl) {
            if (plan === 'team') {
              planEl.textContent = 'TEAM';
              planEl.classList.add('capsule-team');
            } else {
              planEl.textContent = 'Free';
              planEl.classList.remove('capsule-team');
            }
          }

          applyLanguage();
        }
      );
    } catch (e) {
      applyLanguage();
    }
  }

  function saveSettings(patch) {
    settingsCache = { ...settingsCache, ...patch };
    try {
      api.storage.local.get(
        {
          lu_settings_ext: {
            showHere: true,
            screens: true,
            eventMode: false,
            lang: 'auto'
          }
        },
        (res) => {
          const base = res.lu_settings_ext || {};
          const next = {
            ...base,
            showHere: settingsCache.showHere,
            screens: settingsCache.screens,
            eventMode: settingsCache.eventMode,
            lang: settingsCache.lang
          };
          api.storage.local.set({ lu_settings_ext: next });
        }
      );
    } catch (e) {
      // ignore errors
    }
  }

  function bindToggles() {
    const tgShowHere = $('tgShowHere');
    const tgScreens = $('tgScreens');
    const tgEvent = $('tgEvent');

    if (tgShowHere) {
      tgShowHere.addEventListener('click', () => {
        const next = !settingsCache.showHere;
        syncToggle('tgShowHere', next);
        saveSettings({ showHere: next });
      });
    }

    if (tgScreens) {
      tgScreens.addEventListener('click', () => {
        const next = !settingsCache.screens;
        syncToggle('tgScreens', next);
        saveSettings({ screens: next });
      });
    }

    if (tgEvent) {
      tgEvent.addEventListener('click', () => {
        const next = !settingsCache.eventMode;
        syncToggle('tgEvent', next);
        saveSettings({ eventMode: next });
      });
    }
  }

  // ==== ZK tab & Timeline ZK badge ====

  function updateZkStatusFromSession(hasPassword, session) {
    const badge = $('zkStatusBadge');
    const sess = $('zkStatusSession');
    if (!badge || !sess) return;
    const active = !!(session && session.active);
    if (!hasPassword) {
      badge.textContent = currentLang === 'ru' ? 'Нет пароля' : 'No password';
      badge.classList.remove('ok');
      sess.textContent = currentLang === 'ru' ? 'Сессия: нет' : 'Session: none';
    } else if (active) {
      badge.textContent = currentLang === 'ru' ? 'Разблокировано' : 'Unlocked';
      badge.classList.add('ok');
      const untilTs = session.sessionUntil || 0;
      const remainMs = Math.max(0, untilTs - Date.now());
      const mins = Math.round(remainMs / 60000);
      if (currentLang === 'ru') {
        sess.textContent = `Сессия: активна (~${mins} мин)`;
      } else {
        sess.textContent = `Session: active (~${mins} min)`;
      }
    } else {
      badge.textContent = currentLang === 'ru' ? 'Заблокировано' : 'Locked';
      badge.classList.remove('ok');
      if (currentLang === 'ru') {
        sess.textContent = 'Сессия: неактивна';
      } else {
        sess.textContent = 'Session: inactive';
      }
    }
  }

  function updateTimelineZkBadgeFromSession(hasPassword, session) {
    const badge = $('timelineZkBadge');
    if (!badge) return;
    const active = !!(session && session.active);
    if (!hasPassword) {
      badge.textContent = 'ZK: no password';
      badge.classList.remove('ok');
    } else if (active) {
      const untilTs = session.sessionUntil || 0;
      const remainMs = Math.max(0, untilTs - Date.now());
      const mins = Math.max(1, Math.round(remainMs / 60000) || 1);
      badge.textContent = currentLang === 'ru' ? `ZK: ~${mins} мин` : `ZK: ~${mins} min`;
      badge.classList.add('ok');
    } else {
      badge.textContent = currentLang === 'ru' ? 'ZK: заблокировано' : 'ZK: locked';
      badge.classList.remove('ok');
    }
  }

  function renderZkEntries(items) {
    const listEl = $('zkEntriesList');
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!items || !items.length) return;
    const max = Math.min(items.length, 50);
    for (let i = 0; i < max; i++) {
      const it = items[i];
      if (!it) continue;
      const li = document.createElement('li');
      const kind = it.kind || 'unknown';
      const ts = typeof it.ts === 'number' ? new Date(it.ts).toLocaleString() : '';
      let prev = '';
      try {
        const p = it.payload || {};
        if (typeof p.value === 'string') prev = p.value.slice(0, 80);
        else if (typeof p.title === 'string') prev = p.title.slice(0, 80);
        else if (typeof p.url === 'string') prev = p.url.slice(0, 80);
      } catch (e) {}
      li.textContent = `[${kind}] ${ts} — ${prev}`;
      listEl.appendChild(li);
    }
  }

  function initZkTab() {
    const btnSet = $('btnZkSetPassword');
    const btnUnlock = $('btnZkUnlock');
    const btnReload = $('btnZkReload');
    const btnExport = $('btnZkExport');
    const errEl = $('zkError');

    function clearError() {
      if (errEl) errEl.textContent = '';
    }

    // initial status for ZK and Timeline badge
    try {
      api.runtime.sendMessage({ type: 'LU_ZK_ENSURE_PASSWORD' }, (res) => {
        if (!res || !res.ok) return;
        updateZkStatusFromSession(!!res.hasPassword, res.session || null);
        updateTimelineZkBadgeFromSession(!!res.hasPassword, res.session || null);
      });
    } catch (e) {}

    // periodic refresh of session for badge
    try {
      setInterval(() => {
        try {
          api.runtime.sendMessage({ type: 'LU_ZK_GET_SESSION' }, (res) => {
            if (!res || !res.ok) return;
            // hasPassword здесь не узнаём, предполагаем, что если сессии нет, то пароль есть
            updateTimelineZkBadgeFromSession(true, res.session || null);
          });
        } catch (e) {}
      }, 30000);
    } catch (e) {}

    if (btnSet) {
      btnSet.addEventListener('click', () => {
        clearError();
        const input = $('zkNewPassword');
        const pwd = input && input.value ? String(input.value) : '';
        if (!pwd) {
          if (errEl)
            errEl.textContent =
              currentLang === 'ru' ? 'Введите новый мастер‑пароль.' : 'Enter a new master password.';
          return;
        }
        try {
          api.runtime.sendMessage({ type: 'LU_ZK_SET_PASSWORD', payload: { password: pwd } }, (res) => {
            if (!res || !res.ok) {
              if (errEl)
                errEl.textContent =
                  currentLang === 'ru' ? 'Не удалось сохранить пароль.' : 'Failed to save password.';
              return;
            }
            if (input) input.value = '';
            updateZkStatusFromSession(!!res.hasPassword, res.session || null);
            updateTimelineZkBadgeFromSession(!!res.hasPassword, res.session || null);
          });
        } catch (e) {}
      });
    }

    if (btnUnlock) {
      btnUnlock.addEventListener('click', () => {
        clearError();
        const input = $('zkUnlockPassword');
        const pwd = input && input.value ? String(input.value) : '';
        if (!pwd) {
          if (errEl)
            errEl.textContent = currentLang === 'ru' ? 'Введите мастер‑пароль.' : 'Enter master password.';
          return;
        }
        try {
          api.runtime.sendMessage(
            { type: 'LU_ZK_VERIFY_PASSWORD', payload: { password: pwd, sessionMs: 15 * 60 * 1000 } },
            (res) => {
              if (!res || !res.ok) {
                const reason = res && res.reason;
                if (errEl) {
                  if (reason === 'BAD_PASSWORD') {
                    errEl.textContent =
                      currentLang === 'ru' ? 'Неверный мастер‑пароль.' : 'Wrong master password.';
                  } else if (reason === 'NO_PASSWORD') {
                    errEl.textContent =
                      currentLang === 'ru'
                        ? 'Мастер‑пароль ещё не задан.'
                        : 'Master password is not set yet.';
                  } else {
                    errEl.textContent =
                      currentLang === 'ru'
                        ? 'Не удалось разблокировать ZK‑сессию.'
                        : 'Failed to unlock ZK session.';
                  }
                }
                return;
              }
              updateZkStatusFromSession(true, res.session || null);
              updateTimelineZkBadgeFromSession(true, res.session || null);
              try {
                api.runtime.sendMessage({ type: 'LU_ZK_LIST_LAST', payload: { limit: 100 } }, (resp) => {
                  if (resp && resp.ok) renderZkEntries(resp.items || []);
                });
              } catch (e) {}
            }
          );
        } catch (e) {}
      });
    }

    if (btnReload) {
      btnReload.addEventListener('click', () => {
        clearError();
        try {
          api.runtime.sendMessage({ type: 'LU_ZK_LIST_LAST', payload: { limit: 100 } }, (resp) => {
            if (resp && resp.ok) renderZkEntries(resp.items || []);
          });
        } catch (e) {}
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        clearError();
        const pwd = window.prompt(
          currentLang === 'ru'
            ? 'Введите пароль для .luzk‑архива (не обязательно совпадает с ZK‑паролем).'
            : 'Enter password for .luzk archive (does not have to match ZK password).'
        );
        if (!pwd) return;
        try {
          api.runtime.sendMessage(
            { type: 'LU_ZK_EXPORT_LUZK', payload: { password: String(pwd), limit: 1000 } },
            (resp) => {
              if (!resp || !resp.ok || !resp.container) {
                if (errEl)
                  errEl.textContent =
                    currentLang === 'ru' ? 'Не удалось экспортировать .luzk.' : 'Failed to export .luzk.';
                return;
              }
              try {
                const blob = new Blob([JSON.stringify(resp.container, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const ts = new Date().toISOString().replace(/[:.]/g, '-');
                a.download = `lifeundo_zk_${ts}.luzk.json`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }, 0);
              } catch (e) {}
            }
          );
        } catch (e) {}
      });
    }
  }

  // ==== Lang buttons ====

  function bindLangButtons() {
    const btnEn = $('optLangEn');
    const btnRu = $('optLangRu');
    if (!btnEn || !btnRu) return;

    btnEn.addEventListener('click', () => {
      currentLang = 'en';
      settingsCache.lang = 'en';
      applyLanguage();
      saveSettings({ lang: 'en' });
      try {
        localStorage.setItem('lu_lang', 'en');
      } catch (e) {}
    });

    btnRu.addEventListener('click', () => {
      currentLang = 'ru';
      settingsCache.lang = 'ru';
      applyLanguage();
      saveSettings({ lang: 'ru' });
      try {
        localStorage.setItem('lu_lang', 'ru');
      } catch (e) {}
    });
  }

  // ==== Links ====

  function openUrl(url) {
    try {
      api.tabs.create({ url });
    } catch (e) {
      window.open(url, '_blank');
    }
  }

  function bindLinks() {
    // Apps
    $('btnChromeWebStore')?.addEventListener('click', () => {
      openUrl('https://chromewebstore.google.com/detail/lifeundo/'); // уточни реальный ID позже
    });

    $('btnFirefoxAddons')?.addEventListener('click', () => {
      openUrl('https://addons.mozilla.org/ru/firefox/addon/lifeundo/');
    });

    $('btnWinDownload')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/ru/downloads');
    });

    $('btnWinReleases')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/ru/downloads');
    });

    $('btnRuStore')?.addEventListener('click', () => {
      openUrl('https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app');
    });

    $('btnAndroidApk')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/app/releases/android/');
    });

    $('btnAppsRoadmap')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/roadmap');
    });

    // Subscription / TEAM
    $('btnSubPortal')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/account');
    });

    $('btnSubStatus')?.addEventListener('click', () => {
      // здесь можно добавить рефреш из storage/backend позже
    });

    $('btnTeamAdmin')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/team');
    });

    // Timeline actions — реальные действия через backend/хранилище
    const tlFlash = $('timelineFlash');

    function withTimeline(handler) {
      try {
        api.runtime.sendMessage({ type: 'LU_GET_TIMELINE', payload: { limit: 200 } }, (res) => {
          if (!res || !res.ok || !Array.isArray(res.items)) {
            if (tlFlash)
              setFlash(
                tlFlash,
                currentLang === 'ru' ? 'Не удалось загрузить Ленту.' : 'Failed to load timeline.',
                'err'
              );
            return;
          }
          handler(res.items || []);
        });
      } catch (e) {}
    }

    $('btnOpenRecentTabs')?.addEventListener('click', () => {
      withTimeline((items) => {
        const tabs = items.filter((it) => it && it.kind === 'tab').slice(0, 15);
        tabs.forEach((it) => {
          const url = it && it.payload && it.payload.url;
          if (typeof url === 'string' && url) {
            try {
              api.tabs.create({ url });
            } catch (e) {
              window.open(url, '_blank');
            }
          }
        });
        if (tlFlash)
          setFlash(
            tlFlash,
            currentLang === 'ru' ? 'Открыты последние вкладки.' : 'Recent tabs opened.',
            'ok'
          );
      });
    });

    $('btnExportRecentTabs')?.addEventListener('click', () => {
      withTimeline((items) => {
        const tabs = items.filter((it) => it && it.kind === 'tab');
        try {
          const blob = new Blob([JSON.stringify(tabs, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const ts = new Date().toISOString().replace(/[:.]/g, '-');
          a.download = `lifeundo_tabs_${ts}.json`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 0);
          if (tlFlash)
            setFlash(
              tlFlash,
              currentLang === 'ru' ? 'Список вкладок экспортирован.' : 'Tabs list exported.',
              'ok'
            );
        } catch (e) {}
      });
    });

    $('btnCopyLastText')?.addEventListener('click', () => {
      withTimeline((items) => {
        const texts = items.filter((it) => it && (it.kind === 'text' || it.kind === 'clipboard'));
        const last = texts[0];
        const value = last && last.payload && last.payload.value;
        if (typeof value !== 'string' || !value) {
          if (tlFlash)
            setFlash(
              tlFlash,
              currentLang === 'ru' ? 'Нет текста для копирования.' : 'No text to copy.',
              'err'
            );
          return;
        }
        try {
          navigator.clipboard.writeText(value).then(
            () => {
              if (tlFlash)
                setFlash(
                  tlFlash,
                  currentLang === 'ru' ? 'Последний текст скопирован.' : 'Last text copied.',
                  'ok'
                );
            },
            () => {}
          );
        } catch (e) {}
      });
    });

    $('btnCaptureScreen')?.addEventListener('click', () => {
      if (tlFlash)
        setFlash(
          tlFlash,
          currentLang === 'ru'
            ? 'Скриншоты захватываются десктопным Mesh‑клиентом.'
            : 'Screenshots are captured by the desktop Mesh client.',
          'ok'
        );
    });

    $('btnClearText')?.addEventListener('click', () => {
      try {
        api.storage.local.set({ lu_text_history: [] }, () => {
          if (tlFlash)
            setFlash(
              tlFlash,
              currentLang === 'ru' ? 'История текста очищена.' : 'Text history cleared.',
              'ok'
            );
        });
      } catch (e) {}
    });

    $('btnExportScreens')?.addEventListener('click', () => {
      try {
        api.storage.local.get({ lu_screenshots: [] }, (res) => {
          const shots = res.lu_screenshots || [];
          try {
            const blob = new Blob([JSON.stringify(shots, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `lifeundo_screens_${ts}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 0);
            if (tlFlash)
              setFlash(
                tlFlash,
                currentLang === 'ru' ? 'Список скриншотов экспортирован.' : 'Screenshots exported.',
                'ok'
              );
          } catch (e) {}
        });
      } catch (e) {}
    });

    $('btnClearScreens')?.addEventListener('click', () => {
      try {
        api.storage.local.set({ lu_screenshots: [] }, () => {
          if (tlFlash)
            setFlash(
              tlFlash,
              currentLang === 'ru' ? 'Список скриншотов очищен.' : 'Screenshots cleared.',
              'ok'
            );
        });
      } catch (e) {}
    });

    $('btnExportLogs')?.addEventListener('click', () => {
      try {
        api.storage.local.get({ lu_stats: {} }, (res) => {
          const stats = res.lu_stats || {};
          try {
            const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `lifeundo_logs_${ts}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 0);
            if (tlFlash)
              setFlash(
                tlFlash,
                currentLang === 'ru' ? 'Диагностические данные экспортированы.' : 'Diagnostics exported.',
                'ok'
              );
          } catch (e) {}
        });
      } catch (e) {}
    });

    $('btnClearLogs')?.addEventListener('click', () => {
      try {
        api.storage.local.set({ lu_stats: {} }, () => {
          if (tlFlash)
            setFlash(
              tlFlash,
              currentLang === 'ru' ? 'Диагностические данные очищены.' : 'Diagnostics cleared.',
              'ok'
            );
        });
      } catch (e) {}
    });

    // Footer
    $('ftSite')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com');
    });
    $('ftPrivacy')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/ru/privacy');
    });
    $('ftOffer')?.addEventListener('click', () => {
      openUrl('https://getlifeundo.com/ru/offer');
    });
    $('ftGitHub')?.addEventListener('click', () => {
      openUrl('https://github.com/getlifeundo');
    });
  }

  // ==== Init ====

  function initVersion() {
    try {
      const v = api.runtime.getManifest().version || '';
      if ($('optVersion')) $('optVersion').textContent = v ? `v${v}` : '';
      if ($('aboutVersionValue'))
        $('aboutVersionValue').textContent = v || '0.0.0';

      // localized about text with version
      const txt = tr('aboutVersionText').replace('{v}', v || '0.0.0');
      $('aboutVersionText').textContent = txt;
    } catch (e) {
      // ignore
    }
  }

  function initLangFromLocalStorage() {
    try {
      const saved = localStorage.getItem('lu_lang');
      if (saved === 'ru') currentLang = 'ru';
      else if (saved === 'en') currentLang = 'en';
    } catch (e) {}
  }

  function init() {
    initLangFromLocalStorage();
    initVersion();
    bindTabs();
    bindToggles();
    bindLangButtons();
    bindLinks();
    initZkTab();
    readSettingsAndApply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();