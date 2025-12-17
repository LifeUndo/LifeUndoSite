import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

export function generateTotpSecret({ name = 'LifeUndo Admin', account = 'admin@lifeundo.ru' } = {}) {
  const secret = authenticator.generateSecret(); // base32
  const otpauth = authenticator.keyuri(account, name, secret); // otpauth://...
  return { secret, otpauth };
}

export async function otpauthQrDataUrl(otpauthUrl: string) {
  return await qrcode.toDataURL(otpauthUrl);
}

export function verifyToken(secret: string, token: string) {
  return authenticator.verify({ token, secret });
}

export function encrypt(text: string, masterKey: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(masterKey, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64'); // store this
}

export function decrypt(payload: string, masterKey: string) {
  const data = Buffer.from(payload, 'base64');
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encrypted = data.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(masterKey, 'hex'), iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8');
}

export function genRecoveryCodes(n = 10) {
  return Array.from({ length: n }, () => crypto.randomBytes(6).toString('hex')); // 12 hex chars
}
