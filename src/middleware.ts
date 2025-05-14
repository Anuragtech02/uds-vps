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

function setLocaleCookies(
   request: NextRequest,
   response: NextResponse,
   locale: string,
   currentHost: string,
) {
   // if (locale !== defaultLocale) {
   //    const cookieValue = `/en/${locale}`;

   //    response.headers.append(
   //       'Set-Cookie',
   //       `googtrans=${cookieValue}; path=/; SameSite=Lax`,
   //    );

   //    if (!currentHost.includes('localhost')) {
   //       response.headers.append(
   //          'Set-Cookie',
   //          `googtrans=${cookieValue}; path=/; domain=.${currentHost}; SameSite=Lax`,
   //       );
   //    }
   // } else {
   //    response.headers.append(
   //       'Set-Cookie',
   //       'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
   //    );

   //    if (!currentHost.includes('localhost')) {
   //       response.headers.append(
   //          'Set-Cookie',
   //          `googtrans=; path=/; domain=.${currentHost}; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
   //       );
   //    }
   // }
   response.headers.append('x-url', request.url);
   return response;
}

const INDUSTRY_MAP: {
   [key: string]: string;
} = {
   'energy-power': 'energy-and-power',
   'consumer-goods-news': 'consumer-goods',
   'automotive-news': 'automotive',
   'electronics-semiconductor-news': 'electronics-semiconductor',
   'healthcare-news': 'healthcare',
   'telecom-it-news': 'telecom-it',
   'artificial-intelligence': 'artificial-intelligence-analytics',
   'electronics-semiconductor': 'electronics-semiconductor',
   'media-entertainment-blog': 'media-entertainment',
   'agriculture-food-tech': 'agriculture',
   'consumer-goods': 'consumer-goods',
   'advance-materials-chemicals': 'chemical',
   'telecom-it': 'telecom-it',
   healthcare: 'healthcare',
   automotive: 'automotive',
};

