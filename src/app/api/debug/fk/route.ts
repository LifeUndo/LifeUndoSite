import { NextResponse } from 'next/server';
import {
  FK_ENABLED,
  FK_MERCHANT_ID,
  FK_SECRET1,
  FK_SECRET2,
  FK_PAYMENT_URL,
  FK_CURRENCY,
  FK_CONFIGURED,
  FK_PRODUCTS,
} from '@/lib/fk-env';

export async function GET() {
  try {
    const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
    if (env === 'production') {
      return NextResponse.json({ ok: false, error: 'Not available in production' }, { status: 404 });
    }

    const merchantId = FK_MERCHANT_ID;
    const paymentUrl = FK_PAYMENT_URL || 'https://pay.freekassa.net/';

    return NextResponse.json({
      ok: true,
      fkEnabled: !!FK_ENABLED,
      fkConfigured: !!FK_CONFIGURED,
      merchantIdMasked: merchantId ? `${merchantId.substring(0, 3)}***` : null,
      paymentUrl,
      currency: FK_CURRENCY || 'RUB',
      products: FK_PRODUCTS,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('FreeKassa debug error:', error);
    return NextResponse.json({ ok: false, error: 'debug_failed' }, { status: 500 });
  }
}