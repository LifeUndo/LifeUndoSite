// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // пропускаем статику и API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) return NextResponse.next();

  // Корень -> /ru
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url, 308);
  }

  // Всё остальное не трогаем
  return NextResponse.next();
}

// Обрабатываем только корень и «всё, кроме статики»
export const config = {
  matcher: ['/', '/((?!_next|api|.*\\..*).*)'],
};
