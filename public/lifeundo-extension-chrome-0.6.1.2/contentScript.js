// LifeUndo Content Script - v0.3.7.15
// Firefox: collect text input for popup display

const api = window.browser || window.chrome;

// Store recent inputs
let recentInputs = [];

// Settings
let protectClipboard = false;
let excludeDomains = [];

function loadSettings() {
  try {
    api.storage.local.get(['lu_protect_clipboard', 'lu_exclude_domains'], (res) => {
      protectClipboard = !!res.lu_protect_clipboard;
      const raw = String(res.lu_exclude_domains || '').trim();
      excludeDomains = raw ? raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
    });
  } catch (_) {}
}

// Listen for input events
function handleInput(event) {
  const target = event.target;
  
  // Skip password fields
  if (target.type === 'password') return;
  
  // Skip if no text content
  if (!target.value || target.value.trim().length === 0) return;
  
  // Skip very short inputs
  if (target.value.length < 3) return;
  
  // Create input record
  const inputRecord = {
    text: target.value,
    timestamp: Date.now(),
    url: window.location.href,
    selector: getSelector(target)
  };
  
  // Add to recent inputs (keep last 20)
  recentInputs.unshift(inputRecord);
  recentInputs = recentInputs.slice(0, 20);
  
  // Save to storage
  saveToStorage();

  // Push into unified text history for Timeline
  try {
    api.runtime?.sendMessage?.({
      type: 'LU_PUSH_TEXT_STATE',
      payload: { value: target.value, path: getSelector(target) }
    });
  } catch (_) {}
}

// Get CSS selector for element
function getSelector(element) {
  if (element.id) return `#${element.id}`;
  if (element.className) return `.${element.className.split(' ')[0]}`;
  return element.tagName.toLowerCase();
}

// Save to browser storage
async function saveToStorage() {
  try {
    await api.storage.local.set({ recentInputs });
  } catch (e) {
    console.error('LifeUndo: Failed to save inputs:', e);
  }
}

// Load from storage on startup
async function loadFromStorage() {
  try {
    const result = await api.storage.local.get('recentInputs');
    if (result.recentInputs) {
      recentInputs = result.recentInputs;
    }
  } catch (e) {
    console.error('LifeUndo: Failed to load inputs:', e);
  }
}

// Handle clipboard events
function handleClipboardEvent(e) {
  try {
    // Protection: block script-initiated copy/cut if enabled and domain not excluded
    const host = (location.host || '').toLowerCase();
    const isExcluded = excludeDomains.some(d => host.endsWith(d));
    if (protectClipboard && !isExcluded && e && e.isTrusted === false) {
      e.stopImmediatePropagation?.();
      e.preventDefault?.();
      return; // block
    }

    let text = '';
    // Prefer event clipboardData if available
    if (e && e.clipboardData) {
      text = e.clipboardData.getData('text/plain') || '';
    }
    // Fallback to current selection
    if (!text) {
      text = String(window.getSelection?.().toString() || '');
    }
    // Basic guards
    if (!text || text.trim().length === 0) return;
    if (text.length < 2) return;

    api.runtime?.sendMessage?.({ type: 'LU_PUSH_CLIPBOARD', payload: { value: text } });
  } catch (_) {
    // no-op
  }
}

// Initialize
function init() {
  // Load existing data
  loadFromStorage();
  loadSettings();
  
  // Listen for input events
  document.addEventListener('input', handleInput, true);
  
  // Listen for textarea changes
  document.addEventListener('change', handleInput, true);
  
  // Listen for copy/cut to capture clipboard text
  document.addEventListener('copy', handleClipboardEvent, true);
  document.addEventListener('cut', handleClipboardEvent, true);
  
  // React to settings changes
  try {
    api.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.lu_protect_clipboard || changes.lu_exclude_domains) {
        loadSettings();
      }
    });
  } catch (_) {}

  console.log('LifeUndo content script loaded');
}

try {
  api.runtime.onMessage.addListener((message) => {
    if (!message || !message.type) return;

    if (message.type === 'LU_RESTORE_TEXT') {
      const payload = message.payload || {};
      const value = String(payload.value || '');
      if (!value) return;

      let el = document.activeElement;
      if (!el) return;

      const tag = (el.tagName || '').toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea';
      const isEditable = el.isContentEditable;

      if (!isInput && !isEditable) return;

      if (isInput) {
        el.value = value;
      } else if (isEditable) {
        el.textContent = value;
      }

      try {
        const evInput = new Event('input', { bubbles: true, cancelable: true });
        el.dispatchEvent(evInput);
      } catch (_) {}

      try {
        const evChange = new Event('change', { bubbles: true, cancelable: true });
        el.dispatchEvent(evChange);
      } catch (_) {}
    } else if (message.type === 'LU_CAPTURE_PAGE_SNAPSHOT') {
      try {
        const html = String(document.documentElement?.outerHTML || '');
        const url = String(window.location.href || '');
        const title = String(document.title || '');
        api.runtime?.sendMessage?.({
          type: 'LU_SAVE_PAGE_SNAPSHOT',
          payload: { html, url, title }
        });
      } catch (_) {}
    }
  });
} catch (_) {}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}