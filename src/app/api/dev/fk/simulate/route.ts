import { NextRequest, NextResponse } from 'next/server';
import { FK_PLANS } from '@/lib/payments/fk-plans';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in Preview/Dev environment
    const isPreviewOrDev = process.env.VERCEL_ENV !== 'production';
    const isDevEnabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
    
    if (!(isDevEnabled && isPreviewOrDev)) {
      return NextResponse.json({ error: 'Dev simulation disabled' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, email, plan } = body;

    if (!orderId || !email || !plan) {
      return NextResponse.json({ 
        error: 'Missing required fields: orderId, email, plan' 
      }, { status: 400 });
    }

    // Validate plan
    const planConfig = FK_PLANS[plan as keyof typeof FK_PLANS];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Generate FreeKassa signature (simulated)
    const merchantId = process.env.FREEKASSA_MERCHANT_ID || 'test_merchant';
    const secret2 = process.env.FREEKASSA_SECRET2 || 'test_secret2';
    
    // Simulate FreeKassa webhook payload
    const fkPayload = {
      MERCHANT_ID: merchantId,
      AMOUNT: planConfig.amount,
      MERCHANT_ORDER_ID: orderId,
      P_EMAIL: email,
      P_PHONE: '',
      CUR_ID: planConfig.currency,
      SIGN: 'simulated_signature', // In real scenario, this would be calculated
      us_orderid: orderId,
      us_email: email,
      us_plan: plan,
    };

    // Call the real webhook handler
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payments/freekassa/result`;
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(fkPayload as any),
      });

      const result = await response.text();
      
      if (response.ok) {
        return NextResponse.json({
          ok: true,
          message: 'Webhook simulation successful',
          orderId,
          email,
          plan,
          webhookResponse: result,
        });
      } else {
        return NextResponse.json({
          error: 'Webhook simulation failed',
          status: response.status,
          response: result,
        }, { status: 500 });
      }
    } catch (webhookError) {
      console.error('Webhook simulation error:', webhookError);
      return NextResponse.json({
        error: 'Failed to call webhook',
        details: webhookError instanceof Error ? webhookError.message : 'Unknown error',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('FK simulation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
