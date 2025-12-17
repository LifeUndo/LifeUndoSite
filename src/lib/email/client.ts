import nodemailer from 'nodemailer';

// Check if email is enabled
const isEmailEnabled = process.env.NEXT_EMAIL_ENABLED === 'true';

if (!isEmailEnabled) {
  console.log('[Email] Email sending is disabled (NEXT_EMAIL_ENABLED=false)');
}

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.sendgrid.net';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'GetLifeUndo <noreply@getlifeundo.com>';

export const transporter = isEmailEnabled ? nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
}) : null;

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: EmailParams) {
  const { to, subject, html, text } = params;
  
  if (!isEmailEnabled) {
    console.log('[Email] Would send email:', { to, subject, html });
    return { ok: true, skipped: true };
  }

  if (!transporter) {
    throw new Error('Email transporter not configured');
  }
  
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    });
    
    console.log('[email] Sent:', { to, subject, messageId: info.messageId });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error('[email] Failed:', error);
    return { ok: false, error };
  }
}