export async function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;
   const currentHost = request.headers.get('host') || '';
   const searchParams = request.nextUrl.searchParams;

   console.log(`Processing URL: ${pathname}`);

   if (pathname.startsWith('/sitemaps/') || pathname.includes('sitemap.xsl')) {
      console.log(`Bypassing middleware for sitemap path: ${pathname}`);
      const response = NextResponse.next();
      response.headers.set('Content-Type', 'application/xml; charset=utf-8');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      return response;
   }

   if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/blogs/') ||
      pathname.startsWith('/news/')
   ) {
      console.log('Bypassing middleware for special path');
      return setLocaleCookies(
         request,
         NextResponse.next(),
         defaultLocale,
         currentHost,
      );
   }

   // 2. Handle direct locale URLs (very important - add this!)
   // Check if the URL is *exactly* a locale (like /ko, /ja, etc.)
   if (locales.some((locale) => pathname === `/${locale}`)) {
      console.log(`Direct locale URL detected: ${pathname}`);
      // Just continue without redirecting
      const locale = pathname.substring(1); // Remove the leading slash
      return setLocaleCookies(
         request,
         NextResponse.next(),
         locale,
         currentHost,
      );
   }

   if (pathname.includes('googlea315237f11c90f9d')) {
      return new Response(
         'google-site-verification: googlea315237f11c90f9d.html',
         {
            headers: {
               'Content-Type': 'text/html',
               'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
            },
         },
      );
   }

   // if (request.nextUrl.pathname === '/sitemap.xml') {
   //    return NextResponse.redirect(
   //       `${process.env.API_URL}/sitemap/index.xml`,
   //       { status: 301 }, // Adding explicit 301 permanent redirect
   //    );
   // }

   if (request.nextUrl.pathname === '/robots.txt') {
      const robotsTxt = `User-agent: *
   Allow: /
   
   # Disallow specific paths
   Disallow: /api/
   Disallow: /_next/
   Disallow: /static/

   User-agent: Googlebot-News
   Allow: /news/
   
   # Sitemap
   Sitemap: https://univdatos.com/sitemaps/sitemap.xml`; // Corrected path

      return new Response(robotsTxt, {
         headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
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
   const nxtResponse = NextResponse;

   // Extract potential locale and slug
   const pathParts = pathname.split('/').filter(Boolean);
   const potentialLocale = currentLocale;
   const slug = pathParts[pathParts.length - 1];
   const pathSlug = pathnameHasLocale ? pathParts[1] : pathParts[0];

   if (
      pathname.startsWith('/category/blog') ||
      pathname.startsWith(`/${potentialLocale}/category/blog`)
   ) {
      console.log('Redirecting blog category:', slug);
      const industrySlugFromMap = INDUSTRY_MAP[slug] || slug;
      console.log(industrySlugFromMap);
      const newDestination = pathnameHasLocale
         ? `/${potentialLocale}/blogs?industries=${industrySlugFromMap}`
         : `/blogs?industries=${industrySlugFromMap}`;

      return nxtResponse.redirect(new URL(newDestination, request.url), {
         status: 301,
      });
   }

   if (
      pathname.startsWith('/category/news') ||
      pathname.startsWith(`/${potentialLocale}/category/news`)
   ) {
      const industrySlugFromMap = INDUSTRY_MAP[slug] || slug;
      const newDestination = pathnameHasLocale
         ? `/${potentialLocale}/news?industries=${industrySlugFromMap}`
         : `/news?industries=${industrySlugFromMap}`;

      return nxtResponse.redirect(new URL(newDestination, request.url), {
         status: 301,
      });
   }

   // If it's a known valid route, skip processing
   if (validRoutes.includes(pathSlug)) {
      // set pathname as x-url to headers
      return setLocaleCookies(
         request,
         nxtResponse.next(),
         potentialLocale,
         currentHost,
      );
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

            return nxtResponse.redirect(new URL(redirectUrl, request.url));
         }

         // If tag not found, redirect to 404
         const notFoundUrl =
            locale && locales.find((loc) => loc.includes(locale))
               ? `/${locale}/not-found`
               : '/en/not-found';

         return nxtResponse.redirect(new URL(notFoundUrl, request.url));
      } catch (error) {
         console.error('Error processing tag redirect:', error);
         return nxtResponse.redirect(new URL('/not-found', request.url));
      }
   }

   // Check if it's a legacy PHP sample form URL
   if (pathname.includes('/get-a-free-sample-form-php')) {
      const pathParts = pathname.split('/').filter(Boolean);
      const potentialLocale = pathParts[0];
      const currentLocale = pathnameHasLocale ? potentialLocale : defaultLocale;

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
               const redirectUrl = pathnameHasLocale
                  ? `/${currentLocale}/reports/${reportSlug}?popup=report-enquiry`
                  : `/reports/${reportSlug}?popup=report-enquiry`;

               return nxtResponse.redirect(new URL(redirectUrl, request.url));
            }
            // If product ID not found, redirect to 404 with proper locale
            const notFoundUrl = pathnameHasLocale
               ? `/${currentLocale}/not-found`
               : '/en/not-found';

            return nxtResponse.redirect(new URL(notFoundUrl, request.url));
         } catch (error) {
            console.error(
               'Error processing legacy product ID redirect:',
               error,
            );
            const errorUrl = pathnameHasLocale
               ? `/${currentLocale}/not-found`
               : '/en/not-found';
            return nxtResponse.redirect(new URL(errorUrl, request.url));
         }
      }
   }

   if (slug) {
      if (
         SUPPORTED_LOCALES.includes(slug as (typeof SUPPORTED_LOCALES)[number])
      ) {
         return setLocaleCookies(
            request,
            nxtResponse.next(),
            potentialLocale,
            currentHost,
         );
      }

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

         if (blogsData.data && blogsData.data.length > 0) {
            const redirectUrl = pathnameHasLocale
               ? `/${potentialLocale}/blogs/${slug}`
               : `/blogs/${slug}`;

            // Create redirect response
            const response = NextResponse.redirect(
               new URL(redirectUrl, request.url),
               301,
            );

            // Set locale cookies on the redirect
            return setLocaleCookies(
               request,
               response,
               potentialLocale,
               currentHost,
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
            const redirectUrl = pathnameHasLocale
               ? `/${potentialLocale}/news/${slug}`
               : `/news/${slug}`;

            const response = NextResponse.redirect(
               new URL(redirectUrl, request.url),
               301,
            );
            return setLocaleCookies(
               request,
               response,
               potentialLocale,
               currentHost,
            );
         }

         // If not found in either collection, redirect to 404
         // const notFoundUrl = pathnameHasLocale
         //    ? `/${potentialLocale}/not-found`
         //    : '/en/not-found';

         // const response = NextResponse.redirect(
         //    new URL(notFoundUrl, request.url),
         // );
         console.log('Came here, nothing found');
         const reportsUrl = pathnameHasLocale
            ? `/${potentialLocale}/reports`
            : '/reports';

         const response = NextResponse.redirect(
            new URL(reportsUrl, request.url),
         );
         return setLocaleCookies(
            request,
            response,
            potentialLocale,
            currentHost,
         );
      } catch (error) {
         console.error('Error processing legacy URL redirect:', error);
         return nxtResponse.redirect(new URL('/en/not-found', request.url));
      }
   }

   // if (currentLocale !== defaultLocale) {
   //    const cookieValue = `/en/${currentLocale}`;
   //    console.log(
   //       'Changing locale',
   //       currentLocale,
   //       pathnameHasLocale,
   //       cookieValue,
   //    );

   //    // Create a single response
   //    const response = NextResponse.next();

   //    // Add headers to the same response object
   //    response.headers.append(
   //       'Set-Cookie',
   //       `googtrans=${cookieValue}; path=/; SameSite=Lax`,
   //    );

   //    if (!currentHost.includes('localhost')) {
   //       response.headers.append(
   //          'Set-Cookie',
   //          `googtrans=${cookieValue}; path=/; domain=.${currentHost}; SameSite=Lax`,
   //       );
   //    }

   //    return response;
   // } else {
   //    // Create a single response for default locale
   //    const response = NextResponse.next();

   //    // Add headers to the same response object
   //    response.headers.append(
   //       'Set-Cookie',
   //       'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
   //    );

   //    if (!currentHost.includes('localhost')) {
   //       response.headers.append(
   //          'Set-Cookie',
   //          `googtrans=; path=/; domain=.${currentHost}; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
   //       );
   //    }

   //    return response;
   // }
}

export const config = {
   matcher: [
      // Match all paths except static files
      '/((?!api/|_next/static/|_next/image/|sitemaps/|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf)$).*)',
   ],
};
