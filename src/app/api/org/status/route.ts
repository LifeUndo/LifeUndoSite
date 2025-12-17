import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { devices, org_devices, orgs } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

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
    const platform = typeof body.platform === 'string' ? body.platform.trim() : '';
    const appVersion = typeof body.appVersion === 'string' ? body.appVersion.trim() : '';

    if (!deviceId && !email) {
      const limits = buildLimits(null, null);
      return NextResponse.json({
        ok: true,
        org: null,
        member: null,
        limits,
      });
    }

    let deviceRow = null as any;

    if (deviceId) {
      const rows = await db
        .select()
        .from(devices)
        .where(eq(devices.device_id, deviceId))
        .orderBy(desc(devices.created_at))
        .limit(1);
      deviceRow = rows[0] || null;
    }

    if (!deviceRow && email) {
      const rows = await db
        .select()
        .from(devices)
        .where(eq(devices.user_email, email))
        .orderBy(desc(devices.created_at))
        .limit(1);
      deviceRow = rows[0] || null;
    }

    if (!deviceRow) {
      const limits = buildLimits(null, null);
      return NextResponse.json({
        ok: true,
        org: null,
        member: null,
        limits,
      });
    }

    const orgDeviceRows = await db
      .select()
      .from(org_devices)
      .where(
        and(
          eq(org_devices.device_id, deviceRow.device_id),
          eq(org_devices.status, 'active'),
        ),
      )
      .orderBy(desc(org_devices.created_at))
      .limit(1);

    const orgDevice = orgDeviceRows[0] || null;

    if (!orgDevice) {
      const limits = buildLimits(null, null);
      return NextResponse.json({
        ok: true,
        org: null,
        member: null,
        limits,
      });
    }

    const orgRows = await db
      .select()
      .from(orgs)
      .where(eq(orgs.id, orgDevice.org_id))
      .limit(1);

    const org = orgRows[0] || null;

    if (!org) {
      const limits = buildLimits(null, null);
      return NextResponse.json({
        ok: true,
        org: null,
        member: null,
        limits,
      });
    }

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
        role: orgDevice.role,
        status: orgDevice.status,
      },
      limits,
      meta: {
        platform: platform || null,
        appVersion: appVersion || null,
      },
    });
  } catch (error) {
    console.error('[org.status.POST] Error:', error);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
