export async function GET() {
  const isPreview = process.env.VERCEL_ENV !== 'production';
  const enabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
  return Response.json({ enabled: isPreview && enabled });
}
