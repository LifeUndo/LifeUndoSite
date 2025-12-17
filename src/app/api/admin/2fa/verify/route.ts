import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, decrypt } from '@/lib/2fa';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }
    
    // В production получать из БД
    const masterKey = process.env.TOTP_MASTER_KEY || 'default-key-change-in-production';
    const encryptedSecret = process.env.ADMIN_TOTP_SECRET || '';
    
    if (!encryptedSecret) {
      return NextResponse.json({ error: '2FA not configured' }, { status: 400 });
    }
    
    const secret = decrypt(encryptedSecret, masterKey);
    
    if (!verifyToken(secret, token)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json({ error: 'Failed to verify 2FA' }, { status: 500 });
  }
}
