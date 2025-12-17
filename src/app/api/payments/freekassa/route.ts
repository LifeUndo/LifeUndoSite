import { POST as handleResult } from './result/route';

export async function GET() {
  return new Response('OK', { status: 200 });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const hasRequired = formData.has('MERCHANT_ID') && formData.has('AMOUNT') && formData.has('MERCHANT_ORDER_ID') && formData.has('SIGN');
    if (!hasRequired) {
      // Пустой или тестовый запрос из ЛК — отвечаем 200 для прохождения проверки статуса
      return new Response('OK', { status: 200 });
    }
    // Делегируем полноценную обработку валидного вебхука
    return handleResult(req as any);
  } catch {
    // На любые проблемы в тестовом пинге — отвечаем OK, чтобы статус стал 200
    return new Response('OK', { status: 200 });
  }
}
