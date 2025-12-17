// LifeUndo Extension Telemetry - v0.4.0
// Minimal telemetry without PII

// Telemetry events
const TELEMETRY_EVENTS = {
  EXT_LICENSE_VIEWED: 'ext_license_viewed',
  EXT_RESEND_CLICKED: 'ext_resend_clicked', 
  EXT_ACCOUNT_OPENED: 'ext_account_opened',
  EXT_BIND_ATTEMPTED: 'ext_bind_attempted',
  EXT_UPGRADE_CLICKED: 'ext_upgrade_clicked',
  EXT_VIP_ACTIVATED: 'ext_vip_activated',
  EXT_POPUP_OPENED: 'ext_popup_opened'
};

// Send telemetry event
function sendTelemetry(eventName, data = {}) {
  try {
    // Only send if analytics is enabled
    const analyticsEnabled = localStorage.getItem('lu_analytics_enabled') !== 'false';
    if (!analyticsEnabled) return;

    const payload = {
      event: eventName,
      timestamp: Date.now(),
      version: '0.4.0',
      ...data
    };

    // Send to analytics endpoint (if available)
    if (typeof fetch !== 'undefined') {
      fetch('https://getlifeundo.com/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Silently fail if analytics endpoint is not available
      });
    }

    // Also log locally for debugging
    console.log('[LifeUndo Telemetry]', payload);
  } catch (error) {
    console.warn('[LifeUndo Telemetry Error]', error);
  }
}

// Track license modal opened
function trackLicenseViewed() {
  sendTelemetry(TELEMETRY_EVENTS.EXT_LICENSE_VIEWED);
}

// Track resend email clicked
function trackResendClicked() {
  sendTelemetry(TELEMETRY_EVENTS.EXT_RESEND_CLICKED);
}

// Track account page opened
function trackAccountOpened() {
  sendTelemetry(TELEMETRY_EVENTS.EXT_ACCOUNT_OPENED);
}

// Track bind purchase attempted
function trackBindAttempted(success) {
  sendTelemetry(TELEMETRY_EVENTS.EXT_BIND_ATTEMPTED, { success });
}

// Track upgrade button clicked
function trackUpgradeClicked() {
  sendTelemetry(TELEMETRY_EVENTS.EXT_UPGRADE_CLICKED);
}

// Track VIP activation
function trackVipActivated() {
  sendTelemetry(TELEMETRY_EVENTS.EXT_VIP_ACTIVATED);
}

// Track popup opened
function trackPopupOpened() {
  sendTelemetry(TELEMETRY_EVENTS.EXT_POPUP_OPENED);
}

// Export functions for use in popup.js
if (typeof window !== 'undefined') {
  window.LifeUndoTelemetry = {
    trackLicenseViewed,
    trackResendClicked,
    trackAccountOpened,
    trackBindAttempted,
    trackUpgradeClicked,
    trackVipActivated,
    trackPopupOpened
  };
}
