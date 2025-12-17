'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function DPAClient() {
  const { locale } = useTranslations();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
            {locale === 'en' ? 'Data Processing Agreement (DPA)' : 'Соглашение об обработке персональных данных (DPA)'}
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              {locale === 'en' 
                ? 'This agreement defines the terms of personal data processing between GetLifeUndo and organizations using our services.'
                : 'Данное соглашение определяет условия обработки персональных данных между GetLifeUndo и организациями, использующими наши услуги.'
              }
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              {locale === 'en' ? '1. Data Processing Principles' : '1. Принципы обработки данных'}
            </h2>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '1.1. GetLifeUndo processes personal data in accordance with applicable data protection laws and regulations.'
                : '1.1. GetLifeUndo обрабатывает персональные данные в соответствии с применимым законодательством о защите данных.'
              }
            </p>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '1.2. All data processing is performed locally on user devices. No telemetry or data collection is conducted.'
                : '1.2. Вся обработка данных выполняется локально на устройствах пользователей. Телеметрия и сбор данных не ведется.'
              }
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              {locale === 'en' ? '2. Data Categories' : '2. Категории данных'}
            </h2>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '2.1. Payment data: processed by payment providers (FreeKassa) according to their privacy policies.'
                : '2.1. Платежные данные: обрабатываются провайдерами платежей (FreeKassa) согласно их политикам конфиденциальности.'
              }
            </p>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '2.2. User content: stored locally on user devices, not transmitted to our servers.'
                : '2.2. Пользовательский контент: хранится локально на устройствах пользователей, не передается на наши серверы.'
              }
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              {locale === 'en' ? '3. Data Security' : '3. Безопасность данных'}
            </h2>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '3.1. We implement appropriate technical and organizational measures to protect personal data.'
                : '3.1. Мы применяем соответствующие технические и организационные меры для защиты персональных данных.'
              }
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              {locale === 'en' ? '4. Data Subject Rights' : '4. Права субъектов данных'}
            </h2>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '4.1. Users have the right to access, rectify, erase, and port their personal data.'
                : '4.1. Пользователи имеют право на доступ, исправление, удаление и переносимость своих персональных данных.'
              }
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              {locale === 'en' ? '5. Evidence and Verification' : '5. Доказательства и верификация'}
            </h2>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '5.1. Claims regarding data processing require verifiable evidence: logs, timestamps, user consent records.'
                : '5.1. Претензии по обработке данных требуют верифицируемых доказательств: логи, таймстемпы, записи согласия пользователя.'
              }
            </p>
            <p className="text-gray-300 mb-4">
              {locale === 'en' 
                ? '5.2. Data processing operates on "best effort" basis with standard exclusions for technical limitations.'
                : '5.2. Обработка данных работает по принципу «best effort» со стандартными исключениями для технических ограничений.'
              }
            </p>

            <p className="text-gray-400 text-sm mt-8">
              <em>{locale === 'en' ? 'Last updated: 2025-10-04' : 'Дата обновления: 2025-10-04'}</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
