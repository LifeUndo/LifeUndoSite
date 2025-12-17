import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { org_devices } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any));

    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';

    if (!deviceId) {
      return NextResponse.json({ ok: false, error: 'MISSING_DEVICE_ID' }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(org_devices)
      .where(eq(org_devices.device_id, deviceId))
      .orderBy(desc(org_devices.created_at))
      .limit(1);

    const row = rows[0] as any | undefined;

    if (!row) {
      return NextResponse.json({ ok: true, changed: false });
    }

    await db
      .update(org_devices)
      .set({ status: 'disabled', updated_at: new Date() } as any)
      .where(and(eq(org_devices.id, row.id)));

    return NextResponse.json({ ok: true, changed: true });
  } catch (error) {
    console.error('[org.leave.POST] Error:', error);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
