import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { FK_MERCHANT_ID, FK_SECRET2, FK_CONFIGURED, FK_CURRENCY } from '@/lib/fk-env';
import { FK_PLANS } from '@/lib/payments/fk-plans';
import { type PlanId } from '@/config/plans';
import { activateLicense, extendLicense } from '@/lib/payments/license';
import { db } from '@/db/client';
import { payments } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const merchantId = formData.get('MERCHANT_ID') as string;
    const amount = formData.get('AMOUNT') as string;
    const orderId = formData.get('MERCHANT_ORDER_ID') as string;
    const signature = formData.get('SIGN') as string;
    const status = formData.get('STATUS') as string;
    
    // Проверяем конфигурацию
    if (!FK_CONFIGURED) {
      console.error('FreeKassa SECRET2 not configured');
      return new Response('Configuration error', { status: 500 });
    }
    
    // Проверяем merchant ID
    if (merchantId !== FK_MERCHANT_ID) {
      console.error('FreeKassa merchant ID mismatch');
      return new Response('Invalid merchant', { status: 400 });
    }
    
    // Проверяем подпись (исправленная схема FreeKassa для callback)
    // Правильный порядок: MERCHANT_ID:AMOUNT:SECRET2:CURRENCY:ORDER_ID
    const signatureString = `${merchantId}:${amount}:${FK_SECRET2}:${FK_CURRENCY}:${orderId}`;
    const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('FreeKassa signature mismatch:', {
        received: signature,
        expected: expectedSignature.substring(0, 8) + '...'
      });
      return new Response('Invalid sign', { status: 400 });
    }
    
    // Извлекаем план из order_id (префикс)
    const planMatch = orderId.match(/^(PROM|VIPL|TEAM5)-/);
    let plan: PlanId | null = null;
    if (planMatch) {
      const prefix = planMatch[1];
      plan = prefix === 'PROM' ? 'pro_month'
        : prefix === 'VIPL' ? 'vip_lifetime'
        : prefix === 'TEAM5' ? 'team_5'
        : null;
    }
    const hasDb = Boolean(process.env.DATABASE_URL);
    if (hasDb) {
      const existing = await db.query.payments.findFirst({
        where: eq(payments.order_id, orderId)
      });
      if (existing && existing.status === 'paid') {
        console.log('[webhook] Already processed:', orderId);
        return new Response('YES', { status: 200 });
      }
      await db.insert(payments).values({
        order_id: orderId,
        plan: plan || 'unknown',
        amount: amount,
        currency: 'RUB',
        status: 'paid',
        paid_at: new Date(),
        raw: { merchantId, amount, orderId, status, signature }
      });
      if (plan) {
        try {
          const email = (formData.get('PAYER_EMAIL') as string) || (formData.get('email') as string) || 'unknown@example.com';
          await activateLicense({ email, plan, orderId });
          console.log('[webhook] License activated:', { orderId, plan, email });
        } catch (error) {
          console.error('[webhook] License activation error:', error);
        }
      }
    } else {
      console.log('[webhook] DB not configured; skipping persistence for', orderId);
    }
    
    // Логируем успешную оплату (без секретов)
    console.log('FreeKassa payment confirmed:', {
      orderId,
      plan,
      amount,
      status,
      merchantId: merchantId.substring(0, 4) + '***',
      sign_ok: true
    });
    
    return new Response('YES', { status: 200 });
    
  } catch (error) {
    console.error('FreeKassa callback error:', error);
    return new Response('Callback processing failed', { status: 500 });
  }
}
