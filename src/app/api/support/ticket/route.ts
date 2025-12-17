import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { support_tickets } from '@/db/schema';
import { sendEmail } from '@/lib/email/client';

export async function POST(req: Request) {
  try {
    const { email, order_id, topic, message, plan } = await req.json();
    
    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Сохранить в БД
    await db.insert(support_tickets).values({
      email,
      order_id: order_id || null,
      plan: plan || null,
      topic: topic || 'general',
      message,
      status: 'open'
    });
    
    console.info('[support.ticket] Created:', { 
      email, 
      order_id, 
      topic, 
      plan, 
      messageLen: message.length 
    });
    
    // Отправить email уведомление
    try {
      await sendEmail({
        to: 'support@getlifeundo.com',
        subject: `GetLifeUndo Support: ${topic || 'Обращение'}`,
        html: `
          <h2>Новое обращение в поддержку</h2>
          <p><strong>От:</strong> ${email}</p>
          ${order_id ? `<p><strong>Order ID:</strong> ${order_id}</p>` : ''}
          ${plan ? `<p><strong>План:</strong> ${plan}</p>` : ''}
          <p><strong>Тема:</strong> ${topic || 'Общий вопрос'}</p>
          <hr>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });
    } catch (emailError) {
      console.error('[support.ticket] Email send failed:', emailError);
      // Не падаем - тикет уже сохранён в БД
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[support.ticket] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

