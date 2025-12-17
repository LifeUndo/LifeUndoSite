'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function OfferClient() {
  const { locale } = useTranslations();
  
  return (
    <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              {locale === 'en' 
                ? 'Public Offer for Simple (Non-Exclusive) License for GetLifeUndo Software'
                : 'Публичная оферта на предоставление простой (неисключительной) лицензии на ПО «GetLifeUndo»'
              }
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">
                <strong>{locale === 'en' ? 'Rights Holder:' : 'Правообладатель:'}</strong> {locale === 'en' ? 'LLC "GetLifeUndo", TIN xxx, OGRN xxx, address: xxx.' : 'ООО «GetLifeUndo», ИНН xxx, ОГРН xxx, адрес: xxx.'}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '1. Subject' : '1. Предмет'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '1.1. The Rights Holder grants the User a non-exclusive non-transferable license for the GetLifeUndo software (hereinafter — "Software"), and the User accepts the terms of this Offer.'
                  : '1.1. Правообладатель предоставляет Пользователю неисключительную непередаваемую лицензию на программное обеспечение «GetLifeUndo» (далее — «ПО»), а Пользователь принимает условия настоящей Оферты.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '2. License and Limitations' : '2. Лицензия и ограничения'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '2.1. The license is granted on the terms of a simple (non-exclusive) license, without the right to sublicense, worldwide, for the duration of the paid period (for perpetual license — indefinitely).'
                  : '2.1. Лицензия предоставляется на условиях простой (неисключительной) лицензии, без права сублицензирования, на территории всего мира, на срок оплаченного периода (для бессрочной лицензии — бессрочно).'
                }
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '2.2. Prohibited: decompilation, modification of source code, bypassing technical protection measures, distribution of copies, except as permitted by law.'
                  : '2.2. Запрещается: декомпиляция, модификация исходного кода, обход технических средств защиты, распространение копий, за исключением случаев, разрешённых законом.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '3. Rates and Payment' : '3. Тарифы и оплата'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '3.1. Cost and composition of rates are indicated on the page https://getlifeundo.com/en/pricing.'
                  : '3.1. Стоимость и состав тарифов указаны на странице https://getlifeundo.com/ru/pricing.'
                }
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '3.2. Payment is processed by the payment provider. The moment of payment is acceptance of the Offer.'
                  : '3.2. Оплату обрабатывает платёжный провайдер. Момент оплаты является акцептом Оферты.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '4. Updates and Support' : '4. Обновления и поддержка'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '4.1. Software may be updated automatically.'
                  : '4.1. ПО может обновляться автоматически.'
                }
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '4.2. Support is provided at support@getlifeundo.com within 2 (two) business days.'
                  : '4.2. Поддержка оказывается по адресу support@getlifeundo.com в срок до 2 (двух) рабочих дней.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '5. Privacy and Data' : '5. Конфиденциальность и данные'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '5.1. The Software works locally; no telemetry is conducted, and timeline content or browsing history are not uploaded to the server. On the backend (getlifeundo.com) we process account e-mail, device identifiers and license / 7-day trial status, as well as minimal payment data required by the payment provider.'
                  : '5.1. ПО работает локально; телеметрия не ведётся, контент таймлайна и история браузера не передаются на сервер. На сервере (getlifeundo.com) обрабатываются учётные данные (e-mail), идентификаторы устройств и статус лицензии/7‑дневного пробного периода, а также минимальные платёжные данные, необходимые платёжным провайдером.'
                }
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '5.2. Additional terms for processing personal data are contained in the Personal Data Processing Policy: https://getlifeundo.com/en/legal/pdp.'
                  : '5.2. Дополнительные условия обработки персональных данных содержатся в Политике обработки персональных данных: https://getlifeundo.com/ru/legal/pdp.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '6. Liability' : '6. Ответственность'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '6.1. Rights Holder liability is limited to the amount of 3 (three) months cost of the corresponding User tariff.'
                  : '6.1. Ответственность Правообладателя ограничена суммой 3 (трёх) месяцев стоимости соответствующего тарифа Пользователя.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '7. Termination' : '7. Прекращение'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '7.1. The agreement terminates at the end of the paid period or upon violation of the Offer terms.'
                  : '7.1. Договор прекращается по окончании оплаченного периода либо при нарушении условий Оферты.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '7. Liability and Evidence' : '7. Ответственность и доказательства'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '7.1. The service operates on a "best effort" basis. No guarantee of data recovery is provided.'
                  : '7.1. Сервис работает по принципу «best effort». Гарантия восстановления данных не предоставляется.'
                }
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '7.2. Claims regarding "data loss" are accepted only with verifiable artifacts (extension logs with consent, timestamps, reproducibility).'
                  : '7.2. Претензии по «потере данных» принимаются только при наличии верифицируемых артефактов (логи расширения при согласии, таймстемпы, воспроизводимость).'
                }
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '7.3. Exclusions: force majeure (power/network outages, software/OS issues, third-party actions, standard browser limitations).'
                  : '7.3. Исключения: форс-мажор (перебои питания/связи, ПО/ОС, действия третьих лиц, штатные ограничения браузера).'
                }
              </p>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '7.4. Compensation (if provided by contract) is possible only after verification and within the paid period.'
                  : '7.4. Возмещение (если предусмотрено договором) возможно лишь после верификации и в пределах оплаченного периода.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '8. Applicable Law and Disputes' : '8. Применимое право и споры'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? '8.1. Applicable law — Russian Federation.'
                  : '8.1. Применимое право — Российская Федерация.'
                }
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">
                {locale === 'en' ? '9. Rights Holder Details' : '9. Реквизиты Правообладателя'}
              </h2>
              <p className="text-gray-300 mb-4">
                {locale === 'en' 
                  ? 'LLC "GetLifeUndo", TIN xxx, OGRN xxx<br/>Address: xxx<br/>Bank: xxx, BIC xxx<br/>Account: xxx, Corr. account: xxx<br/>E-mail: support@getlifeundo.com'
                  : 'ООО «GetLifeUndo», ИНН xxx, ОГРН xxx<br/>Адрес: xxx<br/>Банк: xxx, БИК xxx<br/>Счёт: xxx, Корр. счёт: xxx<br/>E-mail: support@getlifeundo.com'
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
