import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { email_domain_rules } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    const rows = await db.query.email_domain_rules.findMany({
      orderBy: (t: any, helpers: any) => [helpers.asc(t.domain)],
    });

    return NextResponse.json({ ok: true, items: rows });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.email-domains.GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json().catch(() => ({}));
    const action = typeof body.action === 'string' ? body.action : '';
    const domain = typeof body.domain === 'string' ? body.domain.trim().toLowerCase() : '';

    if (!action || !domain) {
      return NextResponse.json({ error: 'Missing action or domain' }, { status: 400 });
    }

    if (action === 'delete') {
      await db.delete(email_domain_rules).where(eq(email_domain_rules.domain, domain));
      return NextResponse.json({ ok: true });
    }

    if (action === 'upsert') {
      const mode = body.mode === 'whitelist' ? 'whitelist' : body.mode === 'blacklist' ? 'blacklist' : 'blacklist';
      const comment = typeof body.comment === 'string' ? body.comment : null;

      const existing = await db.query.email_domain_rules.findFirst({
        where: eq(email_domain_rules.domain, domain),
      });

      const now = new Date();

      if (existing) {
        const [row] = await db
          .update(email_domain_rules)
          .set({ mode, comment, updated_at: now })
          .where(eq(email_domain_rules.id, existing.id))
          .returning();
        return NextResponse.json({ ok: true, rule: row });
      }

      const [row] = await db
        .insert(email_domain_rules)
        .values({ domain, mode, comment, created_at: now, updated_at: now })
        .returning();

      return NextResponse.json({ ok: true, rule: row });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[admin.email-domains.POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
