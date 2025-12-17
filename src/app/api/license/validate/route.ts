import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { devices, licenses } from '@/db/schema';
import { eq, and, gt, desc, or, isNull } from 'drizzle-orm';

const TRIAL_DAYS = 7;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';
    const platform = typeof body.platform === 'string' ? body.platform.trim() : '';
    const version = typeof body.version === 'string' ? body.version.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!deviceId || !platform) {
      return NextResponse.json({ error: 'Missing deviceId or platform' }, { status: 400 });
    }

    const now = new Date();

    // Базовая модель ответа по умолчанию (локальный триал на стороне клиента)
    const base = {
      ok: true,
      status: 'trial' as const,
      tier: 'free',
      trialStart: null as string | null,
      trialEnd: null as string | null,
      deviceStatus: 'active' as const,
      devicesUsed: 0,
      deviceLimit: 5,
    };

    // Зарегистрировать/обновить устройство, если БД сконфигурирована
    let userEmail: string | null = email || null;

    let devicesUsed = 0;

    try {
      let deviceRow = await db.query.devices.findFirst({
        where: eq(devices.device_id, deviceId),
      });

      if (!deviceRow) {
        const [inserted] = await db
          .insert(devices)
          .values({
            user_email: userEmail || 'unknown@local',
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
            user_email: userEmail || deviceRow.user_email,
            last_seen_at: now,
          })
          .where(eq(devices.id, deviceRow.id))
          .returning();
        deviceRow = updated;
      }

      if (!userEmail && deviceRow.user_email) {
        userEmail = deviceRow.user_email;
      }

      // посчитаем количество устройств, привязанных к этому email
      if (userEmail) {
        const userDevices = await db.query.devices.findMany({
          where: eq(devices.user_email, userEmail),
        });
        devicesUsed = (userDevices || []).length;
      }
    } catch (e) {
      // Если DATABASE_URL не задана или другая ошибка — просто вернём базовый ответ
      console.warn('[license.validate] DB unavailable, returning base response');
      return NextResponse.json(base);
    }

    // Если есть email — попробовать найти действующую лицензию
    if (!userEmail) {
      return NextResponse.json({
        ...base,
        devicesUsed,
      });
    }

    // 1) ищем любую актуальную лицензию (trial или платную).
    // Важно: lifetime-VIP имеет expires_at = null, поэтому учитываем и этот вариант как «активный».
    let existingLic: any = null;
    let lastTrial: any = null;
    try {
      existingLic = await db.query.licenses.findFirst({
        where: and(
          eq(licenses.user_email, userEmail),
          or(
            isNull(licenses.expires_at),
            gt(licenses.expires_at, now) as any,
          ) as any,
        ),
      });

      // 2) ищем последний когда-либо созданный триал для этого email
      lastTrial = await db.query.licenses.findFirst({
        where: and(
          eq(licenses.user_email, userEmail),
          eq(licenses.plan, 'trial-7d'),
        ),
        orderBy: [desc(licenses.created_at as any)],
      } as any);
    } catch (e) {
      console.error('[license.validate] Failed to query licenses table, returning base response', e);
      return NextResponse.json({
        ...base,
        devicesUsed,
      });
    }

    // Обновим статус устройства по лимиту
    const deviceLimit = 5;
    const deviceStatus = devicesUsed > deviceLimit ? 'limit_exceeded' as const : 'active' as const;

    // Если активной лицензии нет и триала ещё никогда не было — создаём первый централизованный 7-дневный триал
    if (!existingLic && !lastTrial) {
      const trialStart = now;
      const trialEnd = new Date(trialStart.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

      const [trialLic] = await db
        .insert(licenses)
        .values({
          user_email: userEmail,
          level: 'free',
          plan: 'trial-7d',
          expires_at: trialEnd,
          seats: 1,
          activated_at: trialStart,
        })
        .returning();

      return NextResponse.json({
        ok: true,
        status: 'trial' as const,
        tier: 'free',
        trialStart: (trialLic.activated_at || trialStart).toISOString(),
        trialEnd: (trialLic.expires_at || trialEnd).toISOString(),
        deviceStatus,
        devicesUsed,
        deviceLimit,
      });
    }

    // Если есть активная лицензия — различаем платную и триальную
    if (existingLic) {
      const isTrial = existingLic.plan === 'trial-7d' || existingLic.level === 'free';

      if (isTrial) {
        return NextResponse.json({
          ok: true,
          status: 'trial' as const,
          tier: 'free',
          trialStart: (existingLic.activated_at || existingLic.created_at || now).toISOString(),
          trialEnd: (existingLic.expires_at || null) ? existingLic.expires_at!.toISOString() : null,
          deviceStatus,
          devicesUsed,
          deviceLimit,
        });
      }

      const resp = {
        ok: true,
        status: 'active' as const,
        tier: existingLic.level || 'pro',
        trialStart: null as string | null,
        trialEnd: (existingLic.expires_at || null) ? existingLic.expires_at!.toISOString() : null,
        deviceStatus,
        devicesUsed,
        deviceLimit,
      };

      return NextResponse.json(resp);
    }

    // Активной лицензии уже нет, зато есть исторический триал — не создаём новый, а честно возвращаем истёкший триал
    if (lastTrial) {
      return NextResponse.json({
        ok: true,
        status: 'trial' as const,
        tier: 'free',
        trialStart: (lastTrial.activated_at || lastTrial.created_at || now).toISOString(),
        trialEnd: (lastTrial.expires_at || null) ? lastTrial.expires_at!.toISOString() : null,
        deviceStatus,
        devicesUsed,
        deviceLimit,
      });
    }

    // На всякий случай —fallback к базовой модели с устройствами
    const resp = {
      ...base,
      devicesUsed,
    };

    return NextResponse.json(resp);
  } catch (error) {
    console.error('[license.validate] Error, returning base response instead of 500:', error);
    return NextResponse.json({
      ok: true,
      status: 'trial',
      tier: 'free',
      trialStart: null,
      trialEnd: null,
      deviceStatus: 'active',
      devicesUsed: 0,
      deviceLimit: 5,
    });
  }
}

// code omitted in chat
