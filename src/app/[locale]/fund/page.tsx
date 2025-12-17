export default function FundPage({ params }: { params: { locale: 'ru' | 'en' } }) {
  const isEn = params.locale === 'en';
  return (
    <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            {isEn ? 'GetLifeUndo Fund' : 'Фонд GetLifeUndo'}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">{isEn ? 'Our mission' : 'Наша миссия'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn
                  ? 'The GetLifeUndo Fund supports user projects. We believe anyone can contribute to society—so we help turn your ideas into reality.'
                  : 'Фонд GetLifeUndo создан для поддержки проектов наших пользователей. Мы верим, что каждый человек может внести вклад в развитие общества, и готовы помочь в реализации ваших идей.'}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">{isEn ? 'Funding' : 'Финансирование'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {isEn ? 'We allocate ' : 'Мы выделяем '}<span className="text-purple-400 font-semibold">10%</span>{' '}
                {isEn
                  ? 'of all GetLifeUndo revenue to support user projects. It’s our way to give back to the community.'
                  : 'от всех доходов GetLifeUndo на поддержку проектов пользователей. Это наш способ вернуть сообществу часть того, что оно дает нам.'}
              </p>
            </div>
          </div>

          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">{isEn ? 'Funds allocation' : 'Распределение средств'}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">40%</div>
                <h3 className="text-lg font-semibold mb-2">{isEn ? 'Education' : 'Образование'}</h3>
                <p className="text-gray-300 text-sm">
                  {isEn ? 'Support for education projects, courses and research' : 'Поддержка образовательных проектов, курсов и исследований'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">30%</div>
                <h3 className="text-lg font-semibold mb-2">{isEn ? 'Research' : 'Исследования'}</h3>
                <p className="text-gray-300 text-sm">
                  {isEn ? 'Funding scientific research and innovation' : 'Финансирование научных исследований и инноваций'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">30%</div>
                <h3 className="text-lg font-semibold mb-2">{isEn ? 'Social projects' : 'Социальные проекты'}</h3>
                <p className="text-gray-300 text-sm">
                  {isEn ? 'Support for socially significant initiatives' : 'Поддержка социально значимых инициатив'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">{isEn ? 'How to apply' : 'Как подать заявку'}</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h3 className="font-semibold mb-1">{isEn ? 'Prepare a project brief' : 'Подготовьте описание проекта'}</h3>
                  <p className="text-gray-300 text-sm">
                    {isEn ? 'Clearly describe goals, tasks and expected outcomes of your project' : 'Четко опишите цели, задачи и ожидаемые результаты вашего проекта'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h3 className="font-semibold mb-1">{isEn ? 'Fill in the application form' : 'Заполните форму заявки'}</h3>
                  <p className="text-gray-300 text-sm">
                    {isEn ? 'Provide your contacts and choose a suitable category' : 'Укажите контактные данные и выберите подходящую категорию'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h3 className="font-semibold mb-1">{isEn ? 'Wait for review' : 'Дождитесь рассмотрения'}</h3>
                  <p className="text-gray-300 text-sm">
                    {isEn ? 'We will review your application within 5 business days' : 'Мы рассмотрим вашу заявку в течение 5 рабочих дней'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href={`/${params.locale}/fund/apply`}
              className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {isEn ? 'Apply to the fund' : 'Подать заявку в фонд'}
            </a>
          </div>
        </div>
    </div>
  );
}