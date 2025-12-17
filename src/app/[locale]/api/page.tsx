'use client';

import { useTranslations } from "@/hooks/useTranslations";
import Link from "next/link";

export default function ApiPage({ params }: { params: { locale: string } }) {
  const { t } = useTranslations();
  const base = "https://getlifeundo.com";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold">{t.apiPage.h1}</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.apiPage.overviewTitle}</h2>
        <p className="text-gray-300">{t.apiPage.overviewText}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-sm text-gray-400">{t.apiPage.baseUrl}</div>
          <div className="font-mono mt-1">{base}</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-sm text-gray-400">{t.apiPage.rateLimits}</div>
          <div className="mt-1">{t.apiPage.rateLimitsText}</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.apiPage.auth}</h2>
        <p className="text-gray-300">{t.apiPage.authText}</p>
        <pre className="mt-3 bg-gray-900 p-3 rounded-lg overflow-auto">
{`Authorization: Bearer <api_key>`}
        </pre>
        <div className="text-sm text-gray-400 mt-1">{t.apiPage.headerExample}</div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.apiPage.endpoints}</h2>

        <div className="space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-xl">
            <h3 className="font-semibold">{t.apiPage.healthzTitle}</h3>
            <pre className="mt-2 bg-gray-900 p-3 rounded-lg overflow-auto">
{`GET /api/healthz -> 200 OK`}
            </pre>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl">
            <h3 className="font-semibold">{t.apiPage.createTitle}</h3>
            <div className="text-sm text-gray-400 mt-2">{t.apiPage.requestBody}</div>
            <pre className="mt-2 bg-gray-900 p-3 rounded-lg overflow-auto">
{`POST /api/payments/freekassa/create
Content-Type: application/json

{
  "productId": "pro_monthly | vip_lifetime | team_5_monthly | starter_6m"
}`}
            </pre>
            <div className="text-sm text-gray-400 mt-2">{t.apiPage.responses}</div>
            <pre className="mt-2 bg-gray-900 p-3 rounded-lg overflow-auto">
{`200 OK
{
  "ok": true,
  "pay_url": "https://pay.freekassa.net/?...",
  "orderId": "17597..."
}

400 Bad Request
{
  "ok": false,
  "error": "invalid_productId"
}`}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.apiPage.examples}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-400">{t.apiPage.curl}</div>
            <pre className="mt-2 bg-gray-900 p-3 rounded-lg overflow-auto">
{`curl -X POST ${base}/api/payments/freekassa/create \\
 -H "Content-Type: application/json" \\
 -d '{"productId":"pro_monthly"}'`}
            </pre>
          </div>
          <div>
            <div className="text-sm text-gray-400">{t.apiPage.powershell}</div>
            <pre className="mt-2 bg-gray-900 p-3 rounded-lg overflow-auto">
{`$body = @{ productId = "pro_monthly" } | ConvertTo-Json
Invoke-RestMethod -Method POST "${base}/api/payments/freekassa/create" -ContentType "application/json" -Body $body`}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.apiPage.webhooks}</h2>
        <p className="text-gray-300">{t.apiPage.webhooksText}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.apiPage.openapi}</h2>
        <Link href="/api/openapi.yaml" className="underline text-blue-400">openapi.yaml</Link>
      </section>
    </main>
  );
}
