export type LicenseActivatedContext = {
  orderId: string;
  plan: string;            // e.g. "starter_6m" | "pro_month" | "vip_lifetime" | "team_5"
  level: "pro" | "vip" | "team";
  email: string;
  expiresAt: string | null; // ISO or null for lifetime
  bonusActive: boolean;
  bonusUntil?: string;      // ISO if bonusActive
  accountUrl: string;       // e.g. https://getlifeundo.com/en/account?order_id=...&email=...
  featuresUrl: string;      // /en/features
  supportUrl: string;       // /en/support?order_id=...
};

export function subject(ctx: LicenseActivatedContext) {
  return `GetLifeUndo — license activated (order #${ctx.orderId})`;
}

export function text(ctx: LicenseActivatedContext) {
  const lines = [
    `Hi!`,
    ``,
    `Thanks for your purchase — your GetLifeUndo license is now active.`,
    `Order ID: ${ctx.orderId}`,
    `Plan: ${ctx.plan}`,
    `Level: ${ctx.level.toUpperCase()}`,
    ctx.expiresAt ? `Active until: ${fmt(ctx.expiresAt)}` : `Access: lifetime`,
    ctx.bonusActive && ctx.bonusUntil ? `Starter bonus active until: ${fmt(ctx.bonusUntil)}` : ``,
    ``,
    `What's next:`,
    `1) Open the GetLifeUndo browser extension`,
    `2) Go to Settings → License`,
    `3) Paste your key (sent to this email)`,
    ``,
    `Useful links:`,
    `• Account: ${ctx.accountUrl}`,
    `• Features: ${ctx.featuresUrl}`,
    `• Support: ${ctx.supportUrl}`,
    ``,
    `If you didn't make this purchase or need help, reply to this email.`,
    `— GetLifeUndo Team`
  ].filter(Boolean);
  return lines.join("\n");
}

export function html(ctx: LicenseActivatedContext) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111">
    <h2>GetLifeUndo — license activated</h2>
    <p>Thanks for your purchase — your license is now active.</p>
    <ul>
      <li><b>Order ID:</b> ${esc(ctx.orderId)}</li>
      <li><b>Plan:</b> ${esc(ctx.plan)}</li>
      <li><b>Level:</b> ${esc(ctx.level.toUpperCase())}</li>
      <li><b>${ctx.expiresAt ? "Active until" : "Access" }:</b> ${ctx.expiresAt ? esc(fmt(ctx.expiresAt)) : "lifetime"}</li>
      ${ctx.bonusActive && ctx.bonusUntil ? `<li><b>Starter bonus until:</b> ${esc(fmt(ctx.bonusUntil))}</li>` : ""}
    </ul>

    <h3>What's next</h3>
    <ol>
      <li>Open the GetLifeUndo browser extension</li>
      <li>Go to <b>Settings → License</b></li>
      <li>Paste your key (sent to this email)</li>
    </ol>

    <p><b>Useful links</b><br/>
      <a href="${esc(ctx.accountUrl)}">Account</a> ·
      <a href="${esc(ctx.featuresUrl)}">Features</a> ·
      <a href="${esc(ctx.supportUrl)}">Support</a>
    </p>

    <p style="color:#555">If you didn't make this purchase or need help, just reply to this email.</p>
    <p>— GetLifeUndo Team</p>
  </div>`;
}

/* helpers */
function fmt(iso: string) {
  // ISO → human (YYYY-MM-DD); форматируй как нужно
  return new Date(iso).toISOString().slice(0, 10);
}
function esc(s: string) {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!));
}
