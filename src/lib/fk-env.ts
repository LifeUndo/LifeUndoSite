// FreeKassa Environment Configuration
// Используем только FREEKASSA_* переменные

export const FK_ENABLED = String(process.env.NEXT_PUBLIC_FK_ENABLED ?? "").toLowerCase() === "true";

export const FK_MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID || "";

export const FK_SECRET1 = process.env.FREEKASSA_SECRET1 || "";

export const FK_SECRET2 = process.env.FREEKASSA_SECRET2 || "";

// Новый URL согласно документации FreeKassa
export const FK_PAYMENT_URL = process.env.FREEKASSA_PAYMENT_URL || "https://pay.freekassa.net/";

export const FK_CURRENCY = process.env.FREEKASSA_CURRENCY || "RUB";

// Проверка конфигурации
export const FK_CONFIGURED = !!(FK_MERCHANT_ID && FK_SECRET1 && FK_SECRET2);

// Продуктовые ID и суммы (строго с двумя знаками)
export const FK_PRODUCTS = {
  getlifeundo_pro: "599.00",
  getlifeundo_vip: "9990.00", 
  getlifeundo_team: "2990.00"
} as const;

export type FKProductId = keyof typeof FK_PRODUCTS;
