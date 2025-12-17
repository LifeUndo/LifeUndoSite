export type Currency = "RUB" | "USD" | "EUR";

export interface CreatePaymentInput {
  productId: string; // e.g. pro_month | vip_lifetime | team_5 | PROM
  email?: string;
  amountMinor?: number; // optional override in minor units
  currency?: Currency;
  meta?: Record<string, any>;
}

export interface CreatePaymentResult {
  ok: boolean;
  pay_url?: string;
  orderId?: string;
  error?: string;
}

export interface PaymentStatusResult {
  ok: boolean;
  orderId: string;
  status: "pending" | "paid" | "failed" | "canceled";
  meta?: Record<string, any>;
}

export interface GatewayAdapter {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  getStatus(orderId: string): Promise<PaymentStatusResult>;
}
