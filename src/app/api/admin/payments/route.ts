import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { payments } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

function requireAdmin(request: NextRequest) {
  const token = request.headers.get('X-Admin-Token');
  const expected = process.env.ADMIN_GRANT_TOKEN;
  if (!token || !expected || token !== expected) {
    throw new Error('unauthorized');
  }
}

function deriveEmail(raw: any): string | null {
  if (!raw || typeof raw !== 'object') return null;
  const direct = (raw as any).email || (raw as any).payer_email || (raw as any).PAYER_EMAIL;
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  return null;
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const emailFilter = (searchParams.get('email') || '').trim().toLowerCase();
    const orderIdFilter = (searchParams.get('order_id') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10) || 200, 500);

    const where = [] as any[];
    if (orderIdFilter) {
      where.push(eq(payments.order_id, orderIdFilter));
    }

    const rows = await db.query.payments.findMany({
      where: where.length ? (and as any)(...where) : undefined,
      limit,
      orderBy: (p: any, helpers: any) => [helpers.desc(p.created_at)],
    });

    const items = rows
      .map((p: any) => {
        const email = deriveEmail(p.raw);
        return {
          id: p.id,
          order_id: p.order_id,
          email,
          plan: p.plan,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          created_at: p.created_at,
        };
      })
      .filter((it) => {
        if (!emailFilter) return true;
        const e = (it.email || '').toLowerCase();
        return e.includes(emailFilter);
      });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.payments.GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
