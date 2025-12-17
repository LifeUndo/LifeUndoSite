import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId') || '';
    if (!orderId) {
      return NextResponse.json({ ok: false, error: 'missing_orderId' }, { status: 400 });
    }

    // TODO: wire to gateway adapter (FreeKassa) in milestone B2/B3
    return NextResponse.json({ ok: true, orderId, status: 'pending' });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'status_failed' }, { status: 500 });
  }
}
