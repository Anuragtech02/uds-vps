// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
   DEFAULT_LOCALE,
   SUPPORTED_LOCALES,
   validRoutes,
} from './utils/constants';

export const locales = SUPPORTED_LOCALES;
export const defaultLocale = DEFAULT_LOCALE;

export async function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;
   const currentHost = request.headers.get('host') || '';
   const searchParams = request.nextUrl.searchParams;

   // Skip non-page requests
   if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') ||
      pathname.startsWith('/blogs/') ||
      pathname.startsWith('/news/')
   ) {
      return NextResponse.next();
   }

   // Extract potential locale and slug
   const pathParts = pathname.split('/').filter(Boolean);
   const potentialLocale = pathParts[0];
   const hasLocale = locales.some(
      (loc) => loc.toLowerCase() === potentialLocale.toLowerCase(),
   );
   const slug = hasLocale ? pathParts[1] : pathParts[0];

   // If it's a known valid route, skip processing
   if (validRoutes.includes(slug)) {
      return NextResponse.next();
   }

   // Check if it's a product-tag URL
   const productTagMatch = pathname.match(
      /^\/(?:([^\/]+)\/)?product-tag\/(.+)/,
   );

   if (productTagMatch) {
      const [, locale, tagSlug] = productTagMatch;

      try {
         // Make request to Strapi
         const response = await fetch(
            `${process.env.API_URL}/tag-mappings?filters[tagSlug][$eq]=${tagSlug}`,
            {
               headers: {
                  Authorization: `Bearer ${process.env.API_TOKEN}`,
               },
            },
         );

         const data = await response.json();

         if (data.data && data.data.length > 0) {
            const reportSlug = data.data[0].attributes.reportSlug;
            const redirectUrl =
               locale && locales.find((loc) => loc.includes(locale))
                  ? `/${locale}/reports/${reportSlug}`
                  : `/reports/${reportSlug}`;

            return NextResponse.redirect(new URL(redirectUrl, request.url));
         }

         // If tag not found, redirect to 404
         const notFoundUrl =
            locale && locales.find((loc) => loc.includes(locale))
               ? `/${locale}/not-found`
               : '/en/not-found';

         return NextResponse.redirect(new URL(notFoundUrl, request.url));
      } catch (error) {
         console.error('Error processing tag redirect:', error);
         return NextResponse.redirect(new URL('/not-found', request.url));
      }
   }

   // Check if it's a legacy PHP sample form URL
   if (pathname.includes('/get-a-free-sample-form-php')) {
      const pathParts = pathname.split('/').filter(Boolean);
      const potentialLocale = pathParts[0];
      const hasLocale = locales.includes(
         potentialLocale as (typeof locales)[number],
      );
      const currentLocale = hasLocale ? potentialLocale : defaultLocale;

      console.log(currentLocale, hasLocale, potentialLocale, defaultLocale);

      const productId = searchParams.get('product_id')?.trim();

      if (productId) {
         try {
            // Remove any potential encoded spaces or special characters
            const cleanProductId = decodeURIComponent(productId).replace(
               /\s+/g,
               '',
            );

            // Make request to Strapi
            const response = await fetch(
               `${process.env.API_URL}/reports?filters[productId][$eq]=${cleanProductId}`,
               {
                  headers: {
                     Authorization: `Bearer ${process.env.API_TOKEN}`,
                  },
               },
            );

            const data = await response.json();

            if (data.data && data.data.length > 0) {
               const reportSlug = data.data[0].attributes.slug;
               // Construct redirect URL with locale if present
               const redirectUrl = hasLocale
                  ? `/${currentLocale}/reports/${reportSlug}?popup=report-enquiry`
                  : `/reports/${reportSlug}?popup=report-enquiry`;

               return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
            // If product ID not found, redirect to 404 with proper locale
            const notFoundUrl = hasLocale
               ? `/${currentLocale}/not-found`
               : '/en/not-found';

            return NextResponse.redirect(new URL(notFoundUrl, request.url));
         } catch (error) {
            console.error(
               'Error processing legacy product ID redirect:',
               error,
            );
            const errorUrl = hasLocale
               ? `/${currentLocale}/not-found`
               : '/en/not-found';
            return NextResponse.redirect(new URL(errorUrl, request.url));
         }
      }
   }

   if (slug) {
      try {
         // First, check in blogs collection
         const blogsResponse = await fetch(
            `${process.env.API_URL}/blogs?filters[slug][$eq]=${slug}`,
            {
               headers: {
                  Authorization: `Bearer ${process.env.API_TOKEN}`,
               },
            },
         );

         const blogsData = await blogsResponse.json();

         // If found in blogs, redirect to blogs path
         if (blogsData.data && blogsData.data.length > 0) {
            const redirectUrl = hasLocale
               ? `/${potentialLocale}/blogs/${slug}`
               : `/blogs/${slug}`;
            return NextResponse.redirect(
               new URL(redirectUrl, request.url),
               301,
            );
         }

         // If not found in blogs, check news collection
         const newsResponse = await fetch(
            `${process.env.API_URL}/news-articles?filters[slug][$eq]=${slug}`,
            {
               headers: {
                  Authorization: `Bearer ${process.env.API_TOKEN}`,
               },
            },
         );

         const newsData = await newsResponse.json();

         // If found in news, redirect to news path
         if (newsData.data && newsData.data.length > 0) {
            const redirectUrl = hasLocale
               ? `/${potentialLocale}/news/${slug}`
               : `/news/${slug}`;
            return NextResponse.redirect(
               new URL(redirectUrl, request.url),
               301,
            );
         }

         // If not found in either collection, redirect to 404
         const notFoundUrl = hasLocale
            ? `/${potentialLocale}/not-found`
            : '/en/not-found';
         return NextResponse.redirect(new URL(notFoundUrl, request.url));
      } catch (error) {
         console.error('Error processing legacy URL redirect:', error);
         return NextResponse.redirect(new URL('/en/not-found', request.url));
      }
   }

   // Rest of your existing middleware code...
   if (request.nextUrl.pathname === '/sitemap.xml') {
      return NextResponse.rewrite(new URL('/sitemap', request.url));
   }

   if (request.nextUrl.pathname === '/robots.txt') {
      const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${'https://web-server-india.univdatos.com/api'}/sitemap/index.xml`;

      return new Response(robotsTxt, {
         headers: {
            'Content-Type': 'text/plain',
            'Cache-Control':
               'public, max-age=0, s-maxage=3600, stale-while-revalidate',
         },
      });
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
      const cookieValue = `/en/${currentLocale}`;

      response.headers.append(
         'Set-Cookie',
         `googtrans=${cookieValue}; path=/; SameSite=Lax`,
      );

      if (!currentHost.includes('localhost')) {
         response.headers.append(
            'Set-Cookie',
            `googtrans=${cookieValue}; path=/; domain=.${currentHost}; SameSite=Lax`,
         );
      }
   } else {
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
   matcher: [
      // Match all paths except static files
      '/((?!_next/static|_next/image|favicon.ico).*)',
   ],
};
