import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { email_validations, email_domain_rules } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/lib/email/client';

function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function getDomain(email: string): string | null {
  const idx = email.indexOf('@');
  if (idx === -1) return null;
  return email.slice(idx + 1).toLowerCase();
}

function genToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const reason = typeof body.reason === 'string' ? body.reason.trim() : 'generic';

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const domain = getDomain(email);
    if (!domain) {
      return NextResponse.json({ error: 'Invalid email domain' }, { status: 400 });
    }

    // Проверка доменных правил: сначала ищем явный whitelist, затем blacklist
    const rules = await db.query.email_domain_rules.findMany({
      where: eq(email_domain_rules.domain, domain),
    });

    const hasWhitelist = rules.some((r) => r.mode === 'whitelist');
    const isBlacklisted = rules.some((r) => r.mode === 'blacklist');

    if (hasWhitelist && isBlacklisted) {
      // В случае конфликта отдадим приоритет blacklist
      return NextResponse.json({ error: 'Email domain is not allowed' }, { status: 400 });
    }

    if (hasWhitelist === false && isBlacklisted) {
      return NextResponse.json({ error: 'Email domain is blacklisted' }, { status: 400 });
    }

    // TTL для токена подтверждения (24 часа)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const token = genToken();

    const [row] = await db
      .insert(email_validations)
      .values({
        email,
        token,
        status: 'pending',
        reason,
        expires_at: expiresAt,
        created_at: now,
        updated_at: now,
      })
      .returning();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getlifeundo.com';
    const confirmUrl = `${baseUrl}/api/account/email/confirm?token=${encodeURIComponent(token)}`;

    const subject = 'Подтверждение email для GetLifeUndo';
    const html = `
      <p>Здравствуйте!</p>
      <p>Вы запросили подтверждение email <b>${email}</b> для сервиса GetLifeUndo.</p>
      <p>Чтобы подтвердить адрес, перейдите по ссылке:</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      <p>Ссылка действует 24 часа.</p>
    `;

    const result = await sendEmail({ to: email, subject, html });
    if (!result.ok) {
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
    }

    console.log('[account.email.request-validate] token created', {
      id: row.id,
      email,
      reason,
      expiresAt: expiresAt.toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[account.email.request-validate] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
