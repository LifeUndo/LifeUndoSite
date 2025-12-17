import { FK_PLANS } from '@/lib/payments/fk-plans';
import { type PlanId } from '@/config/plans';

export interface LicenseEmailData {
  email: string;
  plan: PlanId;
  orderId: string;
  expiresAt?: Date;
}

export function renderLicenseActivatedEmail(data: LicenseEmailData): { subject: string; html: string } {
  const { email, plan, orderId, expiresAt } = data;
  const planConfig = FK_PLANS[plan];
  
  const expiresText = expiresAt 
    ? `Активна до: <strong>${expiresAt.toLocaleDateString('ru-RU')}</strong>`
    : `Активна: <strong>навсегда</strong>`;
  
  const bonusText = (planConfig as any).bonusFlag 
    ? `<br>Бонус: <strong>${(planConfig as any).bonusFlag}</strong> до ${expiresAt?.toLocaleDateString('ru-RU')}`
    : '';

  const subject = `GetLifeUndo — лицензия активирована (заказ #${orderId})`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
    .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Ваша лицензия GetLifeUndo активирована!</h1>
    </div>
    <div class="content">
      <p>Привет!</p>
      <p>Спасибо за покупку <strong>${planConfig.title}</strong>.</p>
      
      <div class="info-box">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Лицензия:</strong> Pro</p>
        <p>${expiresText}${bonusText}</p>
      </div>
      
      <h3>Как активировать:</h3>
      <ol>
        <li>Установите расширение GetLifeUndo для браузера</li>
        <li>Откройте настройки → Лицензия</li>
        <li>Лицензия активируется автоматически по email</li>
      </ol>
      
      <h3>Возможности Pro:</h3>
      <ul>
        <li>История буфера обмена (50 элементов)</li>
        <li>Восстановление закрытых вкладок</li>
        <li>Автосохранение форм</li>
        <li>Экспорт данных</li>
        <li>Приоритетная поддержка</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://getlifeundo.com/ru/features?order_id=${orderId}" class="button">Узнать возможности</a>
        <a href="https://getlifeundo.com/ru/support?order_id=${orderId}&email=${email}" class="button" style="background: #6b7280;">Нужна помощь?</a>
      </div>
      
      <div class="footer">
        <p>С уважением,<br>Команда GetLifeUndo</p>
        <p>
          <a href="https://t.me/GetLifeUndo">Telegram</a> | 
          <a href="https://getlifeundo.com/ru/support">Поддержка</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  return { subject, html };
}


