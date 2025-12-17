import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { admin_events } from '@/db/schema';
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
    const section = searchParams.get('section') || '';
    const targetId = searchParams.get('targetId') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10) || 200, 1000);

    const where: any[] = [];
    if (section) {
      where.push(eq(admin_events.section, section));
    }
    if (targetId) {
      const idNum = parseInt(targetId, 10);
      if (!isNaN(idNum)) {
        where.push(eq(admin_events.target_id, idNum));
      }
    }

    const rows = await db.query.admin_events.findMany({
      where: where.length ? (and as any)(...where) : undefined,
      limit,
      orderBy: (t: any, helpers: any) => [helpers.desc(t.created_at)],
    });

    return NextResponse.json({ ok: true, items: rows });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.events.GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
