import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // layout.tsx'te hangi sayfada olduğumuzu bilmek için isteğin yolunu bir header olarak ekliyoruz
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Aşağıdaki yollar dışındaki tüm istek yollarında proxy'yi çalıştır:
     * - _next/static (statik dosyalar)
     * - _next/image (görsel optimizasyon dosyaları)
     * - favicon.ico (favicon dosyası)
     * - Tüm resim, font vb. statik varlıklar (public klasörü altındakiler dahil)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css)$).*)',
  ],
};
