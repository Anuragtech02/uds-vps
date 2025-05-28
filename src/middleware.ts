// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import {
   DEFAULT_LOCALE,
   SUPPORTED_LOCALES,
   validRoutes,
   INDUSTRY_MAP,
} from './utils/constants';
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const currentLocalesArray = SUPPORTED_LOCALES as readonly string[];
function setLocaleCookies(
   request: NextRequest,
   response: NextResponse,
   locale: SupportedLocale,
) {
   response.headers.append('x-url', request.url);
   response.headers.append('x-middleware-pathname', request.nextUrl.pathname);
   response.headers.append('x-middleware-locale', locale);
   return response;
}
export async function middleware(request: NextRequest) {
   const { pathname, searchParams } = request.nextUrl;
   console.log(
      `[MW_START] Path: ${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
   );
   // 0. Immediately reject .php requests
   if (
      pathname.endsWith('.php') &&
      !pathname.includes('get-a-free-sample-form')
   ) {
      console.log(`[MW_REJECT_PHP] Rejecting .php path: ${pathname}`);
      return new NextResponse(null, { status: 404 });
   }
   // 1. Early Exits for Assets & Internal Next.js paths
   if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/favicon')
   ) {
      console.log(`[MW_BYPASS_INTERNAL_ASSET_API] Path: ${pathname}`);
      return setLocaleCookies(request, NextResponse.next(), DEFAULT_LOCALE);
   }
   // 2. Specific file/utility handlers
   if (pathname.endsWith('googlea315237f11c90f9d.html')) {
      console.log(`[MW_HANDLER_GOOGLE_VERIF]`);
      return new Response(
         'google-site-verification: googlea315237f11c90f9d.html',
         {
            headers: {
               'Content-Type': 'text/html',
               'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            },
         },
      );
   }
   if (pathname === '/robots.txt') {
      console.log(`[MW_HANDLER_ROBOTS_TXT]`);
      const robotsTxt = `User-agent: *\nAllow: /\n\nDisallow: /api/\nDisallow: /_next/\nDisallow: /static/\n\nUser-agent: Googlebot-News\nAllow: /news/\n\nSitemap: https://univdatos.com/sitemaps/sitemap.xml`;
      return new Response(robotsTxt, {
         headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
         },
      });
   }
   // 3. Determine Locale and Base Path Information
   const pathSegmentsFiltered = pathname.split('/').filter(Boolean); // Segments like ['ar'] or ['ar', 'reports']
   let detectedLocale: SupportedLocale = DEFAULT_LOCALE;
   let pathWithoutLocale = pathname; // Path after stripping locale prefix
   let hasLocalePrefix = false;
   const potentialLocaleSegment = pathSegmentsFiltered[0];
   if (
      potentialLocaleSegment &&
      currentLocalesArray.includes(potentialLocaleSegment)
   ) {
      detectedLocale = potentialLocaleSegment as SupportedLocale;
      hasLocalePrefix = true;
      if (pathSegmentsFiltered.length === 1) {
         // Path was /<locale> or /<locale>/
         pathWithoutLocale = '/';
      } else {
         pathWithoutLocale = '/' + pathSegmentsFiltered.slice(1).join('/');
      }
      console.log(
         `[MW_LOCALE_INFO] Detected: ${detectedLocale}, Path w/o locale: ${pathWithoutLocale}, Original: ${pathname}`,
      );
   } else {
      console.log(
         `[MW_LOCALE_INFO] No locale prefix for ${pathname}, using default: ${DEFAULT_LOCALE}, Path w/o locale: ${pathWithoutLocale}`,
      );
   }
   // 4. Handle direct locale paths: /<locale> and /<locale>/
   //    Goal: ensure /<locale> redirects to /<locale>/, and /<locale>/ passes through.
   if (hasLocalePrefix && pathSegmentsFiltered.length === 1) {
      // This means pathname is either /<locale> or /<locale>/
      console.log(
         `[MW_RULE4_LOCALE_ROOT] Allowing path ${pathname} to pass through without enforcing trailing slash.`,
      );
      // Let all locale root paths fall through to Rule 5, whether they have trailing slashes or not
      return setLocaleCookies(request, NextResponse.next(), detectedLocale);
   }
   // 5. Handle known application routes AFTER locale stripping
   const firstSegmentOfPathWithoutLocale =
      pathWithoutLocale.split('/').filter(Boolean)[0] || '';
   if (pathWithoutLocale === '/') {
      console.log(
         `[MW_VALID_ROUTE_ROOT] Root path after locale strip: '${pathWithoutLocale}' (orig: ${pathname}, locale: ${detectedLocale}). Passing through.`,
      );
      return setLocaleCookies(request, NextResponse.next(), detectedLocale);
   }
   if (
      firstSegmentOfPathWithoutLocale &&
      validRoutes.includes(firstSegmentOfPathWithoutLocale) &&
      !pathWithoutLocale.includes('get-a-free-sample-form')
   ) {
      console.log(
         `[MW_VALID_ROUTE] Segment: '${firstSegmentOfPathWithoutLocale}' in validRoutes. Path: ${pathWithoutLocale} (orig: ${pathname}). Passing through.`,
      );
      return setLocaleCookies(request, NextResponse.next(), detectedLocale);
   }
   if (firstSegmentOfPathWithoutLocale) {
      console.log(
         `[MW_VALID_ROUTE_CHECK_FAILED] Segment: '${firstSegmentOfPathWithoutLocale}' not in validRoutes. Path: ${pathWithoutLocale} (orig: ${pathname}). Continuing...`,
      );
   }
   // 6. Handle legacy/deprecated routes with 410 Gone status
   if (pathWithoutLocale.startsWith('/category/blog/')) {
      const categorySlug = pathWithoutLocale.split('/category/blog/')[1];
      console.log(
         `[MW_410_CAT_BLOG] Deprecated category blog route. Category Slug: ${categorySlug}. Returning 410 Gone.`,
      );
      return new NextResponse(null, { status: 410 });
   }
   if (pathWithoutLocale.startsWith('/category/news/')) {
      const categorySlug = pathWithoutLocale.split('/category/news/')[1];
      console.log(
         `[MW_410_CAT_NEWS] Deprecated category news route. Category Slug: ${categorySlug}. Returning 410 Gone.`,
      );
      return new NextResponse(null, { status: 410 });
   }
   const productTagMatch = pathWithoutLocale.match(/^\/product-tag\/(.+)/);
   if (productTagMatch) {
      const tagSlug = productTagMatch[1];
      console.log(
         `[MW_410_PRODUCT_TAG] Deprecated product-tag route. Tag Slug: ${tagSlug}. Returning 410 Gone.`,
      );
      return new NextResponse(null, { status: 410 });
   }
   if (
      pathWithoutLocale.includes('/get-a-free-sample-form-php') ||
      pathWithoutLocale.includes('/get-a-free-sample-form')
   ) {
      const productId = searchParams.get('product_id')?.trim();
      console.log(`[MW_REDIRECT_LEGACY_PHP_FORM] Product ID: ${productId}`);
      if (productId) {
         try {
            const cleanProductId = decodeURIComponent(productId).replace(
               /\s+/g,
               '',
            );
            const strapiResponse = await fetch(
               `${process.env.API_URL}/reports?filters[productId][$eq]=${cleanProductId}&locale=${detectedLocale}`,
               {
                  headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
               },
            );
            if (!strapiResponse.ok)
               throw new Error(
                  `API error for reports by productId: ${strapiResponse.status}`,
               );
            const data = await strapiResponse.json();
            if (data.data && data.data.length > 0) {
               const reportSlug = data.data[0].attributes.slug;
               const redirectPath = hasLocalePrefix
                  ? `/${detectedLocale}/reports/${reportSlug}?popup=report-enquiry`
                  : `/reports/${reportSlug}?popup=report-enquiry`;
               return NextResponse.redirect(
                  new URL(redirectPath, request.url),
                  301,
               ); // 301 for permanent
            }
            const notFoundUrl = hasLocalePrefix
               ? `/${detectedLocale}/not-found`
               : '/not-found';
            return NextResponse.redirect(new URL(notFoundUrl, request.url));
         } catch (error) {
            console.error(
               `[MW_REDIRECT_LEGACY_PHP_FORM_ERROR] Product ID: ${productId}`,
               error,
            );
            const errorRedirectUrl = hasLocalePrefix
               ? `/${detectedLocale}/not-found`
               : '/not-found';
            return NextResponse.redirect(
               new URL(errorRedirectUrl, request.url),
            );
         }
      } else {
         const fallbackRedirect = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         return NextResponse.redirect(new URL(fallbackRedirect, request.url));
      }
   }
   // 7. Handle orphaned blog/news slugs with 410 Gone status
   const segmentsOfPathWithoutLocale = pathWithoutLocale
      .split('/')
      .filter(Boolean);
   const potentialOrphanSlug = segmentsOfPathWithoutLocale[0];
   const isLikelyOrphanSlugPath =
      segmentsOfPathWithoutLocale.length === 1 &&
      potentialOrphanSlug &&
      !validRoutes.includes(potentialOrphanSlug);
   if (isLikelyOrphanSlugPath) {
      console.log(
         `[MW_ORPHAN_SLUG_LOOKUP] Attempting lookup for slug: '${potentialOrphanSlug}' from path: ${pathWithoutLocale} (orig: ${pathname})`,
      );
      try {
         const blogsApiUrl = `${process.env.API_URL}/blogs?filters[slug][$eq]=${potentialOrphanSlug}&publicationState=live&locale=${detectedLocale}`;
         console.log(`[MW_ORPHAN_SLUG_LOOKUP_FETCH_BLOGS] URL: ${blogsApiUrl}`);
         const blogsResponse = await fetch(blogsApiUrl, {
            headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
         });
         if (blogsResponse.ok) {
            const blogsData = await blogsResponse.json();
            if (blogsData.data && blogsData.data.length > 0) {
               console.log(
                  `[MW_410_ORPHAN_BLOG] Deprecated orphaned blog route. Slug: ${potentialOrphanSlug}. Returning 410 Gone.`,
               );
               return new NextResponse(null, { status: 410 });
            }
         } else {
            console.warn(
               `[MW_ORPHAN_SLUG_LOOKUP_BLOGS_API_ERROR] Status: ${blogsResponse.status} for slug ${potentialOrphanSlug} at ${blogsApiUrl}`,
            );
         }
         const newsApiUrl = `${process.env.API_URL}/news-articles?filters[slug][$eq]=${potentialOrphanSlug}&publicationState=live&locale=${detectedLocale}`;
         console.log(`[MW_ORPHAN_SLUG_LOOKUP_FETCH_NEWS] URL: ${newsApiUrl}`);
         const newsResponse = await fetch(newsApiUrl, {
            headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
         });
         if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            if (newsData.data && newsData.data.length > 0) {
               console.log(
                  `[MW_410_ORPHAN_NEWS] Deprecated orphaned news route. Slug: ${potentialOrphanSlug}. Returning 410 Gone.`,
               );
               return new NextResponse(null, { status: 410 });
            }
         } else {
            console.warn(
               `[MW_ORPHAN_SLUG_LOOKUP_NEWS_API_ERROR] Status: ${newsResponse.status} for slug ${potentialOrphanSlug} at ${newsApiUrl}`,
            );
         }
         console.log(
            `[MW_ORPHAN_SLUG_NOT_FOUND_IN_API] Slug '${potentialOrphanSlug}' not in blogs/news. Redirecting to not-found.`,
         );
         const notFoundUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         const response = NextResponse.redirect(
            new URL(notFoundUrl, request.url),
         ); // Consider 302 if it might exist elsewhere or 404 via Next.js
         return setLocaleCookies(request, response, detectedLocale);
      } catch (error) {
         console.error(
            `[MW_ORPHAN_SLUG_LOOKUP_UNEXPECTED_ERROR] Slug: ${potentialOrphanSlug}`,
            error,
         );
         const errorRedirectUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         return NextResponse.redirect(new URL(errorRedirectUrl, request.url));
      }
   }
   // 8. Default pass-through if no other rule matched
   console.log(
      `[MW_PASS_THROUGH_DEFAULT] Path: ${pathname}. No specific rules matched or orphan slug logic not triggered. Letting Next.js handle.`,
   );
   return setLocaleCookies(request, NextResponse.next(), detectedLocale);
}
export const config = {
   matcher: [
      '/((?!api/|_next/|sitemaps/|assets/|static/|favicon|.well-known/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|xml|xsl|html|js|css|json)$).*)',
      '/robots.txt',
   ],
};
