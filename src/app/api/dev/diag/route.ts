export async function GET() {
  return Response.json({
    vercelEnv: process.env.VERCEL_ENV ?? 'development',
    devEnabled: process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true',
    emailEnabled: process.env.NEXT_EMAIL_ENABLED !== 'false',
    hasDbUrl: Boolean(process.env.DATABASE_URL),
  });
}
