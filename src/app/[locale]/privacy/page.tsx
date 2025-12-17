import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: 'ru' | 'en' } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/privacy`;
  const title = locale === 'en' ? 'Privacy Policy — GetLifeUndo' : 'Политика конфиденциальности — GetLifeUndo';
  const description = locale === 'en'
    ? 'Privacy Policy of GetLifeUndo: what data we collect, how we use and protect it, your rights.'
    : 'Политика конфиденциальности GetLifeUndo: какие данные мы собираем, как используем и защищаем, ваши права.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/privacy`,
        'en-US': `${base}/en/privacy`,
      }
    },
    openGraph: { url, title, description, images: [{ url: '/brand/getlifeundo-og.png', width: 1200, height: 630 }] },
    twitter: { title, description, images: ['/brand/getlifeundo-og.png'] },
  };
}

export default function PrivacyPage({ params }: { params: { locale: 'ru' | 'en' } }) {
  const isEn = params.locale === 'en';
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">
            {isEn ? 'Privacy Policy' : 'Политика конфиденциальности'}
          </h1>
          
          <div className="glass-card p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{isEn ? '1. General' : '1. Общие положения'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn
                  ? 'This Privacy Policy describes how we process personal data of GetLifeUndo users. We take your privacy seriously and keep your data secure.'
                  : 'Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сервиса GetLifeUndo. Мы серьезно относимся к защите вашей конфиденциальности и обеспечиваем безопасность ваших данных.'}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{isEn ? '2. Data we collect' : '2. Сбор информации'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn ? 'We collect only what is necessary to provide our services:' : 'Мы собираем только необходимую информацию для предоставления наших услуг:'}
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>{isEn ? 'Account e-mail used for licenses and important notifications' : 'Учётный e-mail, используемый для лицензий и важных уведомлений'}</li>
                <li>{isEn ? 'Device identifiers to manage connected apps and protect your account' : 'Идентификаторы устройств для управления подключёнными приложениями и защиты учётной записи'}</li>
                <li>{isEn ? 'License and subscription / Cloud/TEAM status stored on our backend (without uploading your timeline content)' : 'Статус лицензии, подписки и Cloud/TEAM, хранящиеся на сервере (без загрузки контента вашего таймлайна)'}</li>
                <li>{isEn ? 'Payment information (processed via secure payment service providers)' : 'Платёжная информация (обрабатывается через защищённые платёжные провайдеры)'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{isEn ? '3. How we use data' : '3. Использование данных'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn ? 'We use your data only to:' : 'Ваши данные используются исключительно для:'}
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>{isEn ? 'Provide GetLifeUndo services' : 'Предоставления услуг GetLifeUndo'}</li>
                <li>{isEn ? 'Process payments and subscriptions' : 'Обработки платежей и подписок'}</li>
                <li>{isEn ? 'Send important notifications' : 'Отправки важных уведомлений'}</li>
                <li>{isEn ? 'Improve product quality' : 'Улучшения качества сервиса'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{isEn ? '4. Data protection' : '4. Защита данных'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn ? 'We apply modern security measures:' : 'Мы применяем современные методы защиты данных:'}
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>{isEn ? 'Encryption in transit and at rest' : 'Шифрование данных при передаче и хранении'}</li>
                <li>{isEn ? 'Regular security audits' : 'Регулярные аудиты безопасности'}</li>
                <li>{isEn ? 'Limited access to personal data' : 'Ограниченный доступ к персональным данным'}</li>
                <li>{isEn ? 'Compliance with international security standards' : 'Соответствие международным стандартам безопасности'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{isEn ? '5. Your rights' : '5. Ваши права'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn ? 'You have the right to:' : 'Вы имеете право:'}
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>{isEn ? 'Access your data' : 'Получить информацию о ваших данных'}</li>
                <li>{isEn ? 'Rectify inaccurate information' : 'Исправить неточную информацию'}</li>
                <li>{isEn ? 'Delete your data' : 'Удалить ваши данные'}</li>
                <li>{isEn ? 'Restrict processing' : 'Ограничить обработку данных'}</li>
                <li>{isEn ? 'Withdraw consent' : 'Отозвать согласие на обработку'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{isEn ? '6. Contacts' : '6. Контакты'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn ? 'Privacy questions:' : 'По вопросам конфиденциальности:'} <a href="mailto:privacy@getlifeundo.com">privacy@getlifeundo.com</a> · {isEn ? 'Quick support:' : 'Быстрая связь:'} <a href="https://t.me/GetLifeUndoSupport" target="_blank" rel="noopener noreferrer">t.me/GetLifeUndoSupport</a>
              </p>
            </section>

            <div className="text-sm text-gray-400 mt-8 pt-6 border-t border-white/10">
              <p>{isEn ? 'Last updated: ' : 'Последнее обновление: '}{new Date().toLocaleDateString(isEn ? 'en-US' : 'ru-RU')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}