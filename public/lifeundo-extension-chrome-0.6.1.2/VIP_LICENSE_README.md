# LifeUndo VIP License Import v0.2.1

## Overview
This hotfix adds VIP license import functionality to the LifeUndo extension, allowing users to import `.lifelic` files with offline ECDSA P-256 signature verification.

## New Features

### 1. License Import Interface
- **Location**: Options page (`chrome://extensions` → LifeUndo → Options)
- **File Format**: `.lifelic` (JSON with license and signature)
- **Verification**: Offline ECDSA P-256 with SHA-256

### 2. VIP Status Display
- **VIP Badge**: Golden badge appears in popup when VIP license is active
- **PRO Badges Hidden**: All PRO badges are hidden when VIP is active
- **Status Text**: "VIP License Active - All features unlocked"

### 3. License Management
- **Import**: Upload `.lifelic` file and verify signature
- **Verify**: Check existing license signature validity
- **Clear**: Remove stored license from extension storage

## File Structure

```
extension/
├── manifest.json          # Updated to v0.2.1 with options_ui
├── options.html           # Updated with license import interface
├── options.js             # Updated with import/verify/clear functions
├── verifyLicense.js       # NEW: ECDSA P-256 signature verification
├── licensePubKey.js       # NEW: Public key for signature verification
├── popup.html             # Updated with VIP badge
├── popup.js               # Updated with VIP status checking
└── test-license.lifelic   # Test license file (for development)
```

## Technical Details

### Signature Verification
- **Algorithm**: ECDSA P-256
- **Hash**: SHA-256
- **Canonical JSON**: Keys sorted for deterministic hashing
- **Offline**: No network requests required

### Storage
- **Location**: `chrome.storage.local`
- **Keys**: `license`, `signature`
- **Persistence**: Survives browser restarts

### VIP Detection
- Checks stored license and signature
- Verifies signature validity
- Checks license expiration
- Confirms VIP plan type

## Testing

1. **Import Test**: Load `test-license.lifelic` (note: signature is fake for testing)
2. **VIP Display**: Check popup shows VIP badge and hides PRO badges
3. **Options Page**: Verify import/verify/clear buttons work
4. **Persistence**: Restart browser and verify VIP status persists

## Security Notes

- Public key is embedded in extension (not a security risk)
- Private key remains secure and separate
- Signature verification prevents tampering
- License expiration prevents indefinite use

## Version History

- **v0.2.1**: Added VIP license import functionality
- **v0.2.0**: Previous version with basic Pro features







































