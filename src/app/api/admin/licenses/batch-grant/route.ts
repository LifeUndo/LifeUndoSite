import { NextRequest, NextResponse } from 'next/server';
import { activateLicense } from '@/lib/payments/license';

function requireAdmin(request: NextRequest) {
  const token = request.headers.get('X-Admin-Token');
  const expected = process.env.ADMIN_GRANT_TOKEN;
  if (!token || !expected || token !== expected) {
    throw new Error('unauthorized');
  }
}

interface BatchItem {
  email: string;
  plan: string;
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json().catch(() => ({}));
    const items = Array.isArray(body.items) ? (body.items as BatchItem[]) : [];

    if (!items.length) {
      return NextResponse.json({ error: 'Missing items' }, { status: 400 });
    }

    const results: any[] = [];

    for (const it of items) {
      const email = typeof it.email === 'string' ? it.email.trim() : '';
      const plan = typeof it.plan === 'string' ? it.plan.trim() : '';
      if (!email || !plan) {
        results.push({ ok: false, email, plan, error: 'Invalid item' });
        continue;
      }

      try {
        const orderId = `BATCH-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const res = await activateLicense({ email, plan: plan as any, orderId });
        results.push({ ok: true, email, plan, license: res.license });
      } catch (e) {
        results.push({ ok: false, email, plan, error: e instanceof Error ? e.message : 'Unknown error' });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.licenses.batch-grant] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
