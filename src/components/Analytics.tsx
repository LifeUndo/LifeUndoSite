'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'getlifeundo.com';
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  
  if (!enabled) return null;
  
  return (
    <Script
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}

// Helper РґР»СЏ РѕС‚РїСЂР°РІРєРё СЃРѕР±С‹С‚РёР№
export function trackEvent(eventName: string, props?: Record<string, string | number | undefined>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: props || {} });
  }
}

// Р“РѕС‚РѕРІС‹Рµ СЃРѕР±С‹С‚РёСЏ РёР· РўР—
export const analyticsEvents = {
  pricingClickPay: (plan: string) => trackEvent('pricing_click_pay', { plan }),
  starterClick: () => trackEvent('starter_click'),
  purchaseRedirect: (plan: string, orderId: string) => trackEvent('purchase_redirect_fk', { plan, order_id: orderId }),
  purchaseSuccess: (plan: string, orderId: string, amount?: string, currency?: string) => 
    trackEvent('purchase_success', { plan, order_id: orderId, amount, currency }),
  supportOpened: (orderId?: string, plan?: string) => trackEvent('support_opened', { order_id: orderId, plan })
};


