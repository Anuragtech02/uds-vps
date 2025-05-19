// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import {
   DEFAULT_LOCALE,
   SUPPORTED_LOCALES,
   validRoutes,
   INDUSTRY_MAP,
   // type SupportedLocale, // If you define this type in constants.ts
} from './utils/constants';

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const currentLocalesArray = SUPPORTED_LOCALES as readonly string[];

function setLocaleCookies(
   request: NextRequest,
   response: NextResponse,
   locale: SupportedLocale,
) {
   response.headers.append('x-url', request.url);
   response.headers.append('x-middleware-locale', locale);
   return response;
}

export async function middleware(request: NextRequest) {
   const { pathname, searchParams } = request.nextUrl;
   // const currentHost = request.headers.get('host') || ''; // Kept for potential future use

   console.log(
      `[MW_START] Path: ${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
   );

   // 0. Immediately reject .php requests
   if (pathname.endsWith('.php')) {
      console.log(`[MW_REJECT_PHP] Rejecting .php path: ${pathname}`);
      return new NextResponse(null, { status: 404 });
   }

   // 1. Early Exits for Assets & Internal Next.js paths
   if (pathname.startsWith('/_next/') || pathname.startsWith('/api/')) {
      console.log(`[MW_BYPASS_INTERNAL_ASSET_API] Path: ${pathname}`);
      const res = NextResponse.next();
      res.headers.append('x-url', request.url);
      res.headers.append('x-middleware-locale', DEFAULT_LOCALE);
      return res;
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
   console.log('The pathname is', pathname);
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
      // And potentialLocaleSegment (which is detectedLocale here) is that <locale>
      const canonicalLocalePath = `/${detectedLocale}/`; // e.g., /ar/

      if (pathname === canonicalLocalePath) {
         // Path is already canonical with a trailing slash, e.g., /ar/
         console.log(
            `[MW_RULE4_CANONICAL_OK] Path ${pathname} is already canonical. Passing to Rule 5.`,
         );
         // Let it fall through to Rule 5, where pathWithoutLocale='/' will be handled.
      } else if (pathname === `/${detectedLocale}`) {
         // Path is /<locale> without a trailing slash, e.g., /ar. Needs redirect.
         console.log(
            `[MW_RULE4_REDIRECT_TO_CANONICAL] Path ${pathname} redirecting to ${canonicalLocalePath}`,
         );
         return NextResponse.redirect(
            new URL(canonicalLocalePath, request.url),
            308,
         ); // 308 Permanent Redirect
      } else {
         // This case implies an unexpected structure, e.g., /ar/foo was misidentified in Rule 3
         // or path has unusual characters. Should be rare if Rule 3 is correct.
         console.warn(
            `[MW_RULE4_UNEXPECTED_PATH_FOR_DIRECT_LOCALE] Path: ${pathname}, Locale: ${detectedLocale}. Cautiously passing through.`,
         );
      }
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
      validRoutes.includes(firstSegmentOfPathWithoutLocale)
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

   // 6. Handle specific redirects that require API calls (category, product-tag, legacy php form)
   // ... (This part remains the same as the previous full version)
   if (pathWithoutLocale.startsWith('/category/blog/')) {
      const categorySlug = pathWithoutLocale.split('/category/blog/')[1];
      if (categorySlug) {
         console.log(`[MW_REDIRECT_CAT_BLOG] Category Slug: ${categorySlug}`);
         const industrySlugFromMap = INDUSTRY_MAP[categorySlug] || categorySlug;
         const newDestination = hasLocalePrefix
            ? `/${detectedLocale}/blogs?industries=${industrySlugFromMap}`
            : `/blogs?industries=${industrySlugFromMap}`;
         return NextResponse.redirect(new URL(newDestination, request.url), {
            status: 301,
         });
      }
   }
   if (pathWithoutLocale.startsWith('/category/news/')) {
      const categorySlug = pathWithoutLocale.split('/category/news/')[1];
      if (categorySlug) {
         console.log(`[MW_REDIRECT_CAT_NEWS] Category Slug: ${categorySlug}`);
         const industrySlugFromMap = INDUSTRY_MAP[categorySlug] || categorySlug;
         const newDestination = hasLocalePrefix
            ? `/${detectedLocale}/news?industries=${industrySlugFromMap}`
            : `/news?industries=${industrySlugFromMap}`;
         return NextResponse.redirect(new URL(newDestination, request.url), {
            status: 301,
         });
      }
   }

   const productTagMatch = pathWithoutLocale.match(/^\/product-tag\/(.+)/);
   if (productTagMatch) {
      const tagSlug = productTagMatch[1];
      console.log(`[MW_REDIRECT_PRODUCT_TAG] Tag Slug: ${tagSlug}`);
      try {
         const strapiResponse = await fetch(
            `${process.env.API_URL}/tag-mappings?filters[tagSlug][$eq]=${tagSlug}&locale=${detectedLocale}`,
            { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } },
         );
         if (!strapiResponse.ok)
            throw new Error(
               `API error for tag-mappings: ${strapiResponse.status}`,
            );
         const data = await strapiResponse.json();

         if (data.data && data.data.length > 0) {
            const reportSlug = data.data[0].attributes.reportSlug;
            const redirectUrl = hasLocalePrefix
               ? `/${detectedLocale}/reports/${reportSlug}`
               : `/reports/${reportSlug}`;
            return NextResponse.redirect(
               new URL(redirectUrl, request.url),
               301,
            ); // 301 for permanent
         }
         const notFoundUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         return NextResponse.redirect(new URL(notFoundUrl, request.url));
      } catch (error) {
         console.error(
            `[MW_REDIRECT_PRODUCT_TAG_ERROR] Tag: ${tagSlug}`,
            error,
         );
         const errorRedirectUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         return NextResponse.redirect(new URL(errorRedirectUrl, request.url));
      }
   }

   if (pathWithoutLocale.includes('/get-a-free-sample-form-php')) {
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

   // 7. SLOW PART: Fallback Slug Lookup for potential "orphan" slugs
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
               const redirectPath = hasLocalePrefix
                  ? `/${detectedLocale}/blogs/${potentialOrphanSlug}`
                  : `/blogs/${potentialOrphanSlug}`;
               console.log(
                  `[MW_ORPHAN_SLUG_FOUND_BLOGS] Redirecting to: ${redirectPath}`,
               );
               const response = NextResponse.redirect(
                  new URL(redirectPath, request.url),
                  301,
               );
               return setLocaleCookies(request, response, detectedLocale);
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
               const redirectPath = hasLocalePrefix
                  ? `/${detectedLocale}/news/${potentialOrphanSlug}`
                  : `/news/${potentialOrphanSlug}`;
               console.log(
                  `[MW_ORPHAN_SLUG_FOUND_NEWS] Redirecting to: ${redirectPath}`,
               );
               const response = NextResponse.redirect(
                  new URL(redirectPath, request.url),
                  301,
               );
               return setLocaleCookies(request, response, detectedLocale);
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
      '/((?!api/|_next/static/|_next/image/|sitemaps/|assets/|static/|favicon\\.png|favicon\\.svg|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|xml|xsl|html|js|css)$).*)',
      '/robots.txt',
   ],
};
