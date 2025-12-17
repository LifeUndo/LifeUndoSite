import React from 'react';

export default function ContractClient({ locale }: { locale: 'en' | 'ru' }) {
  return (
    <div className="container mx-auto px-4 py-10">
        {/* TXT Templates Button */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <a 
            href={`/${locale}/legal/downloads`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            📄 {locale === 'en' ? 'Download .TXT Templates' : 'Скачать .TXT-шаблоны'}
          </a>
        </div>

        {/* Contract Content */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
                {locale === 'en' ? 'Software Licensing Agreement (B2B)' : 'Договор лицензирования программного обеспечения (B2B)'}
              </h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-6">
                  {locale === 'en' 
                    ? 'This Agreement governs the provision of a simple (non‑exclusive) license for the "GetLifeUndo" software to organizations (100+ VIP seats).'
                    : 'Настоящий Договор регулирует предоставление простой (неисключительной) лицензии на программное обеспечение «GetLifeUndo» организациям (100+ VIP мест).'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '1. Parties' : '1. Стороны'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '1.1. Licensor: LLC "GetLifeUndo", TIN xxx, OGRN xxx, address: xxx.'
                    : '1.1. Лицензиар: ООО «GetLifeUndo», ИНН xxx, ОГРН xxx, адрес: xxx.'}
                </p>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '1.2. Licensee: [Organization details to be filled]'
                    : '1.2. Лицензиат: [Реквизиты организации заполняются индивидуально]'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '2. License Terms' : '2. Условия лицензии'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '2.1. The Licensor grants the Licensee a simple (non‑exclusive), non‑transferable license for the Software for internal use, worldwide, for the paid period (perpetual — indefinitely).'
                    : '2.1. Лицензиар предоставляет Лицензиату простую (неисключительную), непередаваемую лицензию на ПО для внутреннего использования, на территории всего мира, на срок оплаченного периода (для бессрочной — бессрочно).'}
                </p>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '2.2. Sublicensing, distribution of copies and disclosure of license keys are prohibited unless expressly permitted by law or an additional agreement.'
                    : '2.2. Сублицензирование, распространение копий и разглашение лицензионных ключей запрещены, если иное прямо не предусмотрено законом либо дополнительным соглашением.'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '3. Best‑Effort, No Data Guarantee' : '3. Best‑effort и отсутствие гарантий данных'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '3.1. The Software operates on a “best‑effort” basis. The Licensor does not guarantee recovery of tabs/text or the preservation of any specific user data.'
                    : '3.1. ПО работает по принципу «best‑effort». Лицензиар не гарантирует восстановление вкладок/текста и сохранность каких‑либо конкретных пользовательских данных.'}
                </p>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '3.2. The Software stores data locally on the user device. No telemetry or remote collection is performed by default.'
                    : '3.2. Данные хранятся локально на устройстве пользователя. По умолчанию телеметрия или удалённый сбор не осуществляются.'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '4. Evidence and Claims' : '4. Доказательства и претензии'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '4.1. Claims regarding “data loss” are accepted only with verifiable artifacts: explicit user consent to provide logs, extension logs with timestamps, reproducible steps, system/browser events.'
                    : '4.1. Претензии о «потере данных» принимаются только при наличии верифицируемых артефактов: явное согласие пользователя на предоставление логов, логи расширения с таймстемпами, воспроизводимые шаги, события системы/браузера.'}
                </p>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '4.2. Without such artifacts, any claim is deemed unsubstantiated.'
                    : '4.2. При отсутствии указанных артефактов претензия считается необоснованной.'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '5. Exclusions and Limitations' : '5. Исключения и ограничения'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '5.1. Exclusions include, among others: power/network failures; OS/browser bugs or updates; third‑party extensions; user actions; corporate policies; storage quotas; anti‑virus/EDR; force majeure.'
                    : '5.1. К исключениям относятся, в частности: сбои электропитания/сети; ошибки или обновления ОС/браузера; сторонние расширения; действия пользователя; корпоративные политики; квоты хранилища; антивирус/EDR; форс‑мажор.'}
                </p>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '5.2. Liability of the Licensor is limited to the amount paid for the last three (3) months for the relevant plan, and in any case excludes indirect, incidental, and consequential damages.'
                    : '5.2. Ответственность Лицензиара ограничена суммой, уплаченной за последние три (3) месяца по соответствующему тарифу, и во всех случаях исключает косвенные, случайные и последующие убытки.'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '6. Payment and Taxes' : '6. Оплата и налоги'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '6.1. Payment is processed by a payment provider; the moment of payment constitutes acceptance of this Agreement.'
                    : '6.1. Оплату обрабатывает платёжный провайдер; момент оплаты является акцептом настоящего Договора.'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '7. Updates and Support' : '7. Обновления и поддержка'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '7.1. Software may update automatically; support is provided via support@getlifeundo.com within two business days.'
                    : '7.1. ПО может обновляться автоматически; поддержка оказывается по адресу support@getlifeundo.com в течение двух рабочих дней.'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '8. Governing Law and Dispute Resolution' : '8. Применимое право и споры'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '8.1. Governing law — Russian Federation. Disputes are resolved through negotiations; if unresolved — by a competent court at the Licensor’s location.'
                    : '8.1. Применимое право — Российская Федерация. Споры разрешаются путём переговоров; при недостижении — в компетентном суде по месту нахождения Лицензиара.'}
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '9. Miscellaneous' : '9. Прочие условия'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '9.1. The Agreement may be updated; the current version is available on the website. Continued use constitutes acceptance of changes.'
                    : '9.1. Договор может обновляться; актуальная версия размещена на сайте. Продолжение использования означает акцепт изменений.'}
                </p>

                <p className="text-gray-400 text-sm mt-8">
                  <em>{locale === 'en' ? 'Last updated: 2025-10-27' : 'Дата обновления: 2025-10-27'}</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* B2B Disclaimer */}
        <div className="max-w-4xl mx-auto mt-10">
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-yellow-200 mb-4">
                {locale === 'en' ? 'Important Information' : 'Важная информация'}
              </h3>
              <div className="text-yellow-200 space-y-2">
                {locale === 'en' ? (
                  <>
                    <p>• For organizations — <strong>100+ VIP seats</strong></p>
                    <p>• This is a contract template. Not a public offer</p>
                    <p>• Final version provided upon request and signed by parties</p>
                    <p>• All details filled individually for each organization</p>
                  </>
                ) : (
                  <>
                    <p>• Для организаций от <strong>100 VIP-подписок</strong></p>
                    <p>• Это шаблон договора. Не является публичной офертой</p>
                    <p>• Финальная версия предоставляется по запросу и подписывается сторонами</p>
                    <p>• Все реквизиты заполняются индивидуально для каждой организации</p>
                  </>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
