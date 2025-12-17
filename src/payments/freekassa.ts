import { GatewayAdapter, CreatePaymentInput, CreatePaymentResult, PaymentStatusResult } from "./gateway";

// Minimal FreeKassa adapter stub (v1). In milestone B we will wire real requests.
export class FreeKassaAdapter implements GatewayAdapter {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // TODO: sign and call FK create invoice API; for now, return placeholder
    const orderId = `FK-${Date.now()}`;
    const pay_url = `https://pay.freekassa.net/?o=${encodeURIComponent(orderId)}`;
    return { ok: true, pay_url, orderId };
  }

  async getStatus(orderId: string): Promise<PaymentStatusResult> {
    // TODO: query FK status; for now, return pending stub
    return { ok: true, orderId, status: "pending" };
  }
}

export const freeKassa = new FreeKassaAdapter();
