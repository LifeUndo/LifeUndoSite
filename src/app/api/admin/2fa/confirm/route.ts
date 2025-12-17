import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, encrypt, genRecoveryCodes } from '@/lib/2fa';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Временное хранилище для секретов (в production использовать Redis)
const tempSecrets = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    const { sessionId, token } = await request.json();
    
    if (!sessionId || !token) {
      return NextResponse.json({ error: 'Missing sessionId or token' }, { status: 400 });
    }
    
    const secret = tempSecrets.get(sessionId);
    if (!secret) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }
    
    // Проверяем токен
    if (!verifyToken(secret, token)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    
    // Генерируем recovery codes
    const recoveryCodes = genRecoveryCodes(10);
    const hashedCodes = await Promise.all(
      recoveryCodes.map(code => bcrypt.hash(code, 10))
    );
    
    // Шифруем секрет для хранения в БД
    const masterKey = process.env.TOTP_MASTER_KEY || 'default-key-change-in-production';
    const encryptedSecret = encrypt(secret, masterKey);
    
    // Сохраняем в credentials.json как backup
    const credentialsPath = path.join(process.cwd(), 'business', 'secrets', 'credentials.json');
    try {
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      credentials.totp_backup.admin_panel = {
        secret: secret,
        recovery_codes: recoveryCodes,
        created_at: new Date().toISOString()
      };
      fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
    } catch (error) {
      console.error('Failed to save backup:', error);
    }
    
    // Очищаем временный секрет
    tempSecrets.delete(sessionId);
    
    return NextResponse.json({ 
      success: true,
      recoveryCodes,
      encryptedSecret // В production сохранить в БД
    });
  } catch (error) {
    console.error('2FA confirm error:', error);
    return NextResponse.json({ error: 'Failed to confirm 2FA' }, { status: 500 });
  }
}
