"use client";
import React from "react";
import { PLAN_TO_PRODUCT, type PlanKey } from "@/business/pricing/plans";
import { useTranslations } from "@/hooks/useTranslations";

// TODO: подключи свой i18n-хук (например, useTranslations()) и замени useI18n().
function useI18n() {
  const { locale } = useTranslations();
  const isEN = locale === "en";
  const RU: Record<string, string> = {
    "errors.unknownPlan": "Неизвестный тариф",
    "errors.fkUnavailable": "Платёж сейчас недоступен. Попробуйте позже.",
    "common.payWithFreeKassa": "Оплатить через FreeKassa",
  };
  const EN: Record<string, string> = {
    "errors.unknownPlan": "Unknown plan",
    "errors.fkUnavailable": "Payment is temporarily unavailable. Please try again later.",
    "common.payWithFreeKassa": "Pay with FreeKassa",
  };
  const dict = isEN ? EN : RU;
  return (k: string) => dict[k] ?? k;
}

type Props = {
  plan: PlanKey;
  email?: string;
  className?: string;
};

export default function FreeKassaButton({ plan, email, className }: Props) {
  const t = useI18n();
  const { locale } = useTranslations();
  const productId = PLAN_TO_PRODUCT[plan];
  const disabled = !productId;

  const onClick = async () => {
    if (disabled) return;
    try {
      const payload: Record<string, any> = { plan, productId, locale };
      if (email) payload.email = email;
      console.log('[FK] create payment payload', payload);
      const r = await fetch("/api/payments/freekassa/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({} as any));
      if (!r.ok || !j?.pay_url) {
        console.error('[FK] create payment failed', { status: r.status, body: j });
        alert(`${t("errors.fkUnavailable")}\n${j?.error ? `(${j.error})` : ''}`.trim());
        return;
      }
      const url = String(j.pay_url);
      console.log('[FK] redirecting to', url);
      let redirected = false;
      try {
        window.location.assign(url);
        redirected = true;
      } catch (e) {
        console.warn('[FK] location.assign failed', e);
      }
      // Форма POST по новой документации (надежный способ, если редирект/открытие блокируются)
      const formData = j?.form as { action?: string; method?: string; fields?: Record<string,string> } | undefined;
      const action = formData?.action || 'https://pay.freekassa.net/';
      const fields = formData?.fields || {};
      const doPostForm = () => {
        try {
          const form = document.createElement('form');
          form.action = action;
          form.method = 'POST';
          form.target = '_self';
          Object.entries(fields).forEach(([k, v]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = k;
            input.value = String(v);
            form.appendChild(input);
          });
          document.body.appendChild(form);
          console.log('[FK] submitting POST form to', action, fields);
          form.submit();
        } catch (e) {
          console.warn('[FK] form POST failed, trying window.open as last resort', e);
          window.open(url, '_blank', 'noopener');
        }
      };
      // Если прямой редирект не сработал — отправляем POST форму
      setTimeout(() => {
        if (!redirected) doPostForm();
      }, 500);
    } catch {
      console.error('[FK] unexpected error during payment init');
      alert(t("errors.fkUnavailable"));
    }
  };

  return (
    <button type="button" className={className} disabled={disabled} onClick={onClick} title={disabled ? t("errors.unknownPlan") : ""}>
      {t("common.payWithFreeKassa")}
    </button>
  );
}

