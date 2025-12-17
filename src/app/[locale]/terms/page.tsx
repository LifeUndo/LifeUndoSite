export default function TermsPage({ params }: { params: { locale: 'ru' | 'en' } }) {
  const isEn = params.locale === 'en';
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8">
          {isEn ? 'Terms of Use' : 'Условия использования'}
        </h1>
        
        <div className="glass-card p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '1. General' : '1. Общие положения'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isEn
                ? 'These Terms of Use govern the relationship between users and the GetLifeUndo service. By using our service, you agree to these terms.'
                : 'Настоящие Условия использования регулируют отношения между пользователями и сервисом GetLifeUndo. Используя наш сервис, вы соглашаетесь с данными условиями.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '2. Service description' : '2. Описание сервиса'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isEn
                ? 'GetLifeUndo is a browser extension that helps restore lost form text, closed tabs and clipboard history. The service is provided “as is” without warranties.'
                : 'GetLifeUndo — это расширение для браузера, которое позволяет возвращать текст форм, закрытые вкладки и историю буфера обмена. Сервис предоставляется «как есть» без гарантий.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '3. Registration and account' : '3. Регистрация и аккаунт'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isEn ? 'Registration is required to use the full functionality. You agree to:' : 'Для использования полного функционала требуется регистрация. Вы обязуетесь:'}
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>{isEn ? 'Provide accurate information' : 'Предоставлять достоверную информацию'}</li>
              <li>{isEn ? 'Keep your data up to date' : 'Поддерживать актуальность данных'}</li>
              <li>{isEn ? 'Ensure the security of your account' : 'Нести ответственность за безопасность аккаунта'}</li>
              <li>{isEn ? 'Not share access with third parties' : 'Не передавать доступ третьим лицам'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '4. Paid services' : '4. Платные услуги'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isEn ? 'Some features are available via subscription:' : 'Некоторые функции доступны по подписке:'}
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>{isEn ? 'Pro plan: 599 ₽/month or 5,990 ₽/year' : 'Pro план: 599 ₽/месяц или 5,990 ₽/год'}</li>
              <li>{isEn ? 'VIP plan: 9,990 ₽ (lifetime access)' : 'VIP план: 9,990 ₽ (пожизненный доступ)'}</li>
              <li>{isEn ? 'Team plan: 2,990 ₽/month for 5 users' : 'Team план: 2,990 ₽/месяц за 5 пользователей'}</li>
            </ul>
            <p className="text-gray-300 mt-4">
              {isEn ? 'Subscriptions renew automatically. You can cancel any time before the charge.' : 'Подписка продлевается автоматически. Отменить можно в любой момент до списания.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '5. Restrictions' : '5. Ограничения использования'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isEn ? 'You must not:' : 'Запрещается:'}
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>{isEn ? 'Use the service for illegal purposes' : 'Использовать сервис в незаконных целях'}</li>
              <li>{isEn ? 'Disrupt the service' : 'Нарушать работу сервиса'}</li>
              <li>{isEn ? 'Attempt unauthorized access' : 'Пытаться получить несанкционированный доступ'}</li>
              <li>{isEn ? 'Distribute malware' : 'Распространять вредоносное ПО'}</li>
              <li>{isEn ? 'Infringe intellectual property rights' : 'Нарушать права интеллектуальной собственности'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '6. Liability' : '6. Ответственность'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isEn ? 'We are not liable for:' : 'Мы не несем ответственности за:'}
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>{isEn ? 'Loss of user data' : 'Потерю данных пользователей'}</li>
              <li>{isEn ? 'Temporary service interruptions' : 'Временные сбои в работе сервиса'}</li>
              <li>{isEn ? 'Actions of third parties' : 'Действия третьих лиц'}</li>
              <li>{isEn ? 'Damages arising from the use of the service' : 'Ущерб от использования сервиса'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '7. Changes' : '7. Изменения условий'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isEn
                ? 'We may amend these terms. We will notify users of any material changes 30 days before they take effect.'
                : 'Мы оставляем за собой право изменять данные условия. О существенных изменениях мы уведомим пользователей за 30 дней до вступления в силу новых условий.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isEn ? '8. Contacts' : '8. Контакты'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn ? 'Questions about terms:' : 'Вопросы по условиям:'} <a href="mailto:legal@getlifeundo.com">legal@getlifeundo.com</a> · {isEn ? 'Quick support:' : 'Быстрая связь:'} <a href="https://t.me/GetLifeUndoSupport" target="_blank" rel="noopener noreferrer">t.me/GetLifeUndoSupport</a>
              </p>
          </section>

          <div className="text-sm text-gray-400 mt-8 pt-6 border-t border-white/10">
            <p>{isEn ? 'Last updated: ' : 'Последнее обновление: '}{new Date().toLocaleDateString(isEn ? 'en-US' : 'ru-RU')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}