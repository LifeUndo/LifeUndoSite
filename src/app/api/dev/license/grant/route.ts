import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { payments, licenses, feature_flags } from '@/db/schema';
import { activateLicense } from '@/lib/payments/license';
import { FK_PLANS } from '@/lib/payments/fk-plans';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in Preview/Dev environment
    const isPreviewOrDev = process.env.VERCEL_ENV !== 'production';
    const isDevEnabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
    
    if (!(isDevEnabled && isPreviewOrDev)) {
      return NextResponse.json({ error: 'Dev mode disabled' }, { status: 403 });
    }

    // Check admin token
    const adminToken = request.headers.get('X-Admin-Token');
    const expectedToken = process.env.ADMIN_GRANT_TOKEN;
    
    if (!adminToken || !expectedToken || adminToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, plan } = body;

    if (!email || !plan) {
      return NextResponse.json({ error: 'Missing email or plan' }, { status: 400 });
    }

    // Validate plan
    const planConfig = FK_PLANS[plan as keyof typeof FK_PLANS];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Generate order ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const orderId = `GRANT-${timestamp}-${random}`;

    // Create payment record
    await db.insert(payments).values({
      order_id: orderId,
      plan: plan,
      amount: planConfig.amount,
      currency: planConfig.currency,
      status: 'paid',
      paid_at: new Date(),
      created_at: new Date(),
    });

    // Activate license
    const licenseResult = await activateLicense({
      orderId,
      email,
      plan: plan as any,
    });

    return NextResponse.json({
      ok: true,
      order_id: orderId,
      email,
      level: licenseResult.license.level,
      expires_at: licenseResult.license.expires_at,
      plan: plan,
      bonus_flag: licenseResult.flags?.[0]?.key || null,
    });

  } catch (error) {
    console.error('Admin grant error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
