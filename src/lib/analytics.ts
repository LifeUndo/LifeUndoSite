// Privacy-friendly Analytics Integration
// Supports Plausible, Umami, or custom

const ANALYTICS_ENABLED = typeof window !== 'undefined';
const IS_DEV = process.env.NODE_ENV === 'development';

export interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
}

// Plausible integration
function trackPlausible(event: AnalyticsEvent) {
  if (typeof window === 'undefined' || !window.plausible) return;
  
  window.plausible(event.name, {
    props: event.props || {}
  });
}

// Umami integration  
function trackUmami(event: AnalyticsEvent) {
  if (typeof window === 'undefined' || !window.umami) return;
  
  window.umami.track(event.name, event.props || {});
}

// Main track function
export function track(eventName: string, props?: Record<string, any>) {
  if (!ANALYTICS_ENABLED) return;
  
  // Sanitize props - remove sensitive data
  const sanitizedProps: Record<string, string | number | boolean> = {};
  if (props) {
    Object.keys(props).forEach(key => {
      const value = props[key];
      // Skip null, undefined, objects, arrays
      if (value != null && typeof value !== 'object') {
        sanitizedProps[key] = value;
      }
    });
  }
  
  const event: AnalyticsEvent = { name: eventName, props: sanitizedProps };
  
  // Log in development
  if (IS_DEV) {
    console.log('[analytics]', event);
  }
  
  // Try both Plausible and Umami
  trackPlausible(event);
  trackUmami(event);
}

// Specific event helpers
export const analytics = {
  track,
  
  // Pricing events
  pricingClickPay: (plan: string) => track('pricing_click_pay', { plan }),
  starterClick: () => track('starter_click'),
  
  // Purchase events
  purchaseRedirect: (plan: string, orderId: string, amount?: string, currency?: string) => 
    track('purchase_redirect_fk', { plan, order_id: orderId, amount, currency }),
  purchaseSuccess: (plan: string, orderId: string) => 
    track('purchase_success', { plan, order_id: orderId }),
  
  // Support events
  supportOpened: (orderId?: string, plan?: string) => 
    track('support_opened', { order_id: orderId, plan }),
  
  // Page views
  pageView: (path: string) => track('pageview', { path })
};

// TypeScript declarations
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
    umami?: { track: (event: string, props?: Record<string, any>) => void };
  }
}







