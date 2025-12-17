import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { devices, pairing_sessions } from '@/db/schema';
import { eq, and, gt, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';
    const shortCode = typeof body.shortCode === 'string' ? body.shortCode.trim().toUpperCase() : '';
    const platform = typeof body.platform === 'string' ? body.platform.trim() : '';

    if (!deviceId || !shortCode || !platform) {
      return NextResponse.json({ error: 'Missing deviceId, shortCode or platform' }, { status: 400 });
    }

    const now = new Date();

    // Найти живую сессию
    const session = await db.query.pairing_sessions.findFirst({
      where: and(
        eq(pairing_sessions.short_code, shortCode),
        eq(pairing_sessions.status, 'pending'),
        gt(pairing_sessions.expires_at, now) as any
      ),
    });

    if (!session) {
      return NextResponse.json({ error: 'Pairing session not found or expired' }, { status: 404 });
    }

    // Инициатор
    const initiator = await db.query.devices.findFirst({
      where: eq(devices.id, session.initiator_device_id),
    });

    if (!initiator) {
      return NextResponse.json({ error: 'Initiator device not found' }, { status: 404 });
    }

    // Найти или создать target-устройство
    let target = await db.query.devices.findFirst({
      where: eq(devices.device_id, deviceId),
    });

    if (!target) {
      const [inserted] = await db
        .insert(devices)
        .values({
          user_email: initiator.user_email,
          device_id: deviceId,
          kind: platform,
          created_at: now,
          last_seen_at: now,
        })
        .returning();
      target = inserted;
    } else {
      const [updated] = await db
        .update(devices)
        .set({ last_seen_at: now })
        .where(eq(devices.id, target.id))
        .returning();
      target = updated;
    }

    // Обновить сессию как linked
    const [updatedSession] = await db
      .update(pairing_sessions)
      .set({
        target_device_id: target.id,
        status: 'linked',
        updated_at: now,
      })
      .where(eq(pairing_sessions.id, session.id))
      .returning();

    // Попробовать вытащить уровень лицензии по email инициатора.
    // Используем сырой SQL, чтобы не зависеть от расхождений схемы (например, столбца seats) между кодом и прод-БД.
    let licenseLevel: string | null = null;
    if (initiator.user_email) {
      try {
        const rows = await db.execute(
          sql`select level, expires_at from licenses where user_email = ${
            initiator.user_email
          } and (expires_at is null or expires_at > now()) order by expires_at desc limit 1` as any,
        );
        const lic: any = Array.isArray(rows) ? rows[0] : (rows as any).rows?.[0];
        if (lic && typeof lic.level === 'string') {
          licenseLevel = lic.level;
        }
      } catch (e) {
        console.error('[pair.consume] Failed to load license level:', e);
      }
    }

    console.log('[pair.consume] session linked', {
      shortCode,
      sessionId: updatedSession.id,
      initiatorDeviceId: initiator.device_id,
      targetDeviceId: target.device_id,
    });

    return NextResponse.json({
      ok: true,
      shortCode,
      initiatorDeviceId: initiator.device_id,
      targetDeviceId: target.device_id,
      licenseLevel,
    });
  } catch (error) {
    console.error('[pair.consume] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
