import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Вычисляем флаги
    const isProd = process.env.VERCEL_ENV === 'production';
    const devEnabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
    const hasDb = !!process.env.DATABASE_URL;

    // Возвращаем 200 с JSON для всех предсказуемых кейсов
    if (isProd) {
      return NextResponse.json({ 
        ok: false, 
        code: 'FORBIDDEN', 
        message: 'Dev grant is disabled in Production.' 
      }, { status: 200 });
    }

    if (!devEnabled) {
      return NextResponse.json({ 
        ok: false, 
        code: 'DEV_DISABLED', 
        message: 'Enable DEV_SIMULATE_WEBHOOK_ENABLED=true' 
      }, { status: 200 });
    }

    if (!hasDb) {
      return NextResponse.json({ 
        ok: false, 
        code: 'NO_DATABASE_URL', 
        message: 'DATABASE_URL is not set for Preview.' 
      }, { status: 200 });
    }

    const body = await request.json();
    const { email, plan } = body;

    if (!email || !plan) {
      return NextResponse.json({ 
        ok: false, 
        code: 'MISSING_PARAMS', 
        message: 'Missing email or plan' 
      }, { status: 200 });
    }

    // Call the actual grant API with server-side token
    const adminToken = process.env.ADMIN_GRANT_TOKEN;
    if (!adminToken) {
      return NextResponse.json({ 
        ok: false, 
        code: 'NO_ADMIN_TOKEN', 
        message: 'Admin token not configured' 
      }, { status: 200 });
    }

    try {
      const grantResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/dev/license/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({ email, plan }),
      });

      const grantData = await grantResponse.json();
      
      if (grantResponse.ok) {
        return NextResponse.json({
          ok: true,
          order_id: grantData.order_id,
          email: grantData.email,
          level: grantData.level,
          expires_at: grantData.expires_at,
          plan: grantData.plan || body.plan,
          bonus_flag: grantData.bonusFlag
        });
      } else {
        return NextResponse.json({ 
          ok: false, 
          code: 'GRANT_FAILED', 
          message: grantData.error || 'Grant failed' 
        }, { status: 200 });
      }
    } catch (dbError) {
      console.error('[DevGrant] Database error:', dbError);
      return NextResponse.json(
        { ok: false, code: 'DB_ERROR', message: 'Database error in Preview.' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('[grant-ui]', error);
    return NextResponse.json({ 
      ok: false,
      code: 'UNEXPECTED',
      message: 'Unexpected error'
    }, { status: 500 });
  }
}
