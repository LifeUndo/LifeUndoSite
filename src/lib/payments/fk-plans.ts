// FreeKassa Plans Configuration
// Используем единый конфиг из src/config/plans.ts

import { PLANS, type PlanId, getPlanAmount } from '@/config/plans';

export type PlanKind = "subscription" | "lifetime" | "team" | "bundle";

export interface FKPlan {
  amount: string;
  currency: string;
  title: string;
  kind: PlanKind;
  periodDays?: number;
  seats?: number;
  bonusFlag?: string;
}

// Маппинг новых PlanId на FKPlan
export const FK_PLANS: Record<PlanId, FKPlan> = {
  pro_month: {
    amount: getPlanAmount('pro_month'),
    currency: 'RUB',
    title: 'Pro / месяц (для одного пользователя)',
    kind: 'subscription',
    periodDays: 30
  },
  vip_lifetime: {
    amount: getPlanAmount('vip_lifetime'),
    currency: 'RUB',
    title: 'VIP навсегда (для одного пользователя)',
    kind: 'lifetime'
  },
  team_5: {
    amount: getPlanAmount('team_5'),
    currency: 'RUB',
    title: 'Team / 5 мест / мес (для команд и организаций)',
    kind: 'team',
    seats: 5,
    periodDays: 30
  }
} as const;

// Генератор префиксов для order_id
export function getOrderPrefix(plan: string): string {
  // Поддерживаем как план-идентификаторы, так и исторические/временные значения
  const map: Record<string, string> = {
    pro_month: "PROM",
    vip_lifetime: "VIPL",
    team_5: "TEAM5",
    starter_6m: "S6M", // bundle на 6 месяцев
  };
  return map[plan] || "ORDER";
}

// Валидация плана
export function isValidPlan(plan: string): plan is PlanId {
  return plan in FK_PLANS;
}

// Получить конфигурацию плана
export function getPlan(planId: string): FKPlan | null {
  if (!isValidPlan(planId)) return null;
  return FK_PLANS[planId];
}

