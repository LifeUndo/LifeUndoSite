import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Если это корневой путь, редиректим на /ru
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ru', request.url));
  }
  
  // Если путь не содержит локаль, добавляем /ru
  if (!pathname.startsWith('/ru') && !pathname.startsWith('/en') && 
      !pathname.startsWith('/zh') && !pathname.startsWith('/hi') && 
      !pathname.startsWith('/ar') && !pathname.startsWith('/kk') && 
      !pathname.startsWith('/uz') && !pathname.startsWith('/az') &&
      !pathname.startsWith('/api') && !pathname.startsWith('/_next') &&
      !pathname.startsWith('/ok') && !pathname.startsWith('/robots.txt') &&
      !pathname.startsWith('/sitemap.xml')) {
    return NextResponse.redirect(new URL(`/ru${pathname}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = { 
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)'] 
};