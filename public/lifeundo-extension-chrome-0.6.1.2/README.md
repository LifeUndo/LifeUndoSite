# LifeUndo v0.2.0

Undo last actions across the web: text input history, recently closed tabs, clipboard history. Now with Pro features and 7-day trial!

## Install (Chrome)

1. Open chrome://extensions
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select this folder (the `extension` directory)
5. Pin the LifeUndo icon and click it

## Features

### Free Version
- Tracks text typed in inputs/textarea/contentEditable (stores last 20 states)
- Stores last 10 closed tabs and can reopen the latest
- Records clipboard history on copy (selection-based, last 10 items)
- Popup shows histories and a one-click "Undo Last Action"

### Pro Version (7-day trial included)
- **10x more storage**: 200 text states, 50 tabs, 50 clipboard items
- **Statistics tracking**: Local analytics without network requests
- **Data export**: Download all data as JSON for backup/migration
- **Options page**: License management and statistics dashboard
- **Pro UI**: Visual indicators and upgrade prompts

## New in v0.2.0

- **Pro subscription model** with 7-day free trial
- **Local statistics** - track usage without telemetry
- **License activation** - simple offline key validation
- **Data export/import** - full data portability
- **Enhanced UI** - Pro badges and upgrade sections
- **Options page** - dedicated settings and statistics

## Structure

- `manifest.json`: MV3 manifest with options_ui
- `background.js`: service worker with Pro logic and statistics
- `contentScript.js`: input/copy tracking and restoration
- `popup.html/js`: enhanced UI with Pro features
- `options.html/js`: settings page for license and statistics
- `constants.js`: centralized configuration

## Privacy

All data stays local in your browser. No network requests, no telemetry. Pro features work entirely offline.


