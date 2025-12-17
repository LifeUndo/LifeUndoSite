// LifeUndo VIP License Public Key (ECDSA P-256)
// This is the public key used to verify .lifelic license files
// The private key is kept secure and used only for signing licenses

export const LICENSE_PUB_KEY_JWK = {
  "kty":"EC","crv":"P-256","alg":"ES256","ext":true,"key_ops":["verify"],
  "x":"SWSOsep9HCI3vkmYa9K_J1V9e_Nc4OPHYkAjyhua4HU",
  "y":"tSC4mGV8FrHdoZAiZyQYSwGCCombXsZpPLq3Y4TsH2k"
};

// Make it globally available for verifyLicense.js
window.LICENSE_PUB_KEY_JWK = LICENSE_PUB_KEY_JWK;

