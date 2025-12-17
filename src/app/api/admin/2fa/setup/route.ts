import { NextRequest, NextResponse } from 'next/server';
import { generateTotpSecret, otpauthQrDataUrl, verifyToken, encrypt, genRecoveryCodes } from '@/lib/2fa';
import bcrypt from 'bcryptjs';

// Временное хранилище для секретов (в production использовать Redis)
const tempSecrets = new Map<string, string>();

export async function GET() {
  try {
    const { secret, otpauth } = generateTotpSecret({ 
      name: 'LifeUndo Admin', 
      account: 'admin@lifeundo.ru' 
    });
    
    const qrDataUrl = await otpauthQrDataUrl(otpauth);
    
    // Сохраняем секрет временно для подтверждения
    const sessionId = crypto.randomUUID();
    tempSecrets.set(sessionId, secret);
    
    return NextResponse.json({ 
      secret, 
      otpauth, 
      qrDataUrl,
      sessionId 
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 });
  }
}
