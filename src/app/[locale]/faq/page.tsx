// src/app/faq/page.tsx
export const metadata = { 
  title: 'FAQ — GetLifeUndo',
  description: 'Часто задаваемые вопросы о GetLifeUndo: Лента, устройства, TEAM и LifeUndo Cloud.'
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h1>
          <p className="text-xl text-gray-600">Ответы на популярные вопросы о GetLifeUndo, устройствах, TEAM и LifeUndo Cloud.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что такое GetLifeUndo?</h3>
            <p className="text-gray-600">
              GetLifeUndo — это локальная «лента» вашей работы за компьютером: скриншоты, текст из буфера обмена, история вкладок и форм.
              Приложение помогает вернуть потерянный текст, найти нужный скрин и вспомнить, чем вы занимались 5 минут, час или день назад.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Где хранятся мои данные?</h3>
            <p className="text-gray-600">
              По умолчанию всё хранится локально на вашем устройстве: на диске (десктоп), в профиле браузера (расширения), в памяти телефона (мобильные клиенты).
              Данные не отправляются на наши сервера без вашего явного решения включить облачные функции.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что такое LifeUndo Cloud?</h3>
            <p className="text-gray-600">
              LifeUndo Cloud — это опциональный зашифрованный слой поверх локальной Mesh‑сети. Он позволит синхронизировать часть Ленты и настроек
              между домашними и рабочими устройствами по вашему выбору. По умолчанию Cloud выключен; включить его можно отдельно в настройках.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что за пароль LifeUndo Cloud и зачем он нужен?</h3>
            <p className="text-gray-600">
              Пароль LifeUndo Cloud — это отдельный мастер‑пароль, который вы придумываете для шифрования облачных данных. Он не связан с паролем от почты
              и не восстанавливается: при утере пароля расшифровать Cloud‑данные будет невозможно. Этот пароль понадобится на других устройствах и в админ‑панели,
              чтобы открыть зашифрованный слой.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что такое Devices / «Устройства»?</h3>
            <p className="text-gray-600">
              Раздел «Устройства» показывает, какие компьютеры и браузеры привязаны к вашей лицензии или аккаунту. Desktop‑клиент и расширения используют общую Mesh‑сеть
              и единый backend, чтобы связывать устройства между собой и в будущем синхронизировать данные через LifeUndo Cloud.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что такое TEAM и TEAM 5?</h3>
            <p className="text-gray-600">
              TEAM — это доступ к GetLifeUndo для команды или небольшой организации: общие ключи, распределение лицензий и учёт устройств. Тариф TEAM 5 рассчитан
              примерно на пять активных рабочих мест. Организация и ключи TEAM управляются через отдельную админ‑панель; десктоп‑клиент и расширения используют тот же
              backend для проверки статусов и устройств.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что включено бесплатно из коробки?</h3>
            <p className="text-gray-600">
              Базовое локальное ядро GetLifeUndo работает бесплатно: Лента, локальное зашифрованное ZK‑хранилище и режимы Office/Home. Эти функции не требуют
              подписки и продолжают работать на устройстве, пока установлено приложение.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что происходит при отмене подписки или окончании лицензии?</h3>
            <p className="text-gray-600">
              Локальный доступ к вашим данным сохраняется: вы по‑прежнему можете открывать старые скриншоты и истории текста. Отключаются только платные функции:
              повышенные лимиты, командные возможности TEAM и будущие Cloud‑функции. Мы не блокируем ваши файлы и не удаляем локальную историю.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Безопасно ли использовать GetLifeUndo?</h3>
            <p className="text-gray-600">
              Мы стремимся к модели «локально по умолчанию»: приложение не отправляет содержимое вашей Ленты на сервер без явного включения Cloud или других сетевых функций.
              В десктопе можно открыть папку с данными и убедиться, что файлы хранятся локально. Подробности — в разделе Приватность и в документации.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}