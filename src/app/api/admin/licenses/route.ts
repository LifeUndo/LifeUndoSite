import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { admin_events, licenses } from '@/db/schema';
import { and, eq, ilike } from 'drizzle-orm';

function requireAdmin(request: NextRequest) {
  const token = request.headers.get('X-Admin-Token');
  const expected = process.env.ADMIN_GRANT_TOKEN;
  if (!token || !expected || token !== expected) {
    throw new Error('unauthorized');
  }
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const email = searchParams.get('email') || '';
    const plan = searchParams.get('plan') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 500);

    const where = [] as any[];
    if (email) {
      where.push(ilike(licenses.user_email, `%${email}%`));
    }
    if (plan) {
      where.push(eq(licenses.plan, plan));
    }

    const rows = await db.query.licenses.findMany({
      where: where.length ? (and as any)(...where) : undefined,
      limit,
      orderBy: (l: any, helpers: any) => [helpers.desc(l.created_at)],
    });

    return NextResponse.json({ ok: true, items: rows });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.licenses.GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json().catch(() => ({}));
    const id = typeof body.id === 'number' ? body.id : null;
    const action = typeof body.action === 'string' ? body.action : '';

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    const now = new Date();

    if (action === 'revoke') {
      const [row] = await db
        .update(licenses)
        .set({ expires_at: now, updated_at: now })
        .where(eq(licenses.id, id))
        .returning();
      await db.insert(admin_events).values({
        actor: 'admin-panel',
        section: 'licenses',
        action: 'revoke',
        target_type: 'license',
        target_id: id,
        meta: { expires_at: now },
      } as any);
      return NextResponse.json({ ok: true, license: row });
    }

    if (action === 'update') {
      const patch: any = {};
      if (body.level) patch.level = String(body.level);
      if (body.plan) patch.plan = String(body.plan);
      if (body.expires_at) patch.expires_at = new Date(body.expires_at);
      patch.updated_at = now;

      const [row] = await db
        .update(licenses)
        .set(patch)
        .where(eq(licenses.id, id))
        .returning();
      await db.insert(admin_events).values({
        actor: 'admin-panel',
        section: 'licenses',
        action: 'update',
        target_type: 'license',
        target_id: id,
        meta: patch,
      } as any);
      return NextResponse.json({ ok: true, license: row });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.licenses.POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
