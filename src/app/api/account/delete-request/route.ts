import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { licenses, feature_flags, devices, support_tickets, account_deletions } from '@/db/schema';
import { sendEmail } from '@/lib/email/client';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let email: string | undefined;
    let reason: any;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      email = body?.email;
      reason = body?.reason;
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData();
      email = (form.get('email') as string | null) || undefined;
      const reasonCode = (form.get('reasonCode') as string | null) || undefined;
      const comment = (form.get('comment') as string | null) || undefined;
      reason = {
        code: reasonCode,
        comment,
      };
    } else {
      // Пытаемся как JSON по умолчанию
      const body = await req.json().catch(() => ({}));
      email = (body as any).email;
      reason = (body as any).reason;
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid email' }, { status: 400 });
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    let reasonCode: string | undefined;
    let reasonComment: string | undefined;

    if (reason && typeof reason === 'object') {
      if (typeof (reason as any).code === 'string') {
        reasonCode = (reason as any).code;
      }
      if (typeof (reason as any).comment === 'string' && (reason as any).comment.trim()) {
        reasonComment = (reason as any).comment.trim();
      }
    } else if (typeof reason === 'string' && reason.trim()) {
      // legacy формат: причина просто строкой
      reasonComment = reason.trim();
    }

    const hasDb = Boolean(process.env.DATABASE_URL);

    if (hasDb) {
      // Жёсткое удаление/анонимизация основных сущностей по email
      await Promise.all([
        db.delete(licenses).where(eq(licenses.user_email, trimmedEmail)),
        db.delete(feature_flags).where(eq(feature_flags.user_email, trimmedEmail)),
        db.delete(devices).where(eq(devices.user_email, trimmedEmail)),
        db.delete(support_tickets).where(eq(support_tickets.email, trimmedEmail)),
        db.insert(account_deletions).values({
          email: trimmedEmail,
          reason_code: reasonCode,
          comment: reasonComment,
          source: 'web',
        }),
      ]);

      console.log('[account.delete-request] deleted from DB', {
        email: trimmedEmail,
        reasonCode,
        reasonComment,
      });

      // Письмо пользователю с подтверждением
      try {
        await sendEmail({
          to: trimmedEmail,
          subject: 'Запрос на удаление аккаунта GetLifeUndo',
          html: `
            <h2>Мы получили ваш запрос на удаление аккаунта</h2>
            <p>Ваш запрос на удаление аккаунта, привязанного к адресу <strong>${trimmedEmail}</strong>, был обработан.</p>
            <p>Доступ к платным функциям и лицензиям отключён, связанные с аккаунтом флаги и устройства удалены или будут удалены в рамках нашей политики хранения данных.</p>
            ${
              reasonCode
                ? `<p><strong>Код причины:</strong> ${reasonCode}</p>`
                : ''
            }
            ${
              reasonComment
                ? `<p><strong>Комментарий:</strong><br>${reasonComment.replace(/\n/g, '<br>')}</p>`
                : ''
            }
            <p>Если вы отправили этот запрос по ошибке, как можно скорее свяжитесь с поддержкой, указав этот же email.</p>
          `,
        });
      } catch (emailUserError) {
        console.error('[account.delete-request] failed to send user confirmation email', emailUserError);
      }

      // Уведомление юридического/поддержки
      try {
        await sendEmail({
          to: process.env.LEGAL_EMAIL || 'legal@getlifeundo.com',
          subject: `Account deletion request: ${trimmedEmail}`,
          html: `
            <h2>Account deletion request</h2>
            <p><strong>Email:</strong> ${trimmedEmail}</p>
            ${reasonCode ? `<p><strong>Reason code:</strong> ${reasonCode}</p>` : ''}
            ${
              reasonComment
                ? `<p><strong>Comment:</strong><br>${reasonComment.replace(/\n/g, '<br>')}</p>`
                : ''
            }
          `,
        });
      } catch (emailLegalError) {
        console.error('[account.delete-request] failed to send legal notification email', emailLegalError);
      }
    } else {
      // Без БД просто логируем факт запроса, чтобы не ломать фронтенд
      console.log('[account.delete-request] requested (DB disabled)', {
        email: trimmedEmail,
        reasonCode,
        reasonComment,
      });
    }

    const successMessage =
      'Запрос на удаление аккаунта обработан. Данные аккаунта на стороне сервера удалены или будут удалены согласно политике хранения.';

    // Если это обычная HTML-форма (как на /account/delete), показываем понятную страницу, а не сырой JSON
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const html = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Запрос на удаление аккаунта GetLifeUndo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, -webkit-system-font, 'SF Pro Text', sans-serif; background: #020617; color: #e5e7eb; }
      .wrap { max-width: 640px; margin: 0 auto; padding: 40px 16px; }
      .card { background: rgba(15,23,42,0.95); border-radius: 24px; border: 1px solid rgba(148,163,184,0.45); padding: 28px 22px; box-shadow: 0 24px 60px rgba(15,23,42,0.9); }
      h1 { font-size: 22px; margin: 0 0 12px; }
      p { font-size: 14px; line-height: 1.6; margin: 8px 0; }
      .ok { color: #4ade80; font-weight: 600; margin-bottom: 8px; }
      .email { color: #e5e7eb; font-weight: 500; }
      .meta { font-size: 12px; color: #9ca3af; margin-top: 12px; }
      a.button { display: inline-flex; margin-top: 18px; padding: 8px 16px; border-radius: 999px; background: #f97373; color: #0f172a; font-size: 14px; font-weight: 600; text-decoration: none; }
      a.button:hover { background: #ef4444; color: #020617; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <p class="ok">Заявка отправлена</p>
        <h1>Запрос на удаление аккаунта получен</h1>
        <p>
          Мы зафиксировали запрос на удаление аккаунта, привязанного к адресу
          <span class="email">${trimmedEmail}</span>.
        </p>
        <p>
          Доступ к платным функциям будет отключён, а данные аккаунта удалены или анонимизированы в соответствии с
          политикой хранения данных GetLifeUndo.
        </p>
        <p class="meta">
          Если вы отправили этот запрос по ошибке, как можно скорее свяжитесь с поддержкой, указав этот же email.
        </p>
        <a href="/account/delete?lang=ru" class="button">Вернуться на страницу удаления аккаунта</a>
      </div>
    </div>
  </body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    return NextResponse.json({
      ok: true,
      message: successMessage,
    });
  } catch (error) {
    console.error('[account.delete-request] error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
