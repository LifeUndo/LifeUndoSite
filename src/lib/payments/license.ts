// License Management Utilities
import { FK_PLANS } from './fk-plans';
import { type PlanId } from '@/config/plans';
import { db } from '@/db/client';
import { licenses, feature_flags } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export interface License {
  id: number;
  user_id?: string;
  email?: string;
  level: string;
  plan?: string;
  expires_at?: Date;
  seats?: number;
  activated_at: Date;
}

export interface FeatureFlag {
  id: number;
  user_id?: string;
  email?: string;
  key: string;
  value: any;
  expires_at?: Date;
}

// Активация лицензии для плана
export async function activateLicense(params: {
  email: string;
  plan: PlanId;
  orderId: string;
}): Promise<{ license: License; flags?: FeatureFlag[] }> {
  const { email, plan, orderId } = params;
  const planConfig = FK_PLANS[plan];
  
  if (!planConfig) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  const now = new Date();
  const expiresAt = (planConfig as any).periodDays 
    ? new Date(now.getTime() + (planConfig as any).periodDays * 24 * 60 * 60 * 1000)
    : undefined;

  let level: string;
  switch (planConfig.kind) {
    case 'subscription':
    case 'bundle':
      level = 'pro';
      break;
    case 'lifetime':
      level = 'vip';
      break;
    case 'team':
      level = 'team';
      break;
    default:
      level = 'pro';
  }

  // Сохранить в БД
  const [licenseRow] = await db.insert(licenses).values({
    user_email: email,
    level,
    plan,
    expires_at: expiresAt || null,
    seats: (planConfig as any).seats || null,
    activated_at: now
  }).returning();

  const license: License = {
    id: licenseRow.id,
    email,
    level,
    plan,
    expires_at: expiresAt,
    seats: (planConfig as any).seats,
    activated_at: now
  };

  console.log('[license.activate]', { email, plan, orderId, license });

  // Если есть бонусный флаг - создать
  const flags: FeatureFlag[] = [];
  if ((planConfig as any).bonusFlag) {
    const [flagRow] = await db.insert(feature_flags).values({
      user_email: email,
      key: (planConfig as any).bonusFlag,
      value: true,
      expires_at: expiresAt || null
    }).returning();
    
    const flag: FeatureFlag = {
      id: flagRow.id,
      email,
      key: (planConfig as any).bonusFlag,
      value: true,
      expires_at: expiresAt
    };
    flags.push(flag);
    console.log('[license.activate] bonus flag:', flag);
  }

  // Отправить email с лицензией
  try {
    const { sendEmail } = await import('@/lib/email/client');
    const { renderLicenseActivatedEmail } = await import('@/lib/email/templates/license-activated');
    
    const emailContent = renderLicenseActivatedEmail({
      email,
      plan,
      orderId,
      expiresAt
    });
    
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html
    });
  } catch (emailError) {
    console.error('[license.activate] Email send failed:', emailError);
    // Не падаем - лицензия уже активирована
  }

  return { license, flags: flags.length > 0 ? flags : undefined };
}

// Продление существующей лицензии
export async function extendLicense(params: {
  email: string;
  plan: PlanId;
  currentExpiresAt?: Date;
}): Promise<License> {
  const { email, plan, currentExpiresAt } = params;
  const planConfig = FK_PLANS[plan];
  
  if (!planConfig || !(planConfig as any).periodDays) {
    throw new Error(`Plan ${plan} cannot be extended`);
  }

  const now = new Date();
  const baseDate = currentExpiresAt && currentExpiresAt > now 
    ? currentExpiresAt 
    : now;
  
  const newExpiresAt = new Date(
    baseDate.getTime() + (planConfig as any).periodDays * 24 * 60 * 60 * 1000
  );

  console.log('[license.extend]', { email, plan, currentExpiresAt, newExpiresAt });

  // Обновить в БД
  const [licenseRow] = await db.update(licenses)
    .set({ 
      expires_at: newExpiresAt,
      updated_at: now 
    })
    .where(eq(licenses.user_email, email))
    .returning();

  const license: License = {
    id: licenseRow?.id || 0,
    email,
    level: 'pro',
    plan,
    expires_at: newExpiresAt,
    activated_at: now
  };

  return license;
}

