// LifeUndo License Core - shared module for popup and options
// Supports JSON + armored .lifelic files, ECDSA P-256/SHA-256 verification

const licenseApi = (window.browser || window.chrome);

// ==== Crypto helpers ====
const enc = new TextEncoder();
const normB64 = s => { s=s.replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4) s+='='; return s; };
const b64ToBytes = b64 => Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0));

function canonicalJSONStringify(o){
  if (o===null || typeof o!=='object') return JSON.stringify(o);
  if (Array.isArray(o)) return "["+o.map(canonicalJSONStringify).join(",")+"]";
  const k=Object.keys(o).sort(); return "{"+k.map(x=>JSON.stringify(x)+":"+canonicalJSONStringify(o[x])).join(",")+"}";
}

function rsToDer(rs){
  const tz=a=>{let i=0;while(i<a.length&&a[i]===0)i++;return a.slice(i)};
  const derInt=a=>{a=tz(a); if(a[0]&0x80)a=Uint8Array.from([0,...a]); return Uint8Array.from([0x02,a.length,...a])};
  const r=rs.slice(0,32), s=rs.slice(32), R=derInt(r), S=derInt(s);
  return Uint8Array.from([0x30, R.length+S.length, ...R, ...S]);
}

const ensureDer = sig => sig[0]===0x30 ? sig : rsToDer(sig);
const importJwkVerify = jwk => crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]);

function parseDateFlexible(s){
  if(!s) return null; s=String(s).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s+"T00:00:00Z");
  const m=s.replace(/\s+/g,"").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`);
  return null;
}

// ==== Main functions ====

/**
 * Parse .lifelic file (JSON or armored format)
 */
function parseArmoredOrJson(text) {
  const txt = text.trim();
  if (txt.startsWith('{')) {
    return JSON.parse(txt);
  }
  // Armored format: extract base64 content between headers
  const lines = txt.split('\n').filter(l => !/BEGIN|END/.test(l));
  const json = atob(lines.join(''));
  return JSON.parse(json);
}

/**
 * Verify license signature with flexible payload formats
 */
async function verifyLicenseFlexible(lic, embeddedPubJwk) {
  if (!lic?.license || !lic?.signature?.sig_b64) {
    throw new Error("Bad .lifelic format");
  }
  
  const exp = parseDateFlexible(lic.license.expiry);
  if (exp && exp < new Date()) {
    throw new Error("License expired");
  }
  
  const jwk = lic.signature.publicKeyJwk?.kty ? lic.signature.publicKeyJwk : embeddedPubJwk;
  if (!jwk) {
    throw new Error("No public key found");
  }
  
  const pub = await importJwkVerify(jwk);
  const sigRaw = b64ToBytes(lic.signature.sig_b64);
  const sigDer = ensureDer(sigRaw);
  
  // Try multiple payload formats
  const msgs = [
    JSON.stringify(lic.license),
    JSON.stringify(lic.license, null, 2),
    canonicalJSONStringify(lic.license),
    JSON.stringify(JSON.parse(canonicalJSONStringify(lic.license)), null, 2),
  ];
  
  for (const m of msgs) {
    for (const s of [sigDer, sigRaw]) {
      for (const payload of [m, m+"\n", m+"\r\n"]) {
        try {
          const ok = await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"}, pub, s, enc.encode(payload));
          if (ok) return true;
        } catch (e) {
          // Continue trying other formats
        }
      }
    }
  }
  
  return false;
}

/**
 * Install VIP license to storage
 */
async function installVip(lic) {
  await licenseApi.storage.local.set({
    lu_plan: 'vip',
    lu_license: lic,
    license: lic.license,
    signature: lic.signature
  });
}

/**
 * Import license from file
 */
async function importFromFile(file, embeddedPubJwk) {
  const text = await file.text();
  const lic = parseArmoredOrJson(text);
  const isValid = await verifyLicenseFlexible(lic, embeddedPubJwk);
  
  if (!isValid) {
    throw new Error("Signature verification failed");
  }
  
  await installVip(lic);
  return lic;
}

// Export for use in popup and options
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseArmoredOrJson, verifyLicenseFlexible, installVip, importFromFile };
} else {
  window.LicenseCore = { parseArmoredOrJson, verifyLicenseFlexible, installVip, importFromFile };
}






























