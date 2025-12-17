import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { org_keys } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

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
    const orgId = parseInt(searchParams.get('org_id') || '0', 10) || 0;
    const status = searchParams.get('status') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 500);

    const where: any[] = [];
    if (orgId) where.push(eq(org_keys.org_id, orgId));
    if (status) where.push(eq(org_keys.status, status));

    const rows = await db.query.org_keys.findMany({
      where: where.length ? (and as any)(...where) : undefined,
      limit,
      orderBy: (t: any, helpers: any) => [helpers.desc(t.created_at)],
    });

    return NextResponse.json({ ok: true, items: rows });
  } catch (error: any) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.org-keys.GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json().catch(() => ({} as any));
    const id = typeof body.id === 'number' ? body.id : null;
    const action = typeof body.action === 'string' ? body.action : '';

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    const now = new Date();

    if (action === 'create') {
      const payload: any = {
        org_id: Number(body.org_id),
        key: String(body.key || '').trim(),
        role: String(body.role || 'member'),
        usage_limit: typeof body.usage_limit === 'number' ? body.usage_limit : null,
        expires_at: body.expires_at ? new Date(body.expires_at) : null,
        status: 'active',
        used_count: 0,
        created_at: now,
        updated_at: now,
      };
      const [row] = await db.insert(org_keys).values(payload).returning();
      return NextResponse.json({ ok: true, key: row });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    if (action === 'revoke') {
      const [row] = await db
        .update(org_keys)
        .set({ status: 'revoked', updated_at: now } as any)
        .where(eq(org_keys.id, id))
        .returning();
      return NextResponse.json({ ok: true, key: row });
    }

    if (action === 'update') {
      const patch: any = { updated_at: now };
      if (body.role) patch.role = String(body.role);
      if (typeof body.usage_limit === 'number') patch.usage_limit = body.usage_limit;
      if (body.expires_at) patch.expires_at = new Date(body.expires_at);
      if (body.status) patch.status = String(body.status);

      const [row] = await db
        .update(org_keys)
        .set(patch)
        .where(eq(org_keys.id, id))
        .returning();
      return NextResponse.json({ ok: true, key: row });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.org-keys.POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
