import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { email_change_requests, email_domain_rules } from '@/db/schema';
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

async function checkDomainAllowed(domain: string) {
  const rules = await db.query.email_domain_rules.findMany({
    where: eq(email_domain_rules.domain, domain),
  });

  const hasWhitelist = rules.some((r) => r.mode === 'whitelist');
  const isBlacklisted = rules.some((r) => r.mode === 'blacklist');

  if (hasWhitelist && isBlacklisted) {
    throw new Error('Email domain is not allowed');
  }

  if (!hasWhitelist && isBlacklisted) {
    throw new Error('Email domain is blacklisted');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const oldEmail = typeof body.old_email === 'string' ? body.old_email.trim() : '';
    const newEmail = typeof body.new_email === 'string' ? body.new_email.trim() : '';

    if (!oldEmail || !newEmail) {
      return NextResponse.json({ error: 'Missing old_email or new_email' }, { status: 400 });
    }

    if (!isValidEmail(oldEmail) || !isValidEmail(newEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const newDomain = getDomain(newEmail);
    if (!newDomain) {
      return NextResponse.json({ error: 'Invalid email domain' }, { status: 400 });
    }

    await checkDomainAllowed(newDomain);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const token = genToken();

    const [row] = await db
      .insert(email_change_requests)
      .values({
        old_email: oldEmail,
        new_email: newEmail,
        token,
        status: 'pending',
        expires_at: expiresAt,
        created_at: now,
        updated_at: now,
      })
      .returning();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getlifeundo.com';
    const confirmUrl = `${baseUrl}/api/account/email/confirm?token=${encodeURIComponent(token)}`;

    const subject = 'Подтверждение смены email для GetLifeUndo';
    const html = `
      <p>Здравствуйте!</p>
      <p>Вы запросили смену email для аккаунта GetLifeUndo с <b>${oldEmail}</b> на <b>${newEmail}</b>.</p>
      <p>Чтобы подтвердить изменение, перейдите по ссылке:</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      <p>Если вы не запрашивали смену email, просто проигнорируйте это письмо.</p>
      <p>Ссылка действует 24 часа.</p>
    `;

    const result = await sendEmail({ to: newEmail, subject, html });
    if (!result.ok) {
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
    }

    console.log('[account.email.change] request created', {
      id: row.id,
      oldEmail,
      newEmail,
      expiresAt: expiresAt.toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[account.email.change] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
