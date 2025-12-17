import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { devices, pairing_sessions, licenses } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

function genShortCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const pick = (n: number) => Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `${pick(4)}-${pick(4)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';
    const platform = typeof body.platform === 'string' ? body.platform.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!deviceId || !platform) {
      return NextResponse.json({ error: 'Missing deviceId or platform' }, { status: 400 });
    }

    const now = new Date();

    // Найти или создать устройство
    let deviceRow = await db.query.devices.findFirst({
      where: eq(devices.device_id, deviceId),
    });

    if (!deviceRow) {
      const [inserted] = await db
        .insert(devices)
        .values({
          user_email: email || 'unknown@local',
          device_id: deviceId,
          kind: platform,
          created_at: now,
          last_seen_at: now,
        })
        .returning();
      deviceRow = inserted;
    } else {
      const [updated] = await db
        .update(devices)
        .set({
          user_email: email || deviceRow.user_email,
          last_seen_at: now,
        })
        .where(eq(devices.id, deviceRow.id))
        .returning();
      deviceRow = updated;
    }

    // Проверка лицензии по email (если есть)
    let licenseLevel: string | null = null;
    if (email) {
      const lic = await db.query.licenses.findFirst({
        where: and(
          eq(licenses.user_email, email),
          // либо бессрочная, либо не истёкшая
          // drizzle gt по timestamp, null допустим
          gt(licenses.expires_at, now) as any
        ),
      });
      if (lic) {
        licenseLevel = lic.level;
      }
    }

    // Создать pairing session с TTL ~15 минут
    const ttlMinutes = 15;
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);
    const shortCode = genShortCode();

    const [session] = await db
      .insert(pairing_sessions)
      .values({
        short_code: shortCode,
        initiator_device_id: deviceRow.id,
        status: 'pending',
        expires_at: expiresAt,
        meta: null,
        created_at: now,
        updated_at: now,
      })
      .returning();

    console.log('[pair.create] session created', {
      deviceId,
      email: email || null,
      platform,
      shortCode,
      sessionId: session.id,
    });

    return NextResponse.json({
      ok: true,
      shortCode,
      expiresAt: expiresAt.toISOString(),
      licenseLevel,
    });
  } catch (error) {
    console.error('[pair.create] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
