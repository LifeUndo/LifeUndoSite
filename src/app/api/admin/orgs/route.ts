import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { orgs } from '@/db/schema';
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
    const email = searchParams.get('owner_email') || '';
    const status = searchParams.get('status') || '';
    const tier = searchParams.get('tier') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 500);

    const where: any[] = [];
    if (email) where.push(ilike(orgs.owner_email, `%${email}%`));
    if (status) where.push(eq(orgs.status, status));
    if (tier) where.push(eq(orgs.tier, tier));

    const rows = await db.query.orgs.findMany({
      where: where.length ? (and as any)(...where) : undefined,
      limit,
      orderBy: (t: any, helpers: any) => [helpers.desc(t.created_at)],
    });

    return NextResponse.json({ ok: true, items: rows });
  } catch (error: any) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.orgs.GET] Error:', error);
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

    if (action === 'create') {
      const payload: any = {
        slug: String(body.slug || '').trim() || undefined,
        name: String(body.name || '').trim(),
        owner_email: String(body.owner_email || '').trim(),
        tier: String(body.tier || 'free_team'),
        cloud_level: String(body.cloud_level || 'off'),
        status: String(body.status || 'active'),
      };
      const [row] = await db.insert(orgs).values(payload).returning();
      return NextResponse.json({ ok: true, org: row });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    if (action === 'update') {
      const patch: any = {};
      if (body.name) patch.name = String(body.name);
      if (body.owner_email) patch.owner_email = String(body.owner_email);
      if (body.tier) patch.tier = String(body.tier);
      if (body.cloud_level) patch.cloud_level = String(body.cloud_level);
      if (body.status) patch.status = String(body.status);

      const [row] = await db.update(orgs).set(patch).where(eq(orgs.id, id)).returning();
      return NextResponse.json({ ok: true, org: row });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.orgs.POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
