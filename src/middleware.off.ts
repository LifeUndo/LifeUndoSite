// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Защищаем ТОЛЬКО приватные зоны на PROD
const PROTECTED_MATCHERS = [
  "/admin/:path*",
  "/partner/:path*",
  "/api/admin/:path*",
  "/api/private/:path*",
];

// Явно разрешаем публичные и тех.пути
const PUBLIC_PREFIXES = [
  "/",
  "/demo",
  "/gov",
  "/edu",
  "/fund",
  "/pricing",
  "/buy",
  "/api/fk",            // FreeKassa (notify/demo)
  "/api/_health",       // health-ручки
  "/_next", "/static", "/public",
  "/favicon.ico", "/robots.txt", "/sitemap.xml",
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // На DEMO-домене middleware полностью выключен
  const host = req.headers.get("host") || "";
  if (host.includes("lifeundo.ru")) return NextResponse.next();

  // Публичные префиксы — пропускаем
  if (PUBLIC_PREFIXES.some(p => url.pathname === p || url.pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Приватные зоны — проверяем авторизацию (cookie/header)
  const isProtected = PROTECTED_MATCHERS.some(pattern => matchPattern(url.pathname, pattern));
  if (isProtected) {
    const token = req.cookies.get("auth")?.value || req.headers.get("authorization");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // TODO: валидировать токен/сессию
    return NextResponse.next();
  }

  // Всё остальное — по умолчанию публично
  return NextResponse.next();
}

// Простой матчинг вида /segment/:param*
function matchPattern(pathname: string, pattern: string) {
  const re = new RegExp("^" + pattern.replace(/:[^/]+(\*)?/g, ".*") + "$");
  return re.test(pathname.endsWith("/") ? pathname.slice(0, -1) : pathname);
}

// ВАЖНО: матчим только то, что реально хотим защищать
export const config = {
  matcher: [
    "/admin/:path*",
    "/partner/:path*",
    "/api/admin/:path*",
    "/api/private/:path*",
  ],
};