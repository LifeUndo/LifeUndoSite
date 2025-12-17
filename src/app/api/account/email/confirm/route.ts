import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { email_validations, email_change_requests, licenses, feature_flags, devices } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function handleToken(token: string) {
  const now = new Date();

  // 1) Попробовать как email_validations
  const validation = await db.query.email_validations.findFirst({
    where: eq(email_validations.token, token),
  });

  if (validation) {
    if (validation.status !== 'pending') {
      return { ok: false, reason: 'already-used' as const };
    }
    if (validation.expires_at && validation.expires_at <= now) {
      await db
        .update(email_validations)
        .set({ status: 'expired', updated_at: now })
        .where(eq(email_validations.id, validation.id));
      return { ok: false, reason: 'expired' as const };
    }

    await db
      .update(email_validations)
      .set({ status: 'confirmed', updated_at: now })
      .where(eq(email_validations.id, validation.id));

    return { ok: true, kind: 'validation' as const, email: validation.email };
  }

  // 2) Попробовать как email_change_requests
  const changeReq = await db.query.email_change_requests.findFirst({
    where: eq(email_change_requests.token, token),
  });

  if (!changeReq) {
    return { ok: false, reason: 'not-found' as const };
  }

  if (changeReq.status !== 'pending') {
    return { ok: false, reason: 'already-used' as const };
  }

  if (changeReq.expires_at && changeReq.expires_at <= now) {
    await db
      .update(email_change_requests)
      .set({ status: 'expired', updated_at: now })
      .where(eq(email_change_requests.id, changeReq.id));
    return { ok: false, reason: 'expired' as const };
  }

  // Обновить все сущности на новый email
  const oldEmail = changeReq.old_email;
  const newEmail = changeReq.new_email;

  await db.update(licenses).set({ user_email: newEmail }).where(eq(licenses.user_email, oldEmail));
  await db.update(feature_flags).set({ user_email: newEmail }).where(eq(feature_flags.user_email, oldEmail));
  await db.update(devices).set({ user_email: newEmail }).where(eq(devices.user_email, oldEmail));

  await db
    .update(email_change_requests)
    .set({ status: 'confirmed', updated_at: now })
    .where(eq(email_change_requests.id, changeReq.id));

  return { ok: true, kind: 'change' as const, oldEmail, newEmail };
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || '';
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const result = await handleToken(token);

    if (!result.ok) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[account.email.confirm] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
