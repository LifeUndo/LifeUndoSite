'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function PdpClient() {
  const { locale } = useTranslations();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              {locale === 'en' ? 'Privacy Policy' : 'Политика обработки персональных данных'}
            </h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">
                {locale === 'en'
                  ? 'This policy describes how GetLifeUndo processes personal data in compliance with applicable privacy laws.'
                  : 'Данная политика описывает, как GetLifeUndo обрабатывает персональные данные в соответствии с применимым законодательством о конфиденциальности.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '1. Data Controller' : '1. Контролер данных'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en'
                  ? '1.1. LLC "GetLifeUndo" is the data controller for personal data processed in connection with our services.'
                  : '1.1. ООО «GetLifeUndo» является контролером персональных данных, обрабатываемых в связи с нашими услугами.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '2. Local Data Processing' : '2. Локальная обработка данных'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en'
                  ? '2.1. GetLifeUndo software operates entirely locally on user devices. No user data is transmitted to our servers.'
                  : '2.1. Программное обеспечение GetLifeUndo работает полностью локально на устройствах пользователей. Пользовательские данные не передаются на наши серверы.'}
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en'
                  ? '2.2. We do not collect telemetry, usage statistics, or any personal content from users.'
                  : '2.2. Мы не собираем телеметрию, статистику использования или любой персональный контент пользователей.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '3. Payment Data' : '3. Платежные данные'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en'
                  ? '3.1. Payment processing is handled by third-party providers (FreeKassa) according to their privacy policies.'
                  : '3.1. Обработка платежей осуществляется сторонними провайдерами (FreeKassa) согласно их политикам конфиденциальности.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '4. User Rights' : '4. Права пользователей'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en'
                  ? '4.1. Users have the right to access, correct, delete, and restrict processing of their personal data.'
                  : '4.1. Пользователи имеют право на доступ, исправление, удаление и ограничение обработки своих персональных данных.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '5. Contact Information' : '5. Контактная информация'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en'
                  ? '5.1. For privacy-related inquiries, contact us at privacy@getlifeundo.com'
                  : '5.1. По вопросам, связанным с конфиденциальностью, обращайтесь к нам по адресу privacy@getlifeundo.com'}
              </p>

              <p className="text-gray-400 text-sm mt-8">
                <em>{locale === 'en' ? 'Last updated: 2025-10-04' : 'Дата обновления: 2025-10-04'}</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
