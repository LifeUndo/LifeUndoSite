import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { devices, org_devices, org_keys, orgs } from '@/db/schema';
import { and, desc, eq, gt, isNull, or, sql } from 'drizzle-orm';

function buildLimits(tier: string | null, cloudLevel: string | null) {
  const t = tier || 'free_team';
  const c = cloudLevel || 'off';

  if (!tier) {
    return {
      max_devices: 3,
      max_members: 0,
      cloud_snapshot_interval_min: 15,
    };
  }

  if (t === 'pro_team') {
    return {
      max_devices: 20,
      max_members: 50,
      cloud_snapshot_interval_min: c === 'full' ? 5 : 10,
    };
  }

  if (t === 'enterprise') {
    return {
      max_devices: 100,
      max_members: 500,
      cloud_snapshot_interval_min: c === 'full' ? 1 : 5,
    };
  }

  // free_team or unknown
  return {
    max_devices: 5,
    max_members: 10,
    cloud_snapshot_interval_min: c === 'full' ? 10 : 15,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any));

    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const key = typeof body.key === 'string' ? body.key.trim() : '';

    if (!deviceId || !key) {
      return NextResponse.json({ ok: false, error: 'MISSING_PARAMS' }, { status: 400 });
    }

    const now = new Date();

    // 1) Найти активный ключ
    const keyRows = await db
      .select()
      .from(org_keys)
      .where(
        and(
          eq(org_keys.key, key),
          eq(org_keys.status, 'active'),
          or(isNull(org_keys.expires_at), gt(org_keys.expires_at, now)),
          or(isNull(org_keys.usage_limit), gt(org_keys.usage_limit, org_keys.used_count)),
        ),
      )
      .limit(1);

    const keyRow: any = keyRows[0] || null;

    if (!keyRow) {
      return NextResponse.json({ ok: false, error: 'INVALID_OR_EXPIRED_KEY' }, { status: 400 });
    }

    // 2) Найти организацию
    const orgRows = await db.select().from(orgs).where(eq(orgs.id, keyRow.org_id)).limit(1);
    const org = orgRows[0] as any;

    if (!org) {
      return NextResponse.json({ ok: false, error: 'ORG_NOT_FOUND' }, { status: 400 });
    }

    if (org.status === 'suspended' || org.status === 'archived') {
      return NextResponse.json({ ok: false, error: 'ORG_SUSPENDED' }, { status: 400 });
    }

    // 3) Обновить/создать запись устройства (devices)
    let deviceRow: any = null;
    const devById = await db
      .select()
      .from(devices)
      .where(eq(devices.device_id, deviceId))
      .orderBy(desc(devices.created_at))
      .limit(1);
    deviceRow = devById[0] || null;

    if (!deviceRow && email) {
      const devByEmail = await db
        .select()
        .from(devices)
        .where(and(eq(devices.user_email, email), eq(devices.device_id, deviceId)))
        .orderBy(desc(devices.created_at))
        .limit(1);
      deviceRow = devByEmail[0] || null;
    }

    if (!deviceRow) {
      const inserted = await db
        .insert(devices)
        .values({
          user_email: email || 'unknown',
          device_id: deviceId,
          kind: 'extension',
          created_at: now,
          last_seen_at: now,
        } as any)
        .returning();
      deviceRow = inserted[0] || null;
    } else {
      await db
        .update(devices)
        .set({
          user_email: email || deviceRow.user_email,
          last_seen_at: now,
        } as any)
        .where(eq(devices.id, deviceRow.id));
    }

    // 4) Создать/обновить org_devices
    const memberRows = await db
      .select()
      .from(org_devices)
      .where(and(eq(org_devices.org_id, org.id), eq(org_devices.device_id, deviceId)))
      .orderBy(desc(org_devices.created_at))
      .limit(1);

    const member = memberRows[0] as any | undefined;

    if (!member) {
      await db.insert(org_devices).values({
        org_id: org.id,
        device_id: deviceId,
        kind: deviceRow.kind || 'extension',
        label: deviceRow.label || null,
        role: keyRow.role || 'member',
        status: 'active',
        last_seen_at: now,
        created_at: now,
        updated_at: now,
      } as any);
    } else {
      await db
        .update(org_devices)
        .set({
          role: keyRow.role || member.role,
          status: 'active',
          last_seen_at: now,
          updated_at: now,
        } as any)
        .where(eq(org_devices.id, member.id));
    }

    // 5) Инкрементировать used_count
    await db
      .update(org_keys)
      .set({
        used_count: sql`${org_keys.used_count} + 1`,
        updated_at: now,
      } as any)
      .where(eq(org_keys.id, keyRow.id));

    const cloudEnabled = org.cloud_level !== 'off';
    const limits = buildLimits(org.tier, org.cloud_level);

    return NextResponse.json({
      ok: true,
      org: {
        id: org.id,
        slug: org.slug,
        name: org.name,
        tier: org.tier,
        cloud_level: org.cloud_level,
        cloud_enabled: cloudEnabled,
        status: org.status,
      },
      member: {
        role: keyRow.role || 'member',
        status: 'active',
      },
      limits,
    });
  } catch (error) {
    console.error('[org.join-by-key.POST] Error:', error);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
