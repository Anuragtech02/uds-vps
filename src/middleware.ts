// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './utils/constants';

export const locales = SUPPORTED_LOCALES;
export const defaultLocale = DEFAULT_LOCALE;

export function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;
   const currentHost = request.headers.get('host') || '';

   // Skip non-page requests
   if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
   ) {
      return NextResponse.next();
   }

   // Check if the pathname starts with a locale
   const pathnameHasLocale = locales.some(
      (locale) =>
         pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
   );

   // Get the current locale from the pathname if it exists
   const currentLocale = pathnameHasLocale
      ? pathname.split('/')[1]
      : defaultLocale;

   // Create response
   const response = NextResponse.next();

   // Handle cookie setting based on locale
   if (currentLocale !== defaultLocale) {
      // Create the cookie value without URL encoding
      const cookieValue = `/en/${currentLocale}`;

      // Set cookies using Set-Cookie header
      response.headers.append(
         'Set-Cookie',
         `googtrans=${cookieValue}; path=/; SameSite=Lax`,
      );

      // If not localhost, also set for subdomain
      if (!currentHost.includes('localhost')) {
         response.headers.append(
            'Set-Cookie',
            `googtrans=${cookieValue}; path=/; domain=.${currentHost}; SameSite=Lax`,
         );
      }
   } else {
      // For English, remove the cookie
      response.headers.append(
         'Set-Cookie',
         'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      );

      if (!currentHost.includes('localhost')) {
         response.headers.append(
            'Set-Cookie',
            `googtrans=; path=/; domain=.${currentHost}; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
         );
      }
   }

   return response;
}

export const config = {
   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
