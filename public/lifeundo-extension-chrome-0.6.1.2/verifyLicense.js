// LifeUndo License Verification Module
// Implements ECDSA P-256 signature verification for .lifelic files

import { LICENSE_PUB_KEY_JWK } from './licensePubKey.js';

// canonical stringify (детерминированный JSON)
function canonicalJSONStringify(obj){
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalJSONStringify).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k)+':'+canonicalJSONStringify(obj[k])).join(',') + '}';
}

const enc = new TextEncoder();

async function importPublicKey(jwk){
  return crypto.subtle.importKey('jwk', jwk, { name:'ECDSA', namedCurve:'P-256' }, true, ['verify']);
}

// raw(64) r||s  ->  DER
function rsToDer(sig){
  const r = sig.slice(0,32), s = sig.slice(32);
  function trim(buf){ let i=0; while (i<buf.length-1 && buf[i]===0) i++; return buf.slice(i); }
  function derInt(buf){
    let v = trim(buf);
    if (v[0] & 0x80) v = new Uint8Array([0, ...v]);           // ensure positive
    return new Uint8Array([0x02, v.length, ...v]);
  }
  const R = derInt(r), S = derInt(s);
  const len = R.length + S.length;
  return new Uint8Array([0x30, len, ...R, ...S]);
}

function toUint8(b64){
  try { return Uint8Array.from(atob(b64), c => c.charCodeAt(0)); }
  catch { return new Uint8Array(); }
}

export async function verifyLicenseSignature(obj){
  const { license, signature } = obj || {};
  if(!license || !signature) return false;

  const payload = enc.encode(canonicalJSONStringify(license));

  // 1) берём ключ из лицензии, иначе — вшитый
  const jwk = signature.publicKeyJwk || (window.LICENSE_PUB_KEY_JWK);
  if(!jwk) return false;
  const pub = await importPublicKey(jwk);

  // 2) принимаем подпись как raw(64) или DER
  let sig = toUint8(signature.sig_b64 || '');
  if(!sig.length) return false;
  if (sig[0] !== 0x30) {            // не DER -> пытаемся сконвертить raw r||s
    if (sig.length !== 64) return false;
    sig = rsToDer(sig);
  }

  return crypto.subtle.verify({ name:'ECDSA', hash:'SHA-256' }, pub, sig, payload);
}

/**
 * Check if a license is valid and not expired
 * @param {Object} license - License object
 * @returns {boolean} - True if license is valid and not expired
 */
export function isLicenseValid(license) {
  if (!license || !license.plan) {
    return false;
  }
  
  // Check expiration date if present
  if (license.expiry) {
    const today = new Date().toISOString().slice(0, 10);
    return license.expiry >= today;
  }
  
  return true; // No expiration date means perpetual license
}

/**
 * Check if license is VIP tier
 * @param {Object} license - License object
 * @returns {boolean} - True if license is VIP tier
 */
export function isVipLicense(license) {
  return license && license.plan === 'vip';
}

