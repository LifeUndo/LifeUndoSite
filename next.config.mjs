/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    const csp = [
      "default-src 'self';",
      "img-src 'self' https: data:;",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
      "script-src 'self' 'unsafe-inline' https://*.vercel-insights.com;",
      "connect-src 'self' https://api.freekassa.net https://pay.freekassa.net https://pay.fk.money https://*.vercel-insights.com;",
      "frame-src https://pay.freekassa.net https://pay.fk.money;",
      "font-src 'self' https://fonts.gstatic.com data:;",
      "object-src 'none';",
      "base-uri 'self';",
      "form-action 'self' https://pay.freekassa.net https://pay.fk.money;",
      "frame-ancestors 'self';",
      "upgrade-insecure-requests;"
    ].join(" ");

    return [
      {
        // распространяем CSP на весь сайт (и ru/en)
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp }
        ],
      },
    ];
  },
};

export default nextConfig;
