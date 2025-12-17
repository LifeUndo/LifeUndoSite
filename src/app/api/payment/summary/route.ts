import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { payments, licenses, feature_flags } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('order_id');
  
  if (!orderId) {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
  }
  
  try {
    const hasDb = Boolean(process.env.DATABASE_URL);
    if (!hasDb) {
      // Без БД возвращаем мягкий ответ, чтобы страница успеха не падала
      return NextResponse.json({
        ok: true,
        order_id: orderId,
        status: 'processed',
        note: 'DB not configured; detailed summary unavailable'
      }, { status: 200 });
    }
    // Найти платеж
    const payment = await db.query.payments.findFirst({
      where: eq(payments.order_id, orderId)
    });
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // Найти лицензию по email из платежа
    const email = (payment.raw as any)?.email || 'unknown';
    
    const license = await db.query.licenses.findFirst({
      where: eq(licenses.user_email, email)
    });
    
    // Найти флаги
    const flags = await db.query.feature_flags.findMany({
      where: eq(feature_flags.user_email, email)
    });
    
    return NextResponse.json({
      ok: true,
      order_id: payment.order_id,
      plan: payment.plan,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paid_at: payment.paid_at,
      email,
      license: license ? {
        level: license.level,
        expires_at: license.expires_at,
        seats: license.seats
      } : null,
      flags: flags.map((f: any) => ({
        key: f.key,
        value: f.value,
        expires_at: f.expires_at
      }))
    });
  } catch (error) {
    console.error('[payment.summary] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}







