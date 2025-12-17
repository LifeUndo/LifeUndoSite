export type PlanKey = "pro_month" | "vip_lifetime" | "team_5" | "starter_6m";

export const PLAN_TO_PRODUCT: Record<PlanKey, "PROM" | "VIPL" | "TEAM5" | "S6M"> = {
  pro_month: "PROM",
  vip_lifetime: "VIPL",
  team_5: "TEAM5",
  starter_6m: "S6M",
};
