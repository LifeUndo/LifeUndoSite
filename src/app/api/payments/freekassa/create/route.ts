import { NextRequest, NextResponse } from 'next/server';
import { PLANS, isValidPlan, getPlanAmount, type PlanId } from '@/config/plans';
import crypto from 'crypto';
import { FK_CURRENCY } from '@/lib/fk-env';
import { getOrderPrefix } from '@/lib/payments/fk-plans';

// Совместимость: план → productId
const PLAN_TO_PRODUCT: Record<string, string> = {
  pro_month: 'PROM',
  vip_lifetime: 'VIPL',
  team_5: 'TEAM5',
  starter_6m: 'S6M',
};

const PRODUCT_TO_PLAN: Record<string, PlanId | undefined> = {
  PROM: 'pro_month',
  VIPL: 'vip_lifetime',
  TEAM5: 'team_5',
  S6M: 'starter_6m' as any,
};

// Фиксированные суммы по productId (строго две цифры при форматировании)
const PRODUCT_AMOUNTS_RUB: Record<string, number> = {
  PROM: 599.00,
  VIPL: 9990.00,
  TEAM5: 2990.00,
  S6M: 3000.00,
} as const;

// Опциональные суммы в USD из ENV (если не заданы — используем RUB-варианты как временный фоллбэк)
const ENV_USD = {
  PROM: Number(process.env.FREEKASSA_USD_PROM || NaN),
  VIPL: Number(process.env.FREEKASSA_USD_VIPL || NaN),
  TEAM5: Number(process.env.FREEKASSA_USD_TEAM5 || NaN),
  S6M: Number(process.env.FREEKASSA_USD_S6M || NaN),
};
const PRODUCT_AMOUNTS_USD: Record<string, number> = {
  PROM: Number.isFinite(ENV_USD.PROM) ? ENV_USD.PROM : 599.00,
  VIPL: Number.isFinite(ENV_USD.VIPL) ? ENV_USD.VIPL : 9990.00,
  TEAM5: Number.isFinite(ENV_USD.TEAM5) ? ENV_USD.TEAM5 : 2990.00,
  S6M: Number.isFinite(ENV_USD.S6M) ? ENV_USD.S6M : 3000.00,
} as const;

export async function POST(req: NextRequest) {
  try {
    // Разбор входа с совместимостью (plan или productId)
    const body = await req.json().catch(() => ({} as any));
    const planRaw = body?.plan;
    const productIdRaw = body?.productId;
    const emailRaw = body?.email;
    const plan = typeof planRaw === 'string' ? planRaw.trim() : undefined;
    const productId = typeof productIdRaw === 'string' ? productIdRaw.trim() : undefined;
    const email = typeof emailRaw === 'string' ? emailRaw.trim() : undefined;
    const localeRaw = body?.locale;
    const locale = typeof localeRaw === 'string' ? localeRaw.toLowerCase() : undefined;

    // Включение: флаг или наличие секретов (позволяет не падать, если флаг не выставлен, но секреты заданы)
    const flagEnabled = String(process.env.NEXT_PUBLIC_FK_ENABLED || '').toLowerCase() === 'true';
    const secretsPresent = Boolean(process.env.FREEKASSA_MERCHANT_ID && process.env.FREEKASSA_SECRET1);
    const fkEnabled = flagEnabled || secretsPresent;
    if (!fkEnabled) {
      return NextResponse.json({ ok: false, error: 'fk-disabled' }, { status: 400 });
    }

    // Вычисляем productId по плану, если он не передан
    const effectiveProductId = productId || (plan ? PLAN_TO_PRODUCT[plan] : undefined);

    // Валидация входа
    if (!effectiveProductId) {
      return NextResponse.json(
        { ok: false, error: plan ? 'invalid_plan' : 'invalid_productId' },
        { status: 400 }
      );
    }
    // валидируем productId уже по выбранной таблице дальше

    const MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID!;
    const SECRET1 = process.env.FREEKASSA_SECRET1!;

    // Определяем валюту: RU→RUB, EN→USD; иначе — системное значение/дефолт RUB
    const requestedCurrency = locale === 'en' ? 'USD' : locale === 'ru' ? 'RUB' : undefined;
    const CURRENCY = requestedCurrency || FK_CURRENCY || 'RUB';

    // Выбираем таблицу сумм по валюте
    const AMOUNTS = CURRENCY === 'USD' ? PRODUCT_AMOUNTS_USD : PRODUCT_AMOUNTS_RUB;
    const amountNum = AMOUNTS[effectiveProductId];
    if (!amountNum) {
      return NextResponse.json({ ok: false, error: 'amount_not_configured' }, { status: 500 });
    }
    const AMOUNT = amountNum.toFixed(2); // строго две цифры
    // Префикс по плану для удобства дальнейшей обработки webhook
    const planForPrefix: PlanId | undefined = PRODUCT_TO_PLAN[effectiveProductId];
    const prefix = planForPrefix ? getOrderPrefix(planForPrefix) : effectiveProductId;
    const ORDER_ID = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    // CURRENCY уже выбран выше

    // Подпись (без раскрытия деталей в логах) по новой доке: MERCHANT_ID:AMOUNT:SECRET1:CURRENCY:ORDER_ID
    const signatureString = `${MERCHANT_ID}:${AMOUNT}:${SECRET1}:${CURRENCY}:${ORDER_ID}`;
    const SIGN = crypto.createHash('md5').update(signatureString, 'utf8').digest('hex');

    // Формируем поля формы и URL для редиректа
    const qs = new URLSearchParams({
      m: MERCHANT_ID,
      oa: AMOUNT,
      o: ORDER_ID,
      s: SIGN,
      currency: CURRENCY,
    });

    // Базовый URL оплаты: защищаемся от устаревших доменов в ENV
    const rawBase = process.env.FREEKASSA_PAYMENT_URL || 'https://pay.freekassa.net/';
    const isNet = /^https:\/\/(?:pay\.)?freekassa\.net\/?$/i.test(rawBase);
    const baseUrl = isNet ? (rawBase.endsWith('/') ? rawBase : rawBase + '/') : 'https://pay.freekassa.net/';
    const pay_url = `${baseUrl}?${qs.toString()}`;

    // Логируем для отладки (без секретов)
    console.log('FreeKassa payment created:', {
      productId: effectiveProductId,
      orderId: ORDER_ID,
      amount: AMOUNT,
      currency: CURRENCY,
      signatureString: signatureString.replace(SECRET1, '***'),
      signature: SIGN.substring(0, 8) + '...',
      payUrl: pay_url.substring(0, 50) + '...',
    });

    // Опциональные настройки метода/языка из ENV
    const LANG = (process.env.FREEKASSA_LANG || '').trim(); // например, 'ru' | 'en'
    const METHOD_ID = (process.env.FREEKASSA_METHOD_ID || '').trim(); // например, '4' (карты RUB), см. доку

    return NextResponse.json({
      ok: true,
      pay_url,
      orderId: ORDER_ID,
      productId: effectiveProductId,
      form: {
        action: baseUrl, // всегда https://pay.freekassa.net/
        method: 'POST',
        fields: {
          m: MERCHANT_ID,
          oa: AMOUNT,
          o: ORDER_ID,
          s: SIGN,
          currency: CURRENCY,
          ...(email ? { us_email: email } : {}),
          ...(LANG ? { lang: LANG } : {}),
          ...(METHOD_ID ? { i: METHOD_ID } : {}),
        }
      }
    });
  } catch (error) {
    console.error('FreeKassa payment error:', error);
    return NextResponse.json({ ok: false, error: 'payment_creation_failed' }, { status: 500 });
  }
}

