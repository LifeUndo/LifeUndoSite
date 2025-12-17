import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { admin_events, devices } from '@/db/schema';
import { and, eq, ilike } from 'drizzle-orm';

function requireAdmin(request: NextRequest) {
  const token = request.headers.get('X-Admin-Token');
  const expected = process.env.ADMIN_GRANT_TOKEN;
  if (!token || !expected || token !== expected) {
    throw new Error('unauthorized');
  }
}

async function logAdminEvent(values: typeof admin_events.$inferInsert) {
  try {
    await db.insert(admin_events).values(values as any);
  } catch (error) {
    console.error('[admin.devices.logEvent] Failed to insert admin_event:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const email = searchParams.get('email') || '';
    const kind = searchParams.get('kind') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 500);

    const where = [] as any[];
    if (email) {
      where.push(ilike(devices.user_email, `%${email}%`));
    }
    if (kind) {
      where.push(eq(devices.kind, kind));
    }

    const rows = await db.query.devices.findMany({
      where: where.length ? (and as any)(...where) : undefined,
      limit,
      orderBy: (d: any, helpers: any) => [helpers.desc(d.created_at)],
    });

    return NextResponse.json({ ok: true, items: rows });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.devices.GET] Error:', error);
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

    if (action === 'disable') {
      const [row] = await db
        .update(devices)
        .set({ last_seen_at: now } as any)
        .where(eq(devices.id, id))
        .returning();

      await logAdminEvent({
        actor: 'admin-panel',
        section: 'devices',
        action: 'disable',
        target_type: 'device',
        target_id: id,
        meta: { last_seen_at: now },
      } as any);

      return NextResponse.json({ ok: true, device: row });
    }

    if (action === 'enable') {
      const [row] = await db
        .update(devices)
        .set({ last_seen_at: now } as any)
        .where(eq(devices.id, id))
        .returning();

      await logAdminEvent({
        actor: 'admin-panel',
        section: 'devices',
        action: 'enable',
        target_type: 'device',
        target_id: id,
        meta: { last_seen_at: now },
      } as any);

      return NextResponse.json({ ok: true, device: row });
    }

    if (action === 'setLabel') {
      const label = typeof body.label === 'string' ? body.label.trim() : '';
      const [row] = await db
        .update(devices)
        .set({ label: label || null } as any)
        .where(eq(devices.id, id))
        .returning();

      await logAdminEvent({
        actor: 'admin-panel',
        section: 'devices',
        action: 'setLabel',
        target_type: 'device',
        target_id: id,
        meta: { label: label || null },
      } as any);

      return NextResponse.json({ ok: true, device: row });
    }

    if (action === 'delete') {
      await db
        .update(devices)
        .set({ label: '[удалено админом]' } as any)
        .where(eq(devices.id, id));

      await logAdminEvent({
        actor: 'admin-panel',
        section: 'devices',
        action: 'softDelete',
        target_type: 'device',
        target_id: id,
        meta: { label: '[удалено админом]' },
      } as any);

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.devices.POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
