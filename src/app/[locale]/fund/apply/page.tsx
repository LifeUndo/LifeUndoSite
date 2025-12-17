'use client';
import { useState } from 'react';

export default function FundApplyPage({ params }: { params: { locale: 'ru' | 'en' } }) {
  const isEn = params.locale === 'en';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Симуляция отправки формы
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card p-8">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-3xl font-bold gradient-text mb-4">
                {isEn ? 'Application sent!' : 'Заявка отправлена!'}
              </h1>
              <p className="text-gray-300 mb-6">
                {isEn
                  ? 'Thank you for your application. We will review it within 5 business days and contact you via email.'
                  : 'Спасибо за вашу заявку. Мы рассмотрим её в течение 5 рабочих дней и свяжемся с вами по указанному email.'}
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                {isEn ? 'Submit another application' : 'Подать новую заявку'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            {isEn ? 'Apply to the fund' : 'Подать заявку в фонд'}
          </h1>
          
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {isEn ? 'Full name *' : 'ФИО *'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={isEn ? 'Enter your full name' : 'Введите ваше полное имя'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  {isEn ? 'Project category *' : 'Категория проекта *'}
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-gray-500">{isEn ? 'Choose a category' : 'Выберите категорию'}</option>
                  <option value="nko" className="text-white bg-gray-800">{isEn ? 'NGOs — civil society initiatives' : 'НКО — инициативы гражданского общества'}</option>
                  <option value="medicine" className="text-white bg-gray-800">{isEn ? 'Medicine — education for doctors/patients' : 'Медицина — образовательные проекты для медиков/пациентов'}</option>
                  <option value="education" className="text-white bg-gray-800">{isEn ? 'Education — school/university clubs' : 'Образование — школы/вузовские кружки'}</option>
                  <option value="media" className="text-white bg-gray-800">{isEn ? 'Media — local media and newsrooms' : 'СМИ — локальные медиа и редакции'}</option>
                  <option value="individuals" className="text-white bg-gray-800">{isEn ? 'Individuals — students, teachers, parents' : 'Частные лица — студенты, преподаватели, родители'}</option>
                </select>
                
                {/* Описания категорий */}
                {formData.category && (
                  <div className="mt-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-gray-300">
                      {formData.category === 'nko' && (isEn ? 'Digital literacy, privacy, safe data practices.' : 'Цифровая грамотность, приватность, обучение безопасной работе с данными.')}
                      {formData.category === 'medicine' && (isEn ? 'Education for doctors/patients on personal data protection and reducing communication errors.' : 'Образовательные проекты для медиков/пациентов о защите персональных данных и снижении ошибок коммуникаций.')}
                      {formData.category === 'education' && (isEn ? 'Grants for digital hygiene clubs, school newspapers, student communities.' : 'Гранты на кружки по цифровой гигиене, школьные газеты, студэнсообщества.')}
                      {formData.category === 'media' && (isEn ? 'Tools and training for safe publishing and fact-checking.' : 'Инструменты и тренинги по безопасной публикации и проверке материалов.')}
                      {formData.category === 'individuals' && (isEn ? 'Microgrants for software/education if the project brings public benefit.' : 'Микрогранты на софт/обучение, если проект несёт общественную пользу.')}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  {isEn ? 'Project description *' : 'Описание проекта *'}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder={isEn ? 'Describe your project, its goals and how GetLifeUndo helps...' : 'Расскажите о вашем проекте, его целях и том, как GetLifeUndo поможет в его реализации...'}
                />
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-300">
                  {isEn ? 'I consent to personal data processing and receiving notifications about the application status *' : 'Я согласен на обработку персональных данных и получение уведомлений о статусе заявки *'}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.consent}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isEn ? 'Submitting...' : 'Отправляем...') : (isEn ? 'Submit application' : 'Подать заявку')}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="font-semibold text-blue-300 mb-2">{isEn ? 'About the fund' : 'Информация о фонде'}</h3>
              <p className="text-sm text-gray-300">
                {isEn
                  ? 'The GetLifeUndo Fund allocates 10% of all revenue to support user projects. Funds allocation: 40% education, 30% research, 30% social projects.'
                  : 'Фонд GetLifeUndo выделяет 10% от всех доходов на поддержку проектов пользователей. Средства распределяются: 40% на образование, 30% на исследования, 30% на социальные проекты.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}