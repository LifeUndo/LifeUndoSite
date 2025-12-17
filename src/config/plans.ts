// Единый конфиг тарифов - источник истины
export type PlanId = 'pro_month' | 'vip_lifetime' | 'team_5';

export const PLANS: Record<PlanId, {
  label: string;
  amount: number;
  currency: 'RUB';
  period?: 'month' | 'lifetime';
  description: string;
}> = {
  pro_month: {
    label: 'Pro',
    amount: 599,
    currency: 'RUB',
    period: 'month',
    description: 'История форм и буфера, локально'
  },
  vip_lifetime: {
    label: 'VIP',
    amount: 9990,
    currency: 'RUB',
    period: 'lifetime',
    description: 'Лицензия навсегда, все функции'
  },
  team_5: {
    label: 'Team',
    amount: 2990,
    currency: 'RUB',
    period: 'month',
    description: 'Пакетная лицензия для команды'
  }
};

// Валидация плана
export function isValidPlan(planId: string): planId is PlanId {
  return planId in PLANS;
}

// Получить конфигурацию плана
export function getPlan(planId: string) {
  if (!isValidPlan(planId)) return null;
  return PLANS[planId];
}

// Получить сумму с двумя знаками для FreeKassa
export function getPlanAmount(planId: string): string {
  const plan = getPlan(planId);
  return plan ? plan.amount.toFixed(2) : '0.00';
}
