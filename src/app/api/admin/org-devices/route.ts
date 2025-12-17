import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { org_devices } from '@/db/schema';
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
    const deviceId = searchParams.get('device_id') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 500);

    const where: any[] = [];
    if (orgId) where.push(eq(org_devices.org_id, orgId));
    if (deviceId) where.push(eq(org_devices.device_id, deviceId));

    const rows = await db.query.org_devices.findMany({
      where: where.length ? (and as any)(...where) : undefined,
      limit,
      orderBy: (t: any, helpers: any) => [helpers.desc(t.created_at)],
    });

    return NextResponse.json({ ok: true, items: rows });
  } catch (error: any) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.org-devices.GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json().catch(() => ({} as any));
    const id = typeof body.id === 'number' ? body.id : null;
    const action = typeof body.action === 'string' ? body.action : '';

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    const now = new Date();

    if (action === 'setRole') {
      const role = String(body.role || 'member');
      const [row] = await db
        .update(org_devices)
        .set({ role, updated_at: now } as any)
        .where(eq(org_devices.id, id))
        .returning();
      return NextResponse.json({ ok: true, device: row });
    }

    if (action === 'disable' || action === 'enable') {
      const status = action === 'disable' ? 'disabled' : 'active';
      const [row] = await db
        .update(org_devices)
        .set({ status, updated_at: now } as any)
        .where(eq(org_devices.id, id))
        .returning();
      return NextResponse.json({ ok: true, device: row });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.org-devices.POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
