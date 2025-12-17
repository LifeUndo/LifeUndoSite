import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getlifeundo.com';
  const now = new Date();
  return [
    // Russian pages
    { url: `${base}/ru`, changeFrequency: 'weekly', priority: 1, lastModified: now },
    { url: `${base}/ru/downloads`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${base}/ru/features`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${base}/ru/pricing`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${base}/ru/use-cases`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${base}/ru/support`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${base}/ru/fund`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/ru/fund/apply`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/ru/privacy`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/ru/terms`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/ru/developers`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/ru/partners`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/ru/legal/offer`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/ru/legal/sla`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/ru/legal/contract`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/ru/legal/dpa`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/ru/legal/pdp`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/ru/legal/downloads`, changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    
    // English pages
    { url: `${base}/en`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${base}/en/downloads`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${base}/en/features`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${base}/en/pricing`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${base}/en/support`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/en/privacy`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/en/terms`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/en/developers`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/en/partners`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${base}/en/legal/offer`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/en/legal/sla`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/en/legal/contract`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/en/legal/dpa`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/en/legal/pdp`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${base}/en/legal/downloads`, changeFrequency: 'monthly', priority: 0.5, lastModified: now },
  ];
}





