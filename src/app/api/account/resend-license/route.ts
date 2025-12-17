import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { payments, licenses, feature_flags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/lib/email/client';
import { renderLicenseActivatedEmail } from '@/lib/email/templates/license-activated';

export async function POST(req: Request) {
  try {
    const { order_id, email } = await req.json();
    
    if (!order_id && !email) {
      return NextResponse.json({ error: 'Missing order_id or email' }, { status: 400 });
    }
    
    // Найти платеж
    let payment;
    if (order_id) {
      payment = await db.query.payments.findFirst({
        where: eq(payments.order_id, order_id)
      });
    }
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // Извлечь email из платежа или использовать переданный
    const userEmail = email || (payment.raw as any)?.email || (payment.raw as any)?.PAYER_EMAIL;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    
    // Найти лицензию
    const license = await db.query.licenses.findFirst({
      where: eq(licenses.user_email, userEmail)
    });
    
    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }
    
    // Найти флаги
    const flags = await db.query.feature_flags.findMany({
      where: eq(feature_flags.user_email, userEmail)
    });
    
    // Отправить письмо заново
    const emailContent = renderLicenseActivatedEmail({
      email: userEmail,
      plan: payment.plan as any,
      orderId: payment.order_id,
      expiresAt: license.expires_at || undefined
    });
    
    const result = await sendEmail({
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html
    });
    
    if (!result.ok) {
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
    }
    
    console.log('[account.resend] Email resent:', { order_id, email: userEmail });
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Email resent successfully',
      email: userEmail 
    });
    
  } catch (error) {
    console.error('[account.resend] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

